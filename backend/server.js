const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Endpoint to fetch quiz questions from external API
app.get("/api/questions", async (req, res) => {
    try {
        const response = await axios.get("https://api.jsonserve.com/Uw5CrX");
        res.json({ questions: response.data.questions });
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        res.status(500).json({ error: "Failed to fetch quiz data" });
    }
});

// Endpoint to submit the score
app.post("/api/submit-score", (req, res) => {
    const { name, score } = req.body;
    console.log(`Player: ${name}, Score: ${score}`);
    res.json({ message: "Score submitted successfully!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
