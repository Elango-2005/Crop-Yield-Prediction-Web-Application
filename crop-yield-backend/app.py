from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import gdown
# ----------------------------
# Flask App Configuration
# ----------------------------
app = Flask(__name__)
CORS(app)

# ----------------------------
# Load Model & Encoders
# ----------------------------
MODEL_URL = "https://drive.google.com/uc?export=download&id=1bianH9FTUVGp_5nwX9Tl7QP6xDxlv2kE"

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_FILE = os.path.join(MODEL_DIR, "crop_yield_prediction.pkl")

# Create model directory if it doesn't exist
os.makedirs(MODEL_DIR, exist_ok=True)

# Download only if model doesn't exist
if not os.path.exists(MODEL_FILE):
    print("Downloading model...")
    gdown.download(id="1bianH9FTUVGp_5nwX9Tl7QP6xDxlv2kE", output=MODEL_FILE, quiet=False)

try:
    model = joblib.load(MODEL_FILE)
    area_encoder = joblib.load(os.path.join(MODEL_DIR, "area_encoder.pkl"))
    item_encoder = joblib.load(os.path.join(MODEL_DIR, "item_encoder.pkl"))

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
    app.run(host="127.0.0.1", port=5000, debug=True)