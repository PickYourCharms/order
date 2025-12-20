/* =========================
   COMBO CONTROLLER
   ========================= */

const Combo = {
  isActive() {
    return sessionStorage.getItem("comboMode") === "true";
  },

  start() {
    sessionStorage.setItem("comboMode", "true");
  },

  clear() {
    sessionStorage.removeItem("comboMode");
    sessionStorage.removeItem("combo_bracelet");
    sessionStorage.removeItem("combo_earring");
  },

  saveBracelet(data) {
    sessionStorage.setItem("combo_bracelet", JSON.stringify(data));
  },

  getBracelet() {
    return JSON.parse(sessionStorage.getItem("combo_bracelet") || "null");
  },

  saveEarring(data) {
    sessionStorage.setItem("combo_earring", JSON.stringify(data));
  },

  getEarring() {
    return JSON.parse(sessionStorage.getItem("combo_earring") || "null");
  },

  hasBracelet() {
    return !!sessionStorage.getItem("combo_bracelet");
  },

  hasEarring() {
    return !!sessionStorage.getItem("combo_earring");
  },

  commitToCart(cart) {
    const bracelet = this.getBracelet();
    const earring = this.getEarring();

    if (!bracelet || !earring) return;

    cart.push({
      type: "bracelet",
      source: "combo",
      design: bracelet
    });

    cart.push({
      type: "earring",
      source: "combo",
      design: earring
    });

    this.clear();
  }
};
