const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const licenses = {
    BR: ["186.23.164.145"]
};

app.get("/license", (req, res) => {
    const ip = req.query.ip;
    const event = req.query.event;

    if (licenses[event] && licenses[event].includes(ip)) {
        return res.send("OK");
    }

    return res.send("NO");
});

app.listen(PORT, () => {
    console.log("API RUNNING");
});
