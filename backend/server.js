require("dotenv").config();  // Charge les variables d'environnement
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.log("❌ Erreur MongoDB :", err));

// Modèle Mongoose
const WeatherSchema = new mongoose.Schema({
  city: String,
  country: String,
  temperature: Number,
  weather: String,
  timestamp: { type: Date, default: Date.now },
});

const Weather = mongoose.model("Weather", WeatherSchema);

// Route pour récupérer la météo et enregistrer dans MongoDB
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const weatherData = new Weather({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      weather: data.weather[0].description,
    });

    await weatherData.save();
    res.json({ status: "success", data: weatherData });
  } catch (error) {
    res.json({ status: "error", message: "Ville non trouvée" });
  }
});

// Route pour récupérer l'historique des recherches
app.get("/history", async (req, res) => {
  const history = await Weather.find().sort({ timestamp: -1 }).limit(10);
  res.json(history);
});

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur http://localhost:${PORT}`));
