import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/database.js';
import urlRouter from './routes/url.route.js';
import Url from './models/url.model.js'; // ✅ Import URL Model

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB();

// API endpoint
app.get('/', (req, res) => {
    res.send('🚀 API is running...');
});

// Use the URL router
app.use('/api/url', urlRouter);

// ✅ Handle short URLs globally
app.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;

        // Find the URL in the database
        const url = await Url.findOne({ shortUrl });

        if (!url) {
            return res.status(404).json({ message: 'URL Not Found' });
        }

        url.clicks += 1; // Increment click count
        await url.save();

        return res.redirect(url.originalUrl); // ✅ Redirect to original URL
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
