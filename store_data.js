const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdvv7OsOR7zlwkQSCEpvm2o6m0IpDXmUuHI9wLmf6SzXQl9kwBv1HlIyBwYNmU4pEq/exec"; 

// Run this on Index/Home page load
async function fetchStoreData() {
  console.log("Fetching latest store data...");
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();

    if (data.status === "success") {
      // 1. Process Charms (Separate Gold/Silver)
      const charmsGold = data.charms.filter(c => c.metal.toLowerCase() === 'gold').map(c => c.id);
      const charmsSilver = data.charms.filter(c => c.metal.toLowerCase() === 'silver').map(c => c.id);
      
      // Create Metadata Object (Price & Premium status)
      const charmMeta = {};
      data.charms.forEach(c => {
        charmMeta[c.id] = { price: c.price, isPremium: c.is_premium };
      });

      // Save to Storage
      localStorage.setItem('pyc_charms_gold', JSON.stringify(charmsGold));
      localStorage.setItem('pyc_charms_silver', JSON.stringify(charmsSilver));
      localStorage.setItem('pyc_charm_metadata', JSON.stringify(charmMeta));
      
      // 2. Process Products (Curated)
      localStorage.setItem('pyc_products', JSON.stringify(data.products));

      // 3. Process Coupons
      localStorage.setItem('pyc_coupons', JSON.stringify(data.coupons));

      // 4. Process Config (Base Prices)
      localStorage.setItem('pyc_config', JSON.stringify(data.config));
      
      console.log("Store data updated from Cloud.");
    }
  } catch (error) {
    console.error("Failed to fetch store data, using fallbacks.", error);
  }
}

// Call immediately
fetchStoreData();
