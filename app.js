const express = require("express");
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔐 USUARIOS (LOGIN)
const users = [
    { user: "admin", pass: "1234" }
];

// 📦 DATOS
let licenses = {
    BR: {
        active: true,
        ips: [
            { ip: "186.23.164.145", desc: "Evento de Tomi" }
        ]
    }
};

// 🔐 LOGIN
app.post("/login", (req, res) => {
    const { user, pass } = req.body;

    const found = users.find(u => u.user === user && u.pass === pass);

    if (found) return res.json({ success: true });

    res.json({ success: false });
});

// 📥 GET LICENCIAS
app.get("/data", (req, res) => {
    res.json(licenses);
});

// ➕ AGREGAR IP
app.post("/add-ip", (req, res) => {
    const { event, ip, desc } = req.body;

    if (!licenses[event]) {
        licenses[event] = { active: true, ips: [] };
    }

    licenses[event].ips.push({ ip, desc });

    res.json({ success: true });
});

// 🔄 ACTIVAR / DESACTIVAR
app.post("/toggle", (req, res) => {
    const { event, active } = req.body;

    if (licenses[event]) {
        licenses[event].active = active;
    }

    res.json({ success: true });
});

// 🎯 VALIDACIÓN (JAVA)
app.get("/license", (req, res) => {
    const { ip, event } = req.query;

    const data = licenses[event];

    if (!data || !data.active) return res.send("NO");

    if (data.ips.find(i => i.ip === ip)) {
        return res.send("OK");
    }

    return res.send("NO");
});

app.listen(PORT, () => {
    console.log("API PRO RUNNING");
});
