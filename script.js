// =======================================================
// 0. TERMINAL BOOT (Console Log Ascii Art)
// =======================================================
console.log(`
  _      ______ ____  ______ ____  _____  _   _ ______ _____  
 | |    |  ____/ __ \\|  ____/ __ \\|  __ \\| \\ | |  ____|  __ \\ 
 | |    | |__ | |  | | |__ | |  | | |__) |  \\| | |__  | |__) |
 | |    |  __|| |  | |  __|| |  | |  _  /| . \` |  __| |  _  / 
 | |____| |___| |__| | |   | |__| | | \\ \\| |\\  | |____| | \\ \\ 
 |______|______\\____/|_|    \\____/|_|  \\_\\_| \\_|______|_|  \\_\\
                                                              
 > Kernel Panic? Nope. Welcome to my portfolio.
 > Looking for the source code? Check my GitHub or type 'whoami' in the terminal (press backtick \` ).
`);

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initDarkMode();
  initScrollReveal();
  fetchGitHubProjects();
  initProjectFilters();
  initContactForm();
  
  // Funções V3/V4
  initI18n();
  initTerminal();
  initMQTT();
  initChartJS();

  // Funções V5 (Engenharia de Elite)
  initParticles();
  initKonamiCode();
  initFSM();
  initMarkdownRenderer();
});

// =======================================================
// 1. EFEITO MÁQUINA DE ESCREVER (Typewriter)
// =======================================================
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;
  const texts = ["Dev Jr.", "Capitão da Equipe Robota", "Engenharia de Controle e Automação", "Hardware & Software"];
  let textIndex = 0; let charIndex = 0; let isDeleting = false;
  function type() {
    const currentText = texts[textIndex];
    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false; textIndex = (textIndex + 1) % texts.length; typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
  }
  type();
}

// =======================================================
// 2. MODO ESCURO E CLARO
// =======================================================
function initDarkMode() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
    updateToggleIcon('dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
    
    if (window.skillsChartInstance) {
      const textColor = newTheme === 'light' ? '#222' : 'whitesmoke';
      const gridColor = newTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
      window.skillsChartInstance.options.scales.r.ticks.color = textColor;
      window.skillsChartInstance.options.scales.r.grid.color = gridColor;
      window.skillsChartInstance.options.scales.r.pointLabels.color = textColor;
      window.skillsChartInstance.update();
    }
    // Update Particles
    if (window.updateParticlesTheme) window.updateParticlesTheme(newTheme);
  });

  function updateToggleIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// =======================================================
// 3. ANIMAÇÃO NO SCROLL
// =======================================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  reveals.forEach(r => observer.observe(r));
}

// =======================================================
// 4. INTEGRAÇÃO COM GITHUB API
// =======================================================
let globalProjectsData = [];
async function fetchGitHubProjects() {
  const container = document.getElementById('github-projects');
  if (!container) return;
  try {
    container.innerHTML = '<p>Carregando repositórios...</p>';
    const response = await fetch(`https://api.github.com/users/leoforner/repos?sort=updated&per_page=100`);
    const repos = await response.json();
    globalProjectsData = repos.filter(repo => !repo.fork && repo.description && repo.description.trim() !== '');
    renderProjects(globalProjectsData);
  } catch (error) {
    container.innerHTML = '<p>Erro ao carregar projetos do GitHub.</p>';
  }
}

function renderProjects(projects) {
  const container = document.getElementById('github-projects');
  container.innerHTML = '';
  if (projects.length === 0) return container.innerHTML = '<p>Nenhum projeto encontrado.</p>';
  
  projects.forEach(repo => {
    const lang = repo.language || 'Outro';
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', lang.toLowerCase());
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <div class="project-tags"><span class="badge">${lang}</span></div>
      <p>${repo.description}</p>
      <a href="${repo.html_url}" target="_blank" class="repo-link">Ver GitHub <i class="fab fa-github"></i></a>
    `;
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
        const l = r.language.toLowerCase();
        if (f === 'html' && (l === 'html' || l === 'css')) return true;
        return l === f;
      });
      renderProjects(filtered);
    });
  });
}

// =======================================================
// 5. FORMULÁRIO DE CONTATO
// =======================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    if (form.getAttribute('action').includes('your_form_id')) {
      e.preventDefault();
      alert("Formulário simulado com sucesso! Troque o action no HTML para funcionar de verdade.");
      form.reset();
    }
  });
}

// =======================================================
// 6. INTERNACIONALIZAÇÃO (i18n)
// =======================================================
const dictionary = {
  pt: {
    nav_about: "SOBRE", nav_projects: "PROJETOS", nav_robota: "ROBOTA", nav_iot: "IoT & HARDWARE", nav_fsm: "SIMULADOR", nav_media: "MÍDIA",
    hero_subtitle: "Engenharia e Tecnologia", section_about: "SOBRE & SKILLS",
    about_text: "Sou estudante de Engenharia de Controle e Automação na UFSC e atuo profundamente no desenvolvimento de sistemas embarcados, Internet das Coisas (IoT) e robótica móvel. Tenho experiência prática como Capitão da equipe Robota de robótica móvel, além de projetar hardware e software para sistemas complexos — desde dataloggers baseados em LIDAR (Marine Height Logger) até computadores de bordo para foguetes de pouso vertical (VTVL) usando ESP32 e comunicação ESP-NOW. Também atuei com iniciação científica no Laboratório de Mecânica de Precisão (LMP/UFSC) desenvolvendo softwares de análise de imagem para manufatura aditiva a laser.",
    timeline_title: "Trajetória", timeline_robota: "Capitão / Robótica Móvel",
    timeline_lmp: "Iniciação Científica / Visão Computacional aplicados à Manufatura Aditiva", timeline_ufsc: "Engenharia de Controle e Automação (2020-Presente)",
    chart_title: "Tech Stack",
    section_articles: "ARTIGOS & DOCS (MARKDOWN)",
    md_label: "Escolha um Repositório:", md_btn: "Carregar README", md_placeholder: "O conteúdo do README.md aparecerá aqui renderizado via API do GitHub.",
    section_robota: "MURAL DA ROBOTA",
    robota_title: "A Grande Conquista",
    robota_desc: "Como Capitão e ex-diretor de projetos internos da Equipe Robota na UFSC, liderei a gestão ágil de pessoas e a coordenação logística de uma equipe multidisciplinar de estudantes no desenvolvimento de robótica móvel competitiva. Meu papel principal envolveu a resolução de conflitos, otimização de cronogramas e o alinhamento de metas de engenharia que culminaram na entrega bem-sucedida de soluções de manufatura 3D e protótipos em eventos de grande visibilidade.",
    section_awards: "CERTIFICAÇÕES & PRÊMIOS",
    award_1_title: "Equipe Robota - Destaque", award_1_desc: "Liderança em robótica autônoma e VTVL.",
    award_2_title: "LMP/UFSC - Pesquisa", award_2_desc: "Visão Computacional na Manufatura Aditiva.",
    award_3_title: "Sistemas Embarcados", award_3_desc: "Arquitetura de firmware e hardware.",
    section_projects: "PROJETOS & SOFTWARE", top_projects_title: "Projetos de Maior Impacto",
    proj1_title: "Marine Height Logger (LidarBox)",
    proj1_desc: "Desenvolvimento de um datalogger embarcado de alta precisão (LidarBox) projetado especificamente para acoplamento em UAVs/drones voltados à altimetria marinha. O sistema realiza a fusão de dados e telemetria integrando sensores LiDAR, GPS e IMU...",
    proj2_title: "Computador de Voo VTVL",
    proj2_desc: "Arquitetura e programação do computador de bordo para um minifoguete experimental de pouso e decolagem vertical (VTVL) estruturado em microcontroladores ESP32. Controle por Vetorização de Empuxo (TVC) e telemetria via ESP-NOW.",
    proj3_title: "Robótica Móvel Autônoma",
    proj3_desc: "Prototipagem, design de hardware e calibração de firmware para robôs móveis autônomos de alto desempenho, aplicando conceitos de fusão de sensores com IMU e sensores de efeito Hall. Controle PID embarcado.",
    other_projects_title: "Outros Repositórios (GitHub)",
    section_iot: "HARDWARE & IoT", iot_title: "Dashboard IoT Ao Vivo",
    iot_desc: "Conectado ao broker HiveMQ público. Aguardando dados de telemetria.",
    schem_title: "Arquitetura & Esquemáticos", schem_desc: "Diagramas elétricos e projetos de PCB.",
    "3d_title": "Visualizador 3D", section_media: "MÍDIAS", section_contact: "Contato",
    form_name: "Nome:", form_message: "Mensagem:", form_btn: "Enviar Mensagem", footer: "Desenvolvido por Leonardo Forner | Engenharia de Controle e Automação.",
    section_fsm: "SIMULADOR DE FSM (VTVL)",
    fsm_desc: "Interaja com a simulação simplificada da Máquina de Estados Finitos (FSM) que roda no computador de bordo do VTVL."
  },
  en: {
    nav_about: "ABOUT", nav_projects: "PROJECTS", nav_robota: "ROBOTA TEAM", nav_iot: "IoT & HARDWARE", nav_fsm: "SIMULATOR", nav_media: "MEDIA",
    hero_subtitle: "Engineering & Technology", section_about: "ABOUT & SKILLS",
    about_text: "I am a Control and Automation Engineering student at UFSC deeply involved in embedded systems, Internet of Things (IoT), and mobile robotics. I have practical experience as the Captain of the Robota mobile robotics team, and in designing hardware/software for complex systems — from LIDAR-based dataloggers to flight computers for VTVL rockets using ESP32 and ESP-NOW. I also worked as a researcher at the Precision Mechanics Laboratory (LMP/UFSC) developing computer vision software for laser additive manufacturing.",
    timeline_title: "Journey", timeline_robota: "Captain / Mobile Robotics",
    timeline_lmp: "Undergraduate Researcher / Computer Vision for Additive Manufacturing", timeline_ufsc: "Control and Automation Engineering (2020-Present)",
    chart_title: "Tech Stack",
    section_articles: "ARTICLES & DOCS (MARKDOWN)",
    md_label: "Choose a Repository:", md_btn: "Load README", md_placeholder: "The README.md content will appear here rendered via GitHub API.",
    section_robota: "ROBOTA WALL",
    robota_title: "The Big Achievement",
    robota_desc: "As Captain and former director of internal projects for the Robota Team at UFSC, I led the agile product management and logistical coordination of a multidisciplinary student team developing competitive mobile robotics. My core role involved conflict resolution, timeline optimization, and alignment of engineering milestones that culminated in the successful delivery of 3D manufacturing solutions and prototypes.",
    section_awards: "CERTIFICATIONS & AWARDS",
    award_1_title: "Robota Team - Highlights", award_1_desc: "Leadership in autonomous robotics and VTVL.",
    award_2_title: "LMP/UFSC - Research", award_2_desc: "Computer Vision in Additive Manufacturing.",
    award_3_title: "Embedded Systems", award_3_desc: "Firmware and hardware architecture.",
    section_projects: "PROJECTS & SOFTWARE", top_projects_title: "My Top 3 Most Impactful Projects",
    proj1_title: "Marine Height Logger (LidarBox)",
    proj1_desc: "Development of a high-precision embedded datalogger specifically designed for UAVs/drones for marine altimetry. The system performs data fusion integrating LiDAR, GPS, and IMU...",
    proj2_title: "VTVL Flight Computer",
    proj2_desc: "Architecture and programming of the flight computer for an experimental VTVL model rocket built on ESP32 microcontrollers. Thrust Vector Control (TVC) and ESP-NOW telemetry.",
    proj3_title: "Autonomous Mobile Robots",
    proj3_desc: "Prototyping, hardware design, and firmware calibration for high-performance autonomous mobile robots, applying sensor fusion concepts with IMU and Hall Effect sensors. Embedded PID control.",
    other_projects_title: "Other Repositories (GitHub)",
    section_iot: "HARDWARE & IoT", iot_title: "Live IoT Dashboard",
    iot_desc: "Connected to public HiveMQ broker. Waiting for telemetry data.",
    schem_title: "Architecture & Schematics", schem_desc: "Electrical diagrams and PCB designs.",
    "3d_title": "3D Viewer", section_media: "MEDIA", section_contact: "Contact",
    form_name: "Name:", form_message: "Message:", form_btn: "Send Message", footer: "Developed by Leonardo Forner | Control and Automation Engineering.",
    section_fsm: "VTVL FSM SIMULATOR",
    fsm_desc: "Interact with the simplified Finite State Machine (FSM) simulation running on the VTVL flight computer."
  }
};

function initI18n() {
  const langBtn = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('current-lang');
  let currentLang = 'pt';

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    langLabel.textContent = currentLang === 'pt' ? 'BR' : 'EN';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dictionary[currentLang][key]) {
        if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
          if (el.children.length === 0) el.textContent = dictionary[currentLang][key];
          else {
             if(el.tagName === 'SPAN') el.textContent = dictionary[currentLang][key];
             else el.childNodes[0].nodeValue = dictionary[currentLang][key];
          }
        }
      }
    });
    // Form Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dictionary[currentLang][key]) el.placeholder = dictionary[currentLang][key];
    });
  });
}

// =======================================================
// 7. TERMINAL EASTER EGG & KONAMI CODE
// =======================================================
function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  const closeBtn = document.getElementById('close-terminal');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  document.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '´') {
      modal.classList.remove('hidden');
      setTimeout(() => input.focus(), 100);
    }
  });

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';
      
      const line = document.createElement('p');
      line.innerHTML = `<span>$ ${cmd}</span>`;
      output.appendChild(line);

      const res = document.createElement('p');
      if (cmd === 'help') {
        res.innerHTML = "Comandos: <br>- <b>whoami</b>: Info<br>- <b>clear</b>: Limpa tela<br>- <b>exit</b>: Fecha terminal";
      } else if (cmd === 'whoami') {
        res.innerHTML = "Leonardo Forner. Eng. Automação. Entusiasta C++ e Sistemas Embarcados.";
      } else if (cmd === 'clear') {
        output.innerHTML = ''; return;
      } else if (cmd === 'exit') {
        modal.classList.add('hidden'); return;
      } else if (cmd !== '') {
        res.innerHTML = `bash: ${cmd}: command not found`;
      }
      
      output.appendChild(res);
      output.scrollTop = output.scrollHeight;
    }
  });
}

function initKonamiCode() {
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIndex = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === konami[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konami.length) {
        document.body.classList.toggle('matrix-mode');
        alert("System Override: MATRIX MODE ACTIVATED.");
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

// =======================================================
// 8. MQTT (DASHBOARD IOT)
// =======================================================
function initMQTT() {
  if (typeof Paho === 'undefined') return;
  const topic = 'leoforner/iot';
  const clientId = 'portfolio_web_' + Math.random().toString(16).substr(2, 8);
  const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, clientId);
  const statusLabel = document.getElementById('mqtt-status');
  const tempLabel = document.getElementById('mqtt-temp');

  client.onConnectionLost = (res) => {
    if (res.errorCode !== 0) {
      statusLabel.textContent = "Desconectado. Reconectando...";
      statusLabel.style.color = "red";
      setTimeout(connectMQTT, 5000);
    }
  };

  client.onMessageArrived = (msg) => {
    if (msg.destinationName === topic) tempLabel.textContent = msg.payloadString;
  };

  function connectMQTT() {
    client.connect({
      onSuccess: () => {
        statusLabel.textContent = "Conectado. Ouvindo telemetria...";
        statusLabel.style.color = "lime";
        client.subscribe(topic);
      },
      onFailure: (err) => {
        statusLabel.textContent = "Falha ao conectar no broker.";
        statusLabel.style.color = "red";
      }
    });
  }
  connectMQTT();
}

// =======================================================
// 9. RADAR CHART (Chart.js)
// =======================================================
function initChartJS() {
  const ctx = document.getElementById('skillsChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const data = {
    labels: ['C/C++', 'Hardware & PCB', 'Controle (PID/FSM)', 'Visão Computacional', 'Python', 'Web (HTML/JS/KT)'],
    datasets: [{
      label: 'Proficiência',
      data: [90, 85, 80, 75, 75, 60],
      fill: true,
      backgroundColor: 'rgba(58, 245, 29, 0.2)',
      borderColor: 'rgba(58, 245, 29, 1)',
      pointBackgroundColor: 'rgba(58, 245, 29, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(58, 245, 29, 1)'
    }]
  };

  const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
  const textColor = isLightMode ? '#222' : 'whitesmoke';
  const gridColor = isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  window.skillsChartInstance = new Chart(ctx, {
    type: 'radar',
    data: data,
    options: {
      responsive: true, maintainAspectRatio: true,
      scales: {
        r: {
          angleLines: { color: gridColor }, grid: { color: gridColor },
          pointLabels: { color: textColor, font: { size: 10, family: "'Source Code Pro', monospace" } },
          ticks: { display: false, max: 100, min: 0 }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleFont: { family: "'Source Code Pro', monospace" }, bodyFont: { family: "'Source Code Pro', monospace" } }
      }
    }
  });
}

// =======================================================
// 10. FSM SIMULATOR (V5)
// =======================================================
function initFSM() {
  const btnArm = document.getElementById('fsm-btn-arm');
  const btnLaunch = document.getElementById('fsm-btn-launch');
  const btnAbort = document.getElementById('fsm-btn-abort');
  
  const stateIdle = document.getElementById('state-idle');
  const stateArmed = document.getElementById('state-armed');
  const stateFlight = document.getElementById('state-flight');
  const stateRecovery = document.getElementById('state-recovery');
  const log = document.getElementById('fsm-status-log');
  
  if (!btnArm) return;
  
  let currentState = 'IDLE'; // IDLE, ARMED, FLIGHT, RECOVERY, ABORTED

  function updateVisuals(state) {
    [stateIdle, stateArmed, stateFlight, stateRecovery].forEach(el => {
      el.classList.remove('active');
      el.classList.remove('error');
    });
    if(state === 'IDLE') stateIdle.classList.add('active');
    if(state === 'ARMED') stateArmed.classList.add('active');
    if(state === 'FLIGHT') stateFlight.classList.add('active');
    if(state === 'RECOVERY') stateRecovery.classList.add('active');
    if(state === 'ABORTED') {
      [stateIdle, stateArmed, stateFlight, stateRecovery].forEach(el => el.classList.add('error'));
    }
  }

  btnArm.addEventListener('click', () => {
    if(currentState === 'IDLE') {
      currentState = 'ARMED';
      log.textContent = "Estado: ARMED. Ignição pronta. Aguardando comando LAUNCH.";
      updateVisuals('ARMED');
    }
  });

  btnLaunch.addEventListener('click', () => {
    if(currentState === 'ARMED') {
      currentState = 'FLIGHT';
      log.textContent = "Estado: FLIGHT. Controle TVC Ativo. Monitorando IMU/Lidar.";
      updateVisuals('FLIGHT');
      setTimeout(() => {
        if(currentState === 'FLIGHT') {
          currentState = 'RECOVERY';
          log.textContent = "Estado: RECOVERY. Apogeu detectado. Paraquedas acionado.";
          updateVisuals('RECOVERY');
          setTimeout(() => {
            if(currentState === 'RECOVERY') {
              currentState = 'IDLE';
              log.textContent = "Estado: IDLE. Pouso confirmado. Sistema em repouso.";
              updateVisuals('IDLE');
            }
          }, 3000);
        }
      }, 3000);
    }
  });

  btnAbort.addEventListener('click', () => {
    currentState = 'ABORTED';
    log.textContent = "!!! ABORT !!! Corte de motor imediato acionado.";
    updateVisuals('ABORTED');
    setTimeout(() => {
      currentState = 'IDLE';
      log.textContent = "Estado: IDLE. Sistema resetado após aborto.";
      updateVisuals('IDLE');
    }, 4000);
  });
}

// =======================================================
// 11. MARKDOWN RENDERER (V5)
// =======================================================
function initMarkdownRenderer() {
  const select = document.getElementById('repo-select');
  const btn = document.getElementById('load-md-btn');
  const content = document.getElementById('markdown-content');
  if(!select || typeof marked === 'undefined') return;

  btn.addEventListener('click', async () => {
    const repo = select.value;
    content.innerHTML = `<p>Buscando README.md do repositório <b>${repo}</b> na API do GitHub...</p>`;
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/readme`);
      if(!response.ok) throw new Error("Repositório não encontrado ou sem README.");
      const data = await response.json();
      // O conteúdo vem em Base64
      const markdown = atob(data.content);
      content.innerHTML = marked.parse(markdown);
    } catch(err) {
      content.innerHTML = `<p style="color:red;">Erro ao renderizar Markdown: ${err.message}</p>`;
    }
  });
}

// =======================================================
// 12. CANVAS PARTICLES BACKGROUND (V5)
// =======================================================
function initParticles() {
  const canvas = document.getElementById('particles-bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

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

  let particleColor = 'rgba(58, 245, 29, 0.5)'; // Accent base
  let lineColor = 'rgba(58, 245, 29, 0.15)';

  window.updateParticlesTheme = function(theme) {
    if(theme === 'light') {
      particleColor = 'rgba(46, 139, 87, 0.5)';
      lineColor = 'rgba(46, 139, 87, 0.15)';
    } else {
      particleColor = 'rgba(58, 245, 29, 0.5)';
      lineColor = 'rgba(58, 245, 29, 0.15)';
    }
  }

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
    let numParticles = (width * height) / 9000; 
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
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                     + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
        if (distance < (width/7) * (height/7)) {
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
