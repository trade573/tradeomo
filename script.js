document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const liveValueElement = document.getElementById('liveValue');
    const statusTickerElement = document.getElementById('statusTicker');
    const stockGraphElement = document.getElementById('stockGraph');

    // Starting stock value
    let stockValue = parseFloat(localStorage.getItem('stockValue')) || 170000;

    // Target values for the specific dates
    const targetValues = {
        '2025-03-28': 210001,
        '2025-03-29': 221675,
        '2025-03-30': 242872,
        '2025-03-31': 276876,
        '2025-04-01': 301229,
    };

    // Current date
    const currentDate = new Date();
    const todayKey = currentDate.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Set target value for today
    let currentTarget = targetValues[todayKey] || stockValue;

    // Display initial stock value on the page
    liveValueElement.textContent = `₹${stockValue.toLocaleString('en-IN')}`;

    // Setup Chart.js for stock value graph
    const ctx = stockGraphElement.getContext('2d');
    const stockGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 60 }, (_, i) => i + 1),  // Labels for 60-minute intervals
            datasets: [{
                label: 'Stock Price (₹)',
                data: Array(60).fill(stockValue),  // Initialize graph with data
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

    // Function to update stock value and graph
    function updateStockValue() {
        // Get current date
        const currentDate = new Date();
        const targetDate = new Date('2025-04-01T00:00:00');

        // Before April 1, fluctuate towards target
        if (currentDate < targetDate) {
            fluctuateBeforeApril1();
        }
        // After April 1, perform random fluctuations
        else {
            fluctuateAfterApril1();
        }
    }

    // Function to fluctuate the stock value before April 1
    function fluctuateBeforeApril1() {
        let fluctuationMagnitude = (Math.random() * 0.1 - 0.05);  // ±5% fluctuation
        let previousStockValue = stockValue;
        stockValue += fluctuationMagnitude * stockValue;

        // Gradually move towards the target value at the end of the day
        let targetTime = new Date('2025-03-31T23:59:59');
        let timeRemaining = targetTime - new Date();
        if (timeRemaining > 0) {
            let increment = (currentTarget - stockValue) / timeRemaining;
            stockValue += increment;
        }

        // Update the status ticker based on the fluctuation
        updateStatusTicker(stockValue, previousStockValue);

        // Display the stock value
        liveValueElement.textContent = `₹${stockValue.toLocaleString('en-IN')}`;

        // Update the graph with the fluctuating value
        stockGraph.data.datasets[0].data.push(stockValue);
        stockGraph.data.datasets[0].data.shift();  // Remove the oldest value
        stockGraph.update();

        // Save updated graph data in localStorage
        localStorage.setItem('graphData', JSON.stringify(stockGraph.data.datasets[0].data));
    }

    // Function to fluctuate the stock value after April 1 (random fluctuations like a real market)
    function fluctuateAfterApril1() {
        let randomFluctuation = Math.random() * 200 - 100; // Random fluctuation between -100 and 100
        let previousStockValue = stockValue;
        stockValue += randomFluctuation;

        // Prevent the value from becoming negative
        if (stockValue < 0) {
            stockValue = 0;
        }

        // Update the status ticker based on the fluctuation
        updateStatusTicker(stockValue, previousStockValue);

        // Display the fluctuating stock value
        liveValueElement.textContent = `₹${stockValue.toLocaleString('en-IN')}`;

        // Update the graph with the fluctuating value
        stockGraph.data.datasets[0].data.push(stockValue);
        stockGraph.data.datasets[0].data.shift();  // Remove the oldest value
        stockGraph.update();

        // Save updated graph data in localStorage
        localStorage.setItem('graphData', JSON.stringify(stockGraph.data.datasets[0].data));
    }

    // Function to update the status ticker based on stock fluctuation direction
    function updateStatusTicker(currentValue, previousValue) {
        if (currentValue > previousValue) {
            statusTickerElement.textContent = "Stock is rising!";
            statusTickerElement.style.color = "#66ff66";  // Green for rising
        } else if (currentValue < previousValue) {
            statusTickerElement.textContent = "Stock is falling!";
            statusTickerElement.style.color = "#ff6666";  // Red for falling
        } else {
            statusTickerElement.textContent = "Stock is steady.";
            statusTickerElement.style.color = "#ffcc00";  // Yellow for steady
        }
    }

    // Ensure the graph is the same for all users by loading shared graph data
    let sharedGraphData = JSON.parse(localStorage.getItem('graphData'));
    if (sharedGraphData) {
        stockGraph.data.datasets[0].data = sharedGraphData;
        stockGraph.update();
    } else {
        // If no shared data exists, initialize with default data
        let defaultGraphData = Array(60).fill(stockValue);
        localStorage.setItem('graphData', JSON.stringify(defaultGraphData));
        stockGraph.data.datasets[0].data = defaultGraphData;
        stockGraph.update();
    }

    // Run the update every second
    setInterval(updateStockValue, 1000);

    // Hide loader after the page content is fully loaded
    loader.style.display = 'none';
});
