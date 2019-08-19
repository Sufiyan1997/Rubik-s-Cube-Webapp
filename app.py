from flask import render_template,Flask,url_for,request,redirect,jsonify
from urllib.parse import unquote_plus
from cube_solver import cube_solver
from solution import solution

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/solver',methods=['POST'])
def solve():
    state = request.get_json()
    solver_input = {
        'l':state[0],
        'r':state[1],
        'f':state[2],
        'b':state[3],
        'u':state[4],
        'd':state[5]
    }

    solver = cube_solver(solver_input)
    debug = False
    ans = solver.solve(debug)
    return jsonify(ans.__dict__)


if __name__ == "__main__":
    app.run(port=80,debug=True)