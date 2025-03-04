const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const async = require('async');

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const PORT = process.env.PORT || 3000;

// Helper function to validate and format Amazon URL
function getAmazonUrl(query) {
    if (query.includes('amazon.in')) {
        return query; // It's already an Amazon URL
    }
    // Create search URL
    return `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
}

// Route to handle scraping
app.get('/scrape', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const url = getAmazonUrl(query);
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'en-US,en;q=0.9'
        };

        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        const selectors = {
            title: '#productTitle, .a-text-normal',
            price: '.a-price-whole',
            brand: '#productDetails_techSpec_section_1 tr:contains("Brand") td, .a-size-base.a-color-secondary'
        };

        const productData = {
            title: $(selectors.title).first().text().trim(),
            price: $(selectors.price).first().text().trim(),
            brand: $(selectors.brand).first().text().trim()
        };

        res.json(productData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to handle performance testing
app.get('/test', async (req, res) => {
    const TOTAL_REQUESTS = 50; // Reduced for quicker testing
    const CONCURRENCY = 5;
    let results = [];
    let successCount = 0;
    let failureCount = 0;

    const testStart = Date.now();

    await async.timesLimit(TOTAL_REQUESTS, CONCURRENCY, async () => {
        const startTime = process.hrtime();
        try {
            await axios.get('http://localhost:3000/scrape?query=gaming+mouse');
            const elapsed = process.hrtime(startTime);
            const responseTime = elapsed[0] * 1000 + elapsed[1] / 1e6;
            successCount++;
            results.push(responseTime);
        } catch (error) {
            const elapsed = process.hrtime(startTime);
            const responseTime = elapsed[0] * 1000 + elapsed[1] / 1e6;
            failureCount++;
            results.push(responseTime);
        }
    });

    const testEnd = Date.now();
    const totalDuration = (testEnd - testStart) / 1000;

    const testResults = {
        totalRequests: TOTAL_REQUESTS,
        successCount,
        failureCount,
        successRate: ((successCount / TOTAL_REQUESTS) * 100).toFixed(2),
        failureRate: ((failureCount / TOTAL_REQUESTS) * 100).toFixed(2),
        avgResponseTime: results.reduce((a, b) => a + b, 0) / results.length,
        requestsPerSecond: (TOTAL_REQUESTS / totalDuration).toFixed(2),
        totalDuration
    };

    res.json(testResults);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});