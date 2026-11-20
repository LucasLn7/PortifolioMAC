// ── RELÓGIO ──
const relogio = document.getElementById('relogio');
function atualizarRelogio() {
  const d = new Date();
  const dia = d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  relogio.textContent = `${dia}  ${hora}`;
}
atualizarRelogio();
setInterval(atualizarRelogio, 30000);

// ── JANELAS ──
const janelas = document.querySelectorAll('.janela');
const appName = document.getElementById('appName');
const ehMobile = () => window.matchMedia('(max-width: 768px)').matches;
let zTopo = 100;

function marcarDock(id, ligado) {
  document.querySelectorAll(`.dock-item[data-abrir="${id}"]`)
    .forEach(el => el.classList.toggle('rodando', ligado));
}

function focar(win) {
  janelas.forEach(j => j.classList.remove('ativa'));
  win.classList.add('ativa');
  win.style.zIndex = ++zTopo;
  appName.textContent = win.dataset.titulo;
}

function abrir(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (ehMobile()) {
    janelas.forEach(j => { if (j !== win) fechar(j); });
  }
  win.classList.remove('minimizando');
  win.classList.add('aberta');
  marcarDock(id, true);
  focar(win);
}

function fechar(win) {
  win.classList.remove('aberta', 'ativa', 'max');
  marcarDock(win.id, false);
  const aberta = [...janelas].filter(j => j.classList.contains('aberta'))
    .sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
  if (aberta) focar(aberta); else appName.textContent = 'Finder';
}

function minimizar(win) {
  win.classList.add('minimizando');
  setTimeout(() => {
    win.classList.remove('aberta', 'ativa', 'minimizando');
    const aberta = [...janelas].filter(j => j.classList.contains('aberta'))[0];
    if (aberta) focar(aberta); else appName.textContent = 'Finder';
  }, 250);
  // continua "rodando" no dock: clicar de novo reabre
}

// abrir por ícones, dock e botões
document.querySelectorAll('[data-abrir]').forEach(el =>
  el.addEventListener('click', () => abrir(el.dataset.abrir)));

janelas.forEach(win => {
  win.addEventListener('pointerdown', () => focar(win));
  win.querySelector('.b-fechar').addEventListener('click', e => { e.stopPropagation(); fechar(win); });
  win.querySelector('.b-min').addEventListener('click', e => { e.stopPropagation(); minimizar(win); });
  win.querySelector('.b-max').addEventListener('click', e => { e.stopPropagation(); win.classList.toggle('max'); });
  win.querySelector('.barra').addEventListener('dblclick', () => win.classList.toggle('max'));

  // arrastar pela barra de título
  const barra = win.querySelector('.barra');
  barra.addEventListener('pointerdown', e => {
    if (ehMobile() || win.classList.contains('max') || e.target.closest('.semaforo')) return;
    const ini = { x: e.clientX, y: e.clientY, l: win.offsetLeft, t: win.offsetTop };
    barra.setPointerCapture(e.pointerId);
    const mover = ev => {
      const x = Math.min(Math.max(ini.l + ev.clientX - ini.x, -win.offsetWidth + 80), innerWidth - 80);
      const y = Math.min(Math.max(ini.t + ev.clientY - ini.y, 0), innerHeight - 160);
      win.style.left = x + 'px';
      win.style.top = y + 'px';
    };
    const soltar = () => {
      barra.removeEventListener('pointermove', mover);
      barra.removeEventListener('pointerup', soltar);
    };
    barra.addEventListener('pointermove', mover);
    barra.addEventListener('pointerup', soltar);
  });
});

// Esc fecha a janela ativa
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const ativa = document.querySelector('.janela.ativa');
    if (ativa) fechar(ativa);
  }
});

// ── TELA DE INICIALIZAÇÃO ──
const boot = document.getElementById('boot');
const faseBoot = document.getElementById('faseBoot');
const faseLogin = document.getElementById('faseLogin');
const bootProgresso = document.getElementById('bootProgresso');
const bootMsg = document.getElementById('bootMsg');
const btnEntrar = document.getElementById('btnEntrar');

const mensagens = [
  [0, 'Iniciando sistema…'],
  [25, 'Carregando projetos…'],
  [50, 'Compilando skills…'],
  [75, 'Conectando ao GitHub…'],
  [95, 'Tudo pronto.']
];

let progresso = 0, entrou = false, timerBoot;

function mostrarLogin() {
  clearInterval(timerBoot);
  faseBoot.hidden = true;
  faseLogin.hidden = false;
  btnEntrar.focus();
}

function entrar() {
  if (entrou) return;
  entrou = true;
  clearInterval(timerBoot);
  btnEntrar.classList.add('carregando');
  btnEntrar.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Entrando…';
  setTimeout(() => {
    boot.classList.add('saindo');
    setTimeout(() => { boot.remove(); abrir('sobre'); setTimeout(guiaSaudar, 1400); setTimeout(() => notificar('Lucas está disponível', 'Aberto a oportunidades e freelas. Dica: Ctrl+K abre a busca.'), 900); }, 800);
  }, faseLogin.hidden ? 0 : 500);
}

timerBoot = setInterval(() => {
  progresso = Math.min(100, progresso + 2 + Math.random() * 5);
  bootProgresso.style.width = progresso + '%';
  const atual = mensagens.filter(m => progresso >= m[0]).pop();
  bootMsg.textContent = atual[1];
  if (progresso >= 100) setTimeout(mostrarLogin, 450);
}, 110);

btnEntrar.addEventListener('click', entrar);
document.getElementById('bootPular').addEventListener('click', entrar);
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('boot')) {
    faseLogin.hidden ? mostrarLogin() : entrar();
  }
});


// ── WHATSAPP ──
document.getElementById('formulario').addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  if (!nome || !mensagem) {
    alert('Por favor, preencha seu nome e a mensagem.');
    return;
  }
  const telefone = '5511991306798';
  const texto = `Olá, meu nome é ${nome} e minha mensagem é: ${mensagem}`;
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`, '_blank');
});

// ── NOTIFICAÇÃO ──
let timerToast;
function notificar(titulo, texto) {
  const t = document.getElementById('toast');
  document.getElementById('toastT').textContent = titulo;
  document.getElementById('toastD').textContent = texto;
  t.classList.remove('saindo');
  t.hidden = false;
  clearTimeout(timerToast);
  timerToast = setTimeout(() => {
    t.classList.add('saindo');
    setTimeout(() => { t.hidden = true; }, 350);
  }, 4500);
}
document.getElementById('lixeira').addEventListener('click', () =>
  notificar('Lixeira', 'Vazia. Meus bugs também... quase.'));

// ── TERMINAL ──
const termSaida = document.getElementById('termSaida');
const termInput = document.getElementById('termInput');
const historico = []; let posHist = 0;
function escrever(txt, cls) {
  const d = document.createElement('div');
  d.textContent = txt;
  if (cls) d.className = cls;
  termSaida.appendChild(d);
}
const janelasCmd = ['sobre', 'experiencia', 'skills', 'projetos', 'contato', 'github', 'curriculo'];
const comandos = {
  help: () => ['Comandos: whoami, sobre, experiencia, skills, projetos, contato, github, curriculo, abrir <janela>, clear'],
  whoami: () => ['Lucas Lima, analista de suporte técnico júnior e dev full-stack, 19 anos, São Paulo.', 'Estudante de ADS na FAM e estagiário de TI (Help Desk) na Progroup.'],
  skills: () => ['HTML5, CSS3, JavaScript, Node.js, Python, Git/GitHub, Redes, IA/APIs, Help Desk, Manutenção de computadores'],
  projetos: () => ['1. Landing Page Corinthians (ChatBot + API)', '2. Sistema de Gestão de Estoque (em desenvolvimento)', '3. Landing Page Limpeza SP'],
  sudo: () => ['visitante não está no arquivo sudoers. Este incidente será reportado.'],
  ls: () => ['sobre  experiencia  skills  projetos  contato  github  curriculo'],
  clear: () => { termSaida.replaceChildren(); return []; }
};
function executar(linha) {
  escrever('visitante@lucas ~ % ' + linha, 'cmd');
  const [nome, ...args] = linha.trim().split(/\s+/);
  const alvo = nome === 'abrir' ? args[0] : nome;
  if (!nome) return;
  if (comandos[nome]) comandos[nome]().forEach(l => escrever(l));
  if (janelasCmd.includes(alvo)) { escrever('Abrindo ' + alvo + '…', 'ok'); abrir(alvo); }
  else if (!comandos[nome]) escrever(`comando não encontrado: ${nome}. Digite help.`, 'erro');
}
termInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const v = termInput.value; termInput.value = '';
    if (v.trim()) { historico.push(v); posHist = historico.length; }
    executar(v);
    document.getElementById('termTela').scrollTop = 1e6;
  } else if (e.key === 'ArrowUp' && historico.length) {
    posHist = Math.max(0, posHist - 1); termInput.value = historico[posHist]; e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    posHist = Math.min(historico.length, posHist + 1); termInput.value = historico[posHist] || ''; e.preventDefault();
  }
});
document.getElementById('termTela').addEventListener('click', () => termInput.focus());
escrever('Bem-vindo ao terminal do Lucas. Digite help para ver os comandos.', 'ok');
document.querySelector('[data-abrir="terminal"]').addEventListener('click', () => setTimeout(() => termInput.focus(), 50));

// ── GITHUB (API pública) ──
(async function carregarGithub() {
  const perfil = document.getElementById('ghPerfil');
  const repos = document.getElementById('ghRepos');
  try {
    const [u, r] = await Promise.all([
      fetch('https://api.github.com/users/LucasLn7').then(x => x.ok ? x.json() : Promise.reject()),
      fetch('https://api.github.com/users/LucasLn7/repos?sort=updated&per_page=6').then(x => x.ok ? x.json() : Promise.reject())
    ]);
    perfil.replaceChildren();
    const img = document.createElement('img'); img.src = u.avatar_url; img.alt = u.login;
    const info = document.createElement('div');
    const h2 = document.createElement('h2'); h2.textContent = u.name || u.login;
    const bio = document.createElement('p'); bio.className = 'mudo'; bio.textContent = u.bio || '';
    const st = document.createElement('div'); st.className = 'gh-stats';
    [`${u.public_repos} repositórios`, `${u.followers} seguidores`].forEach(t => { const s = document.createElement('span'); s.textContent = t; st.appendChild(s); });
    info.append(h2, bio, st); perfil.append(img, info);
    r.filter(x => !x.fork).forEach(x => {
      const a = document.createElement('a'); a.className = 'repo'; a.href = x.html_url; a.target = '_blank'; a.rel = 'noopener';
      const n = document.createElement('strong'); n.textContent = x.name;
      const d = document.createElement('span'); d.textContent = x.description || 'Sem descrição.';
      const m = document.createElement('small'); m.textContent = [x.language, x.stargazers_count ? x.stargazers_count + ' estrelas' : ''].filter(Boolean).join(' · ');
      a.append(n, d, m); repos.appendChild(a);
    });
  } catch {
    perfil.innerHTML = '<p class="mudo">Não consegui carregar agora. Use o botão abaixo para ver o perfil.</p>';
  }
})();

// ── SPOTLIGHT (Ctrl+K) ──
const spot = document.getElementById('spot');
const spotInput = document.getElementById('spotInput');
const spotLista = document.getElementById('spotLista');
const link = u => () => window.open(u, '_blank', 'noopener');
const itensSpot = [
  { n: 'Sobre mim', i: 'fa fa-user', k: 'perfil lucas', a: () => abrir('sobre') },
  { n: 'Experiência', i: 'fa fa-briefcase', k: 'estagio progroup help desk service desk manutencao laboratorio reparo chamados fam ads', a: () => abrir('experiencia') },
  { n: 'Skills', i: 'fa fa-code', k: 'html css javascript node python git redes ia suporte help desk manutencao', a: () => abrir('skills') },
  { n: 'Projetos', i: 'fa fa-layer-group', k: 'corinthians estoque limpeza landing', a: () => abrir('projetos') },
  { n: 'Contato', i: 'fa fa-comment', k: 'whatsapp mensagem', a: () => abrir('contato') },
  { n: 'Terminal', i: 'fa fa-terminal', k: 'comandos shell', a: () => { abrir('terminal'); setTimeout(() => termInput.focus(), 50); } },
  { n: 'GitHub (janela)', i: 'fa-brands fa-github', k: 'repositorios codigo', a: () => abrir('github') },
  { n: 'Currículo', i: 'fa fa-file-lines', k: 'cv pdf', a: () => abrir('curriculo') },
  { n: 'Abrir perfil no GitHub', i: 'fa-brands fa-github', k: 'externo', a: link('https://github.com/LucasLn7') },
  { n: 'Abrir LinkedIn', i: 'fa-brands fa-linkedin', k: 'externo', a: link('https://www.linkedin.com/in/lucasln7/') }
];
let filtrados = itensSpot, sel = 0;
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function desenharSpot() {
  spotLista.replaceChildren();
  if (!filtrados.length) { const li = document.createElement('li'); li.className = 'vazio'; li.textContent = 'Nada encontrado.'; spotLista.appendChild(li); return; }
  filtrados.forEach((it, idx) => {
    const li = document.createElement('li'); if (idx === sel) li.className = 'sel';
    const ic = document.createElement('i'); ic.className = it.i;
    const sp = document.createElement('span'); sp.textContent = it.n;
    li.append(ic, sp); li.addEventListener('click', () => escolher(it)); spotLista.appendChild(li);
  });
}
function abrirSpot() { spot.hidden = false; spotInput.value = ''; filtrados = itensSpot; sel = 0; desenharSpot(); spotInput.focus(); }
function fecharSpot() { spot.hidden = true; }
function escolher(it) { fecharSpot(); it.a(); }
spotInput.addEventListener('input', () => {
  const q = norm(spotInput.value.trim());
  filtrados = itensSpot.filter(it => norm(it.n + ' ' + it.k).includes(q)); sel = 0; desenharSpot();
});
spotInput.addEventListener('keydown', e => {
  e.stopPropagation();
  if (e.key === 'Escape') fecharSpot();
  else if (e.key === 'ArrowDown') { sel = Math.min(filtrados.length - 1, sel + 1); desenharSpot(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); desenharSpot(); e.preventDefault(); }
  else if (e.key === 'Enter' && filtrados[sel]) escolher(filtrados[sel]);
});
spot.addEventListener('pointerdown', e => { if (e.target === spot) fecharSpot(); });
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); spot.hidden ? abrirSpot() : fecharSpot(); }
});
document.querySelector('[data-spot]').addEventListener('click', abrirSpot);

// ── MENU DE CONTEXTO ──
const ctx = document.getElementById('ctx');
document.getElementById('desktop').addEventListener('contextmenu', e => {
  if (e.target.closest('.janela')) return;
  e.preventDefault();
  ctx.hidden = false;
  ctx.style.left = Math.min(e.clientX, innerWidth - ctx.offsetWidth - 8) + 'px';
  ctx.style.top = Math.min(e.clientY, innerHeight - ctx.offsetHeight - 8) + 'px';
});
ctx.addEventListener('click', e => {
  const acao = e.target.closest('li')?.dataset.acao;
  ctx.hidden = true;
  if (acao === 'spot') abrirSpot();
  else if (acao === 'sobre-site') notificar('Sobre este portfólio', 'Feito com HTML, CSS e JavaScript puros, sem frameworks.');
  else if (acao === 'terminal') { abrir('terminal'); setTimeout(() => termInput.focus(), 50); }
  else if (acao) abrir(acao);
});
document.addEventListener('pointerdown', e => { if (!e.target.closest('#ctx')) ctx.hidden = true; });

// ── MÚSICA (Spotify) ──
// Cole aqui o link da sua playlist do Spotify (Compartilhar > Copiar link da playlist)
const SPOTIFY_PLAYLIST = '';

let musicaCarregada = false;
function carregarMusica() {
  if (musicaCarregada) return;
  musicaCarregada = true;
  const corpo = document.getElementById('musicaCorpo');
  const id = (SPOTIFY_PLAYLIST.match(/playlist\/([A-Za-z0-9]+)/) || [])[1];
  if (!id) {
    corpo.innerHTML = '<div class="aviso-musica">Nenhuma playlist configurada. No <code>js.js</code>, cole o link da sua playlist do Spotify em <code>SPOTIFY_PLAYLIST</code>.</div>';
    return;
  }
  const f = document.createElement('iframe');
  f.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
  f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  f.loading = 'lazy';
  f.title = 'Playlist do Spotify';
  corpo.appendChild(f);
}
document.querySelectorAll('[data-abrir="musica"]').forEach(el => el.addEventListener('click', carregarMusica));

// ── NAVEGADOR (prévia de projetos) ──
function abrirDemo(url, nome) {
  document.getElementById('navFrame').src = url;
  document.getElementById('navUrl').textContent = url;
  document.getElementById('navExterno').href = url;
  document.getElementById('navTitulo').textContent = nome;
  document.getElementById('navegador').dataset.titulo = nome;
  abrir('navegador');
}
document.querySelectorAll('.proj[data-demo]').forEach(a =>
  a.addEventListener('click', e => { e.preventDefault(); abrirDemo(a.href, a.dataset.demo); }));

// ── CENTRAL DE CONTROLE ──
const cc = document.getElementById('cc');
const raiz = document.documentElement;
const salvar = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const ler = k => { try { return localStorage.getItem(k); } catch { return null; } };

function aplicarTema(t) {
  raiz.dataset.tema = t;
  document.getElementById('ccTemaTxt').textContent = t === 'light' ? 'Claro' : 'Escuro';
  document.querySelector('meta[name="theme-color"]').content = t === 'light' ? '#eceeff' : '#0c0e1a';
  salvar('tema', t);
}
function alternarTema() { aplicarTema(raiz.dataset.tema === 'light' ? 'dark' : 'light'); }
function aplicarAurora(ligada) {
  raiz.classList.toggle('sem-aurora', !ligada);
  document.getElementById('ccAuroraTxt').textContent = ligada ? 'Ligada' : 'Desligada';
  salvar('aurora', ligada ? '1' : '0');
}
function aplicarBrilho(v) {
  document.getElementById('escurecer').style.opacity = (100 - v) / 100 * 0.7;
  document.getElementById('ccBrilho').value = v;
  salvar('brilho', v);
}

aplicarTema(ler('tema') === 'light' ? 'light' : 'dark');
aplicarAurora(ler('aurora') !== '0');
aplicarBrilho(Number(ler('brilho')) || 100);

document.getElementById('ccTema').addEventListener('click', alternarTema);
document.getElementById('ccAurora').addEventListener('click', () => aplicarAurora(raiz.classList.contains('sem-aurora')));
document.getElementById('ccBrilho').addEventListener('input', e => aplicarBrilho(Number(e.target.value)));
document.querySelector('[data-cc]').addEventListener('click', () => { cc.hidden = !cc.hidden; });
document.addEventListener('pointerdown', e => {
  if (!cc.hidden && !e.target.closest('#cc') && !e.target.closest('[data-cc]')) cc.hidden = true;
});
document.getElementById('ctx').addEventListener('click', e => {
  if (e.target.closest('li')?.dataset.acao === 'tema') alternarTema();
});

// novos itens no Spotlight
itensSpot.push(
  { n: 'Música', i: 'fa fa-music', k: 'spotify playlist som', a: () => { abrir('musica'); carregarMusica(); } },
  { n: 'Alternar tema claro/escuro', i: 'fa fa-circle-half-stroke', k: 'dark light modo', a: alternarTema },
  { n: 'Ver prévia: Limpeza SP', i: 'fa fa-window-maximize', k: 'projeto landing demo', a: () => abrirDemo('https://lucasln7.github.io/landing-limpeza-sp/', 'Limpeza SP') }
);

// ── GUIA (Paimon) ──
// Coloque a imagem da guia em img/paimon.png (PNG com fundo transparente funciona melhor).
const gBalao = document.getElementById('guiaBalao');
const gTexto = document.getElementById('guiaTexto');
const gOpcoes = document.getElementById('guiaOpcoes');
const gInput = document.getElementById('guiaInput');
const gImg = document.getElementById('guiaImg');
const reduzirMov = matchMedia('(prefers-reduced-motion: reduce)').matches;
let digitando;

function falhaImagem() {
  const s = document.createElement('span');
  s.className = 'guia-fallback'; s.textContent = '✦';
  gImg.replaceWith(s);
}
gImg.addEventListener('error', falhaImagem, { once: true });
if (gImg.complete && gImg.naturalWidth === 0) falhaImagem();

function falar(txt, opcoes = []) {
  gBalao.hidden = false;
  gOpcoes.replaceChildren();
  clearInterval(digitando);
  const mostrar = () => opcoes.forEach(([rotulo, fn]) => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = rotulo; b.addEventListener('click', fn);
    gOpcoes.appendChild(b);
  });
  if (reduzirMov) { gTexto.textContent = txt; mostrar(); return; }
  gTexto.textContent = ''; let i = 0;
  digitando = setInterval(() => {
    gTexto.textContent = txt.slice(0, ++i);
    if (i >= txt.length) { clearInterval(digitando); mostrar(); }
  }, 16);
}

const respostas = {
  quem: { t: 'Este é o Lucas! 19 anos, de São Paulo, estudante de ADS na FAM e estagiário de TI na Progroup. Ele une suporte técnico com desenvolvimento full-stack.', a: () => abrir('sobre') },
  exp: { t: 'Desde agosto de 2025 ele faz Help Desk na Progroup: atende usuários, registra chamados e conserta computadores no laboratório de TI.', a: () => abrir('experiencia') },
  skills: { t: 'HTML, CSS, JavaScript, Node.js, Python, Git, redes e IA/APIs. Fora do código, Help Desk e manutenção de computadores.', a: () => abrir('skills') },
  projetos: { t: 'São três: a landing do Corinthians com chatbot de IA, um sistema de estoque em desenvolvimento e a landing da Limpeza SP, que dá para ver ao vivo aqui dentro.', a: () => abrir('projetos') },
  contato: { t: 'O Lucas está aberto a oportunidades, freelas e parcerias! Escreva na janela de mensagens: ela chega direto no WhatsApp dele.', a: () => abrir('contato') },
  curriculo: { t: 'Aqui está o currículo dele. Dá para baixar pelo botão.', a: () => abrir('curriculo') },
  github: { t: 'Os repositórios do Lucas, direto do GitHub.', a: () => abrir('github') },
  terminal: { t: 'Tem um terminal de verdade aqui! Digite help para ver os comandos.', a: () => { abrir('terminal'); setTimeout(() => termInput.focus(), 50); } },
  musica: { t: 'A playlist de quem programa ouvindo música.', a: () => { abrir('musica'); carregarMusica(); } },
  tema: { t: 'Trocando entre claro e escuro!', a: alternarTema },
  oi: { t: 'Oi, viajante! Paimon está aqui para ajudar. Pergunte sobre o Lucas ou escolha uma opção.' },
  ajuda: { t: 'Paimon sabe falar do Lucas, da experiência, das skills, dos projetos e do contato. Também faz um passeio guiado!' },
  tour: { a: () => iniciarTour() }
};
const intencoes = [
  [['quem', 'sobre', 'lucas', 'apresent'], 'quem'],
  [['experienc', 'estagio', 'trabalh', 'progroup', 'help desk', 'suporte'], 'exp'],
  [['skill', 'habilidade', 'tecnolog', 'stack', 'linguagem', 'sabe'], 'skills'],
  [['projeto', 'portfolio', 'corinthians', 'estoque', 'limpeza'], 'projetos'],
  [['contat', 'whatsapp', 'mensagem', 'contrat', 'vaga', 'oportunidade', 'freela', 'falar'], 'contato'],
  [['curricul', 'cv', 'pdf'], 'curriculo'],
  [['github', 'codigo', 'repositorio'], 'github'],
  [['terminal', 'comando'], 'terminal'],
  [['musica', 'spotify', 'playlist'], 'musica'],
  [['tema', 'escuro', 'claro', 'noite', 'dia'], 'tema'],
  [['passeio', 'tour', 'guiar'], 'tour'],
  [['ajuda', 'help', 'opcoes', 'o que voce faz'], 'ajuda']
];

const menuPrincipal = () => [
  ['Quem é o Lucas?', () => responder('quem')],
  ['Experiência', () => responder('exp')],
  ['Projetos', () => responder('projetos')],
  ['Skills', () => responder('skills')],
  ['Contratar', () => responder('contato')],
  ['Passeio guiado', () => responder('tour')]
];
function menu() { falar('O que Paimon pode mostrar?', menuPrincipal()); }
function guiaSaudar() {
  falar('Oi, viajante! Eu sou a Paimon, guia deste portfólio. Por onde Paimon começa a mostrar o trabalho do Lucas?', menuPrincipal());
}
function responder(chave) {
  const r = respostas[chave];
  if (!r) return;
  if (r.a) r.a();
  if (r.t) falar(r.t, [['Voltar ao menu', menu]]);
}
function entender(q) {
  const n = norm(q);
  const hit = intencoes.find(([ks]) => ks.some(k => n.includes(k)));
  if (hit) return responder(hit[1]);
  if (n.split(/\W+/).some(t => ['oi', 'ola', 'opa', 'hey', 'eai'].includes(t))) return responder('oi');
  falar('Hm, Paimon não entendeu essa... Tente perguntar sobre projetos, skills, experiência ou contato!', menuPrincipal());
}

// passeio guiado
const passos = [
  ['sobre', 'Primeiro, quem é o Lucas: 19 anos, estudante de ADS e estagiário de TI.'],
  ['experiencia', 'Aqui está a trajetória: Help Desk na Progroup, com chamados e reparo de computadores no laboratório.'],
  ['skills', 'As ferramentas dele, do JavaScript e Node.js até suporte e manutenção de PCs.'],
  ['projetos', 'Os projetos! Clique no da Limpeza SP para ver ao vivo aqui mesmo.'],
  ['contato', 'E por fim o contato. A mensagem chega direto no WhatsApp do Lucas!']
];
let passo = 0;
function iniciarTour() { passo = 0; mostrarPasso(); }
function mostrarPasso() {
  const [id, t] = passos[passo];
  abrir(id);
  const ultimo = passo === passos.length - 1;
  falar(t, ultimo
    ? [['Fim do passeio', menu]]
    : [['Próximo', () => { passo++; mostrarPasso(); }], ['Parar', menu]]);
}

document.getElementById('guiaAvatar').addEventListener('click', () => { gBalao.hidden ? menu() : (gBalao.hidden = true); });
document.getElementById('guiaFechar').addEventListener('click', () => { gBalao.hidden = true; });
document.getElementById('guiaForm').addEventListener('submit', e => {
  e.preventDefault();
  const q = gInput.value.trim();
  if (!q) return;
  gInput.value = '';
  entender(q);
});
gInput.addEventListener('keydown', e => {
  e.stopPropagation();
  if (e.key === 'Escape') gBalao.hidden = true;
});
itensSpot.push({ n: 'Falar com a guia', i: 'fa fa-comment-dots', k: 'paimon ajuda assistente', a: menu });

// ── LIGAR/DESLIGAR GUIA ──
function aplicarGuia(ligada) {
  raiz.classList.toggle('sem-guia', !ligada);
  document.getElementById('ccGuiaTxt').textContent = ligada ? 'Ligado' : 'Desligado';
  salvar('guia', ligada ? '1' : '0');
}
aplicarGuia(ler('guia') !== '0');
document.getElementById('ccGuia').addEventListener('click', () => aplicarGuia(raiz.classList.contains('sem-guia')));