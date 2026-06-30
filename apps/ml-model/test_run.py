from src.predict import predict_session_risk
import matplotlib.pyplot as plt
import os

# Ensure the output directory exists for the image
if not os.path.exists('src'): os.makedirs('src')

# Dummy data - Representing a single hemodialysis session
sample_session = {
    'hemoglobin_g_dl': 11.5, 'potassium_mmol_l': 4.5, 'phosphorus_mg_dl': 4.0,
    'blood_flow_rate_ml_min': 300, 'session_duration_hr': 4.0, 'protein_intake_g': 45.0,
    'calorie_intake_kcal': 1800, 'transmembrane_pressure_mmhg': 150,
    'ultrafiltration_rate_ml_hr': 800, 'membrane_flux_kuf': 30, 'kt_v': 1.4,
    'age_years': 50, 'weight_kg': 70, 'diabetes': 0, 'hypertension': 1,
    'cardiovascular_disease': 0, 'crp_mg_l': 5.0, 'total_uf_volume_ml': 3000
}

try:
    # 1. Get prediction
    result = predict_session_risk(sample_session)
    
    # 2. Console Output
    print(f"--- DialyzeSmart Clinical Prediction ---")
    print(f"Risk Category: {result['status']}")
    print(f"Risk Level Code: {result['risk_level']}")
    
    # 3. Visualization
    levels = ["LOW", "MEDIUM", "HIGH"]
    colors = ['green', 'orange', 'red']
    
    plt.figure(figsize=(6, 4))
    bars = plt.bar(levels, [0.5, 0.5, 0.5], color='lightgray')
    
    # Highlight the predicted category
    bars[result['risk_level']].set_color(colors[result['risk_level']])
    
    plt.title(f"Clinical Nutritional Risk: {result['status']}")
    plt.ylabel("Risk Intensity")
    
    # Save the visualization for the project report
    plt.savefig('src/prediction_result.png')
    print("\nVisualization saved to src/prediction_result.png")
    plt.show()

except Exception as e:
    print(f"Prediction Error: {e}")