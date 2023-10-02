const express = require('express');
const fs = require('fs').promises;

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

async function saveResultsMiddleware(req, res, next) {
    if (req.query.save === 'true') {
        try {
            const data = {
                timestamp: new Date().toISOString(),
                ...res.locals.result
            };
            const existingData = await fs.readFile('results.json', 'utf-8').catch(() => '[]');
            const allData = [...JSON.parse(existingData), data];
            await fs.writeFile('results.json', JSON.stringify(allData, null, 4));
        } catch (err) {
            console.error("Error saving data:", err);
        }
    }
    next();
}

app.get('/', (req, res) => {
    res.send('Welcome to the statistics API! Use /mean, /median, /mode, or /all with the appropriate query parameters.');
});

app.use('/mean', validateNums);
app.use('/median', validateNums);
app.use('/mode', validateNums);
app.use('/all', validateNums);

app.get('/mean', (req, res, next) => {
    res.locals.result = {
        operation: 'mean',
        value: mean(req.nums)
    };
    next();
});

app.get('/median', (req, res, next) => {
    res.locals.result = {
        operation: 'median',
        value: median(req.nums)
    };
    next();
});

app.get('/mode', (req, res, next) => {
    res.locals.result = {
        operation: 'mode',
        value: mode(req.nums)
    };
    next();
});

app.get('/all', saveResultsMiddleware, (req, res, next) => {
    res.locals.result = {
        operation: 'all',
        mean: mean(req.nums),
        median: median(req.nums),
        mode: mode(req.nums)
    };
    next();
});

app.use((req, res, next) => {
    if (req.get('Accept') === 'text/html') {
        res.send(`<pre>${JSON.stringify(res.locals.result, null, 4)}</pre>`);
    } else {
        res.json(res.locals.result);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});