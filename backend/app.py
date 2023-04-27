from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return ""


@app.route("/info")
def members():
    return {"members": ["member1", "member2", "member3"]}


if __name__ == "__main__":
    app.run(debug=True)
