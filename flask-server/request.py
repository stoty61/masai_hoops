import requests

# Define the URL of your Flask application
url = 'http://127.0.0.1:5000/upload_csv_to_db'  # Update with your actual URL

# Load the CSV file
files = {'file': open('prediction_results_2024.csv', 'rb')}  # Update with the path to your CSV file

# Make the POST request
response = requests.post(url, files=files)

# Print the response
print(response.json())