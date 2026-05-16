document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initDarkMode();
  initScrollReveal();
  fetchGitHubProjects();
  initProjectFilters();
  initContactForm();
  
  // Novas funções V3
  initI18n();
  initTerminal();
  initMQTT();
});

// =======================================================
// 1. EFEITO MÁQUINA DE ESCREVER (Typewriter)
// =======================================================
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const texts = ["Dev Jr.", "Capitão da Equipe Robota", "Engenharia de Controle e Automação"];
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
  }, { threshold: 0.15 });
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
// 6. INTERNACIONALIZAÇÃO (i18n)
// =======================================================
const dictionary = {
  pt: {
    nav_about: "SOBRE", nav_projects: "PROJETOS", nav_iot: "IoT", nav_media: "MÍDIA",
    hero_subtitle: "Engenharia e Tecnologia", section_about: "SOBRE",
    about_text: "Sou estudante de Engenharia de Controle e Automação na UFSC e atuo profundamente no desenvolvimento de sistemas embarcados, Internet das Coisas (IoT) e robótica móvel. Tenho experiência prática como Capitão da equipe Robota de robótica móvel, além de projetar hardware e software para sistemas complexos — desde dataloggers baseados em LIDAR (Marine Height Logger) até computadores de bordo para foguetes de pouso vertical (VTVL) usando ESP32 e comunicação ESP-NOW. Também atuei com iniciação científica no Laboratório de Mecânica de Precisão (LMP/UFSC) desenvolvendo softwares de análise de imagem para manufatura aditiva a laser. Busco aplicar essa sólida bagagem técnica em desafios de engenharia e desenvolvimento de software.",
    timeline_title: "Trajetória", timeline_robota: "Capitão / Robótica Móvel",
    timeline_lmp: "Iniciação Científica / Visão Computacional", timeline_ufsc: "Engenharia de Controle e Automação (2020-Presente)",
    section_articles: "ARTIGOS & PESQUISA", notion_title: "Documentação de Projetos",
    notion_desc: "Acompanhe meus cadernos de engenharia, arquiteturas de hardware e tutoriais completos no Notion.",
    notion_btn: "Acessar Meu Notion", section_projects: "PROJETOS",
    section_iot: "ENGENHARIA INTERATIVA", iot_title: "Dashboard IoT Ao Vivo",
    iot_desc: "Conectado ao broker HiveMQ público. Aguardando dados de telemetria.",
    "3d_title": "Visualizador 3D", section_media: "MÍDIAS", section_contact: "CONTATO",
    form_name: "Nome:", form_message: "Mensagem:", form_btn: "Enviar Mensagem", footer: "Desenvolvido por Leonardo Forner."
  },
  en: {
    nav_about: "ABOUT", nav_projects: "PROJECTS", nav_iot: "IoT", nav_media: "MEDIA",
    hero_subtitle: "Engineering & Technology", section_about: "ABOUT",
    about_text: "I am a Control and Automation Engineering student at UFSC deeply involved in embedded systems, Internet of Things (IoT), and mobile robotics. I have practical experience as the Captain of the Robota mobile robotics team, and in designing hardware/software for complex systems — from LIDAR-based dataloggers to flight computers for VTVL rockets using ESP32 and ESP-NOW. I also worked as a researcher at the Precision Mechanics Laboratory (LMP/UFSC) developing computer vision software for laser additive manufacturing. I aim to apply this solid technical background to tough engineering and software challenges.",
    timeline_title: "Journey", timeline_robota: "Captain / Mobile Robotics",
    timeline_lmp: "Undergraduate Researcher / Computer Vision", timeline_ufsc: "Control and Automation Engineering (2020-Present)",
    section_articles: "ARTICLES & RESEARCH", notion_title: "Project Documentation",
    notion_desc: "Check out my engineering notebooks, hardware architectures, and full tutorials on Notion.",
    notion_btn: "Access My Notion", section_projects: "PROJECTS",
    section_iot: "INTERACTIVE ENGINEERING", iot_title: "Live IoT Dashboard",
    iot_desc: "Connected to public HiveMQ broker. Waiting for telemetry data.",
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
        // Para inputs/textareas, não mudamos textContent
        if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
          // Preserva ícones internos se existirem, ajustando o texto isolado se necessário.
          // Aqui usamos textContent simples para tags sem html interno complexo.
          if (el.children.length === 0) {
            el.textContent = dictionary[currentLang][key];
          } else {
             // Se tiver children (ex: botões com <i>), é preciso injetar o html corretamente.
             // Para simplificar, o data-i18n está focado em elementos de texto limpo.
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

  // Tecla crase (`) abre o terminal
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
  // Gerando um ID aleatório para não dar conflito com outros usuários no broker público
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
