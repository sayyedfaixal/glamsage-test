const axios = require('axios');
const async = require('async');

const BASE_URL = 'http://localhost:3000/scrape'; // Change if hosted remotely
const TOTAL_REQUESTS = 100; // Adjust for higher stress
const CONCURRENCY = 10; // Number of concurrent requests

let results = [];
let successCount = 0;
let failureCount = 0;

// Function to make a request and log response time
const makeRequest = async (i) => {
    const startTime = process.hrtime(); // Start timer

    try {
        const response = await axios.get(BASE_URL);
        const elapsed = process.hrtime(startTime); // End timer
        const responseTime = elapsed[0] * 1000 + elapsed[1] / 1e6; // Convert to milliseconds

        console.log(
            `✅ Request ${i + 1}: Status ${response.status} | Time: ${responseTime.toFixed(2)}ms`
        );

        successCount++;
        results.push(responseTime);
    } catch (error) {
        const elapsed = process.hrtime(startTime);
        const responseTime = elapsed[0] * 1000 + elapsed[1] / 1e6;

        console.error(
            `❌ Request ${i + 1} failed: ${error.response ? error.response.status : "No Response"} | Time: ${responseTime.toFixed(2)}ms`
        );

        failureCount++;
        results.push(responseTime);
    }
};

// Performance & Rate Limit Testing
(async () => {
    console.log(`🚀 Starting stress test: ${TOTAL_REQUESTS} requests with concurrency ${CONCURRENCY}...`);

    const testStart = Date.now(); // Track total test duration

    await async.timesLimit(TOTAL_REQUESTS, CONCURRENCY, async (n) => {
        await makeRequest(n);
    });

    const testEnd = Date.now();
    const totalDuration = (testEnd - testStart) / 1000; // Convert to seconds

    // Calculate stats
    const avgResponseTime = results.reduce((a, b) => a + b, 0) / results.length;
    const successRate = ((successCount / TOTAL_REQUESTS) * 100).toFixed(2);
    const failureRate = ((failureCount / TOTAL_REQUESTS) * 100).toFixed(2);
    const requestsPerSecond = (TOTAL_REQUESTS / totalDuration).toFixed(2);

    // Summary Log
    console.log("\n📊 Performance Summary:");
    console.log(`✅ Successful Requests: ${successCount}/${TOTAL_REQUESTS} (${successRate}%)`);
    console.log(`❌ Failed Requests: ${failureCount}/${TOTAL_REQUESTS} (${failureRate}%)`);
    console.log(`⏳ Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`⚡ Requests Per Second (RPS): ${requestsPerSecond}`);
    console.log(`⏱️ Total Duration: ${totalDuration.toFixed(2)}s`);
})();
