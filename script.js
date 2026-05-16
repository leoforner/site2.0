/**
 * SITE 2.0 - SCRIPT MODULAR (Vanilla JS)
 * 
 * NOTA PARA FUTURAS MIGRAÇÕES (React/Vite):
 * As funções abaixo estão modularizadas para facilitar uma refatoração.
 * - initTypewriter() -> Viraria um custom hook (ex: useTypewriter) ou um Componente `TypewriterText`.
 * - initDarkMode() -> Viraria um contexto de tema (ThemeContext) com state global.
 * - fetchGitHubProjects() -> Se tornaria um `useEffect` chamando a API e um `useState` para salvar os dados.
 * - initProjectFilters() -> Usaria estados do React (`filterState`) para re-renderizar a lista automaticamente.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initDarkMode();
  initScrollReveal();
  fetchGitHubProjects();
  initProjectFilters();
  initContactForm();
});

// =======================================================
// 1. EFEITO MÁQUINA DE ESCREVER (Typewriter)
// =======================================================
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const texts = ["Dev Jr.", "Estudante de engenharia", "Apaixonado por Tecnologia"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

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

    // Se terminou de digitar a palavra inteira
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000; // Pausa antes de apagar
      isDeleting = true;
    } 
    // Se terminou de apagar a palavra inteira
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500; // Pausa antes de digitar a próxima
    }

    setTimeout(type, typeSpeed);
  }

  // Inicia o efeito
  type();
}

// =======================================================
// 2. MODO ESCURO E CLARO (Dark Mode com LocalStorage)
// =======================================================
function initDarkMode() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // Verifica preferência salva
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);
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
    if (theme === 'light') {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
  }
}

// =======================================================
// 3. ANIMAÇÃO NO SCROLL (Scroll Reveal API)
// =======================================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // 15% do elemento visível na tela para ativar
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Opcional: remover a observação após animar uma vez
        // observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// =======================================================
// 4. INTEGRAÇÃO REAL COM GITHUB API
// =======================================================
let globalProjectsData = []; // Armazena dados globais para filtro

async function fetchGitHubProjects() {
  const container = document.getElementById('github-projects');
  if (!container) return;

  const username = 'leoforner';
  const apiURL = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`;

  try {
    container.innerHTML = '<p>Carregando projetos do GitHub...</p>';
    
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Falha ao buscar repositórios.");
    
    const repos = await response.json();
    
    // Filtrar apenas repositórios com descrição ou criar logica base
    globalProjectsData = repos.filter(repo => !repo.fork && repo.description);

    renderProjects(globalProjectsData);

  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>Erro ao carregar projetos. Tente novamente mais tarde.</p>';
  }
}

// Função auxiliar para renderizar os cards
function renderProjects(projects) {
  const container = document.getElementById('github-projects');
  container.innerHTML = '';

  if (projects.length === 0) {
    container.innerHTML = '<p>Nenhum projeto encontrado para esta categoria.</p>';
    return;
  }

  projects.forEach(repo => {
    const lang = repo.language || 'Outro';
    const card = document.createElement('div');
    card.className = 'project-card';
    // Adiciona data attribute para facilitar o filtro
    card.setAttribute('data-category', lang.toLowerCase());
    
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <div class="project-tags">
        <span class="project-tag">${lang}</span>
      </div>
      <p>${repo.description}</p>
      <a href="${repo.html_url}" target="_blank" class="project-btn">Ver Projeto <i class="fab fa-github"></i></a>
    `;
    container.appendChild(card);
  });
}

// =======================================================
// 5. FILTRO DE PROJETOS DINÂMICO
// =======================================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove classe 'active' de todos os botões
      filterBtns.forEach(b => b.classList.remove('active'));
      // Adiciona 'active' no clicado
      e.target.classList.add('active');

      const filterValue = e.target.getAttribute('data-filter');
      
      if (filterValue === 'all') {
        renderProjects(globalProjectsData);
      } else {
        // Filtro aproximado (ex: HTML/CSS -> mapeia pra html ou css)
        const filteredData = globalProjectsData.filter(repo => {
          if (!repo.language) return false;
          const repoLang = repo.language.toLowerCase();
          
          if (filterValue === 'html' && (repoLang === 'html' || repoLang === 'css')) return true;
          return repoLang === filterValue;
        });
        
        renderProjects(filteredData);
      }
    });
  });
}

// =======================================================
// 6. FORMULÁRIO DE CONTATO (Lógica e Validação)
// =======================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    // Se você ainda não tem um endpoint Formspree real, prevenimos o envio padrão
    // e criamos um logica de "envio mockado" para demonstração.
    
    const action = form.getAttribute('action');
    if (action.includes('your_form_id_here')) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      if (!name || !email || !message) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      // Simulando o envio com sucesso
      const btn = form.querySelector('.submit-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      setTimeout(() => {
        alert(`Obrigado pela mensagem, ${name}! (Simulação de envio)`);
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 1500);
    }
    // Se o action for um endpoint válido (ex: formspree configurado),
    // o HTML form fará o seu papel nativo ou você pode tratar o fetch manualmente.
  });
}
