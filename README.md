# 🌾 Crop Yield Prediction Web Application

An AI-powered web application that predicts agricultural crop yield based on environmental and agricultural factors using a Machine Learning model.

---

## 📌 Overview

This project helps estimate crop yield by analyzing factors such as:

- Area (Country/Region)
- Crop Type
- Year
- Average Rainfall
- Pesticide Usage
- Average Temperature

The application uses a trained **Random Forest Regressor** to generate accurate crop yield predictions.

---

## 🚀 Features

- 🌱 Predict crop yield instantly
- 📊 Interactive and responsive user interface
- 🤖 Machine Learning model integration
- 📈 Feature importance visualization
- 📉 Model performance metrics
- 📱 Responsive design for desktop and mobile
- ⚡ Fast prediction using Flask REST API

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Axios
- Recharts

### Backend
- Python
- Flask
- Flask-CORS
- Scikit-learn
- Pandas
- NumPy
- Joblib

### Machine Learning
- Random Forest Regressor
- Label Encoding
- Data Preprocessing

---

## 📂 Project Structure

```text
Crop Yield Prediction APP
│
├── crop-yield-frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── crop-yield-backend
│   ├── app.py
│   ├── requirements.txt
│   ├── model
│   └── *.pkl
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/Crop-Yield-Prediction.git
```

---

### Frontend Setup

```bash
cd crop-yield-frontend
npm install
npm run dev
```

---

### Backend Setup

Create a virtual environment

```bash
python -m venv venv
```

Activate it

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run Flask

```bash
python app.py
```

---

## 📥 Input Parameters

| Parameter | Description |
|-----------|-------------|
| Area | Country/Region |
| Item | Crop Name |
| Year | Year of Prediction |
| Average Rainfall | Rainfall (mm/year) |
| Pesticides | Pesticide Usage (tonnes) |
| Average Temperature | Temperature (°C) |

---

## 📤 Output

The model predicts:

- Crop Yield (kg/hectare)

---

## 📊 Machine Learning Model

- Algorithm: Random Forest Regressor
- Problem Type: Regression
- Target Variable: Crop Yield

---

## 📸 Screenshots

Add screenshots here.

Example:

```
screenshots/home.png
screenshots/prediction.png
screenshots/results.png
```

---

## 🔮 Future Improvements

- User Authentication
- Weather API Integration
- Fertilizer Recommendation
- Crop Recommendation
- Deployment on Render
- Model Retraining Pipeline

---

## 👨‍💻 Author

**Elango S**

B.Tech – Artificial Intelligence & Data Science


LinkedIn: https://www.linkedin.com/in/elango-selvaraj/

---

## 📄 License

This project is developed for educational and portfolio purposes.