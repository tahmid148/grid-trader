from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return ""


@app.route("/info")
def info():
    return {"text": "This is the info API endpoint"}


if __name__ == "__main__":
    app.run(debug=True)
