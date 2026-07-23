from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

# ----------------------------
# Flask App Configuration
# ----------------------------
app = Flask(__name__)
CORS(app)

# ----------------------------
# Load Model & Encoders
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

MODEL_PATH = os.path.join(MODEL_DIR, "crop_yield_prediction.pkl")
AREA_ENCODER_PATH = os.path.join(MODEL_DIR, "area_encoder.pkl")
ITEM_ENCODER_PATH = os.path.join(MODEL_DIR, "item_encoder.pkl")

try:
    model = joblib.load(MODEL_PATH)
    area_encoder = joblib.load(AREA_ENCODER_PATH)
    item_encoder = joblib.load(ITEM_ENCODER_PATH)

    print("Model and encoders loaded successfully.")

except Exception as e:
    print(f"Error loading model: {e}")
    raise

# ----------------------------
# Home Route
# ----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Backend Running",
        "model": "Loaded Successfully"
    })

# ----------------------------
# Prediction Route
# ----------------------------
@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data received."
            }), 400

        # Read Inputs
        area = data["Area"]
        item = data["Item"]
        year = int(data["Year"])
        rainfall = float(data["average_rain_fall_mm_per_year"])
        pesticides = float(data["pesticides_tonnes"])
        temp = float(data["avg_temp"])

        # Encode categorical values
        try:
            area_encoded = area_encoder.transform([area])[0]
            item_encoded = item_encoder.transform([item])[0]

        except ValueError:
            return jsonify({
                "success": False,
                "error": "Invalid Area or Item."
            }), 400

        # Create dataframe
        features = pd.DataFrame([{
            "Area": area_encoded,
            "Item": item_encoded,
            "Year": year,
            "average_rain_fall_mm_per_year": rainfall,
            "pesticides_tonnes": pesticides,
            "avg_temp": temp
        }])

        # Prediction
        prediction = model.predict(features)[0]

        return jsonify({
            "success": True,
            "predicted_yield": round(float(prediction), 2)
        })

    except KeyError as e:
        return jsonify({
            "success": False,
            "error": f"Missing field: {e}"
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ----------------------------
# Run Server
# ----------------------------
if __name__ == "__main__":
    print("Starting Flask Server...")
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )