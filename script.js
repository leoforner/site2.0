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
  
  initI18n();
  initTerminal();
  initMQTT();
  initChartJS();

  initParticles();
  initMQTTCursors();
  initDemosceneToggles();
});

// =======================================================
// CANVAS PARTICLES BACKGROUND (Restaurado)
// =======================================================
function initParticles() {
  const canvas = document.getElementById('particles-bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null };

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
  animate();
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
function initDemosceneToggles() {
  const boidsCanvas = document.getElementById('boids-bg');
  const emiOverlay = document.getElementById('emi-overlay');
  const lens = document.getElementById('gravitational-lens');
  
  const btnBoids = document.getElementById('toggle-boids');
  const btnEmi = document.getElementById('toggle-emi');
  const btnLens = document.getElementById('toggle-lens');
  const btnBlueprint = document.getElementById('toggle-blueprint');
  const btnPipboy = document.getElementById('toggle-pipboy');

  if(btnBoids) btnBoids.addEventListener('click', () => {
    boidsCanvas.classList.toggle('hidden');
    btnBoids.classList.toggle('active');
  });
  if(btnEmi) btnEmi.addEventListener('click', () => {
    emiOverlay.classList.toggle('hidden');
    btnEmi.classList.toggle('active');
  });
  if(btnLens) btnLens.addEventListener('click', () => {
    lens.classList.toggle('hidden');
    btnLens.classList.toggle('active');
  });

  if(btnBlueprint) btnBlueprint.addEventListener('click', () => {
    document.body.classList.remove('pipboy-mode');
    document.body.classList.toggle('blueprint-mode');
    btnPipboy.classList.remove('active');
    btnBlueprint.classList.toggle('active');
  });
  if(btnPipboy) btnPipboy.addEventListener('click', () => {
    document.body.classList.remove('blueprint-mode');
    document.body.classList.toggle('pipboy-mode');
    btnBlueprint.classList.remove('active');
    btnPipboy.classList.toggle('active');
  });
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

function initDarkMode() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) htmlElement.setAttribute('data-theme', savedTheme);
  else htmlElement.setAttribute('data-theme', 'dark');

  themeToggleBtn.addEventListener('click', () => {
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

const dictionary = {
  pt: { nav_home: "INÍCIO", nav_projects: "PROJETOS", nav_lab: "LABORATÓRIO", nav_about: "SOBRE", nav_iot: "IoT", nav_robota: "ROBOTA",
    sidebar_sections: "Navegação", sidebar_fx: "Visual FX", nav_impact: "Destaques", nav_repos: "Github",
    nav_pid: "PID", nav_kalman: "Kalman", nav_ik: "Cinemática", nav_horizon: "Voo", nav_audio: "Áudio FFT", nav_fsm: "FSM",
    hero_subtitle: "Engenharia e Tecnologia", section_about: "SOBRE & SKILLS",
    about_text: "Estudante de Engenharia de Controle e Automação focado em sistemas embarcados e IoT...",
    chart_title: "Tech Stack", section_lab: "LABORATÓRIO DE ENGENHARIA", lab_desc: "Simulações em tempo real.",
    lab_pid_title: "Controle PID", lab_pid_desc: "Ajuste os ganhos Kp, Ki e Kd para estabilizar o sistema.",
    lab_kalman_title: "Filtro de Kalman", lab_kalman_desc: "Filtragem estocástica 1D ao vivo.",
    lab_ik_title: "Cinemática Inversa", lab_ik_desc: "Trigonometria analítica no braço robótico 2D.",
    lab_horizon_title: "Horizonte Artificial", lab_horizon_desc: "Pitch e Roll calculados no mouse.",
    lab_audio_title: "Processamento de Sinais: FFT", lab_audio_desc: "Plota o domínio da frequência do microfone."
  },
  en: { nav_home: "HOME", nav_projects: "PROJECTS", nav_lab: "LABORATORY", nav_about: "ABOUT", nav_iot: "IoT", nav_robota: "ROBOTA",
    sidebar_sections: "Navigation", sidebar_fx: "Visual FX", nav_impact: "Top Projects", nav_repos: "Github",
    nav_pid: "PID", nav_kalman: "Kalman", nav_ik: "Kinematics", nav_horizon: "Flight", nav_audio: "Audio FFT", nav_fsm: "FSM",
    hero_subtitle: "Engineering & Tech", section_about: "ABOUT & SKILLS",
    about_text: "Control and Automation Engineering student focused on embedded systems and IoT...",
    chart_title: "Tech Stack", section_lab: "ENGINEERING LAB", lab_desc: "Real-time simulations.",
    lab_pid_title: "PID Control", lab_pid_desc: "Tune Kp, Ki, Kd to stabilize the system.",
    lab_kalman_title: "Kalman Filter", lab_kalman_desc: "Live 1D stochastic filtering.",
    lab_ik_title: "Inverse Kinematics", lab_ik_desc: "Analytic trigonometry on 2D robot arm.",
    lab_horizon_title: "Artificial Horizon", lab_horizon_desc: "Pitch and Roll computed from mouse.",
    lab_audio_title: "Signal Processing: FFT", lab_audio_desc: "Plots frequency domain from mic."
  }
};

function initI18n() {
  const langBtn = document.getElementById('lang-toggle');
  let currentLang = 'pt';
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(dictionary[currentLang] && dictionary[currentLang][key]) el.textContent = dictionary[currentLang][key];
    });
  });
}

function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  document.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '´') { modal.classList.remove('hidden'); document.getElementById('terminal-input').focus(); }
  });
  document.getElementById('close-terminal').addEventListener('click', () => modal.classList.add('hidden'));
}

function initMQTT() {
  if (typeof Paho === 'undefined') return;
  const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'web_' + Math.random().toString(16).substr(2, 8));
  client.onMessageArrived = (msg) => { if (msg.destinationName === 'leoforner/iot') document.getElementById('mqtt-temp').textContent = msg.payloadString; };
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
