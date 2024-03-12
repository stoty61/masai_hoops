from flask import Flask, jsonify
from flask_mysqldb import MySQL
import time

app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_HOST'] = '193.203.166.13'
app.config['MYSQL_USER'] = 'u835552006_bballpaul'
app.config['MYSQL_PASSWORD'] = 'WarriorsvsRaptors2019!'
app.config['MYSQL_DB'] = 'u835552006_BallStats'

mysql = MySQL(app)


@app.route("/members")
def members():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM members")
    data = cur.fetchall()
    cur.close()
    return jsonify({"members": data})


@app.route("/")
def entry():
    return {"test": ["one", "two", "three"]}


@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/database_test')
def database_test():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM prediction_results_2024 LIMIT 1")
    row = cur.fetchone()
    cur.close()
    return jsonify({"first_row": row})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

