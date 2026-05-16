console.log(`
  _      ______ ____  ______ ____  _____  _   _ ______ _____  
 | |    |  ____/ __ \\|  ____/ __ \\|  __ \\| \\ | |  ____|  __ \\ 
 | |    | |__ | |  | | |__ | |  | | |__) |  \\| | |__  | |__) |
 | |    |  __|| |  | |  __|| |  | |  _  /| . \` |  __| |  _  / 
 | |____| |___| |__| | |   | |__| | | \\ \\| |\\  | |____| | \\ \\ 
 |______|______\\____/|_|    \\____/|_|  \\_\\_| \\_|______|_|  \\_\\
                                                              
 > Kernel Panic? Nope. Welcome to my portfolio.
`);

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initDarkMode();
  initScrollReveal();
  fetchGitHubProjects();
  initProjectFilters();
  
  initTerminal();
  initMQTT();
  initChartJS();

  initParticles();
  initMQTTCursors();
  initDemosceneToggles();
});

// =======================================================
// CANVAS PARTICLES BACKGROUND (Com IntersectionObserver)
// =======================================================
function initParticles() {
  const canvas = document.getElementById('particles-bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null };
  let isVisible = true;

  // Otimização de Bateria: Só renderiza se estiver na tela
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if(isVisible) animate();
    });
  }, { threshold: 0 });
  observer.observe(document.body);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x; mouse.y = e.y;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null; mouse.y = null;
  });

  let particleColor = 'rgba(58, 245, 29, 0.5)';
  let lineColor = 'rgba(58, 245, 29, 0.15)';

  class Particle {
    constructor(x, y, dx, dy, size) {
      this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.size = size;
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = particleColor; ctx.fill();
    }
    update() {
      if (this.x > width || this.x < 0) this.dx = -this.dx;
      if (this.y > height || this.y < 0) this.dy = -this.dy;
      this.x += this.dx; this.y += this.dy;
      this.draw();
    }
  }

  function init() {
    particles = [];
    let numParticles = (width * height) / 10000; 
    for (let i = 0; i < numParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * (innerWidth - size * 2) + size * 2);
      let y = (Math.random() * (innerHeight - size * 2) + size * 2);
      let dx = (Math.random() - 0.5) * 1;
      let dy = (Math.random() - 0.5) * 1;
      particles.push(new Particle(x, y, dx, dy, size));
    }
  }

  function animate() {
    if(!isVisible) return; // Pausa o loop se oculto
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connect();
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                     + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
        if (distance < (width/8) * (height/8)) {
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  init();
}

// =======================================================
// MULTIPLAYER CURSORS (V7)
// =======================================================
function initMQTTCursors() {
  if (typeof Paho === 'undefined') return;
  const topic = 'leoforner/cursors';
  const myId = 'dev_' + Math.random().toString(16).substr(2, 6);
  const myColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'portfolioweb_' + myId);
  const cursors = {}; // DOM elements

  client.onMessageArrived = (msg) => {
    if (msg.destinationName === topic) {
      try {
        let data = JSON.parse(msg.payloadString);
        if(data.id === myId) return; // Ignores self
        
        if(!cursors[data.id]) {
          let el = document.createElement('div');
          el.className = 'mqtt-cursor';
          el.style.color = data.color;
          document.body.appendChild(el);
          cursors[data.id] = el;
        }
        
        cursors[data.id].style.left = (data.x * window.innerWidth) + 'px';
        cursors[data.id].style.top = (data.y * window.innerHeight) + 'px';
      } catch(e) {}
    }
  };

  client.connect({
    onSuccess: () => { client.subscribe(topic); }
  });

  // Publish with throttle
  let lastPub = 0;
  window.addEventListener('mousemove', e => {
    let now = Date.now();
    if(now - lastPub > 100 && client.isConnected()) { // 10Hz
      let payload = JSON.stringify({
        id: myId, color: myColor,
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
      let message = new Paho.MQTT.Message(payload);
      message.destinationName = topic;
      client.send(message);
      lastPub = now;
    }
  });
}

// =======================================================
// DEMOSCENE & THEME TOGGLES (V8 Sidebar Fix)
// =======================================================
window.initDemosceneToggles = function() {
  const btnBlueprint = document.getElementById('toggle-blueprint');
  const btnPipboy = document.getElementById('toggle-pipboy');

  if(btnBlueprint) {
    let newBtnBlueprint = btnBlueprint.cloneNode(true);
    btnBlueprint.parentNode.replaceChild(newBtnBlueprint, btnBlueprint);
    newBtnBlueprint.addEventListener('click', () => {
      document.body.classList.remove('pipboy-mode');
      document.body.classList.toggle('blueprint-mode');
      const pb = document.getElementById('toggle-pipboy');
      if(pb) pb.classList.remove('active');
      newBtnBlueprint.classList.toggle('active');
    });
  }

  if(btnPipboy) {
    let newBtnPipboy = btnPipboy.cloneNode(true);
    btnPipboy.parentNode.replaceChild(newBtnPipboy, btnPipboy);
    newBtnPipboy.addEventListener('click', () => {
      document.body.classList.remove('blueprint-mode');
      document.body.classList.toggle('pipboy-mode');
      const bp = document.getElementById('toggle-blueprint');
      if(bp) bp.classList.remove('active');
      newBtnPipboy.classList.toggle('active');
    });
  }
}

// =======================================================
// OUTRAS FUNÇÕES EXISTENTES
// =======================================================
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;
  const texts = ["Dev Jr.", "Capitão da Equipe Robota", "Engenharia de Controle e Automação"];
  let textIndex = 0; let charIndex = 0; let isDeleting = false;
  function type() {
    const currentText = texts[textIndex];
    if (isDeleting) { element.textContent = currentText.substring(0, charIndex - 1); charIndex--; } 
    else { element.textContent = currentText.substring(0, charIndex + 1); charIndex++; }
    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentText.length) { typeSpeed = 2000; isDeleting = true; } 
    else if (isDeleting && charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; typeSpeed = 500; }
    setTimeout(type, typeSpeed);
  }
  type();
}

window.initDarkMode = function() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if(!themeToggleBtn) return;
  
  let newThemeBtn = themeToggleBtn.cloneNode(true);
  themeToggleBtn.parentNode.replaceChild(newThemeBtn, themeToggleBtn);

  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) htmlElement.setAttribute('data-theme', savedTheme);
  else htmlElement.setAttribute('data-theme', 'dark');

  newThemeBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); } });
  }, { threshold: 0.10 });
  reveals.forEach(r => observer.observe(r));
}

let globalProjectsData = [];
async function fetchGitHubProjects() {
  const container = document.getElementById('github-projects');
  if (!container) return;
  try {
    container.innerHTML = '<p>Carregando repositórios...</p>';
    const response = await fetch(`https://api.github.com/users/leoforner/repos?sort=updated&per_page=100`);
    const repos = await response.json();
    globalProjectsData = repos.filter(repo => !repo.fork && repo.description);
    renderProjects(globalProjectsData);
  } catch (error) { container.innerHTML = '<p>Erro ao carregar projetos do GitHub.</p>'; }
}

function renderProjects(projects) {
  const container = document.getElementById('github-projects');
  container.innerHTML = '';
  projects.forEach(repo => {
    const lang = repo.language || 'Outro';
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `<h3>${repo.name}</h3><div class="project-tags"><span class="badge">${lang}</span></div><p>${repo.description}</p><a href="${repo.html_url}" target="_blank" class="repo-link">Ver GitHub</a>`;
    container.appendChild(card);
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const f = e.target.getAttribute('data-filter');
      if (f === 'all') return renderProjects(globalProjectsData);
      const filtered = globalProjectsData.filter(r => {
        if (!r.language) return false;
        return r.language.toLowerCase() === f || (f==='html' && r.language.toLowerCase()==='css');
      });
      renderProjects(filtered);
    });
  });
}

function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  document.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '´') { modal.classList.remove('hidden'); document.getElementById('terminal-input').focus(); }
  });
  const btnClose = document.getElementById('close-terminal');
  if(btnClose) btnClose.addEventListener('click', () => modal.classList.add('hidden'));
}

function initMQTT() {
  if (typeof Paho === 'undefined') return;
  const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'web_' + Math.random().toString(16).substr(2, 8));
  client.onMessageArrived = (msg) => { 
    const el = document.getElementById('mqtt-temp');
    if(el && msg.destinationName === 'leoforner/iot') el.textContent = msg.payloadString; 
  };
  client.connect({ onSuccess: () => client.subscribe('leoforner/iot') });
}

function initChartJS() {
  const ctx = document.getElementById('skillsChart');
  if (!ctx || typeof Chart === 'undefined') return;
  window.skillsChartInstance = new Chart(ctx, {
    type: 'radar', data: { labels: ['C/C++', 'Hardware', 'Controle', 'Visão Comp', 'Python', 'Web'], datasets: [{ data: [90, 85, 80, 75, 75, 60], borderColor: 'rgba(58, 245, 29, 1)' }] },
    options: { plugins: { legend: { display: false } }, scales: { r: { ticks: { display: false } } } }
  });
}
