document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const liveValueElement = document.getElementById('liveValue');
    const statusTickerElement = document.getElementById('statusTicker');

    // Initial Stock Value
    let currentValue = 170000;
    let previousValue = currentValue;

    // Date-based target values for the stock
    const targetValues = {
        '2025-03-28': 210001,
        '2025-03-29': 221675,
        '2025-03-30': 242872,
        '2025-03-31': 276876,
        '2025-04-01': 301229
    };

    // Get current date
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    let targetDate = targetValues[currentDate] || 210001; // Default to 210001 if no target date

    // Function to format numbers with commas
    function formatNumber(number) {
        return number.toLocaleString('en-IN');  // Format with commas (Indian format)
    }

    // Update live stock value gradually and fluctuate it
    function updateLiveValue() {
        // Add random fluctuation to the stock value (-100 to +100)
        const fluctuation = Math.random() * 200 - 100; // Random fluctuation
        currentValue += fluctuation;

        // Ensure stock value doesn't go below the initial value
        if (currentValue < 170000) {
            currentValue = 170000;
        }

        // Display live stock value with commas
        liveValueElement.textContent = `₹${formatNumber(currentValue.toFixed(0))}`;

        // Update the stock ticker status
        if (currentValue > previousValue) {
            statusTickerElement.textContent = "Stock is rising!";
            statusTickerElement.style.color = "#66ff66";  // Green color for rising
        } else if (currentValue < previousValue) {
            statusTickerElement.textContent = "Stock is falling!";
            statusTickerElement.style.color = "#ff6666";  // Red color for falling
        } else {
            statusTickerElement.textContent = "Stock is steady.";
            statusTickerElement.style.color = "#ffcc00";  // Yellow color for steady
        }

        // Update the previous value to track stock movement
        previousValue = currentValue;
    }

    // Setup Chart.js for stock price graph
    const ctx = document.getElementById('stockGraph').getContext('2d');
    const stockGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 60 }, (_, i) => i + 1), // Labels for the last 60 minutes
            datasets: [{
                label: 'Stock Price (₹)',
                data: Array(60).fill(currentValue), // Initial data
                backgroundColor: 'rgba(0, 255, 0, 0.3)', // Green for rising
                borderColor: 'rgba(0, 255, 0, 1)', // Bright green for rising
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

    // Update the graph and stock value every second
    setInterval(() => {
        updateLiveValue();

        // Update the graph with the fluctuating stock value
        stockGraph.data.datasets[0].data.push(currentValue.toFixed(0)); // Push the new value to the graph
        stockGraph.data.datasets[0].data.shift(); // Remove the first value to maintain the graph length
        stockGraph.update();
    }, 1000); // Update every 1 second

    // Simulate the loader being hidden after the page is fully loaded
    loader.style.display = 'none';
});
