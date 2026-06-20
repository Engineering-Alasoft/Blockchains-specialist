const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const NODE_COUNT = 25;
  const CONNECT_DIST = 100;
  const COLORS = ['rgba(255,255,255,', 'rgba(255,215,215,', 'rgba(255,240,240,'];
  let W, H, nodes = [];
  let lastFrameTime = 0;
  const FRAME_MS = 1000 / 30;

  function resizeCanvas() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  }, { passive: true });

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .35,
        vy: (Math.random() - .5) * .35,
        r: Math.random() * 2 + 1,
        col: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }
  initNodes();

  function drawParticles(ts) {
    requestAnimationFrame(drawParticles);
    if (ts - lastFrameTime < FRAME_MS) return;
    lastFrameTime = ts;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d / CONNECT_DIST) * .22) + ')';
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.col + '.65)';
      ctx.fill();
    }
  }
  requestAnimationFrame(drawParticles);
}

const WORDS = ['Solutions.', 'Innovation.', 'Excellence.', 'Results.', 'Success.'];
let wi = 0, ci = 0, deleting = false, typedEl;

function startTyped() {
  typedEl = document.getElementById('typed-container');
  if (typedEl) typeLoop();
}

function typeLoop() {
  const word = WORDS[wi];
  if (!deleting) {
    ci++;
    typedEl.innerHTML = word.slice(0, ci) + '<span class="typed-cursor">|</span>';
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    ci--;
    typedEl.innerHTML = word.slice(0, ci) + '<span class="typed-cursor">|</span>';
    if (ci === 0) { deleting = false; wi = (wi + 1) % WORDS.length; }
  }
  setTimeout(typeLoop, deleting ? 55 : 105);
}

function startCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const suffix = el.querySelector('span') ? el.querySelector('span').innerHTML : '+';
    let cur = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.innerHTML = cur + '<span>' + suffix + '</span>';
      if (cur >= target) clearInterval(t);
    }, 40);
  });
}
