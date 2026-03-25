// CO3 & CO5: Server-Side Programming with Node.js
// This is your main server file: server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// XML Parser and Builder
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

// Path to XML file
const quotesXMLPath = path.join(__dirname, 'quotes.xml');

// CO4: Function to read quotes from XML
function readQuotesFromXML() {
    return new Promise((resolve, reject) => {
        fs.readFile(quotesXMLPath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            parser.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    });
}

// CO4: Function to write quotes to XML
function writeQuotesToXML(data) {
    return new Promise((resolve, reject) => {
        const xml = builder.buildObject(data);
        fs.writeFile(quotesXMLPath, xml, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

// CO3: Route to get all quotes from XML
app.get('/api/quotes', async (req, res) => {
    try {
        const quotesData = await readQuotesFromXML();
        res.json({
            success: true,
            quotes: quotesData.quotes.quote || []
        });
    } catch (error) {
        console.error('Error reading quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Error reading quotes from XML',
            error: error.message
        });
    }
});

// CO3: Route to get a random quote from XML
app.get('/api/quotes/random', async (req, res) => {
    try {
        const quotesData = await readQuotesFromXML();
        const quotes = quotesData.quotes.quote || [];
        
        if (quotes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No quotes available'
            });
        }
        
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        
        res.json({
            success: true,
            quote: {
                text: randomQuote.text[0],
                author: randomQuote.author[0],
                category: randomQuote.category ? randomQuote.category[0] : 'General'
            }
        });
    } catch (error) {
        console.error('Error getting random quote:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting random quote',
            error: error.message
        });
    }
});

// CO3: Route to add a new quote to XML
app.post('/api/quotes', async (req, res) => {
    try {
        const { text, author, category } = req.body;
        
        if (!text || !author) {
            return res.status(400).json({
                success: false,
                message: 'Text and author are required'
            });
        }
        
        const quotesData = await readQuotesFromXML();
        
        if (!quotesData.quotes.quote) {
            quotesData.quotes.quote = [];
        }
        
        const newQuote = {
            text: [text],
            author: [author],
            category: [category || 'General']
        };
        
        quotesData.quotes.quote.push(newQuote);
        
        await writeQuotesToXML(quotesData);
        
        res.json({
            success: true,
            message: 'Quote added successfully',
            quote: newQuote
        });
    } catch (error) {
        console.error('Error adding quote:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding quote to XML',
            error: error.message
        });
    }
});

// CO3: Route to get quotes by category
app.get('/api/quotes/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const quotesData = await readQuotesFromXML();
        const quotes = quotesData.quotes.quote || [];
        
        const filteredQuotes = quotes.filter(quote => 
            quote.category && quote.category[0].toLowerCase() === category.toLowerCase()
        );
        
        res.json({
            success: true,
            category: category,
            quotes: filteredQuotes
        });
    } catch (error) {
        console.error('Error filtering quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Error filtering quotes',
            error: error.message
        });
    }
});

// CO3: Route to search quotes
app.get('/api/quotes/search', async (req, res) => {
    try {
        const searchTerm = req.query.q;
        
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term is required'
            });
        }
        
        const quotesData = await readQuotesFromXML();
        const quotes = quotesData.quotes.quote || [];
        
        const results = quotes.filter(quote => 
            quote.text[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.author[0].toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        res.json({
            success: true,
            searchTerm: searchTerm,
            results: results
        });
    } catch (error) {
        console.error('Error searching quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching quotes',
            error: error.message
        });
    }
});

// CO3: Route to get quote statistics
app.get('/api/stats', async (req, res) => {
    try {
        const quotesData = await readQuotesFromXML();
        const quotes = quotesData.quotes.quote || [];
        
        const categories = {};
        const authors = {};
        
        quotes.forEach(quote => {
            const category = quote.category ? quote.category[0] : 'General';
            const author = quote.author[0];
            
            categories[category] = (categories[category] || 0) + 1;
            authors[author] = (authors[author] || 0) + 1;
        });
        
        res.json({
            success: true,
            totalQuotes: quotes.length,
            categoriesCount: Object.keys(categories).length,
            categories: categories,
            topAuthors: Object.entries(authors)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting statistics',
            error: error.message
        });
    }
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Quote Generator Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✨ Quote Generator Server running on http://localhost:${PORT}`);
    console.log(`📝 API Endpoints:`);
    console.log(`   GET  /api/quotes - Get all quotes`);
    console.log(`   GET  /api/quotes/random - Get random quote`);
    console.log(`   POST /api/quotes - Add new quote`);
    console.log(`   GET  /api/quotes/category/:category - Filter by category`);
    console.log(`   GET  /api/quotes/search?q=term - Search quotes`);
    console.log(`   GET  /api/stats - Get statistics`);
    console.log(`   GET  /health - Health check`);
});
