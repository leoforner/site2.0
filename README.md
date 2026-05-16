# Portfólio V5 (Engenharia de Elite) - Leonardo Forner

Este repositório contém o código-fonte do meu portfólio web profissional, projetado para demonstrar fluência não apenas em desenvolvimento frontend, mas com foco maciço em **Engenharia de Controle e Automação, Sistemas Embarcados e IoT**.

## 🚀 Arquitetura & Features (V5)

O portfólio não utiliza frameworks pesados como React ou Vue. Ele é construído sobre **Vanilla HTML, CSS e JS**, demonstrando profundo controle sobre o DOM e APIs nativas.

### Funcionalidades de Engenharia Implementadas:
1. **Radar Chart de Habilidades (`Chart.js`):** Um gráfico interativo e responsivo demonstrando o balanço exato da "Tech Stack" cruzada via API do GitHub (C/C++, Python, Visão Computacional, etc).
2. **Dashboard IoT via MQTT (`paho-mqtt`):** Conexão via WebSockets ao broker HiveMQ público para recebimento de dados de telemetria em tempo real.
3. **Simulador de FSM (Máquina de Estados):** Um motor simplificado em Vanilla JS rodando as transições de estado do computador de bordo de um foguete (IDLE -> ARMED -> FLIGHT -> RECOVERY).
4. **Partículas em Canvas 2D:** Todo o background do site é renderizado nativamente por uma malha dinâmica de partículas interagindo com as coordenadas `(X, Y)` do cursor do mouse.
5. **Renderizador Markdown Dinâmico (`marked.js`):** O site consome a API REST do GitHub para realizar fetch de arquivos `README.md` brutos (em Base64) e renderizá-los como artigos estruturados dentro da página.
6. **Visualizador CAD 3D (`<model-viewer>`):** Tag web-component do Google para inspecionar modelos 3D (.glb) com anotações e "Hotspots" de hardware.
7. **Motor de i18n (Bilingue):** Sistema completo de troca de idiomas (PT/EN) em tempo de execução sem reload, manipulando o DOM via dicionários JSON.
8. **Easter Eggs "Hacker":** 
   - Um **Terminal Linux** escondido simulando um Shell (`help`, `whoami`, `clear`), ativado via tecla \` (crase).
   - O **Konami Code** que injeta propriedades CSS manipulando filtros visuais para transformar o site inteiro no tema "Matrix".
   - **Boot Log ASCII** disparado no `console.log` para recrutadores que inspecionam o código fonte.

## 📂 Estrutura de Diretórios
- `index.html`: Entrypoint com arquitetura semântica avançada.
- `estilosv2.css`: Sistema de Design, variáveis globais (Theming) e media queries.
- `script.js`: Motor JS (Canvas, APIs, MQTT, i18n).
- `/projetos/`: Pastas preparadas para abrigar páginas SPA dedicadas aos grandes estudos de caso (ex: `/projetos/vtvl/index.html`).

## 🛠️ Como Executar
Basta rodar qualquer servidor estático local.
Exemplo com Python:
```bash
python3 -m http.server 8000
```
Acesse `http://localhost:8000`

---
*Atualizado na versão V5: Injeção de Canvas dinâmico, simulador FSM e renderizador Markdown.*
