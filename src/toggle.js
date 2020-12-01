function toggle() {
  const DOM = {
    tooltip: document.querySelector(".tooltip"),
  };

  DOM.tooltip.classList.toggle("shown");
}
module.exports = toggle;
