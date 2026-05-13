import axios from 'axios';

// WMO Weather interpretation codes that indicate severe weather
const SEVERE_WEATHER_CODES = [
  65, // Heavy rain
  67, // Heavy freezing rain
  75, // Heavy snow fall
  82, // Violent rain showers
  86, // Heavy snow showers
  95, // Thunderstorm
  96, // Thunderstorm with slight hail
  99  // Thunderstorm with heavy hail
];

export const checkSevereWeather = async (latitude, longitude) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await axios.get(url);
    
    if (response.data && response.data.current_weather) {
      const weathercode = response.data.current_weather.weathercode;
      const isSevere = SEVERE_WEATHER_CODES.includes(weathercode);
      
      if (isSevere) {
        return {
          isSevere: true,
          weathercode: weathercode,
          temperature: response.data.current_weather.temperature,
          windspeed: response.data.current_weather.windspeed,
          message: `Severe weather condition detected (Code: ${weathercode}). Please take caution and find shelter if necessary.`
        };
      }
    }
    return { isSevere: false };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return { isSevere: false };
  }
};
