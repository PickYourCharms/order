const canvas = document.getElementById("bracelet-canvas");
const trayCharms = document.querySelectorAll("[data-charm]");

let placedCharms = [];

/**
 * Recalculate positions for charms
 * Lower arc only
 * Perfect symmetry
 */
function layoutCharms() {
  const total = placedCharms.length;
  if (total === 0) return;

  const centerX = 140;
  const centerY = 140;
  const radius = 110;

  // Angles for LOWER arc only
  const startAngle = Math.PI + Math.PI / 6;
  const endAngle = 2 * Math.PI - Math.PI / 6;

  const angles =
    total === 1
      ? [(startAngle + endAngle) / 2]
      : Array.from({ length: total }, (_, i) =>
          startAngle + (i / (total - 1)) * (endAngle - startAngle)
        );

  placedCharms.forEach((charm, index) => {
    const angle = angles[index];
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    charm.el.style.left = `${x - 22}px`;
    charm.el.style.top = `${y - 22}px`;
    charm.el.style.transform = `rotate(${angle + Math.PI / 2}rad)`;
  });
}

/**
 * Add charm
 */
trayCharms.forEach((img) => {
  img.addEventListener("click", () => {
    if (placedCharms.length >= 5) return;

    const wrapper = document.createElement("div");
    wrapper.className = "canvas-charm";

    const charmImg = document.createElement("img");
    charmImg.src = img.src;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerText = "×";

    removeBtn.onclick = () => {
      canvas.removeChild(wrapper);
      placedCharms = placedCharms.filter((c) => c.el !== wrapper);
      layoutCharms();
    };

    wrapper.appendChild(charmImg);
    wrapper.appendChild(removeBtn);
    canvas.appendChild(wrapper);

    placedCharms.push({ el: wrapper });
    layoutCharms();
  });
});
