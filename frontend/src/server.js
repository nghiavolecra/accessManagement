import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = expression();
app.use(cors({origin: process.env.FRONTEND_URL}));