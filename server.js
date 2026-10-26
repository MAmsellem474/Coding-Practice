import Express from "express";
import { inputCleaner, inputValidator } from "./middleware.js";

const app = Express();
app.use(Express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.redirect("/form");
});

app.get("/form", (req, res) => {
    res.status(200).sendFile(process.cwd() + "/public/index.html");
});

app.post("/submit", inputCleaner, inputValidator, (req, res) => {
    res.status(200).send(`${req.body.username} ${req.body.comment}`);
});

app.listen(3000, () => {
    console.log("Server is running on port localhost:3000");
});