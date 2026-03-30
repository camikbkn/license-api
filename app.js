const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

// 🌐 CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// 🔌 MONGO
mongoose.connect("mongodb+srv://admin:27012013Elu@cluster0.b1h2exo.mongodb.net/?retryWrites=true&w=majority")
.then(() => console.log("✅ Mongo conectado"))
.catch(err => console.log("❌ Error Mongo:", err));

// 📦 MODELO
const LicenseSchema = new mongoose.Schema({
    event: String,
    active: Boolean,
    ips: [
        {
            ip: String,
            desc: String
        }
    ]
});

const License = mongoose.model("License", LicenseSchema);

// 🔐 LOGIN
const users = [
    { user: "camikbkn", pass: "27012013Elu??" }
];

app.post("/login", (req, res) => {
    const { user, pass } = req.body;

    const found = users.find(u => u.user === user && u.pass === pass);

    if (found) return res.json({ success: true });

    res.json({ success: false });
});

// 📥 GET DATA
app.get("/data", async (req, res) => {
    const list = await License.find();

    let result = {};

    list.forEach(l => {
        result[l.event] = {
            active: l.active,
            ips: l.ips
        };
    });

    res.json(result);
});

// ➕ ADD IP
app.post("/add-ip", async (req, res) => {
    const { event, ip, desc } = req.body;

    let lic = await License.findOne({ event });

    if (!lic) {
        lic = new License({
            event,
            active: true,
            ips: []
        });
    }

    lic.ips.push({ ip, desc });

    await lic.save();

    res.json({ success: true });
});

// ❌ DELETE IP
app.post("/delete-ip", async (req, res) => {
    const { event, ip } = req.body;

    let lic = await License.findOne({ event });

    if (lic) {
        lic.ips = lic.ips.filter(i => i.ip !== ip);
        await lic.save();
    }

    res.json({ success: true });
});

// ✏️ EDIT IP
app.post("/edit-ip", async (req, res) => {
    const { event, ip, desc } = req.body;

    let lic = await License.findOne({ event });

    if (lic) {
        const found = lic.ips.find(i => i.ip === ip);
        if (found) {
            found.desc = desc;
            await lic.save();
        }
    }

    res.json({ success: true });
});

// 🔄 TOGGLE
app.post("/toggle", async (req, res) => {
    const { event, active } = req.body;

    let lic = await License.findOne({ event });

    if (lic) {
        lic.active = active;
    } else {
        lic = new License({
            event,
            active,
            ips: []
        });
    }

    await lic.save();

    res.json({ success: true });
});

// 🎯 VALIDACIÓN (JAVA)
app.get("/license", async (req, res) => {
    const { ip, event } = req.query;

    const lic = await License.findOne({ event });

    if (!lic || !lic.active) return res.send("NO");

    if (lic.ips.find(i => i.ip === ip)) {
        return res.send("OK");
    }

    return res.send("NO");
});

// 🚀 START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 API PRO RUNNING");
});
