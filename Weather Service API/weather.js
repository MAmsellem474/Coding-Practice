import express from "express";
const router = express.Router();

const SUPPORTED_CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
router.get("/", (req, res) => {
    res.status(200).json({ cities: [...SUPPORTED_CITIES ] });
});

router.get("/:city", async (req, res) => {
    const { city } = req.params;
    try{
        const response = await fetch(`https://weather-proxy.freecodecamp.rocks/api/city/${city}`);
        const weatherData = await response.json();
        res.json({
            city: weatherData.name,
            country: weatherData.sys.country,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            iconUrl: weatherData.weather[0].icon
        });
    } catch (error) {
        res.status(404).json({
            error: `Could not fetch weather data for "${city}".`,
            hint: "The proxy API only supports: New York, Los Angeles, Chicago, Houston, and Phoenix."
        });
    }
});

export default router;