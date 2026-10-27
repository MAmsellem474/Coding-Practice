import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line
app.get("/api", (_req, res) => {
  let now = new Date();
  res.json({
    unix: now.getTime(),
    utc: now.toUTCString(),
  });
});
app.get("/api/:date", (req, res) => {
  let dateString = req.params.date;
  let date;
  if (!dateString) {
    let now = new Date();
    res.json({
      unix: now.getTime(),
      utc: now.toUTCString(),
    });
  } else {
    if (/^\d+$/.test(dateString)) {
      date = new Date(parseInt(dateString));
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      return res.json({ error: "Invalid Date" });
    } 
    res.json({
      unix: date.getTime(),
      utc: date.toUTCString(),
      });
    }
  }
);
// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
