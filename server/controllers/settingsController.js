import db from '../config/database.js';

function parseJSON(str, fallback = {}) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function getSettings(req, res) {
  try {
    const stmt = db.prepare('SELECT * FROM settings');
    const rows = stmt.all();

    const settings = {
      storeName: 'Syvora Beauty & Lifestyle',
      storeEmail: 'contact@syvora.com',
      storePhone: '+1 (800) 555-SYVORA',
      currency: 'USD',
      usdToBdtRate: 120,
      standardShippingUSD: 10,
      expressShippingUSD: 25,
      freeShippingThresholdUSD: 75,
      standardShippingBDT: 60,
      expressShippingBDT: 120,
      freeShippingThresholdBDT: 3000,
      announcementBarText: '✨ Free Complimentary Shipping on Orders Over $75 / ৳3000 | Use Code WELCOME10 for 10% Off'
    };

    rows.forEach(r => {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch (e) {
        settings[r.key] = r.value;
      }
    });

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
}

export function updateSettings(req, res) {
  try {
    const newSettings = req.body;

    const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
    for (const [key, val] of Object.entries(newSettings)) {
      const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
      stmt.run(key, valStr);
    }

    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
}

export function getBanners(req, res) {
  try {
    const stmt = db.prepare('SELECT * FROM banners WHERE status = "active" ORDER BY id DESC');
    const banners = stmt.all();
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch banners.' });
  }
}
