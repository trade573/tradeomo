document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const liveValueElement = document.getElementById('liveValue');
    const statusTickerElement = document.getElementById('statusTicker');

    // Fixed starting stock value for everyone (₹170,000)
    let stockValue = 170000; 

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

    // Set initial stock value for today
    let currentTarget = targetValues[todayKey] || stockValue;

    // Setup Chart.js for real-time graph updates
    const ctx = document.getElementById('stockGraph').getContext('2d');
    const stockGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 60 }, (_, i) => i + 1),  // Labels for 60-minute intervals
            datasets: [{
                label: 'Stock Price (₹)',
                data: JSON.parse(localStorage.getItem('graphData')) || Array(60).fill(stockValue),  // Retrieve from localStorage if available
                backgroundColor: 'rgba(0, 255, 0, 0.3)',  // Light green
                borderColor: 'rgba(0, 255, 0, 1)',  // Bright green
                borderWidth: 1,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Ensure the graph resizes properly on mobile
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

    // Function to update stock value and fluctuations
    function updateStockValue() {
        // Get current date and check if it's before or after the target date
        const today = new Date();
        if (today < new Date('2025-04-01')) {
            // Update stock value before April 1st
            fluctuateStockValueBeforeApril();
        } else {
            // Fluctuate after April 1st like real stock behavior
            startFluctuation();
        }
    }

    // Function to simulate fluctuation before April 1st, 2025
    function fluctuateStockValueBeforeApril() {
        const fluctuationMagnitude = (Math.random() * 0.1 - 0.05);  // ±5% random fluctuation magnitude
        stockValue += stockValue * fluctuationMagnitude;

        // Ensure stock value doesn't go negative
        if (stockValue < 0) stockValue = 0;

        liveValueElement.textContent = `₹${stockValue.toLocaleString('en-IN')}`;
        updateGraph(stockValue);
    }

    // Function to simulate stock fluctuation after April 1st, 2025
    function startFluctuation() {
        let fluctuatingStockValue = stockValue;

        // Fluctuate stock value every second
        setInterval(() => {
            const randomFluctuation = (Math.random() * 0.1 - 0.05);  // ±5% fluctuation (both up and down)
            fluctuatingStockValue += fluctuatingStockValue * randomFluctuation;

            if (fluctuatingStockValue < 0) {
                fluctuatingStockValue = 0; // Prevent negative stock values
            }

            liveValueElement.textContent = `₹${fluctuatingStockValue.toLocaleString('en-IN')}`;
            updateGraph(fluctuatingStockValue);
        }, 1000); // Update every second
    }

    // Function to update the graph
    function updateGraph(newValue) {
        // Update graph with the new stock value
        stockGraph.data.datasets[0].data.push(newValue);
        stockGraph.data.datasets[0].data.shift();  // Remove the oldest value
        stockGraph.update();

        // Store updated graph data in localStorage
        localStorage.setItem('graphData', JSON.stringify(stockGraph.data.datasets[0].data));
    }

    // Function to update status ticker
    function updateStatusTicker() {
        const fluctuation = (Math.random() * 200 - 100);  // Random fluctuation between -100 and +100
        if (fluctuation > 0) {
            statusTickerElement.textContent = "Stock is rising!";
            statusTickerElement.style.color = "#66ff66";  // Green for rising
        } else if (fluctuation < 0) {
            statusTickerElement.textContent = "Stock is falling!";
            statusTickerElement.style.color = "#ff6666";  // Red for falling
        } else {
            statusTickerElement.textContent = "Stock is steady.";
            statusTickerElement.style.color = "#ffcc00";  // Yellow for steady
        }
    }

    // Hide the loader after the page content is loaded
    loader.style.display = 'none';

    // Start updating stock value after page load
    updateStockValue();

    // Update the graph and ticker every second
    setInterval(() => {
        updateStockValue();
        updateStatusTicker();
    }, 1000);  // Update the stock value and status ticker every second
});
