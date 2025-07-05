from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["GET", "POST"])
def analyze():
    print("Received request method:", request.method)
    if request.method == "POST":
        data = request.json
        text = data.get("text", "")
        symbol_count = len(text)
        word_count = len(text.split())
        return jsonify({
            "symbols": symbol_count,
            "words": word_count
        })
    else:
        return "Use POST method to analyze text.", 200

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
