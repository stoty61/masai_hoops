from flask import Flask, jsonify
from flask import request
from flask_mysqldb import MySQL
import time

app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_HOST'] = '193.203.166.13'
app.config['MYSQL_USER'] = 'u835552006_bballpaul'
app.config['MYSQL_PASSWORD'] = 'WarriorsvsRaptors2019!'
app.config['MYSQL_DB'] = 'u835552006_BallStats'

mysql = MySQL(app)


# @app.route("/members")
# def members():
#     cur = mysql.connection.cursor()
#     cur.execute("SELECT * FROM members")
#     data = cur.fetchall()
#     cur.close()
#     return jsonify({"members": data})

@app.route('/addUser', methods=['POST'])
def addUser():
    data = request.json  # or request.json
    # Process the data
    name = data.get('name')
    email = data.get('email')
    pw = data.get('pw')

    cursor = mysql.connection.cursor()

    try:
        # Assuming your table has columns named col1, col2, col3
        cursor.execute("INSERT INTO User_Info (Username, Email, Password) VALUES (%s, %s, %s)", (name, email, pw))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': 'Data inserted successfully'}), 200
    
    except Exception as e:
        mysql.connection.rollback()
        cursor.close()
        return jsonify({'error': str(e)}), 500





@app.route("/")
def entry():
    return {"test": ["one", "two", "three"]}


# # Define a route for your API endpoint
# @app.route('/addUser', methods=['PUT'])
# def addUser():
#     # Assuming you expect JSON data in the request body
#     data = request.json

#     # Extract the parameter sent from React
#     name = data.get('name')
#     email = data.get('email')
#     pw = data.get('pw')

#     print(name)


#     # Perform the database insertion
#     cursor = mysql.connection.cursor()
#     try:
#         # Assuming your table has columns named col1, col2, col3
#         cursor.execute("INSERT INTO User_Info (col1, col2, col3) VALUES (%s, %s, %s)", (name, email, pw))
#         mysql.connection.commit()
#         cursor.close()
#         return jsonify({'message': 'Data inserted successfully'}), 200
#     except Exception as e:
#         mysql.connection.rollback()
#         cursor.close()
#         return jsonify({'error': str(e)}), 500


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/projections')
def database_test():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM prediction_results_2024_")
    rows = cur.fetchall()
    
    # Fetch column names from cursor description
    column_names = [desc[0] for desc in cur.description]
    
    cur.close()
    return jsonify({"column_names": column_names, "rows": rows})


if __name__ == "__main__":
    app.run(debug=True, port=5000)

