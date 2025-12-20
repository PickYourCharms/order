/* ================================
   BRACELET BUILDER – FINAL PHYSICS
   ================================ */

/* ---------- CONFIG ---------- */

const CANVAS_SIZE = 300;
const CENTER = CANVAS_SIZE / 2;
const RADIUS = 115;

// Vertical tuning (LOCKED)
const HANG_OFFSET = 6;          // how much charm hangs down
const CHAIN_THICKNESS = 10;     // visual thickness of chain

// Per-charm loop offsets (VERY IMPORTANT)
const CHARM_LOOP_MAP = {
  "3DBowRibbon_Charm_Gold.png": 18,
  "EvilEye_Charm_Gold.png": 14,
  "LetterA_Charm_Gold.png": 16,
  "NorthStar_Charm_Gold.png": 12,
  "RedCherry_Charm_Gold.png": 10
};

// Lower arc angles (centered at bottom)
const ARC_START = Math.PI * 0.65;
const ARC_END   = Math.PI * 1.35;
const MAX_CHARMS = 5;

/* ---------- STATE ---------- */

let selectedCharms = [];

/* ---------- DOM ---------- */

const canvas = document.getElementById("bracelet-canvas");

/* ---------- HELPERS ---------- */

function polarToXY(angle) {
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle)
  };
}

function getAngles(count) {
  if (count === 1) return [(ARC_START + ARC_END) / 2];

  const step = (ARC_END - ARC_START) / (count - 1);
  return Array.from({ length: count }, (_, i) => ARC_START + step * i);
}

/* ---------- RENDER ---------- */

function renderBracelet() {
  // Clear previous charms
  document.querySelectorAll(".placed-charm").forEach(el => el.remove());

  const count = selectedCharms.length;
  if (count === 0) return;

  const angles = getAngles(count);

  selectedCharms.forEach((charm, index) => {
    const angle = angles[index];
    const pos = polarToXY(angle);

    const loopOffset =
      CHARM_LOOP_MAP[charm.file] ?? 14;

    const wrapper = document.createElement("div");
    wrapper.className = "placed-charm";

    wrapper.style.left = `${pos.x}px`;
    wrapper.style.top = `${
      pos.y +
      HANG_OFFSET -
      loopOffset +
      CHAIN_THICKNESS / 2
    }px`;

    wrapper.style.transform = `
      translate(-50%, -50%)
      rotate(${angle - Math.PI / 2}rad)
    `;

    // Charm image
    const img = document.createElement("img");
    img.src = `assets/charms/${charm.file}`;
    img.draggable = false;

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-charm";
    removeBtn.innerText = "×";
    removeBtn.onclick = () => {
      selectedCharms.splice(index, 1);
      renderBracelet();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    canvas.appendChild(wrapper);
  });
}

/* ---------- ADD CHARM ---------- */

function addCharm(file) {
  if (selectedCharms.length >= MAX_CHARMS) return;

  selectedCharms.push({ file });
  renderBracelet();
}

/* ---------- INIT ---------- */

document.querySelectorAll(".charm-item").forEach(item => {
  item.addEventListener("click", () => {
    addCharm(item.dataset.file);
  });
});
