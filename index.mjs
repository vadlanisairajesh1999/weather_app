import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const weatherstackApiKey = process.env.WEATHERSTACK_API_KEY;

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await axios.get(`http://api.weatherstack.com/current`, {
      params: {
        access_key: weatherstackApiKey,
        query: city,
      },
    });

    if (response.data.error) {
      return res.status(404).json({ error: response.data.error.info });
    }

    const weatherData = response.data;
    return res.json({
      location: weatherData.location.name,
      temperature: weatherData.current.temperature,
      weather_descriptions: weatherData.current.weather_descriptions[0],
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
