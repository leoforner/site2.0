# Leonardo Forner | Portfólio de Engenharia V3

Bem-vindo à versão 3.0 do meu site portfólio pessoal! 🚀

Este projeto foi construído para ser muito mais do que um site estático. Ele atua como uma verdadeira **aplicação web e vitrine de engenharia**, integrando hardware, software, consumo de APIs e elementos 3D interativos, destacando minha experiência como estudante de Engenharia de Controle e Automação (UFSC), sistemas embarcados e robótica móvel.

---

## 📁 Estrutura de Arquivos e Instruções Manuais

O projeto funciona com 3 arquivos base de código, mas exige alguns arquivos locais adicionais fornecidos por você para funcionar 100%. Abaixo está a explicação de onde colocar cada coisa:

* `index.html`: É a estrutura base da página. Contém as tags, importação das fontes, FontAwesome (ícones), Model-Viewer (3D) e Paho MQTT (IoT).
* `estilosv2.css`: Todas as regras visuais, animações de Scroll Reveal, sistema de temas (Dark/Light mode) e responsividade.
* `script.js`: O "motor" do site. Controla a máquina de escrever, o terminal interativo, as conexões MQTT, tradução (i18n) e fetch na API do GitHub.

### Arquivos que você precisa adicionar na pasta raiz:
1. **`curriculo.pdf`**: Salve seu currículo com exatamente este nome na **mesma pasta** do `index.html`. Isso fará o Botão Flutuante (FAB) de download no canto inferior direito funcionar.
2. **Modelo 3D (`seu_modelo.glb`)**: Na linha 134 do `index.html`, existe a tag `<model-viewer src="...">`. Salve o modelo CAD do seu foguete ou robô em formato `.glb` ou `.gltf` na pasta raiz e mude o `src` para apontar para o seu arquivo (ex: `src="foguete.glb"`).

### Links que você precisa alterar no `index.html`:
* **Notion (Linha 106):** Troque o `href="#"` pelo seu link público real de documentação do Notion.
* **Formulário (Linha 155):** Troque o `action="https://formspree.io/f/your_form_id_here"` pelo seu ID real do Formspree (se desejar receber os contatos por e-mail).

---

## ⚙️ Como Funciona Cada Parte do Site

Este portfólio está recheado de integrações profissionais. Aqui está o guia de como cada uma opera sob o capô:

### 1. Integração IoT em Tempo Real (MQTT)
A seção "Dashboard IoT Ao Vivo" usa WebSockets através da biblioteca `paho-mqtt` no `script.js`.
- O site se conecta automaticamente ao broker público `broker.hivemq.com` na porta `8000`.
- Ele escuta/subscreve no tópico `leoforner/iot`.
- **Como testar:** Se você programar um ESP32 para publicar um float neste tópico via MQTT, o painel no seu site atualizará em tempo real, sem recarregar a página!

### 2. Easter Egg do Terminal Interativo
Para mostrar habilidades com Infra e Linux, há um terminal oculto.
- O `script.js` escuta os eventos de teclado do usuário.
- Se a tecla Crase (`` ` ``) ou acento agudo (´) for pressionada, uma modal `div` escurece a tela e abre o terminal.
- O usuário pode digitar comandos básicos programados (`help`, `whoami`, `clear`, `exit`), o JS processa o valor do `input` e insere parágrafos `<p>` com a resposta no DOM simulando o bash.

### 3. Integração Dinâmica com a API do GitHub
Os projetos não são mais escritos à mão no HTML.
- O JS faz um `fetch` em `https://api.github.com/users/leoforner/repos`.
- Ele filtra os resultados ignorando *Forks* e repositórios sem descrição.
- Renderiza "Cards" limpos no HTML usando as tags de linguagens identificadas pelo GitHub.
- Os botões de Filtro usam essa mesma matriz em memória para separar e esconder dinamicamente cards de Python, Web, C++, etc.

### 4. Internacionalização (i18n - PT/EN)
O botão de idioma (Globo) não redireciona para outra página HTML.
- O `script.js` possui um grande Dicionário JSON (`dictionary`).
- Todos os textos traduzíveis no HTML possuem o atributo `data-i18n="chave"`.
- Ao clicar no globo, o JS varre a página alterando o `textContent` de cada elemento para a linguagem correspondente instantaneamente.

### 5. Tema Dinâmico e Scroll Reveal
- **Dark/Light Mode:** O botão do sol/lua troca o atributo `data-theme="light"` na tag `<html>`. O CSS reage a isso alterando o escopo global do `:root`. O `script.js` salva a escolha no seu navegador usando `localStorage`.
- **Scroll Reveal:** Em vez de plugins pesados, a nativa `IntersectionObserver API` é usada. Quando você desce a tela e uma seção atinge 15% de visibilidade, ela ganha a classe CSS `.active`, ativando o fade-in via `transform: translateY`.

---

## 🚀 Como rodar localmente
1. Clone este repositório.
2. Certifique-se de adicionar o `curriculo.pdf` e o modelo `.glb` (opcional).
3. Abra o arquivo `index.html` diretamente em seu navegador preferido (Double click).

*Desenvolvido como uma prova de conceito das minhas habilidades em Engenharia e Código por [Leonardo Forner](https://github.com/leoforner).*
