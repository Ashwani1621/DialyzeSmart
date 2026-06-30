import pandas as pd
import os
import joblib
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix

# 1. Load Data
FILE_PATH = 'data/raw/merged_training_data_final.xlsx'
df = pd.read_excel(FILE_PATH).dropna()

# 2. Advanced Feature Engineering
df['uf_intensity'] = df['total_uf_volume_ml'] / df['session_duration_hr']
df['ktv_to_age'] = df['kt_v'] / df['age_years']
df['crp_to_flux'] = df['crp_mg_l'] / (df['membrane_flux_kuf'] + 0.1)

features = [
    'hemoglobin_g_dl', 'potassium_mmol_l', 'phosphorus_mg_dl', 
    'blood_flow_rate_ml_min', 'session_duration_hr', 'protein_intake_g', 
    'calorie_intake_kcal', 'transmembrane_pressure_mmhg', 
    'ultrafiltration_rate_ml_hr', 'membrane_flux_kuf', 'kt_v', 
    'age_years', 'weight_kg', 'diabetes', 'hypertension', 
    'cardiovascular_disease', 'crp_mg_l', 'uf_intensity', 'ktv_to_age', 'crp_to_flux'
]
X = df[features]

# 3. Risk Categorization
albumin_loss = df["albumin_pre_g_dl"] - df["albumin_post_g_dl"]
p60 = albumin_loss.quantile(0.60)
p85 = albumin_loss.quantile(0.85)
y = pd.cut(albumin_loss, bins=[-np.inf, p60, p85, np.inf], labels=[0, 1, 2]).astype(int)

# 4. Pipeline with Grid Search
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('classifier', RandomForestClassifier(random_state=42, class_weight='balanced_subsample'))
])

param_grid = {
    'classifier__n_estimators': [200, 500],
    'classifier__max_depth': [10, 20, None],
    'classifier__min_samples_split': [2, 5]
}

# 5. Train & Tune
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='f1_macro', n_jobs=-1)
grid_search.fit(X_train, y_train)

# 6. Final Evaluation
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)

print(f"Best Parameters: {grid_search.best_params_}")
print("\nClassification Report:\n", classification_report(y_test, y_pred))


# 7. Save
if not os.path.exists('src'): os.makedirs('src')
joblib.dump(best_model, 'src/rf_balanced_model.pkl')
joblib.dump(features, 'src/features.pkl')

