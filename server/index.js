import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const app = express();
const PORT = 5000;
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/sme-data', async (req, res) => {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    const url = "https://nsearchives.nseindia.com/archives/sme/bhavcopy/sme190824.csv";
    const response = await axios.get(url, { headers, responseType: 'text' });
    res.setHeader('Content-Type', 'text/csv');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching SME data:', error.message);
    res.status(500).send('Error fetching SME data');
  }
});

app.get('/api/cm52-data', async (req, res) => {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    const response = await axios.get(
      'https://nsearchives.nseindia.com/content/CM_52_wk_High_low_19082024.csv',
      { headers, responseType: 'text' }
    );
    res.setHeader('Content-Type', 'text/csv');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching CM 52 data:', error.message);
    res.status(500).send('Error fetching CM 52 data');
  }
});