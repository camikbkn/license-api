const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const licenses = {
    BR: {
        active: true,
        ips: ["186.23.164.145", "181.10.10.10"]
    },
    PVP: {
        active: true,
        ips: ["123.123.123.123"]
    }
};

app.get("/license", (req, res) => {
    const ip = req.query.ip;
    const event = req.query.event;

    const data = licenses[event];

    if (!data) return res.send("NO");

    if (!data.active) return res.send("NO");

    if (data.ips.includes(ip)) {
        return res.send("OK");
    }

    return res.send("NO");
});

app.listen(PORT, () => {
    console.log("API RUNNING");
});
