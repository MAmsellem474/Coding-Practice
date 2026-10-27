import express from "express";
import path from "path";
import weatherRouter from "./weather.js";
import { fileURLToPath } from "url";
const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/weather", weatherRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port localhost:${PORT}`);
});

app.get("/api/info", (req, res) => {
    res.json({
        name: "Weather Service API",
        version: "1.0.0",
        endpoints: ["/api/weather/:city", "/api/greet/:name", "/api/data"]
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/status", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.get("/docs", (req, res) => {
    res.redirect("/api/info");
});

app.get("/api/greet/:name", (req, res) => {
    const name = req.params.name;
    res.json({ message: `Hello, ${name}! Welcome to the Weather Service API.` });
});

app.route('/api/data')
    .get((req, res) => {
        res.json({ data: "Sample data for the Weather Service API." });
    })
    .post((req, res) => {
        res.status(201).json({ message: "Data received successfully." });
    });
