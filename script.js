document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const liveValueElement = document.getElementById('liveValue');
    const statusTickerElement = document.getElementById('statusTicker');

    // Initial Stock Value and Target Value
    const initialValue = 170000;
    const targetValue = 210001;
    
    // Get current date and target date (28/03/2025 11:59 PM)
    const currentDate = new Date();
    const targetDate = new Date('2025-03-28T23:59:59');
    
    // If the target date is in the past, exit
    if (currentDate > targetDate) {
        console.log("Target date has passed.");
        return;
    }

    // Calculate the remaining time until target
    const remainingTime = targetDate - currentDate;

    // Retrieve the last known stock value from localStorage or start from initial value
    let currentValue = parseFloat(localStorage.getItem('sharedStockValue')) || initialValue;

    // Calculate stock increment per millisecond based on the remaining time
    const stockIncrementPerMS = (targetValue - initialValue) / remainingTime;

    // Initialize graph data (previous data for display)
    let graphData = JSON.parse(localStorage.getItem('graphData')) || Array(60).fill(currentValue);

    // Setup Chart.js for stock price graph
    const ctx = document.getElementById('stockGraph').getContext('2d');
    const stockGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 60 }, (_, i) => i + 1),  // Create 60 labels for 1-minute intervals
            datasets: [{
                label: 'Stock Price (₹)',
                data: graphData,
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

    // Function to update the stock price, apply fluctuation, and update the graph
    function updateLiveValue() {
        // Calculate elapsed time since the start
        const now = new Date();
        const elapsedTime = now - currentDate; // Elapsed time in milliseconds

        // Calculate the new stock value based on the elapsed time
        let newValue = initialValue + stockIncrementPerMS * elapsedTime;

        // Apply random fluctuation to simulate stock behavior
        const fluctuation = Math.random() * 200 - 100; // Random value between -100 and 100
        newValue += fluctuation;

        // Ensure the stock value doesn't fall below the initial value
        newValue = Math.max(newValue, initialValue);

        // Format the value with commas for better readability
        const formattedValue = newValue.toLocaleString('en-IN');
        liveValueElement.textContent = `₹${formattedValue}`;

        // Update the ticker status
        if (fluctuation > 0) {
            statusTickerElement.textContent = "Stock is rising!";
            statusTickerElement.style.color = "#66ff66";  // Green color for rising
            stockGraph.data.datasets[0].borderColor = 'rgba(0, 255, 0, 1)'; // Green for rising
        } else if (fluctuation < 0) {
            statusTickerElement.textContent = "Stock is falling!";
            statusTickerElement.style.color = "#ff6666";  // Red color for falling
            stockGraph.data.datasets[0].borderColor = 'rgba(255, 0, 0, 1)'; // Red for falling
        } else {
            statusTickerElement.textContent = "Stock is steady.";
            statusTickerElement.style.color = "#ffcc00";  // Yellow color for steady
            stockGraph.data.datasets[0].borderColor = 'rgba(255, 255, 0, 1)'; // Yellow for steady
        }

        // Store the updated value to localStorage to persist across refreshes
        localStorage.setItem('sharedStockValue', newValue);

        // Update the graph with the new stock price
        stockGraph.data.datasets[0].data.push(newValue.toFixed(0));
        stockGraph.data.datasets[0].data.shift();  // Remove the oldest value (sliding window effect)
        stockGraph.update();
    }

    // Simulate the loader being hidden after the page is fully loaded
    loader.style.display = 'none';

    // Update live stock value every second (1000ms)
    setInterval(updateLiveValue, 1000);

    // Update the graph every minute with a new stock value
    setInterval(() => {
        // Add small fluctuations (random up or down) to the stock value
        const fluctuation = (Math.random() * 200 - 100); // Random value between -100 and 100
        currentValue += fluctuation;

        // Ensure the stock value doesn't fall below the initial value
        currentValue = Math.max(currentValue, initialValue);

        // Update graph data in the sliding window effect
        stockGraph.data.datasets[0].data.push(currentValue.toFixed(0));  // Add the new price to the dataset
        stockGraph.data.datasets[0].data.shift();  // Remove the oldest value (sliding window effect)
        stockGraph.update();

        // Store the graph data in localStorage to persist across refreshes
        localStorage.setItem('graphData', JSON.stringify(stockGraph.data.datasets[0].data));
    }, 60000);  // Update the graph every minute (60000ms)
});
