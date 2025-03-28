document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const liveValueElement = document.getElementById('liveValue');
    const statusTickerElement = document.getElementById('statusTicker');

    // Initial Stock Value
    let currentValue = 170000;

    // Simulate stock fluctuations and update every 1 second
    function updateLiveValue() {
        const change = (Math.random() * 2000 - 1000); // Random value between -1000 and 1000
        currentValue += change;

        // Update live stock value on the dashboard
        liveValueElement.textContent = `₹${currentValue.toFixed(0)}`;

        // Update the ticker status
        if (currentValue > 170000) {
            statusTickerElement.textContent = "Stock is rising!";
            statusTickerElement.style.color = "#66ff66";  // Green color for rising
        } else if (currentValue < 170000) {
            statusTickerElement.textContent = "Stock is falling!";
            statusTickerElement.style.color = "#ff6666";  // Red color for falling
        } else {
            statusTickerElement.textContent = "Stock is steady.";
            statusTickerElement.style.color = "#ffcc00";  // Yellow color for steady
        }

        // Simulate the loader being hidden after the page is fully loaded
        loader.style.display = 'none';
    }

    setInterval(updateLiveValue, 1000); // Update live stock value every 1 second

    // Setup Chart.js for stock price graph
    const ctx = document.getElementById('stockGraph').getContext('2d');
    const stockGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 60 }, (_, i) => i + 1),  // Create 60 labels for 1-minute intervals
            datasets: [{
                label: 'Stock Price (₹)',
                data: Array(60).fill(currentValue),
                backgroundColor: 'rgba(0, 255, 0, 0.3)',  // Light green
                borderColor: 'rgba(0, 255, 0, 1)',  // Bright green
                borderWidth: 1,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time (minutes)',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Stock Price (₹)',
                    },
                    ticks: {
                        beginAtZero: false,
                    },
                },
            },
            animation: {
                duration: 0,
            },
        },
    });

    // Update graph every minute with a new stock value
    setInterval(() => {
        const newPrice = currentValue + (Math.random() * 2000 - 1000);
        stockGraph.data.datasets[0].data.shift();  // Remove the first value in the dataset
        stockGraph.data.datasets[0].data.push(newPrice.toFixed(0));  // Add the new price to the dataset
        stockGraph.update();
    }, 60000);  // Update the graph every minute (60000ms)
});
