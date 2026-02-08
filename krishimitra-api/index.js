// api/index.js
const app = require('express')();
const cors = require('cors');

app.use(cors()); // Allow your website to fetch data

// --- THE MASTER DATABASE ---
const CROP_DATA = [
    {
        id: 1,
        name: "Wheat",
        hindi: "Gehoon",
        season: "Rabi",
        desc: "Staple food crop. Requires cool climate during growth and warm climate during harvest.",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80",
        temp: "10°C - 25°C",
        water: "75 - 100 cm",
        soil: "Loamy or Clay Soil",
        sowing: "Nov - Dec",
        duration: "120-140 Days",
        disease: "Yellow Rust",
        cure: "Spray Propiconazole 25 EC",
        videoId: "Q4sL-s3gP4w"
    },
    {
        id: 2,
        name: "Rice",
        hindi: "Chawal",
        season: "Kharif",
        desc: "Major food crop. Needs flooded fields and high humidity.",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80",
        temp: "22°C - 32°C",
        water: "150 - 300 cm",
        soil: "Clayey Soil",
        sowing: "June - July",
        duration: "110-150 Days",
        disease: "Blast Disease",
        cure: "Use Tricyclazole 75 WP",
        videoId: "7t3iJ9r6g4" // Example ID
    },
    {
        id: 3,
        name: "Cotton",
        hindi: "Kapas",
        season: "Kharif",
        desc: "Fiber crop. Needs black soil and frost-free days.",
        image: "https://images.unsplash.com/photo-1594220309564-9464e0302b41?w=500&q=80",
        temp: "25°C - 35°C",
        water: "50 - 80 cm",
        soil: "Black Soil (Regur)",
        sowing: "May - June",
        duration: "150-180 Days",
        disease: "Pink Bollworm",
        cure: "Install Pheromone Traps",
        videoId: "xyz123"
    },
    // ... Add more crops (Mustard, Sugarcane, etc.) here
];

// --- ENDPOINT: Get All Crops ---
app.get('/api/crops', (req, res) => {
    const { season, soil } = req.query; // Enable filtering via URL

    let results = CROP_DATA;

    // Filter by Season (e.g., ?season=Rabi)
    if (season) {
        results = results.filter(c => c.season.toLowerCase() === season.toLowerCase());
    }

    // Filter by Soil (e.g., ?soil=Black)
    if (soil) {
        results = results.filter(c => c.soil.toLowerCase().includes(soil.toLowerCase()));
    }

    res.json({
        success: true,
        count: results.length,
        data: results
    });
});

module.exports = app;