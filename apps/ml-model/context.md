# DialyzeSmart-Model Project Context

## Project Overview
**DialyzeSmart-Model** is a machine learning-based clinical prediction system for hemodialysis patients. It predicts **nutritional risk levels** during hemodialysis sessions by analyzing clinical indicators and laboratory data.

The model uses a Random Forest classifier to categorize patients into three risk categories:
- **LOW RISK** (0): Minimal albumin loss during dialysis
- **MEDIUM RISK** (1): Moderate albumin loss
- **HIGH RISK** (2): Significant albumin loss requiring intervention

---

## Folder Structure

### Root Level
- **requirements.txt** — Python dependencies (pandas, numpy, scikit-learn, FastAPI, joblib, scipy, openpyxl)
- **test_run.py** — Demonstration script that loads a sample hemodialysis session and generates a risk prediction with visualization
- **venv/** — Python virtual environment (not tracked)

### `/data/` — Datasets Directory
#### `/data/raw/`
- **merged_training_data_final.xlsx** — Master training dataset containing labeled hemodialysis sessions with clinical parameters and albumin loss outcomes

#### `/data/processed/`
Raw dataset components that were likely merged to create the training data:
- **Dialysis Session Dataset.xlsx** — Session-specific parameters (blood flow rate, session duration, ultrafiltration data, membrane parameters)
- **Patient Demographic Dataset.xlsx** — Patient demographics (age, weight, comorbidities like diabetes, hypertension, cardiovascular disease)
- **clinical_lab_data.csv** — Laboratory values (hemoglobin, potassium, phosphorus, CRP)
- **nutrient_loss_labels.csv** — Target variable: albumin loss measurements (pre/post dialysis albumin levels)
- **nutrition_intake_data.csv** — Nutritional intake parameters (protein, calorie intake)
- **vital_signs_timeseries_random.csv** — Time-series vital signs data

### `/src/` — Source Code & Models
- **model_trainer.py** — Training pipeline that:
  - Loads merged training data from `data/raw/merged_training_data_final.xlsx`
  - Performs feature engineering (creates `uf_intensity`, `ktv_to_age`, `crp_to_flux`)
  - Implements a scikit-learn Pipeline with SimpleImputer + RandomForestClassifier
  - Uses GridSearchCV for hyperparameter tuning
  - Categorizes albumin loss into 3 risk levels (60th and 85th percentile thresholds)
  
- **predict.py** — Inference module providing `predict_session_risk()` function:
  - Loads pre-trained model (`rf_balanced_model.pkl`) and feature list (`features.pkl`)
  - Accepts session data dictionary with clinical parameters
  - Recreates engineered features
  - Returns risk level (0/1/2) and status string ("LOW/MEDIUM/HIGH RISK")
  
- **rf_balanced_model.pkl** — Serialized trained Random Forest model
- **features.pkl** — Ordered list of feature names for prediction
- **prediction_result.png** — Generated visualization from test run

---

## Key Clinical Features

### Input Parameters (Used for Prediction)
1. **Laboratory Values**: hemoglobin_g_dl, potassium_mmol_l, phosphorus_mg_dl, crp_mg_l
2. **Dialysis Parameters**: blood_flow_rate_ml_min, session_duration_hr, transmembrane_pressure_mmhg, ultrafiltration_rate_ml_hr, total_uf_volume_ml
3. **Membrane Properties**: membrane_flux_kuf, kt_v
4. **Nutritional Intake**: protein_intake_g, calorie_intake_kcal
5. **Patient Demographics**: age_years, weight_kg
6. **Comorbidities**: diabetes (0/1), hypertension (0/1), cardiovascular_disease (0/1)

### Engineered Features
- **uf_intensity** = total_uf_volume_ml / session_duration_hr (ultrafiltration rate per hour)
- **ktv_to_age** = kt_v / age_years (measure of dialysis adequacy normalized by age)
- **crp_to_flux** = crp_mg_l / (membrane_flux_kuf + 0.1) (inflammation relative to membrane capacity)

### Target Variable
**Albumin Loss** = albumin_pre_g_dl - albumin_post_g_dl
- Categorized using 60th percentile (LOW), 85th percentile (MEDIUM), and above (HIGH) thresholds

---

## Model Architecture

### Algorithm
- **RandomForestClassifier** with balanced subsample weighting (handles class imbalance)
- Imputation strategy: Median for missing values
- Class weighting: 'balanced_subsample' to address imbalanced risk categories

### Hyperparameter Search Space
- n_estimators: [200, 500]
- max_depth: [10, 20, None]
- min_samples_split: [2, 5]

### Training Setup
- Test-Train Split: 80/20
- Random State: 42 (reproducibility)

---

## Usage

### Training
```python
python src/model_trainer.py
```
Outputs:
- Trained model: `src/rf_balanced_model.pkl`
- Feature list: `src/features.pkl`
- Classification report on test set

### Testing/Prediction
```python
python test_run.py
```
- Runs a demo prediction on sample hemodialysis session
- Outputs risk category to console
- Saves visualization (`src/prediction_result.png`)

### Integration
Import and use the predict function:
```python
from src.predict import predict_session_risk

result = predict_session_risk(session_dict)
# Returns: {"risk_level": int, "status": str}
```

---

## Dependencies
- **pandas** — Data manipulation
- **numpy** — Numerical operations
- **scikit-learn** — ML pipeline and algorithms
- **imbalanced-learn** — Handling class imbalance
- **openpyxl** — Reading .xlsx files
- **joblib** — Model serialization
- **scipy** — Scientific computing
- **fastapi** — For potential API deployment
- **uvicorn** — ASGI server for FastAPI

---

## Next Steps / Deployment Considerations
1. API wrapper (FastAPI) for real-time predictions
2. Model validation on holdout test set
3. Hyperparameter fine-tuning based on clinical domain expertise
4. Integration with hospital EHR systems
5. Continuous monitoring of prediction performance
