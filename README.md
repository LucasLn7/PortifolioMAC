# 🖥️ Portfólio — Lucas Lima

<div align="center">

**Um portfólio que funciona como um desktop.**
Janelas arrastáveis, dock, terminal, busca estilo Spotlight e uma guia que abre os apps por você.

Feito com **HTML, CSS e JavaScript puros**, sem frameworks e sem dependências de build.

[![Demo](https://img.shields.io/badge/🌐_Ver_demo-lucasln7.github.io-8b7bf0?style=for-the-badge)](https://lucasln7.github.io/lucas-portfolio/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-lucasln7-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/lucasln7/)
[![GitHub](https://img.shields.io/badge/GitHub-LucasLn7-181717?style=for-the-badge&logo=github)](https://github.com/LucasLn7)

</div>

---

## 📸 Preview

> Adicione aqui um GIF ou print do site (por exemplo `img/preview.gif`):
>
> `![Preview do portfólio](./img/preview.gif)`

---

## 💡 Sobre o projeto

Eu queria um portfólio que as pessoas **explorassem**, e não só rolassem. A ideia foi recriar a experiência de um sistema operacional dentro do navegador: cada seção é uma janela, o menu é um dock e a navegação acontece clicando, arrastando e digitando comandos.

Tudo foi escrito do zero, sem bibliotecas de interface. É um projeto para praticar manipulação de DOM, eventos, animações CSS e organização de código em JavaScript puro.

---

## ✨ Funcionalidades

### Experiência de desktop
- 🚀 **Tela de inicialização** com barra de progresso e tela de login, com botão de pular
- 🪟 **Janelas arrastáveis** com fechar, minimizar (com animação) e maximizar; a janela clicada vai para frente
- 🧲 **Dock** com indicador de apps abertos e tooltips
- 🖱️ **Menu de contexto** (botão direito no desktop)
- 🏝️ **Ilha dinâmica** no topo: notificações, status da guia e mini-player de música (play/pause e progresso)
- 🕐 **Relógio** na barra de menu

### Apps dentro do portfólio
| App | O que faz |
|---|---|
| **Sobre / Experiência / Skills / Projetos** | Conteúdo do portfólio em janelas |
| **Terminal** | Comandos reais: `help`, `whoami`, `ls`, `skills`, `projetos`, `abrir <janela>`, `clear` e histórico com ↑ ↓ |
| **GitHub** | Perfil e repositórios mais recentes via **API pública do GitHub** |
| **Navegador** | Prévia ao vivo de projetos dentro de uma janela |
| **Currículo** | PDF embutido na janela |
| **Música** | Player de playlist do Spotify |
| **Mensagens** | Formulário que envia direto para o WhatsApp |

### Ferramentas
- 🔍 **Spotlight** com `Ctrl + K` (ou `Cmd + K`): busca janelas, projetos e links
- 🎛️ **Central de controle**: tema claro/escuro, aurora de fundo, brilho e liga/desliga da guia (preferências salvas no `localStorage`)
- 🧚 **Guia interativa**: assistente com menus e campo de perguntas. Ao escolher uma opção, ela **voa até o botão certo, aperta e abre o app**, e ainda faz demonstrações, como digitar comandos no terminal
- 📱 **Responsivo**: no celular as janelas ocupam a tela inteira
- ♿ Respeita `prefers-reduced-motion`

---

## ⌨️ Atalhos

| Atalho | Ação |
|---|---|
| `Ctrl/Cmd + K` | Abrir a busca |
| `Esc` | Fechar a janela ativa / a busca |
| `Enter` | Entrar na tela de login |
| `↑` `↓` no terminal | Navegar pelo histórico de comandos |

---

## 🛠️ Tecnologias

- **HTML5** semântico
- **CSS3**: variáveis, grid, flexbox, animações, `backdrop-filter`, temas claro/escuro
- **JavaScript (ES6+)**: Pointer Events (arrastar com mouse e toque), `async/await`, `fetch`, `localStorage` e nenhuma dependência
- **Font Awesome 6** (ícones)
- **Google Fonts** (Syne + DM Sans)
- **API pública do GitHub** e **Spotify Embed**

---

## 📂 Estrutura do projeto

```
lucas-portfolio/
├── index.html      # Estrutura: barra de menu, janelas, dock, guia
├── styles.css      # Estilos, temas e animações
├── js.js           # Janelas, terminal, busca, guia, GitHub, tema
├── README.md
└── img/
    ├── imagem1.jpeg   # Foto de perfil
    ├── imagem2.jpeg   # Projeto Corinthians
    ├── imagem3.png    # Projeto Gestão de Estoque
    ├── imagem4.png    # Projeto Limpeza SP
    └── paimon.png     # Imagem da guia (opcional, veja abaixo)
```

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/LucasLn7/lucas-portfolio.git

# Entre na pasta
cd lucas-portfolio

# Abra o index.html no navegador
# (ou use a extensão Live Server do VS Code)
```

Não há instalação nem etapa de build. É só abrir o arquivo.

---

## 🎨 Como personalizar

**Playlist do Spotify.** No `js.js`, cole o link da sua playlist na constante:
```js
const SPOTIFY_PLAYLIST = 'https://open.spotify.com/playlist/SEU_ID';
```

**Imagem da guia.** Salve uma imagem (PNG com fundo transparente) em `img/paimon.png`. Sem o arquivo, a guia aparece como uma estrela. As falas dela ficam no objeto `R` e nas listas `menus`, `fatos` e `intencoes`, no `js.js`.

**WhatsApp.** O número do formulário de contato fica na constante `telefone`, no `js.js`.

**Cores.** Todas as cores principais estão em variáveis no `:root` do `styles.css`.

**Projetos.** Para um projeto abrir na janela "Navegador", adicione `data-demo="Nome"` no link dele. Observação: sites que bloqueiam `iframe` (como o próprio github.com) precisam abrir em nova aba.

---

## 📝 Notas

- A guia é baseada em **palavras-chave e roteiros prontos**, e não em IA generativa.
- Paimon e Genshin Impact são propriedade da HoYoverse. O uso aqui é uma homenagem de fã, sem fins comerciais, e a imagem não é distribuída neste repositório.

---

## 📬 Contato

Quer trocar uma ideia ou tem uma oportunidade?

- 💼 [LinkedIn](https://www.linkedin.com/in/lucasln7/)
- 🐙 [GitHub](https://github.com/LucasLn7)
- 💬 WhatsApp, pelo app **Mensagens** do próprio portfólio

---

<div align="center">

Feito por **Lucas Lima** · 2026

</div>