document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initDarkMode();
  initScrollReveal();
  fetchGitHubProjects();
  initProjectFilters();
  initContactForm();
  
  // Novas funções V3 e V4
  initI18n();
  initTerminal();
  initMQTT();
  initChartJS();
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
    
    // Atualiza o Chart.js colors dinamicamente
    if (window.skillsChartInstance) {
      const textColor = newTheme === 'light' ? '#222' : 'whitesmoke';
      const gridColor = newTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
      window.skillsChartInstance.options.scales.r.ticks.color = textColor;
      window.skillsChartInstance.options.scales.r.grid.color = gridColor;
      window.skillsChartInstance.options.scales.r.pointLabels.color = textColor;
      window.skillsChartInstance.update();
    }
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
    container.innerHTML = '<p>Carregando projetos...</p>';
    const response = await fetch(`https://api.github.com/users/leoforner/repos?sort=updated&per_page=100`);
    const repos = await response.json();
    globalProjectsData = repos.filter(repo => !repo.fork && repo.description && repo.description.trim() !== '');
    renderProjects(globalProjectsData);
  } catch (error) {
    container.innerHTML = '<p>Erro ao carregar projetos.</p>';
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
// 6. INTERNACIONALIZAÇÃO (i18n) MASSIVA V4
// =======================================================
const dictionary = {
  pt: {
    nav_about: "SOBRE", nav_projects: "PROJETOS", nav_robota: "ROBOTA", nav_iot: "IoT & HARDWARE", nav_media: "MÍDIA",
    hero_subtitle: "Engenharia e Tecnologia", section_about: "SOBRE & SKILLS",
    about_text: "Sou estudante de Engenharia de Controle e Automação na UFSC e atuo profundamente no desenvolvimento de sistemas embarcados, Internet das Coisas (IoT) e robótica móvel. Tenho experiência prática como Capitão da equipe Robota de robótica móvel, além de projetar hardware e software para sistemas complexos — desde dataloggers baseados em LIDAR (Marine Height Logger) até computadores de bordo para foguetes de pouso vertical (VTVL) usando ESP32 e comunicação ESP-NOW. Também atuei com iniciação científica no Laboratório de Mecânica de Precisão (LMP/UFSC) desenvolvendo softwares de análise de imagem para manufatura aditiva a laser. Busco aplicar essa sólida bagagem técnica em desafios de engenharia e desenvolvimento de software.",
    timeline_title: "Trajetória", timeline_robota: "Capitão / Robótica Móvel",
    timeline_lmp: "Iniciação Científica / Visão Computacional aplicados à Manufatura Aditiva", timeline_ufsc: "Engenharia de Controle e Automação (2020-Presente)",
    chart_title: "Tech Stack",
    section_articles: "PESQUISA & CIÊNCIA",
    lmp_title: "Pesquisa: Visão Computacional (LMP/UFSC)",
    lmp_desc: "Durante o período de Iniciação Científica no Laboratório de Mecânica de Precisão (LMP/UFSC), desenvolvi um software dedicado à análise de imagem digital aplicado ao monitoramento e controle de qualidade no processo de manufatura aditiva a laser. A pesquisa focou no desenvolvimento de rotinas de visão computacional voltadas à extração geométrica e análise estrutural de camadas depositadas em tempo real, permitindo a detecção de anomalias no processo diretamente na borda do hardware, sem dependência de processamento em nuvem.",
    notion_title: "Documentação de Projetos",
    notion_desc: "Acompanhe meus cadernos de engenharia, arquiteturas de hardware e tutoriais completos no Notion.",
    notion_btn: "Acessar Meu Notion",
    
    section_robota: "MURAL DA ROBOTA",
    robota_title: "A Grande Conquista",
    robota_desc: "Como Capitão e ex-diretor de projetos internos da Equipe Robota na UFSC, liderei a gestão ágil de pessoas e a coordenação logística de uma equipe multidisciplinar de estudantes no desenvolvimento de robótica móvel competitiva. Meu papel principal envolveu a resolução de conflitos, otimização de cronogramas e o alinhamento de metas de engenharia que culminaram na entrega bem-sucedida de soluções de manufatura 3D e protótipos em eventos de grande visibilidade, como a Semana Acadêmica de Controle e Automação da universidade e exibições tecnológicas na ACATE.",
    
    section_awards: "CERTIFICAÇÕES & PRÊMIOS",
    award_1_title: "Equipe Robota - Destaque", award_1_desc: "Liderança em robótica autônoma e VTVL.",
    award_2_title: "LMP/UFSC - Pesquisa", award_2_desc: "Visão Computacional na Manufatura Aditiva.",
    award_3_title: "Sistemas Embarcados", award_3_desc: "Arquitetura de firmware e hardware.",
    
    section_projects: "PROJETOS & SOFTWARE", top_projects_title: "Projetos de Maior Impacto",
    proj1_title: "Marine Height Logger (LidarBox)",
    proj1_desc: "Desenvolvimento de um datalogger embarcado de alta precisão (LidarBox) projetado especificamente para acoplamento em UAVs/drones voltados à altimetria marinha. O sistema realiza a fusão de dados e telemetria integrando sensores LiDAR, GPS e IMU para aquisição e georreferenciamento de dados brutos em tempo real, utilizando algoritmos de filtragem de sinal desenvolvidos em C++ para mitigar ruídos ambientais causados pela movimentação da água e dinâmica de voo.",
    proj2_title: "Computador de Voo VTVL",
    proj2_desc: "Arquitetura e programação do computador de bordo para um minifoguete experimental de pouso e decolagem vertical (VTVL) estruturado em microcontroladores ESP32. O firmware foi projetado sobre uma arquitetura rígida de Máquina de Estados Finitos (FSM), implementando malhas fechadas de controle dinâmico para Controle por Vetorização de Empuxo (TVC) e telemetria de baixíssima latência via protocolo de comunicação sem fio nativo ESP-NOW.",
    proj3_title: "Robótica Móvel Autônoma",
    proj3_desc: "Prototipagem, design de hardware e calibração de firmware para robôs móveis autônomos de alto desempenho, aplicando conceitos de fusão de sensores com Unidades de Medição Inercial (IMU) e sensores de efeito Hall. O desenvolvimento engloba o desenho de PCBs proprietárias, otimização de malhas de controle PID embarcadas em plataformas Arduino e ESP32, e algoritmos de tomada de decisão lógica para navegação autônoma em pista.",
    other_projects_title: "Outros Repositórios (GitHub)",
    
    section_iot: "HARDWARE & IoT", iot_title: "Dashboard IoT Ao Vivo",
    iot_desc: "Conectado ao broker HiveMQ público. Aguardando dados de telemetria.",
    schem_title: "Arquitetura & Esquemáticos", schem_desc: "Diagramas elétricos e projetos de PCB.",
    "3d_title": "Visualizador 3D", section_media: "MÍDIAS", section_contact: "CONTATO",
    form_name: "Nome:", form_message: "Mensagem:", form_btn: "Enviar Mensagem", footer: "Desenvolvido por Leonardo Forner."
  },
  en: {
    nav_about: "ABOUT", nav_projects: "PROJECTS", nav_robota: "ROBOTA TEAM", nav_iot: "IoT & HARDWARE", nav_media: "MEDIA",
    hero_subtitle: "Engineering & Technology", section_about: "ABOUT & SKILLS",
    about_text: "I am a Control and Automation Engineering student at UFSC deeply involved in embedded systems, Internet of Things (IoT), and mobile robotics. I have practical experience as the Captain of the Robota mobile robotics team, and in designing hardware/software for complex systems — from LIDAR-based dataloggers to flight computers for VTVL rockets using ESP32 and ESP-NOW. I also worked as a researcher at the Precision Mechanics Laboratory (LMP/UFSC) developing computer vision software for laser additive manufacturing. I aim to apply this solid technical background to tough engineering and software challenges.",
    timeline_title: "Journey", timeline_robota: "Captain / Mobile Robotics",
    timeline_lmp: "Undergraduate Researcher / Computer Vision for Additive Manufacturing", timeline_ufsc: "Control and Automation Engineering (2020-Present)",
    chart_title: "Tech Stack",
    section_articles: "RESEARCH & SCIENCE",
    lmp_title: "Research: Computer Vision (LMP/UFSC)",
    lmp_desc: "During my Undergraduate Research fellowship at the Mechanical Precision Laboratory (LMP/UFSC), I developed digital image analysis software applied to monitoring and quality control within the laser additive manufacturing process. The research focused on building computer vision routines for geometric extraction and structural analysis of deposited layers in real time, enabling process anomaly detection directly at the hardware edge without relying on cloud computing.",
    notion_title: "Project Documentation",
    notion_desc: "Check out my engineering notebooks, hardware architectures, and full tutorials on Notion.",
    notion_btn: "Access My Notion",
    
    section_robota: "ROBOTA WALL",
    robota_title: "The Big Achievement",
    robota_desc: "As Captain and former director of internal projects for the Robota Team at UFSC, I led the agile product management and logistical coordination of a multidisciplinary student team developing competitive mobile robotics. My core role involved conflict resolution, timeline optimization, and alignment of engineering milestones that culminated in the successful delivery of 3D manufacturing solutions and prototypes at high-visibility events, including the university's Control and Automation Academic Week and technology exhibitions at ACATE.",
    
    section_awards: "CERTIFICATIONS & AWARDS",
    award_1_title: "Robota Team - Highlights", award_1_desc: "Leadership in autonomous robotics and VTVL.",
    award_2_title: "LMP/UFSC - Research", award_2_desc: "Computer Vision in Additive Manufacturing.",
    award_3_title: "Embedded Systems", award_3_desc: "Firmware and hardware architecture.",
    
    section_projects: "PROJECTS & SOFTWARE", top_projects_title: "My Top 3 Most Impactful Projects",
    proj1_title: "Marine Height Logger (LidarBox)",
    proj1_desc: "Development of a high-precision embedded datalogger (LidarBox) specifically designed for integration with UAVs/drones for marine altimetry. The system performs data fusion and telemetry by integrating LiDAR, GPS, and IMU sensors for real-time raw data acquisition and georeferencing, utilizing C++ signal filtering algorithms to mitigate environmental noise caused by water movement and flight dynamics.",
    proj2_title: "VTVL Flight Computer",
    proj2_desc: "Architecture and programming of the flight computer for an experimental VTVL (Vertical Take-off, Vertical Landing) model rocket built on ESP32 microcontrollers. The firmware was designed on a strict Finite State Machine (FSM) architecture, implementing closed-loop dynamic controls for Thrust Vector Control (TVC) and ultra-low latency telemetry via the native ESP-NOW wireless communication protocol.",
    proj3_title: "Autonomous Mobile Robots",
    proj3_desc: "Prototyping, hardware design, and firmware calibration for high-performance autonomous mobile robots, applying sensor fusion concepts with Inertial Measurement Units (IMU) and Hall Effect sensors. The development encompasses designing proprietary PCBs, optimizing embedded PID control loops on Arduino and ESP32 platforms, and logical decision-making algorithms for autonomous track navigation.",
    other_projects_title: "Other Repositories (GitHub)",
    
    section_iot: "HARDWARE & IoT", iot_title: "Live IoT Dashboard",
    iot_desc: "Connected to public HiveMQ broker. Waiting for telemetry data.",
    schem_title: "Architecture & Schematics", schem_desc: "Electrical diagrams and PCB designs.",
    "3d_title": "3D Viewer", section_media: "MEDIA", section_contact: "CONTACT",
    form_name: "Name:", form_message: "Message:", form_btn: "Send Message", footer: "Developed by Leonardo Forner."
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
          if (el.children.length === 0) {
            el.textContent = dictionary[currentLang][key];
          } else {
             if(el.tagName === 'SPAN') el.textContent = dictionary[currentLang][key];
             else el.childNodes[0].nodeValue = dictionary[currentLang][key];
          }
        }
      }
    });
  });
}

// =======================================================
// 7. TERMINAL EASTER EGG
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

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';
      
      const line = document.createElement('p');
      line.innerHTML = `<span>$ ${cmd}</span>`;
      output.appendChild(line);

      const res = document.createElement('p');
      if (cmd === 'help') {
        res.innerHTML = "Comandos disponíveis: <br>- <b>whoami</b>: Info sobre o Dev<br>- <b>clear</b>: Limpa tela<br>- <b>exit</b>: Fecha terminal";
      } else if (cmd === 'whoami') {
        res.innerHTML = "Leonardo Forner. Eng. Automação. Entusiasta C++ e Web.";
      } else if (cmd === 'clear') {
        output.innerHTML = '';
        return;
      } else if (cmd === 'exit') {
        modal.classList.add('hidden');
        return;
      } else if (cmd !== '') {
        res.innerHTML = `bash: ${cmd}: command not found`;
      }
      
      output.appendChild(res);
      output.scrollTop = output.scrollHeight;
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

  client.onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      statusLabel.textContent = "Desconectado. Tentando reconectar...";
      statusLabel.style.color = "red";
      setTimeout(connectMQTT, 5000);
    }
  };

  client.onMessageArrived = (message) => {
    if (message.destinationName === topic) {
      tempLabel.textContent = message.payloadString;
    }
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
        console.error("MQTT Falhou:", err);
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
    labels: [
      'C/C++',
      'Hardware & PCB',
      'Controle (PID/FSM)',
      'Visão Computacional',
      'Python',
      'Web (HTML/JS)'
    ],
    datasets: [{
      label: 'Nível de Proficiência',
      data: [90, 85, 80, 75, 70, 70],
      fill: true,
      backgroundColor: 'rgba(58, 245, 29, 0.2)', // Accent color transparente
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

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: {
            color: textColor,
            font: { size: 11, family: "'Source Code Pro', monospace" }
          },
          ticks: {
            display: false, // Esconde os números do eixo
            max: 100,
            min: 0
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { family: "'Source Code Pro', monospace" },
          bodyFont: { family: "'Source Code Pro', monospace" }
        }
      }
    }
  };

  window.skillsChartInstance = new Chart(ctx, config);
}
