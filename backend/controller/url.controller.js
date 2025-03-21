import Url from '../models/url.model.js';
import { nanoid } from 'nanoid';
import validUrl from 'valid-url';
import QRCode from 'qrcode';

// Create a Shortened URL
export const createShortUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        // Validate the URL
        if (!validUrl.isUri(originalUrl)) {
            return res.status(400).json({ message: 'Invalid URL format' });
        }

        // Check if URL already exists in the database
        let url = await Url.findOne({ originalUrl });

        if (url) {
            return res.status(200).json({
                success: true,
                message: 'Short URL already exists',
                data: {
                    originalUrl: url.originalUrl,
                    shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
                    qrCode: url.qrCode, // ✅ Send QR Code for Short URL
                },
            });
        }

        // Generate a unique short URL
        const shortUrl = nanoid(8);
        const fullShortUrl = `${process.env.BASE_URL}/${shortUrl}`;

        // ✅ Generate QR Code for the Shortened URL
        const qrCode = await QRCode.toDataURL(fullShortUrl);

        // Save URL to Database
        url = new Url({ originalUrl, shortUrl, qrCode });
        await url.save();

        res.status(201).json({
            success: true,
            message: 'Short URL created successfully',
            data: {
                originalUrl: url.originalUrl,
                shortUrl: fullShortUrl,
                qrCode: qrCode, // ✅ QR Code for Shortened URL
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
