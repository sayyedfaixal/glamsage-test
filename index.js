const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Route to handle scraping
app.get('/scrape', async (req, res) => {
    try {
        const url = 'https://www.amazon.in/Razer-DeathAdder-Hyperspeed-Award-Winning-RZ01-04130100-R3A1/dp/B09KH6NFXG/';
        
        // Configure headers to mimic browser request
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'en-US,en;q=0.9'
        };

        // Fetch HTML content
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        // Convert XPaths to CSS selectors (fragile approach)
        const selectors = {
            title: '#productTitle',
            price: '.a-price-whole',
            brand: '#productDetails_techSpec_section_1 tr:contains("Brand") td'
        };

        // Extract data
        const productData = {
            title: $(selectors.title).text().trim(),
            price: $(selectors.price).text().trim(),
            brand: $(selectors.brand).text().trim()
        };

        res.json(productData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});