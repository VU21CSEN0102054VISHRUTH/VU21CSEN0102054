const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

// Define the window size
const WINDOW_SIZE = 10;
let numberWindow = [];

// Define the endpoints for different number types
const endpoints = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/rand'
};

app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid; // Get the numberid from the request
    const url = endpoints[numberId]; // Map the numberid to the corresponding API endpoint

    if (!url) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const windowPrevState = [...numberWindow]; // Store the current state of the window

    try {
        // Fetch numbers from the third-party API
        const response = await axios.get(url, { timeout: 500 });

        if (response.data && response.data.numbers && response.data.numbers.length > 0) {
            const newNumbers = response.data.numbers.filter(num => !numberWindow.includes(num)); // Filter out duplicates

            if (newNumbers.length > 0) {
                // Add new numbers and maintain the window size
                numberWindow = [...numberWindow, ...newNumbers].slice(-WINDOW_SIZE);
            }

            const avg = numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length; // Calculate the average

            // Send the response
            res.json({
                windowPrevState,
                windowCurrState: numberWindow,
                numbers: response.data.numbers,
                avg: avg.toFixed(2)
            });
        } else {
            console.error("Empty or invalid response from the third-party API");
            res.json({
                windowPrevState,
                windowCurrState: numberWindow,
                numbers: [],
                avg: (numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2)
            });
        }
    } catch (error) {
        console.error("Error fetching data from third-party API:", error.message);
        res.json({
            windowPrevState,
            windowCurrState: numberWindow,
            numbers: [],
            avg: (numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2)
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
