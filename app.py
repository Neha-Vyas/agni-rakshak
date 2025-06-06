from flask import Flask, render_template, jsonify
from flask_cors import CORS
import paho.mqtt.client as mqtt
import threading

app = Flask(__name__)
CORS(app)

# Store latest data
latest_data = {"temperature": 0.0, "distance": 0.0}

# MQTT config
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "agnirakshak/temperature"

# MQTT Callbacks
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with code", rc)
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    try:
        temp, dist = map(float, msg.payload.decode().split(","))
        latest_data["temperature"] = temp
        latest_data["distance"] = dist
        print(f"[MQTT] Temp: {temp}°C | Dist: {dist}m")
    except Exception as e:
        print("Error:", e)

# MQTT Thread
def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT)
    client.loop_forever()

# Flask Routes
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/data")
def data():
    return jsonify(latest_data)

if __name__ == "__main__":
    mqtt_thread = threading.Thread(target=start_mqtt)
    mqtt_thread.daemon = True
    mqtt_thread.start()
    app.run(debug=True, port=3000)
