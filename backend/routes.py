from flask import Flask, request, jsonify
from flask_cors import CORS

from premium_calculate import premium_cost

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST','GET'])
def get_premium():
    data = request.json
    adults = data['adultAges']
    adults = [int(i) for i in adults]
    children = data['childrenAges']
    children = [int(i) for i in children]
    tenure = int(data['insuranceTenure'])
    cover = int(data['insuranceCover'])
    print(adults)
    print(children)
    print(tenure)
    print(cover)
    premium = premium_cost(adults, children, tenure, cover)
    return premium

if __name__=='__main__':
    app.run(debug=True)