import requests

# Define the URL of the endpoint
url = 'http://localhost:8000/api/receita-qrcode'

# Define the JSON data to send
json_data = {
    "idReceita": 1,
    "medList": [
        {"id": 1, "quantidade": 3},
        {"id": 2, "quantidade": 1},
        {"id": 3, "quantidade": 2}
    ],
    "userName": "Manuel Fernandes",
    "userID": 123456789
}

# Send the POST request
response = requests.post(url, json=json_data)

# Check the response
if response.status_code == 200:
    print("Success! Data received successfully.")
else:
    print("Error:", response.json())
