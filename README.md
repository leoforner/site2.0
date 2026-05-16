# Leonardo Forner - Engineering Portfolio (V9)

Bem-vindo ao repositório do meu portfólio profissional! Este site não é apenas um currículo; é um **Laboratório de Engenharia Web** projetado para demonstrar na prática minhas habilidades em Ciência da Computação, Engenharia de Controle e Automação, e Sistemas Embarcados.

> 🚀 **Live Demo:** [leoforner.github.io/site2.0](https://leoforner.github.io/site2.0)

---

## 🏗️ Arquitetura do Projeto (SPA Modular)
A fim de manter a máxima performance sem o uso de frameworks engessados (React/Vue), construí uma arquitetura **Vanilla JS / HTML5** modular focada em velocidade de carregamento e clean code.

### 📂 Estrutura de Diretórios
\`\`\`text
site2.0/
├── index.html       # Página Inicial (Cartão de Visitas, Sobre, Robota, IoT)
├── projetos.html    # Catálogo de Repositórios GitHub e Projetos de Impacto
├── lab.html         # O Laboratório (Simulações Físicas e Matemáticas)
├── css/
│   └── estilosv2.css  # Folha de estilos central (Themes e Layouts)
├── js/
│   ├── script.js      # Core Engine (Inicialização, Backgrounds, GitHub Fetch)
│   ├── lab.js         # Cálculos Pesados (PID, Kalman, Cinemática, FFT)
│   ├── components.js  # Componentização (Injeção Dinâmica de Navbar/Footer)
│   └── i18n.js        # Dicionário Multi-idiomas (PT/EN)
└── assets/          # (Opcional) Imagens e currículos em PDF
\`\`\`

---

## 🧪 O Laboratório de Engenharia (`lab.html`)
Para demonstrar proficiência em algoritmos rodando "No Metal" (via JavaScript no front-end), criei simulações renderizadas em `Canvas 2D` otimizadas com `IntersectionObserver` e `requestAnimationFrame`:

*   **Controle PID:** Ajuste dos ganhos Proporcional, Integral e Derivativo para estabilizar fisicamente um elemento submetido à inércia.
*   **Filtro de Kalman 1D:** Estimação preditiva em tempo real sobre uma massa de dados de sensores com altíssimo ruído estocástico.
*   **Cinemática Inversa:** Resolução trigonométrica analítica que obriga um braço robótico planar de duas juntas a perseguir o cursor sem soltar as articulações.
*   **Web Audio API (FFT):** Processamento de Sinal Digital (DSP) aplicando a Transformada Rápida de Fourier diretamente do microfone para exibição de espectro.

## 📡 Recursos Avançados (IoT & Shaders)
*   **Multiplayer Cursors (MQTT):** O site atua como um Publisher/Subscriber no Broker *HiveMQ*. Ao mexer o mouse, sua coordenada é enviada para um tópico; se outro visitante acessar, você verá o cursor dele movendo pela tela.
*   **Demoscenes & Shaders:** Efeitos visuais ativáveis via botões (Enxame de IA/Boids, EMI Glitch, Lente Gravitacional customizada com `backdrop-filter`).
*   **Themes (CSS Variables):** A interface possui suporte nativo à alteração massiva de escopo (Modo Escuro, Modo Blueprint de Engenharia e Modo Pip-Boy de Fallout).

## 🛠️ Tech Stack Base
*   **HTML5 / CSS3 (Vanilla)**
*   **JavaScript (ES6+)**
*   **APIs Web:** Web Audio, IntersectionObserver, Canvas API
*   **Bibliotecas de Terceiros Leves:** `Paho MQTT` (IoT), `Chart.js` (Radares de Skils), `Model-Viewer` (Modelagem 3D).

## 👨‍💻 Como rodar localmente
1.  Clone este repositório:
    \`git clone https://github.com/leoforner/site2.0.git\`
2.  Entre no diretório:
    \`cd site2.0\`
3.  Inicie um servidor web local rápido (Python):
    \`python3 -m http.server 8000\`
4.  Acesse \`http://localhost:8000\` no seu navegador.
