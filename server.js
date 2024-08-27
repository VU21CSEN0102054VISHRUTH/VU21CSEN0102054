const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9877; 
const WINDOW_SIZE = 10; 
let numberWindow = [];

const endpoints = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/rand'
};

app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;
    const url = endpoints[numberId];

    if (!url) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const windowPrevState = [...numberWindow];

    try {
        const response = await axios.get(url, { timeout: 500 });
        const newNumbers = response.data.numbers.filter(num => !numberWindow.includes(num));
        
        numberWindow = [...numberWindow, ...newNumbers].slice(-WINDOW_SIZE);
        const avg = numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length;

        res.json({
            windowPrevState,
            windowCurrState: numberWindow,
            numbers: response.data.numbers,
            avg: avg.toFixed(2)
        });
    } catch (error) {
        res.json({
            windowPrevState,
            windowCurrState: numberWindow,
            numbers: [],
            avg: (numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2)
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

