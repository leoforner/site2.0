// =======================================================
// JS COMPONENTS (Navbar, Sidebar, Footer dinâmicos)
// =======================================================

const Components = {
  renderGlobalNavbar: () => `
    <nav class="nav global-nav">
      <ul class="p-list">
        <li><a href="index.html" data-i18n="nav_home">INÍCIO</a></li>
        <li><a href="projetos.html" data-i18n="nav_projects">PROJETOS</a></li>
        <li><a href="lab.html" data-i18n="nav_lab">LABORATÓRIO</a></li>
        
        <li class="nav-controls">
          <button id="lang-toggle" class="theme-btn" aria-label="Language"><i class="fas fa-globe"></i> <span id="current-lang">BR</span></button>
          <button id="theme-toggle" class="theme-btn" aria-label="Theme"><i class="fas fa-sun"></i></button>
        </li>
      </ul>
    </nav>
  `,

  renderSidebar: (pageType) => {
    let links = '';
    
    if(pageType === 'index') {
      links = `
        <li><a href="#sobre"><i class="fas fa-user"></i> <span data-i18n="nav_about">SOBRE</span></a></li>
        <li><a href="#artigos"><i class="fas fa-file-alt"></i> <span data-i18n="section_articles">ARTIGOS</span></a></li>
        <li><a href="#robota"><i class="fas fa-robot"></i> <span data-i18n="nav_robota">ROBOTA</span></a></li>
        <li><a href="#iot"><i class="fas fa-microchip"></i> <span data-i18n="nav_iot">IoT</span></a></li>
      `;
    } else if (pageType === 'lab') {
      links = `
        <li><a href="#lab-pid"><i class="fas fa-sliders-h"></i> <span data-i18n="nav_pid">Controle PID</span></a></li>
        <li><a href="#lab-kalman"><i class="fas fa-wave-square"></i> <span data-i18n="nav_kalman">Filtro Kalman</span></a></li>
        <li><a href="#lab-ik"><i class="fas fa-robot"></i> <span data-i18n="nav_ik">Cinemática</span></a></li>
        <li><a href="#lab-horizon"><i class="fas fa-plane"></i> <span data-i18n="nav_horizon">Voo</span></a></li>
        <li><a href="#lab-audio"><i class="fas fa-microphone"></i> <span data-i18n="nav_audio">Áudio FFT</span></a></li>
        <li><a href="#lab-fsm"><i class="fas fa-network-wired"></i> <span data-i18n="nav_fsm">FSM Simulador</span></a></li>
      `;
    } else if (pageType === 'projetos') {
      links = `
        <li><a href="#top-impact"><i class="fas fa-star"></i> <span data-i18n="nav_impact">Destaques</span></a></li>
        <li><a href="#all-repos"><i class="fab fa-github"></i> <span data-i18n="nav_repos">Todos os Repos</span></a></li>
      `;
    }

    return `
      <aside class="sidebar" id="main-sidebar">
        <h3 data-i18n="sidebar_sections">Navegação</h3>
        <ul class="sidebar-links">
          ${links}
        </ul>
        
        <hr class="sidebar-divider">
        
        <h3 data-i18n="sidebar_fx" class="sidebar-fx-title">Visual FX</h3>
        <div class="sidebar-fx-panel">
          <button id="toggle-boids" class="demo-btn" title="Boids Engine"><i class="fas fa-bug"></i></button>
          <button id="toggle-emi" class="demo-btn" title="EMI Glitch"><i class="fas fa-bolt"></i></button>
          <button id="toggle-lens" class="demo-btn" title="Gravitational Lens"><i class="fas fa-circle-notch"></i></button>
          <button id="toggle-blueprint" class="demo-btn" title="Blueprint Mode"><i class="fas fa-drafting-compass"></i></button>
          <button id="toggle-pipboy" class="demo-btn" title="Pip-Boy Mode"><i class="fas fa-terminal"></i></button>
        </div>
      </aside>
    `;
  },

  renderFooter: () => `
    <footer class="footer-modern">
      <div class="footer-container">
        <div class="footer-contact">
          <h3 data-i18n="section_contact">Contato</h3>
          <p>Vamos construir soluções embarcadas incríveis juntos.</p>
          <div class="footer-links">
            <a target="_blank" href="mailto:leonardoaguiarforner@gmail.com"><i class="far fa-envelope"></i> leonardoaguiarforner@gmail.com</a>
            <a target="_blank" href="tel:16999718218"><i class="fas fa-mobile-alt"></i> (16) 99971-8218</a>
            <a target="_blank" href="https://github.com/leoforner"><i class="fab fa-github"></i> leoforner</a>
            <a target="_blank" href="https://www.linkedin.com/in/leonardo-augusto-a-59574116b"><i class="fab fa-linkedin-in"></i> LinkedIn</a>
          </div>
        </div>
        <div class="footer-form">
          <form id="contact-form" class="modern-form" action="https://formspree.io/f/your_form_id_here" method="POST">
            <input type="text" id="name" name="name" required placeholder="Nome / Empresa" data-i18n-ph="form_name">
            <input type="email" id="email" name="email" required placeholder="E-mail">
            <textarea id="message" name="message" rows="3" required placeholder="Sua mensagem..." data-i18n-ph="form_message"></textarea>
            <button type="submit" class="submit-btn"><span data-i18n="form_btn">Enviar Mensagem</span> <i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <p data-i18n="footer">Desenvolvido por Leonardo Forner | Engenharia de Controle e Automação.</p>
      </div>
    </footer>
  `
};

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.main-wrapper');
  const pageType = document.body.getAttribute('data-page-type') || 'index';

  // Injetar Navbar Global
  document.body.insertAdjacentHTML('afterbegin', Components.renderGlobalNavbar());
  
  // Injetar Sidebar Local antes do wrapper
  if(wrapper) {
    wrapper.insertAdjacentHTML('beforebegin', Components.renderSidebar(pageType));
    // Injetar Footer ao final do wrapper
    wrapper.insertAdjacentHTML('beforeend', Components.renderFooter());
  }

  // Se o i18n estiver carregado, rodar de novo para os novos dom nodes
  if(typeof initI18n === 'function') initI18n();
  // Religar os botões recém renderizados aos shaders (importante!)
  if(typeof initDemosceneToggles === 'function') initDemosceneToggles();
  if(typeof initDarkMode === 'function') initDarkMode();
});
