(function () {
  const img = document.querySelector('.field-svg-img');
  if (!img) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 ~ 1
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function loop() {
    curX += (mouseX - curX) * 0.04;
    curY += (mouseY - curY) * 0.04;
    img.style.setProperty('--px', (curX * 14).toFixed(2) + 'px');
    img.style.setProperty('--py', (curY * 8).toFixed(2) + 'px');
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();