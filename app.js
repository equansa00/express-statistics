const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

function mean(nums) {
    return nums.reduce((acc, cur) => acc + cur, 0) / nums.length;
}

function median(nums) {
    nums.sort((a, b) => a - b);
    const midIndex = Math.floor(nums.length / 2);
    if (nums.length % 2 === 0) {
        return (nums[midIndex - 1] + nums[midIndex]) / 2;
    }
    return nums[midIndex];
}

function mode(nums) {
    const freq = {};
    let max = 0;
    let mode = null;

    for (let num of nums) {
        if (freq[num]) {
            freq[num]++;
        } else {
            freq[num] = 1;
        }

        if (freq[num] > max) {
            max = freq[num];
            mode = num;
        }
    }

    return mode;
}

function validateNums(req, res, next) {
    if (!req.query.nums) {
        return res.status(400).json({ error: "nums are required" });
    }

    const nums = req.query.nums.split(',').map(n => parseFloat(n));

    for (let i = 0; i < nums.length; i++) {
        if (isNaN(nums[i])) {
            return res.status(400).json({ error: `${req.query.nums.split(',')[i]} is not a number` });
        }
    }

    req.nums = nums;
    next();
}

function saveToFile(data) {
    const existingData = fs.existsSync('results.json') ? JSON.parse(fs.readFileSync('results.json')) : [];
    existingData.push(data);
    fs.writeFileSync('results.json', JSON.stringify(existingData, null, 4));
}

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the statistics API! Use /mean, /median, /mode, or /all with the appropriate query parameters.');
});

// Apply the nums validator middleware
app.use('/mean', validateNums);
app.use('/median', validateNums);
app.use('/mode', validateNums);
app.use('/all', validateNums);

// Statistical Routes
app.get('/mean', (req, res) => {
    return res.json({
        operation: 'mean',
        value: mean(req.nums)
    });
});

app.get('/median', (req, res) => {
    return res.json({
        operation: 'median',
        value: median(req.nums)
    });
});

app.get('/mode', (req, res) => {
    return res.json({
        operation: 'mode',
        value: mode(req.nums)
    });
});

app.get('/all', (req, res) => {
    return res.json({
        operation: 'all',
        mean: mean(req.nums),
        median: median(req.nums),
        mode: mode(req.nums)
    });
});

// Save results middleware
app.use((req, res, next) => {
    if (req.query.save === 'true') {
        const data = {
            timestamp: new Date().toISOString(),
            ...res.locals
        };
        saveToFile(data);
    }
    next();
});

// Handle Accept header
app.use((req, res, next) => {
    res.locals.isHtml = req.get('Accept') === 'text/html';
    next();
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
