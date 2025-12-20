/* ========= CONFIG ========= */

const CANVAS_SIZE = 300;
const CENTER = CANVAS_SIZE / 2;
const RADIUS = 115;

const HANG_OFFSET = 6;
const CHAIN_THICKNESS = 10;

const MAX_CHARMS = 5;

// Loop offsets per charm (measured once, stable)
const CHARM_LOOP_MAP = {
  "3DBowRibbon_Charm_Gold.png": 18,
  "EvilEye_Charm_Gold.png": 14,
  "LetterA_Charm_Gold.png": 16,
  "NorthStar_Charm_Gold.png": 12,
  "RedCherry_Charm_Gold.png": 10
};

// Lower arc
const ARC_START = Math.PI * 0.65;
const ARC_END   = Math.PI * 1.35;

/* ========= STATE ========= */

let selectedCharms = [];

/* ========= DOM ========= */

const canvas = document.getElementById("bracelet-canvas");

/* ========= HELPERS ========= */

function getAngles(count) {
  if (count === 1) return [(ARC_START + ARC_END) / 2];

  const step = (ARC_END - ARC_START) / (count - 1);
  return Array.from({ length: count }, (_, i) => ARC_START + step * i);
}

function polarToXY(angle) {
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle)
  };
}

/* ========= RENDER ========= */

function renderCharms() {
  document.querySelectorAll(".placed-charm").forEach(el => el.remove());

  const angles = getAngles(selectedCharms.length);

  selectedCharms.forEach((charm, index) => {
    const angle = angles[index];
    const pos = polarToXY(angle);
    const loopOffset = CHARM_LOOP_MAP[charm.file] || 14;

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

    const img = document.createElement("img");
    img.src = `assets/charms/${charm.file}`;

    const remove = document.createElement("button");
    remove.className = "remove-charm";
    remove.innerText = "×";
    remove.onclick = () => {
      selectedCharms.splice(index, 1);
      renderCharms();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(remove);
    canvas.appendChild(wrapper);
  });
}

/* ========= ADD ========= */

document.querySelectorAll(".charm-item").forEach(item => {
  item.addEventListener("click", () => {
    if (selectedCharms.length >= MAX_CHARMS) return;

    selectedCharms.push({
      file: item.dataset.file
    });

    renderCharms();
  });
});
