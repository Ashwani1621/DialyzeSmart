"""
Risk prediction for dialysis sessions.

Wraps the trained Random Forest (apps/ml-model) and runs inference in-process.
The model + ordered feature list are loaded once at import. If the artifacts
can't be loaded (missing files, scikit-learn version mismatch, etc.) or a
prediction raises, we fall back to a deterministic heuristic so development is
never blocked.

The public contract is unchanged from the original dev stub:
    predict_session_risk(session_data, patient_data=None) -> {
        riskScore, riskLevel, recommendation, risk_level, status,
    }

NOTE: feature engineering here mirrors apps/ml-model/src/model_trainer.py.
Those constants (the `crp_to_flux` +0.1 epsilon, the column mapping) must stay
in sync with the trainer if the model is retrained.
"""

import logging
import os

logger = logging.getLogger(__name__)

# riskLevel strings consumed by the dashboard services.
_LEVEL_LABELS = {0: "Low", 1: "Medium", 2: "High"}
_STATUS_LABELS = {0: "LOW RISK", 1: "MEDIUM RISK", 2: "HIGH RISK"}

_RECOMMENDATIONS = {
    0: "Nutritional status stable. Continue current dialysis and diet plan.",
    1: "Moderate albumin loss. Monitor protein intake and review next session.",
    2: "Significant albumin loss. Escalate to the doctor and consider "
       "nutritional intervention.",
}


# ---------------------------------------------------------------------------
# Model loading (singleton, at import)
# ---------------------------------------------------------------------------

def _default_model_dir():
    # services/ -> backend/ -> apps/ -> <repo>; model lives in apps/ml-model/src
    here = os.path.dirname(os.path.abspath(__file__))
    apps_dir = os.path.abspath(os.path.join(here, "..", ".."))
    return os.path.join(apps_dir, "ml-model", "src")


_MODEL_DIR = os.environ.get("MODEL_DIR", _default_model_dir())

_MODEL = None        # the fitted sklearn Pipeline
_FEATURES = None     # ordered list of 20 feature column names
_np = None           # numpy module (only imported if the model loads)
_pd = None           # pandas module


def _load_model():
    global _MODEL, _FEATURES, _np, _pd
    try:
        import joblib
        import numpy as np
        import pandas as pd

        model_path = os.path.join(_MODEL_DIR, "rf_balanced_model.pkl")
        features_path = os.path.join(_MODEL_DIR, "features.pkl")

        model = joblib.load(model_path)
        features = joblib.load(features_path)

        _MODEL = model
        _FEATURES = list(features)
        _np = np
        _pd = pd
        logger.info("Risk model loaded from %s", _MODEL_DIR)
    except Exception as exc:  # noqa: BLE001 - any failure -> heuristic fallback
        logger.warning(
            "Could not load risk model from %s (%s). "
            "Falling back to heuristic risk scoring.",
            _MODEL_DIR, exc,
        )
        _MODEL = None


_load_model()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _to_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _opt_float(value):
    """Return a float, or None if the value is missing/blank (-> imputed)."""
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _flag(value):
    """Coerce a comorbidity flag to 0/1; None if absent (-> imputed)."""
    if value is None or value == "":
        return None
    if isinstance(value, str):
        return 1 if value.strip().lower() in ("1", "true", "yes", "y") else 0
    try:
        return 1 if float(value) >= 0.5 else 0
    except (TypeError, ValueError):
        return None


def _safe_div(numerator, denominator):
    """Division that yields NaN (imputable) on zero/None denominators."""
    if numerator is None or denominator in (None, 0):
        return _np.nan
    return numerator / denominator


def _build_feature_frame(session_data, patient_data):
    """Build the single-row DataFrame the model expects (df[_FEATURES])."""
    patient_data = patient_data or {}

    nan = _np.nan

    duration_min = _opt_float(session_data.get("duration"))
    session_duration_hr = (duration_min / 60.0) if duration_min else nan

    # The session form captures UF removed in Litres; the model expects mL.
    uf_volume_litres = _opt_float(session_data.get("ufVolume"))
    total_uf_volume_ml = (
        uf_volume_litres * 1000.0 if uf_volume_litres is not None else None
    )
    kt_v = _opt_float(session_data.get("ktv"))
    age_years = _opt_float(patient_data.get("age"))
    crp_mg_l = _opt_float(session_data.get("crp"))
    membrane_flux_kuf = _opt_float(session_data.get("membraneFlux"))

    # UF rate is the same quantity as uf_intensity (volume per hour); derive it
    # from captured fields instead of leaving it to the median imputer.
    ultrafiltration_rate_ml_hr = _safe_div(total_uf_volume_ml, session_duration_hr)

    row = {
        "hemoglobin_g_dl": _opt_float(session_data.get("hemoglobin")),
        "potassium_mmol_l": _opt_float(session_data.get("potassium")),
        "phosphorus_mg_dl": _opt_float(session_data.get("phosphorus")),
        "blood_flow_rate_ml_min": _opt_float(session_data.get("bloodFlowRate")),
        "session_duration_hr": session_duration_hr,
        "protein_intake_g": _opt_float(session_data.get("proteinIntake")),
        "calorie_intake_kcal": _opt_float(session_data.get("calorieIntake")),
        "transmembrane_pressure_mmhg": _opt_float(
            session_data.get("transmembranePressure")
        ),
        "ultrafiltration_rate_ml_hr": ultrafiltration_rate_ml_hr,
        "membrane_flux_kuf": membrane_flux_kuf,
        "kt_v": kt_v,
        "age_years": age_years,
        "weight_kg": _opt_float(patient_data.get("weight")),
        "diabetes": _flag(patient_data.get("diabetes")),
        "hypertension": _flag(patient_data.get("hypertension")),
        "cardiovascular_disease": _flag(patient_data.get("cardiovascular_disease")),
        "crp_mg_l": crp_mg_l,
        # engineered (mirror model_trainer.py; no spurious epsilon)
        "uf_intensity": _safe_div(total_uf_volume_ml, session_duration_hr),
        "ktv_to_age": _safe_div(kt_v, age_years),
        "crp_to_flux": _safe_div(
            crp_mg_l,
            membrane_flux_kuf + 0.1 if membrane_flux_kuf is not None else None,
        ),
    }

    # Replace any Python None with NaN so the median imputer handles them.
    row = {k: (nan if v is None else v) for k, v in row.items()}

    df = _pd.DataFrame([row])
    return df[_FEATURES]


# ---------------------------------------------------------------------------
# Heuristic fallback (former dev stub)
# ---------------------------------------------------------------------------

def _heuristic_risk(albumin_loss, ktv, potassium):
    score = 0.0
    score += min(max(albumin_loss, 0.0) / 0.6, 1.0) * 60.0
    if ktv and ktv < 1.2:
        score += min((1.2 - ktv) / 1.2, 1.0) * 25.0
    if potassium:
        if potassium > 5.5:
            score += min((potassium - 5.5) / 2.0, 1.0) * 15.0
        elif potassium < 3.5:
            score += min((3.5 - potassium) / 1.5, 1.0) * 15.0

    risk_score = round(min(score, 100.0), 1)
    if risk_score >= 60:
        level = 2
    elif risk_score >= 30:
        level = 1
    else:
        level = 0
    return level, risk_score


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def predict_session_risk(session_data, patient_data=None):
    """Estimate nutritional risk for a single dialysis session.

    Uses the trained model when available, otherwise a heuristic fallback.
    `patient_data` is the `patients/{uid}` document (age, weight, comorbidity
    flags); optional so older callers keep working (those fields get imputed).
    """

    albumin_before = _to_float(session_data.get("albuminBefore"))
    albumin_after = _to_float(session_data.get("albuminAfter"))
    albumin_loss = round(albumin_before - albumin_after, 3)

    level = None
    risk_score = None

    if _MODEL is not None:
        try:
            X = _build_feature_frame(session_data, patient_data)
            level = int(_MODEL.predict(X)[0])
            proba = _MODEL.predict_proba(X)[0]
            # Map class index -> position via classes_ for robustness.
            classes = list(getattr(_MODEL, "classes_", [0, 1, 2]))
            p_med = proba[classes.index(1)] if 1 in classes else 0.0
            p_high = proba[classes.index(2)] if 2 in classes else 0.0
            risk_score = round(float(p_med * 50.0 + p_high * 100.0), 1)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Risk model prediction failed (%s); using heuristic.", exc)
            level = None

    if level is None:
        ktv = _to_float(session_data.get("ktv"))
        potassium = _to_float(session_data.get("potassium"))
        level, risk_score = _heuristic_risk(albumin_loss, ktv, potassium)

    return {
        "riskScore": risk_score,
        "riskLevel": _LEVEL_LABELS[level],
        "recommendation": _RECOMMENDATIONS[level],
        "risk_level": level,
        "status": _STATUS_LABELS[level],
    }
