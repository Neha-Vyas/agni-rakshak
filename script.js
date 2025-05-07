// Connect to MQTT broker (WebSocket)
const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

// Sample Chart.js setup
const ctx = document.getElementById("tempChart").getContext("2d");
const tempChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Temperature (°C)",
      data: [],
      borderColor: "red",
      fill: false,
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Distance (m)" }
      },
      y: {
        title: { display: true, text: "Temperature (°C)" },
        beginAtZero: true
      }
    }
  }
});

// Data processing
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("agni/temperature");
  client.subscribe("agni/distance");
});

let peakTemp = 0;

client.on("message", (topic, message) => {
  const value = parseFloat(message.toString());

  if (topic === "agni/temperature") {
    document.getElementById("room-temp").textContent = value.toFixed(2);
    peakTemp = Math.max(peakTemp, value);
    document.getElementById("peak-temp").textContent = peakTemp;

    // Fire alert
    const fireStatus = document.getElementById("fire-status");
    if (value >= 45) {
      fireStatus.textContent = "FIRE";
      fireStatus.style.backgroundColor = "red";
      updateHotZones("red");
    } else {
      fireStatus.textContent = "SAFE";
      fireStatus.style.backgroundColor = "green";
      updateHotZones("green");
    }

    // Push to graph
    tempChart.data.datasets[0].data.push(value);
    tempChart.data.labels.push(new Date().toLocaleTimeString());
    tempChart.update();
  }

  if (topic === "agni/distance") {
    document.getElementById("location").textContent = value;
  }
});

function updateHotZones(color) {
  for (let i = 1; i <= 10; i++) {
    const led = document.getElementById(`led${i}`);
    if (color === "red") {
      led.classList.remove("green");
      led.classList.add("red");
    } else {
      led.classList.remove("red");
      led.classList.add("green");
    }
  }
}
