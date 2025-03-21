import express from 'express';
import { createShortUrl } from '../controller/url.controller.js';

const urlRouter = express.Router();

urlRouter.post('/shorten', createShortUrl);
// urlRouter.get('/:shortUrl', redirectShortUrl);


export default urlRouter;
