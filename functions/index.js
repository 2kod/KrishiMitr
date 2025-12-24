const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.searchStores = functions.https.onRequest(async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const TOMTOM_KEY = functions.config().tomtom.key;

    const query = `fertilizer shop ${city}`;
    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${TOMTOM_KEY}&limit=9&countrySet=IN`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});
