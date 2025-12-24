const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Server running on port 5001" });
});

app.get("/api/test", (req, res) => {
    res.json({ success: true, port: 5001 });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log("✅ Server on port", PORT);
});
