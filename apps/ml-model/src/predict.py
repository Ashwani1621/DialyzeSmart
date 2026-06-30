import os

import joblib
import pandas as pd
import numpy as np

# Artifacts live next to this file; resolve paths relative to __file__ so the
# function works regardless of the caller's working directory.
_SRC_DIR = os.path.dirname(os.path.abspath(__file__))

def predict_session_risk(session_data):
    """
    Predicts the nutritional risk level for a hemodialysis session
    by recreating engineered clinical indicators.
    """
    # 1. Load the model and required features
    model = joblib.load(os.path.join(_SRC_DIR, 'rf_balanced_model.pkl'))
    features = joblib.load(os.path.join(_SRC_DIR, 'features.pkl'))

    # 2. Convert input dictionary to DataFrame
    df_input = pd.DataFrame([session_data])

    # 3. Recreate Engineered Features
    # These must match model_trainer.py exactly. Training used no epsilon on
    # uf_intensity / ktv_to_age, and +0.1 on crp_to_flux.
    df_input['uf_intensity'] = df_input['total_uf_volume_ml'] / df_input['session_duration_hr']
    df_input['ktv_to_age'] = df_input['kt_v'] / df_input['age_years']
    df_input['crp_to_flux'] = df_input['crp_mg_l'] / (df_input['membrane_flux_kuf'] + 0.1)
    
    # 4. Predict
    # Ensure df_input[features] contains all necessary columns in the correct order
    risk_level = model.predict(df_input[features])[0]
    
    # 5. Map result
    status_map = {0: "LOW RISK", 1: "MEDIUM RISK", 2: "HIGH RISK"}
    
    return {
        "risk_level": int(risk_level), 
        "status": status_map.get(risk_level, "UNKNOWN")
    }