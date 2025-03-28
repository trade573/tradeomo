document.addEventListener('DOMContentLoaded', () => { 
    const loader = document.getElementById('loader');
    const liveValueElement = document.getElementById('liveValue');
    const statusTickerElement = document.getElementById('statusTicker');

    // Starting stock value
    let stockValue = parseFloat(localStorage.getItem('stockValue')) || 170000; // Get from localStorage or start from ₹1,70,000

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
        localStorage.setItem('stockValue', stockValue);
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
            localStorage.setItem('stockValue', fluctuatingStockValue);
        }, 1000); // Update every second
    }

    // Function to update the graph
    function updateGraph(newValue) {
        stockGraph.data.datasets[0].data.push(newValue);
        stockGraph.data.datasets[0].data.shift();  // Remove the oldest value
        stockGraph.update();
    }

    // Hide the loader after the page content is loaded
    loader.style.display = 'none';

    // Start updating stock value after page load
    updateStockValue();
});
