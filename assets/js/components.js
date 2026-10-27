// Function to load both the Header and the Footer
async function loadComponents() {
    try {
        // Automatically determine base path relative to folder depth
        const isPagesDir = window.location.pathname.includes('/pages/');
        const baseComponentPath = isPagesDir ? '../components/' : './components/';

        // 1. Fetch and inject the Header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch(baseComponentPath + 'header.html?v=' + Date.now());
            let headerHTML = await headerResponse.text();

            if (!isPagesDir) {
                // Adapt relative links if header is ever loaded from root
                headerHTML = headerHTML
                    .replace(/href="([^"\/#:]+)\.html"/g, 'href="pages/$1.html"')
                    .replace(/href="\.\.\/index\.html"/g, 'href="index.html"');
            }
            headerPlaceholder.innerHTML = headerHTML;
            
            // Initialize mobile menu ONLY after header is loaded
            initializeMobileMenu();
            
            // Tell components it's safe to look for the auth-container
            document.dispatchEvent(new Event('headerLoaded'));
        }

        // 2. Fetch and inject the Footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerResponse = await fetch(baseComponentPath + 'footer.html?v=' + Date.now());
            let footerHTML = await footerResponse.text();

            if (!isPagesDir) {
                // Adapt relative links if footer is ever loaded from root
                footerHTML = footerHTML
                    .replace(/href="([^"\/#:]+)\.html"/g, 'href="pages/$1.html"')
                    .replace(/href="\.\.\/index\.html"/g, 'href="index.html"');
            }
            footerPlaceholder.innerHTML = footerHTML;
        }

    } catch (error) {
        console.error("Error loading components:", error);
    }
}

// Mobile Menu Logic
function initializeMobileMenu() {
    const openBtn = document.querySelector('.nav-toggle-btn[aria-label="open manu"]');
    const closeBtn = document.querySelector('.nav-toggle-btn[aria-label="close menu"]');
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.overlay');

    if (openBtn && navbar) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navbar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.classList.add('menu-open');
      });
    }

    if (closeBtn && navbar) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navbar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    }

    if (overlay && navbar) {
      overlay.addEventListener('click', () => {
        navbar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    }
}

// Global Logout Handler
document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'logout-button' || e.target.closest('#logout-button'))) {
        e.preventDefault();
        localStorage.removeItem('krishimitr_user');
        localStorage.removeItem('km_token');
        const isPagesDir = window.location.pathname.includes('/pages/');
        window.location.href = isPagesDir ? '../index.html' : 'index.html';
    }
});

// --- ROCK-SOLID INSTANT MULTILINGUAL TRANSLATOR ---
(function() {
    const HINDI_DICT = {
        // Navigation & Global Header
        "Home": "होम",
        "AI Doctor": "एआई डॉक्टर",
        "News": "कृषि समाचार",
        "Agri News": "कृषि समाचार",
        "Marketplace": "बाज़ार",
        "Find Stores": "खाद व बीज स्टोर",
        "Mandi Prices": "मंडी भाव",
        "Mandi Rates": "मंडी भाव",
        "Crop Guide": "फसल गाइड",
        "Weather": "मौसम",
        "Govt Schemes": "सरकारी योजनाएं",
        "More": "अन्य",
        "Contact": "संपर्क",
        "Logout": "लॉगआउट",
        "Login": "लॉगिन",
        "Sign Up": "साइन अप",
        
        // Schemes Page
        "Active Government Schemes": "सक्रिय सरकारी योजनाएं",
        "Discover financial aids, insurance, and subsidies available for farmers. Learn how to apply step-by-step.": "किसानों के लिए उपलब्ध वित्तीय सहायता, बीमा और सब्सिडी। चरण-दर-चरण आवेदन करना सीखें।",
        "All States / Central Schemes": "सभी राज्य / केंद्रीय योजनाएं",
        "All Categories": "सभी श्रेणियां",
        "Financial Support": "वित्तीय सहायता",
        "Crop Insurance": "फसल बीमा",
        "Solar & Equipment": "सोलर व कृषि यंत्र",
        "Irrigation": "सिंचाई योजना",
        "Organic Farming": "जैविक खेती",
        "Apply anytime": "कभी भी आवेदन करें",
        "Apply within 6 months": "6 माह के भीतर आवेदन करें",
        "Before Kharif/Rabi seasons": "खरीफ/रबी मौसम से पहले",
        "Varies by State": "राज्य अनुसार अलग",
        "View Details & Apply": "विवरण देखें और आवेदन करें",
        "Official Portal": "आधिकारिक पोर्टल",
        "Visit Official Portal": "आधिकारिक पोर्टल पर जाएं",
        "Key Benefits": "मुख्य लाभ",
        "Eligibility": "पात्रता",
        "Documents Required": "आवश्यक दस्तावेज",
        "How to Apply": "आवेदन कैसे करें",
        "Close": "बंद करें",
        "Loading verified government schemes...": "सत्यापित सरकारी योजनाएं लोड हो रही हैं...",

        // Common Schemes
        "PM-Kisan Samman Nidhi": "पीएम-किसान सम्मान निधि",
        "Pradhan Mantri Fasal Bima Yojana": "प्रधानमंत्री फसल बीमा योजना",
        "PM KUSUM Yojana": "पीएम कुसुम सोलर योजना",
        "Kisan Credit Card (KCC)": "किसान क्रेडिट कार्ड (केसीसी)",
        "Rajiv Gandhi Krishak Sathi": "राजीव गांधी कृषक साथी योजना",
        "Rythu Bandhu": "रायथू बंधु योजना",
        "Soil Health Card Scheme": "मृदा स्वास्थ्य कार्ड योजना",
        "Paramparagat Krishi Vikas Yojana": "परंपरागत कृषि विकास योजना",

        // News Page
        "Global Agri-News": "कृषि एवं मंडी समाचार",
        "Real-time updates on agriculture, markets, and technology from around the world.": "देश और दुनिया भर से कृषि, बाजार और तकनीक के ताजा समाचार।",
        "Read Article": "पूरा समाचार पढ़ें",
        "Today": "आज",

        // Dashboard Page
        "Namaste, Ramesh Kumar!": "नमस्ते, रमेश कुमार!",
        "Dashboard for Jaipur, Rajasthan": "डैशबोर्ड - जयपुर, राजस्थान",
        "Clear Sky": "साफ़ आसमान",
        "Humidity:": "आर्द्रता:",
        "Wind:": "हवा की गति:",
        "AI Leaf Doctor": "एआई पत्ता डॉक्टर",
        "Upload or snap a photo of any crop leaf for instant AI disease diagnosis and cure instructions.": "रोग की त्वरित पहचान और उपचार के लिए पौधे की पत्ती का फोटो लें या अपलोड करें।",
        "Open AI Scanner": "एआई स्कैनर खोलें",
        "Farm Profile": "किसान प्रोफ़ाइल",
        "Owner": "मालिक",
        "Contact": "संपर्क",
        "District": "ज़िला",
        "State": "राज्य",
        "Farm Size": "खेत का आकार",
        "5.0 Acres": "5.0 एकड़",
        "Recommended Crops -": "अनुशंसित फसलें -",
        "Rajasthan": "राजस्थान",
        "Wheat (Kalyan Sona)": "गेहूं (कल्याण सोना)",
        "Bajra (Pearl Millet)": "बाजरा (मोती बाजरा)",
        "Mustard (Pusa Bold)": "सरसों (पूसा बोल्ड)",
        "Live Mandi -": "लाइव मंडी भाव -",
        "Jaipur": "जयपुर",
        "Crop": "फसल",
        "Price/Qtl": "भाव / क्विंटल",
        "Trend": "रुझान",
        "Wheat": "गेहूं",
        "Mustard": "सरसों",
        "Bajra": "बाजरा",
        "Gram (Chana)": "चना",
        "Full Guide": "पूरी जानकारी",

        // AI Doctor / Scan Page
        "AI Leaf Disease Doctor": "एआई फसल रोग डॉक्टर",
        "Instant diagnosis powered by YOLOv8 Computer Vision. Detect 38+ crop leaf diseases in milliseconds.": "YOLOv8 कंप्यूटर विज़न द्वारा संचालित। 38+ फसल रोगों की मिलीसेकंड में पहचान करें।",
        "Drag & drop leaf photo here": "पत्ती का फोटो यहाँ छोड़ें",
        "or click to browse from device": "या डिवाइस से फोटो चुनें",
        "Supports JPG, PNG, WEBP up to 10MB": "JPG, PNG, WEBP (10MB तक) समर्थित",
        "Take Photo": "कैमरे से फोटो लें",
        "Diagnose Disease Now": "रोग की तुरंत पहचान करें",
        "Disease Diagnosis Result": "रोग निदान परिणाम",
        "Confidence Score": "सटीकता दर",
        "Recommended Treatment": "अनुशंसित उपचार व दवा",
        "Prevention Measures": "बचाव के उपाय",

        // Weather Page
        "Agricultural Weather Forecast": "कृषि मौसम पूर्वानुमान",
        "5-Day Accurate Weather & Farm Advisory": "5-दिवसीय सटीक मौसम व कृषि परामर्श",
        "Search City or District": "शहर या जिला खोजें",
        "Check Weather": "मौसम देखें",
        "Temperature": "तापमान",
        "Rain Probability": "बारिश की संभावना",
        "Advisory for Farmers": "किसानों के लिए कृषि सलाह",

        // Mandi Prices Page
        "Live Mandi Commodity Rates": "लाइव मंडी जींस भाव",
        "Real-time wholesale market prices across APMC mandis": "विभिन्न कृषि उपज मंडियों के ताजा थोक भाव",
        "Search crop or market...": "फसल या मंडी का नाम खोजें...",
        "Filter by State": "राज्य अनुसार चुनें",
        "Min Price": "न्यूनतम भाव",
        "Max Price": "अधिकतम भाव",
        "Modal Price": "मॉडल भाव",

        // Fertilizer Store Page
        "Find Fertilizer & Seed Stores": "खाद और बीज स्टोर खोजें",
        "Locate certified agricultural suppliers, fertilizer vendors, and seed banks near you": "नजदीकी प्रमाणित खाद, कीटनाशक और बीज विक्रेता खोजें",
        "Locate Stores Near Me": "मेरे नजदीकी स्टोर खोजें",
        "Directions": "रास्ता देखें",
        "Call Vendor": "विक्रेता को कॉल करें",

        // Contact Page
        "Get in Touch with KrishiMitra": "कृषिMitra से संपर्क करें",
        "We are here to support farmers, cooperatives, and agritech partners": "हम किसानों और कृषि विशेषज्ञों की मदद के लिए सदैव तत्पर हैं",
        "Full Name": "पूरा नाम",
        "Phone Number": "मोबाइल नंबर",
        "Your Message": "आपका संदेश",
        "Send Message": "संदेश भेजें"
    };

    const PUNJABI_DICT = {
        "Home": "ਮੁੱਖ ਪੰਨਾ",
        "AI Doctor": "ਏਆਈ ਡਾਕਟਰ",
        "News": "ਖ਼ਬਰਾਂ",
        "Marketplace": "ਮੰਡੀ ਤੇ ਬਾਜ਼ਾਰ",
        "Find Stores": "ਦੁਕਾਨਾਂ ਲੱਭੋ",
        "Mandi Prices": "ਮੰਡੀ ਰੇਟ",
        "Crop Guide": "ਫ਼ਸਲ ਗਾਈਡ",
        "Weather": "ਮੌਸਮ",
        "Govt Schemes": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        "Contact": "ਸੰਪਰਕ",
        "Logout": "ਲਾਗ ਆਊਟ",
        "Active Government Schemes": "ਸਰਗਰਮ ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        "Discover financial aids, insurance, and subsidies available for farmers. Learn how to apply step-by-step.": "ਕਿਸਾਨਾਂ ਲਈ ਵਿੱਤੀ ਸਹਾਇਤਾ, ਬੀਮਾ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੀ ਜਾਣਕਾਰੀ।",
        "All States / Central Schemes": "ਸਾਰੇ ਰਾਜ / ਕੇਂਦਰੀ ਸਕੀਮਾਂ",
        "All Categories": "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ",
        "Namaste": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
        "Dashboard for": "ਡੈਸ਼ਬੋਰਡ -",
        "Clear Sky": "ਸਾਫ਼ ਅਸਮਾਨ",
        "Humidity:": "ਨਮੀ:",
        "Wind:": "ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ:",
        "AI Leaf Doctor": "ਏਆਈ ਪੱਤਾ ਡਾਕਟਰ",
        "Upload or snap a photo of any crop leaf for instant AI disease diagnosis and cure instructions.": "ਫ਼ਸਲ ਦੇ ਰੋਗਾਂ ਦੀ ਜਾਂਚ ਅਤੇ ਇਲਾਜ ਲਈ ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਓ ਜਾਂ ਅੱਪਲੋਡ ਕਰੋ।",
        "Open AI Scanner": "ਏਆਈ ਸਕੈਨਰ ਖੋਲ੍ਹੋ",
        "Recommended Crops -": "ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀਆਂ ਫ਼ਸਲਾਂ -",
        "Recommended Crops": "ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀਆਂ ਫ਼ਸਲਾਂ",
        "Farm Profile": "ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ",
        "Owner": "ਮਾਲਕ",
        "District": "ਜ਼ਿਲ੍ਹਾ",
        "State": "ਸੂਬਾ",
        "Farm Size": "ਖੇਤ ਦਾ ਆਕਾਰ",
        "5.0 Acres": "5.0 ਏਕੜ",
        "Acres": "ਏਕੜ",
        "Live Mandi -": "ਲਾਈਵ ਮੰਡੀ ਰੇਟ -",
        "Live Mandi": "ਲਾਈਵ ਮੰਡੀ ਰੇਟ",
        "Crop": "ਫ਼ਸਲ",
        "Price/Qtl": "ਰੇਟ / ਕੁਇੰਟਲ",
        "Trend": "ਰੁਝਾਨ",
        "Wheat (Kalyan Sona)": "ਕਣਕ (ਕਲਿਆਣ ਸੋਨਾ)",
        "Wheat": "ਕਣਕ",
        "Bajra (Pearl Millet)": "ਬਾਜਰਾ (ਮੋਤੀ ਬਾਜਰਾ)",
        "Bajra": "ਬਾਜਰਾ",
        "Mustard (Pusa Bold)": "ਸਰ੍ਹੋਂ (ਪੂਸਾ ਬੋਲਡ)",
        "Mustard": "ਸਰ੍ਹੋਂ",
        "Full Guide": "ਪੂਰੀ ਜਾਣਕਾਰੀ",
        "Read Article": "ਪੂਰੀ ਖ਼ਬਰ ਪੜ੍ਹੋ",
        "Apply anytime": "ਕਦੇ ਵੀ ਅਪਲਾਈ ਕਰੋ",
        "Apply within 6 months": "6 ਮਹੀਨਿਆਂ ਦੇ ਅੰਦਰ ਅਪਲਾਈ ਕਰੋ",
        "Before Kharif/Rabi seasons": "ਸਾਉਣੀ/ਹਾੜ੍ਹੀ ਸੀਜ਼ਨ ਤੋਂ ਪਹਿਲਾਂ",
        "Varies by State": "ਰਾਜ ਅਨੁਸਾਰ ਵੱਖ",
        "View Details & Apply": "ਵੇਰਵਾ ਦੇਖੋ ਅਤੇ ਅਪਲਾਈ ਕਰੋ"
    };

    const DICTIONARIES = {
        'hi': HINDI_DICT,
        'pa': PUNJABI_DICT
    };

    const PHRASES = {};
    for (const [lang, dict] of Object.entries(DICTIONARIES)) {
        PHRASES[lang] = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
    }

    function translateDOM(lang) {
        if (!document.body) return;

        if (!lang || lang === 'en') {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
            let node;
            while (node = walker.nextNode()) {
                if (node.__kmOrig !== undefined) {
                    node.nodeValue = node.__kmOrig;
                }
            }
            document.querySelectorAll('[data-km-ph]').forEach(el => {
                el.placeholder = el.getAttribute('data-km-ph');
            });
            return;
        }

        const dict = DICTIONARIES[lang] || HINDI_DICT;
        const phraseList = PHRASES[lang] || PHRASES['hi'];

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.tagName.toLowerCase();
                    if (tag === 'script' || tag === 'style' || tag === 'select' || parent.id === 'language-select' || parent.closest('#language-select')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];
        let n;
        while (n = walker.nextNode()) {
            nodes.push(n);
        }

        nodes.forEach(node => {
            if (node.__kmOrig === undefined) {
                node.__kmOrig = node.nodeValue;
            }
            const orig = node.__kmOrig;
            const trimmed = orig.trim();

            if (dict[trimmed]) {
                node.nodeValue = orig.replace(trimmed, dict[trimmed]);
            } else {
                let replaced = orig;
                let changed = false;
                for (let i = 0; i < phraseList.length; i++) {
                    const enKey = phraseList[i][0];
                    const trVal = phraseList[i][1];
                    if (replaced.includes(enKey)) {
                        replaced = replaced.split(enKey).join(trVal);
                        changed = true;
                    }
                }
                if (changed) {
                    node.nodeValue = replaced;
                }
            }
        });

        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            if (!el.hasAttribute('data-km-ph')) {
                el.setAttribute('data-km-ph', el.placeholder);
            }
            const orig = el.getAttribute('data-km-ph');
            if (dict[orig]) el.placeholder = dict[orig];
        });
    }

    window.kmTranslate = translateDOM;

    window.changeLanguage = function(lang) {
        localStorage.setItem('km_language', lang);

        const select = document.getElementById('language-select');
        if (select && select.value !== lang) {
            select.value = lang;
        }

        translateDOM(lang);
    };

    function syncLanguage() {
        const savedLang = localStorage.getItem('km_language') || 'en';
        const select = document.getElementById('language-select');
        if (select) select.value = savedLang;
        if (savedLang !== 'en') {
            setTimeout(() => translateDOM(savedLang), 50);
        }
    }

    document.addEventListener('DOMContentLoaded', syncLanguage);
    document.addEventListener('headerLoaded', syncLanguage);

    // Watch for dynamically rendered content (dashboard widgets, schemes, weather, mandi)
    let isTranslating = false;
    const observer = new MutationObserver(() => {
        if (isTranslating) return;
        const savedLang = localStorage.getItem('km_language');
        if (savedLang && savedLang !== 'en') {
            isTranslating = true;
            translateDOM(savedLang);
            setTimeout(() => { isTranslating = false; }, 200);
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
})();

// Run the loader when the page opens
document.addEventListener('DOMContentLoaded', loadComponents);