const dictionary = {
  pt: { nav_home: "INÍCIO", nav_projects: "PROJETOS", nav_lab: "LABORATÓRIO", nav_about: "SOBRE", nav_iot: "IoT", nav_robota: "ROBOTA",
    sidebar_sections: "Navegação", sidebar_fx: "Visual FX", nav_impact: "Destaques", nav_repos: "Github",
    nav_pid: "PID", nav_kalman: "Kalman", nav_ik: "Cinemática", nav_horizon: "Voo", nav_audio: "Áudio FFT", nav_fsm: "FSM",
    hero_subtitle: "Engenharia e Tecnologia", section_about: "SOBRE & SKILLS",
    about_text: "Estudante de Engenharia de Controle e Automação focado em sistemas embarcados e IoT. Apaixonado por robótica, automação industrial e desenvolvimento web.",
    chart_title: "Tech Stack", section_lab: "LABORATÓRIO DE ENGENHARIA", lab_desc: "Simulações interativas de algoritmos de controle, robótica e processamento de sinais rodando em tempo real no navegador via Vanilla JS e APIs web nativas.",
    lab_pid_title: "Controle PID Interativo", lab_pid_desc: "Ajuste os ganhos Kp, Ki e Kd para tentar estabilizar a barra vermelha na linha alvo (Setpoint) superando a inércia.",
    lab_kalman_title: "Filtro de Kalman 1D", lab_kalman_desc: "O ponto amarelo representa um sensor com altíssimo ruído. A linha verde é a estimativa ótima de estado filtrada por Kalman.",
    lab_ik_title: "Cinemática Inversa (IK)", lab_ik_desc: "Mova o mouse sobre a tela. O braço robótico de 2 elos calcula os ângulos ideais para atingir a coordenada usando trigonometria analítica.",
    lab_horizon_title: "Horizonte Artificial (Atitude)", lab_horizon_desc: "Simulador de painel aeronáutico. Mova o mouse (ou incline o celular) para gerar dados fictícios de Pitch e Roll.",
    lab_audio_title: "Processamento de Sinais: FFT & Osciloscópio", lab_audio_desc: "Requer permissão de microfone. Plota a onda sonora (Domínio do Tempo) e a Transformada Rápida de Fourier (Domínio da Frequência).",
    timeline_title: "Trajetória", timeline_robota: "Capitão / Robótica Móvel", timeline_lmp: "IC / Visão Computacional", timeline_ufsc: "Eng. Controle e Automação",
    section_articles: "ARTIGOS & DOCS (MARKDOWN)", md_label: "Escolha um Repositório:", md_btn: "Carregar README", md_placeholder: "O conteúdo do README.md aparecerá aqui renderizado via API do GitHub.",
    section_robota: "MURAL DA ROBOTA", robota_title: "A Grande Conquista", robota_desc: "Como Capitão e ex-diretor de projetos internos da Equipe Robota na UFSC, liderei o desenvolvimento de robôs autônomos e coordenei mais de 30 membros em competições de alto nível tecnológico.",
    section_iot: "HARDWARE & IoT", iot_title: "Dashboard IoT Ao Vivo", iot_desc: "Conectado ao broker HiveMQ público.",
    schem_title: "Arquitetura & Esquemáticos", schem_desc: "Diagramas elétricos e projetos de PCB.",
    "3d_title": "Visualizador 3D", section_contact: "Contato",
    form_name: "Nome / Empresa", form_message: "Sua mensagem...", form_btn: "Enviar Mensagem", footer: "Desenvolvido por Leonardo Forner | Engenharia de Controle e Automação.",
    section_fsm: "SIMULADOR DE FSM (VTVL)", fsm_desc: "Simulação simplificada da Máquina de Estados Finitos (FSM) de um foguete VTVL.",
    section_projects: "PROJETOS & SOFTWARE", top_projects_title: "Projetos de Maior Impacto", other_projects_title: "Outros Repositórios (GitHub)",
    proj1_title: "Marine Height Logger (LidarBox)", proj1_desc: "Datalogger embarcado de alta precisão projetado especificamente para acoplamento em UAVs/drones voltados à altimetria marinha. O sistema realiza fusão de sensores LiDAR e GPS RTK com telemetria via rádio Lora.",
    proj2_title: "Computador de Voo VTVL", proj2_desc: "Arquitetura e programação do computador de bordo de um foguete modelo projetado para decolagem e pouso vertical. Baseado no ESP32, controla Thrust Vector Control (TVC) via malha PID otimizada.",
    proj3_title: "Robótica Móvel Autônoma", proj3_desc: "Prototipagem, design de hardware e calibração de firmware para robôs das categorias seguidor de linha pro e sumô. Foco no desenvolvimento de placas PCB personalizadas para alta corrente."
  },
  en: { nav_home: "HOME", nav_projects: "PROJECTS", nav_lab: "LABORATORY", nav_about: "ABOUT", nav_iot: "IoT", nav_robota: "ROBOTA",
    sidebar_sections: "Navigation", sidebar_fx: "Visual FX", nav_impact: "Top Projects", nav_repos: "Github",
    nav_pid: "PID", nav_kalman: "Kalman", nav_ik: "Kinematics", nav_horizon: "Flight", nav_audio: "Audio FFT", nav_fsm: "FSM",
    hero_subtitle: "Engineering & Tech", section_about: "ABOUT & SKILLS",
    about_text: "Control and Automation Engineering student focused on embedded systems and IoT. Passionate about robotics, industrial automation, and web development.",
    chart_title: "Tech Stack", section_lab: "ENGINEERING LAB", lab_desc: "Interactive real-time simulations of control algorithms, robotics, and signal processing running on the browser via Vanilla JS and native Web APIs.",
    lab_pid_title: "Interactive PID Control", lab_pid_desc: "Tune Kp, Ki, Kd gains to try stabilizing the red bar at the target line (Setpoint) overcoming inertia.",
    lab_kalman_title: "Live 1D Kalman Filter", lab_kalman_desc: "The yellow dot represents an extremely noisy sensor. The green line is the optimal state estimate filtered by Kalman.",
    lab_ik_title: "Inverse Kinematics (IK)", lab_ik_desc: "Move the mouse over the screen. The 2-link robotic arm computes the ideal angles to reach the coordinate using analytic trigonometry.",
    lab_horizon_title: "Artificial Horizon (Attitude)", lab_horizon_desc: "Aeronautical panel simulator. Move the mouse (or tilt the phone) to generate simulated Pitch and Roll data.",
    lab_audio_title: "Signal Processing: FFT & Oscilloscope", lab_audio_desc: "Requires microphone permission. Plots the sound wave (Time Domain) and the Fast Fourier Transform (Frequency Domain).",
    timeline_title: "Journey", timeline_robota: "Captain / Mobile Robotics", timeline_lmp: "Research / Computer Vision", timeline_ufsc: "Control & Auto. Engineering",
    section_articles: "ARTICLES & DOCS (MARKDOWN)", md_label: "Choose a Repository:", md_btn: "Load README", md_placeholder: "The README.md content will appear here rendered via the GitHub API.",
    section_robota: "ROBOTA HALL", robota_title: "The Great Achievement", robota_desc: "As Captain and former Internal Projects Director of the Robota Team at UFSC, I led the development of autonomous robots and coordinated over 30 members in high-level technological competitions.",
    section_iot: "HARDWARE & IoT", iot_title: "Live IoT Dashboard", iot_desc: "Connected to public HiveMQ broker.",
    schem_title: "Architecture & Schematics", schem_desc: "Electrical diagrams and PCB designs.",
    "3d_title": "3D Viewer", section_contact: "Contact",
    form_name: "Name / Company", form_message: "Your message...", form_btn: "Send Message", footer: "Developed by Leonardo Forner | Control and Automation Engineering.",
    section_fsm: "FSM SIMULATOR (VTVL)", fsm_desc: "Simplified simulation of the Finite State Machine (FSM) of a VTVL rocket.",
    section_projects: "PROJECTS & SOFTWARE", top_projects_title: "High Impact Projects", other_projects_title: "Other Repositories (GitHub)",
    proj1_title: "Marine Height Logger (LidarBox)", proj1_desc: "High-precision embedded datalogger specifically designed for coupling on UAVs/drones aimed at marine altimetry. The system merges LiDAR and RTK GPS sensors with Lora radio telemetry.",
    proj2_title: "VTVL Flight Computer", proj2_desc: "Architecture and programming of the onboard computer of a model rocket designed for vertical takeoff and landing. Based on ESP32, it controls Thrust Vector Control (TVC) via an optimized PID loop.",
    proj3_title: "Autonomous Mobile Robotics", proj3_desc: "Prototyping, hardware design, and firmware calibration for line-follower pro and sumo robots. Focused on custom PCB development for high current applications."
  }
};

function initI18n() {
  const langBtn = document.getElementById('lang-toggle');
  let currentLang = 'pt';
  
  if(langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(dictionary[currentLang] && dictionary[currentLang][key]) el.textContent = dictionary[currentLang][key];
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if(dictionary[currentLang] && dictionary[currentLang][key]) el.placeholder = dictionary[currentLang][key];
      });
    });
  }
}
