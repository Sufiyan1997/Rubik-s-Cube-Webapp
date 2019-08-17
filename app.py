from flask import render_template,Flask,url_for

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')
if __name__ == "__main__":
    app.run(port=80,debug=True)