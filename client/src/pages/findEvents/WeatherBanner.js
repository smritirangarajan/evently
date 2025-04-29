// src/pages/findEvents/WeatherBanner.js
import React from 'react';

function WeatherBanner({ weather }) {
  return (
    <div 
      className={`text-center p-4 mb-6 rounded ${weather.goodWeather ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
    >
      <h2 className="text-xl font-semibold mb-2">
        Today's Weather in Your Area
      </h2>
      <p className="text-md">
        {weather.temp}°F — {weather.weatherDescription}
      </p>
      {weather.goodWeather ? (
        <p className="text-md font-bold mt-2">Great day for an event! 🎉</p>
      ) : (
        <p className="text-md font-bold mt-2">Plan accordingly — weather may not be ideal. 🌧️</p>
      )}
    </div>
  );
}

export default WeatherBanner;
