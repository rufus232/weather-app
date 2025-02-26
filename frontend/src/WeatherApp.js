import React, { useState } from 'react';
import axios from 'axios';

const WeatherApp = () => {
  // États pour stocker la ville entrée, les données météo et l'historique des recherches
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState([]);

  // Fonction pour récupérer les données météo
  const getWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/weather?city=${city}`);
      setWeatherData(response.data.data); // Stocke les données de la météo dans l'état
    } catch (error) {
      console.error("Error fetching weather:", error); // Si erreur, affiche un message d'erreur
    }
  };

  // Fonction pour récupérer l'historique des recherches
  const getHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5001/history');
      setHistory(response.data); // Stocke l'historique des recherches dans l'état
    } catch (error) {
      console.error("Error fetching history:", error); // Si erreur, affiche un message d'erreur
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      {/* Input pour entrer la ville */}
      <input 
        type="text" 
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
        placeholder="Enter city" 
      />
      {/* Bouton pour obtenir la météo */}
      <button onClick={getWeather}>Get Weather</button>
      
      {/* Affichage des données de la météo si elles existent */}
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.city}, {weatherData.country}</h2>
          <p>{weatherData.weather}</p>
          <p>{weatherData.temperature} °C</p>
        </div>
      )}
      
      {/* Bouton pour récupérer l'historique des recherches */}
      <button onClick={getHistory}>Get Search History</button>
      
      {/* Affichage de l'historique des recherches */}
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {entry.city}, {entry.country} - {entry.temperature}°C - {entry.weather}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherApp;
