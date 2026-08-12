const canvas = document.getElementById('particles');
if (canvas) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isNarrow = window.matchMedia('(max-width: 900px)');
  const canRunParticles = () => !prefersReduced.matches && !isNarrow.matches;

  if (!canRunParticles()) {
    canvas.remove();
  } else {
    const ctx = canvas.getContext('2d', { alpha: true });
    const NODE_COUNT = 18;
    const CONNECT_DIST = 90;
    const COLORS = ['rgba(255,255,255,', 'rgba(255,215,215,', 'rgba(255,240,240,'];
    let W, H, nodes = [];
    let lastFrameTime = 0;
    const FRAME_MS = 1000 / 24;
    let rafId = 0;
    let running = false;
    let heroVisible = true;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - .5) * .3,
          vy: (Math.random() - .5) * .3,
          r: Math.random() * 2 + 1,
          col: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    }

    function stopParticles() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      ctx.clearRect(0, 0, W, H);
    }

    function drawParticles(ts) {
      if (!running) return;
      rafId = requestAnimationFrame(drawParticles);
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
            ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d / CONNECT_DIST) * .2) + ')';
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

    function startParticles() {
      if (running || !canRunParticles() || document.hidden || !heroVisible) return;
      running = true;
      lastFrameTime = 0;
      rafId = requestAnimationFrame(drawParticles);
    }

    function syncParticles() {
      if (!canRunParticles()) {
        stopParticles();
        canvas.style.display = 'none';
        return;
      }
      canvas.style.display = '';
      resizeCanvas();
      if (!nodes.length) initNodes();
      if (!document.hidden && heroVisible) startParticles();
      else stopParticles();
    }

    resizeCanvas();
    initNodes();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncParticles, 150);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopParticles();
      else syncParticles();
    });

    prefersReduced.addEventListener('change', syncParticles);
    isNarrow.addEventListener('change', syncParticles);

    const hero = document.getElementById('home') || canvas.closest('.hero');
    if (hero && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) startParticles();
        else stopParticles();
      }, { threshold: 0.05 });
      io.observe(hero);
    }

    startParticles();
  }
}

const WORDS = ['Startups In US', 'Web3 Businesses', 'Innovators & Businesses', 'Blockchain-Powered Businesses', 'Tokenized Business Models'];
let wi = 0, ci = 0, deleting = false, typedEl, typedTimer;

function startTyped() {
  typedEl = document.getElementById('typed-container');
  if (!typedEl) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedEl.textContent = WORDS[0];
    return;
  }
  typeLoop();
}

function typeLoop() {
  const word = WORDS[wi];
  if (!deleting) {
    ci++;
    typedEl.innerHTML = word.slice(0, ci) + '<span class="typed-cursor">|</span>';
    if (ci === word.length) { deleting = true; typedTimer = setTimeout(typeLoop, 1800); return; }
  } else {
    ci--;
    typedEl.innerHTML = word.slice(0, ci) + '<span class="typed-cursor">|</span>';
    if (ci === 0) { deleting = false; wi = (wi + 1) % WORDS.length; }
  }
  typedTimer = setTimeout(typeLoop, deleting ? 55 : 105);
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
