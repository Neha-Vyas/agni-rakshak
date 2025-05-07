import time
import random
import paho.mqtt.client as mqtt

broker = "broker.hivemq.com"
port = 1883

client = mqtt.Client()
client.connect(broker, port, 60)

while True:
    temp = round(random.uniform(20.0, 60.0), 2)  # Simulated temperature
    dist = random.randint(100, 900)              # Simulated distance

    client.publish("agni/temperature", temp)
    client.publish("agni/distance", dist)

    print(f"Published -> Temperature: {temp}, Distance: {dist}")
    time.sleep(2)
