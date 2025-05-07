const tempEl = document.getElementById("room-temp");
const peakEl = document.getElementById("peak-temp");
const locEl = document.getElementById("location");
const fireEl = document.getElementById("fire-status");

const ctx = document.getElementById("tempChart").getContext("2d");
const labels = [];
const dataPoints = [];

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Temperature (°C)',
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            data: dataPoints,
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 100
            }
        }
    }
});

setInterval(() => {
    fetch('/data')
        .then(res => res.json())
        .then(data => {
            const now = new Date().toLocaleTimeString();
            const temp = data.temperature;
            const dist = data.distance;

            tempEl.innerText = `${temp} °C`;
            peakEl.innerText = `${temp} °C`;
            locEl.innerText = `${dist} m`;

            // Fire detection logic
            if (temp > 60) {
                fireEl.innerText = "FIRE!";
                fireEl.style.backgroundColor = "red";
            } else {
                fireEl.innerText = "SAFE";
                fireEl.style.backgroundColor = "green";
            }

            labels.push(now);
            dataPoints.push(temp);

            if (labels.length > 15) {
                labels.shift();
                dataPoints.shift();
            }

            chart.update();
        });
}, 2000);