// ⬇️⬇️⬇️ PASTE YOUR GOOGLE SCRIPT URL BETWEEN THE QUOTES BELOW ⬇️⬇️⬇️
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdvv7OsOR7zlwkQSCEpvm2o6m0IpDXmUuHI9wLmf6SzXQl9kwBv1HlIyBwYNmU4pEq/exec"; 

async function fetchStoreData() {
  // 1. Safety Check: Did you paste the URL?
  if (SCRIPT_URL === "https://script.google.com/macros/s/AKfycbwdvv7OsOR7zlwkQSCEpvm2o6m0IpDXmUuHI9wLmf6SzXQl9kwBv1HlIyBwYNmU4pEq/exec" || SCRIPT_URL === "") {
    alert("⚠️ STOP! \n\nYou forgot to paste your Google Script URL inside 'store_data.js'. \n\nEdit the file and paste the URL at the top.");
    return;
  }

  console.log("Fetching latest store data...");
  
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();

    if (data.status === "success") {
      // --- Process Charms ---
      // We force everything to string/lowercase to be safe against Typos in the sheet
      const charmsGold = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'gold' || m === 'both';
      }).map(c => c.id);

      const charmsSilver = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'silver' || m === 'both';
      }).map(c => c.id);
      
      // Check if we actually found any charms
      if (charmsGold.length === 0 && charmsSilver.length === 0) {
        alert("⚠️ Connection Successful, but NO CHARMS found.\n\nCheck your Google Sheet 'Charms_Inventory' tab.\nColumn C must say 'Gold', 'Silver', or 'Both'.\nColumn H (active) must be TRUE.");
      }

      // Metadata
      const charmMeta = {};
      data.charms.forEach(c => {
        charmMeta[c.id] = { price: c.price, isPremium: c.is_premium };
      });

      // Save to Storage
      localStorage.setItem('pyc_charms_gold', JSON.stringify(charmsGold));
      localStorage.setItem('pyc_charms_silver', JSON.stringify(charmsSilver));
      localStorage.setItem('pyc_charm_metadata', JSON.stringify(charmMeta));
      localStorage.setItem('pyc_products', JSON.stringify(data.products));
      localStorage.setItem('pyc_coupons', JSON.stringify(data.coupons));
      localStorage.setItem('pyc_config', JSON.stringify(data.config));
      
      console.log("Store data updated.");
      
      // Force Reload the Tray if on a builder page
      if (typeof loadTray === 'function') { 
        if(window.CHARMS) {
            window.CHARMS.gold = charmsGold;
            window.CHARMS.silver = charmsSilver;
        }
        loadTray(); 
      }
    } else {
      alert("⚠️ Connected to Sheet, but status was not success.\nError: " + JSON.stringify(data));
    }
  } catch (error) {
    alert("❌ CONNECTION FAILED!\n\nPlease check:\n1. Is the URL correct?\n2. Did you set deployment access to 'Anyone'?\n\nError details: " + error.message);
    console.error("Failed to fetch store data.", error);
  }
}

// Run immediately
fetchStoreData();
