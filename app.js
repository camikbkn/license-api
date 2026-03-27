const express = require("express");
const app = express();
const fs = require("fs");

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
    { user: "camikbkn", pass: "27012013Elu??" }
];

// 📦 DATOS
let licenses = {};

function loadLicenses() {
    try {
        const data = fs.readFileSync("licenses.json");
        licenses = JSON.parse(data);
    } catch (e) {
        console.error("Error cargando licenses.json", e);
    }
}

function saveLicenses() {
    fs.writeFileSync("licenses.json", JSON.stringify(licenses, null, 2));
}

// cargar al iniciar
loadLicenses();

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

    saveLicenses(); // 👈 CLAVE

    res.json({ success: true });
});

// ❌ ELIMINAR IP
app.post("/delete-ip", (req, res) => {
    const { event, ip } = req.body;

    if (licenses[event]) {
        licenses[event].ips = licenses[event].ips.filter(i => i.ip !== ip);
    }

    saveLicenses();

    res.json({ success: true });
});

// ✏️ EDITAR IP (solo descripción)
app.post("/edit-ip", (req, res) => {
    const { event, ip, desc } = req.body;

    if (licenses[event]) {
        const found = licenses[event].ips.find(i => i.ip === ip);
        if (found) {
            found.desc = desc;
        }
    }

    saveLicenses();

    res.json({ success: true });
});

// 🔄 ACTIVAR / DESACTIVAR
app.post("/toggle", (req, res) => {
    const { event, active } = req.body;

    if (licenses[event]) {
        licenses[event].active = active;
    }

    saveLicenses();

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
