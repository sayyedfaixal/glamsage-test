# Stress Test Analysis Report

## Overview
This report analyzes the stress test results for the scraping API endpoint. Various test configurations were evaluated to determine the optimal concurrency and request settings.

## Test Results

| Total Requests | Concurrency | Success Rate (%) | Fail Rate (%) | Avg Response Time (ms) | Requests Per Second |
|---------------|------------|----------------|------------|--------------------|------------------|
| 100 | 10 | 100.00 | 0.00 | 2971.60 | 0.00 |
| 1000 | 100 | 84.50 | 15.50 | 12204.22 | 0.01 |
| 1000 | 20 | 88.40 | 11.60 | 2729.42 | 0.01 |
| 1000 | 10 | 91.50 | 8.50 | 2615.39 | 0.00 |


## Optimal Configuration
The most optimal configuration was **100 requests with concurrency 10**.

- ✅ **Success Rate:** 100.00%
- ⚡ **Requests Per Second:** 0.00 RPS
- ⏳ **Average Response Time:** 2971.60 ms

## Conclusion
The test results indicate that increasing concurrency beyond a certain point negatively impacts the success rate. The optimal configuration balances **high request throughput with a stable success rate and low response times.**

