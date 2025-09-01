import express from 'express';
import axios from 'axios';

const router = express.Router();

const MODEL_ID = "deepseek/deepseek-chat"; 
const API_KEY = "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";

function parseGames(content) {
  const entries = content.split('\n\n');

  const games = entries.map(entry => {
    const titleLine = entry.match(/TITLE\d+:\s*(.*)/);
    const descLine = entry.match(/DESCRIPTION\d+:\s*(.*)/);

    return {
      title: titleLine ? titleLine[1].trim() : '',
      description: descLine ? descLine[1].trim() : ''
    };
  });

  return games;
}




router.post('/games-suggestions', async (req, res) => {
  const weatherData = req.body;

  try {
    const response = await axios.post(
      'https://wittywardrobe.store/aims-service7/recommend-game',
      weatherData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ); 
    console.log('response',response)

res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

export const deepseek =  router;
