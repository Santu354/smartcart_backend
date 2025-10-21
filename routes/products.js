const express = require('express');
const router = express.Router();

// Mock function to generate random price
function randomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Mock function to generate product link for platform
function generateLink(platform, query) {
  const encoded = encodeURIComponent(query);
  switch (platform.toLowerCase()) {
    case 'amazon':
      return `https://www.amazon.in/s?k=${encoded}`;
    case 'flipkart':
      return `https://www.flipkart.com/search?q=${encoded}`;
    case 'snapdeal':
      return `https://www.snapdeal.com/search?keyword=${encoded}`;
    case 'myntra':
      return `https://www.myntra.com/${query.trim().replace(/ /g, '-').toLowerCase()}`;
    default:
      return '#';
  }
}

// Keywords to detect electronics
const electronicsKeywords = [
  'phone', 'laptop', 'tv', 'camera', 'headphone',
  'speaker', 'watch', 'tablet', 'console',
  'keyboard', 'mouse', 'monitor', 'earbuds'
];

router.get('/compare', (req, res) => {
  const { query, platform } = req.query;
  if (!query) return res.status(400).json({ deals: [] });

  const isElectronics = electronicsKeywords.some(keyword =>
    query.toLowerCase().includes(keyword)
  );

  // Decide which platforms to return
  let platforms = [];
  if (platform) {
    // Only requested platform
    platforms = [platform];
  } else {
    // Default platforms based on product type
    platforms = isElectronics ? ['Amazon', 'Flipkart'] : ['Amazon', 'Flipkart', 'Snapdeal', 'Myntra'];
  }

  const deals = platforms.map(p => {
    const priceRange = isElectronics ? [30000, 70000] : [500, 3000];
    return {
      platform: p,
      price: randomPrice(priceRange[0], priceRange[1]),
      link: generateLink(p, query)
    };
  });

  res.json({ deals });
});

module.exports = router;
