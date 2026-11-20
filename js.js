// ── RELÓGIO ──
const relogio = document.getElementById('relogio');
function atualizarRelogio() {
  const d = new Date();
  const dia = d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const sd = document.createElement('span'); sd.className = 'relogio-data'; sd.textContent = dia + '  ';
  relogio.replaceChildren(sd, hora);
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

// ── ILHA DINÂMICA ──
const ilha = document.getElementById('ilha');
const ilhaIc = document.getElementById('ilhaIc');
const ilhaTit = document.getElementById('ilhaTit');
const ilhaTxt = document.getElementById('ilhaTxt');
let avisoAtual = null, guiaMsg = null, musicaTocando = false, musicaAberta = false, musicaCtl = null;
const filaAvisos = [];
let mostrandoAviso = false;

function atualizarIlha() {
  const modo = avisoAtual ? 'aviso'
    : guiaMsg ? 'guia'
    : (musicaAberta && musicaCtl) ? 'aberta'
    : musicaTocando ? 'tocando' : 'idle';
  ilha.dataset.modo = modo;
  if (modo === 'aviso') {
    ilhaIc.className = 'ilha-ic ' + avisoAtual.ic;
    ilhaTit.textContent = avisoAtual.titulo; ilhaTxt.textContent = avisoAtual.texto;
  } else if (modo === 'guia') {
    ilhaIc.className = 'ilha-ic fa fa-wand-magic-sparkles girando';
    ilhaTit.textContent = 'Paimon'; ilhaTxt.textContent = guiaMsg;
  } else {
    if (modo === 'tocando') ilhaIc.className = 'ilha-ic fa fa-music';
    ilhaTit.textContent = ''; ilhaTxt.textContent = '';
  }
}
async function processarFila() {
  if (mostrandoAviso) return;
  mostrandoAviso = true;
  while (filaAvisos.length) {
    avisoAtual = filaAvisos.shift(); atualizarIlha();
    await new Promise(r => setTimeout(r, 4200));
    avisoAtual = null; atualizarIlha();
    await new Promise(r => setTimeout(r, 450));
  }
  mostrandoAviso = false;
}
function notificar(titulo, texto, ic = 'fa fa-bell') {
  filaAvisos.push({ titulo, texto, ic });
  if (filaAvisos.length > 4) filaAvisos.shift();
  processarFila();
}
function ilhaGuia(msg) { guiaMsg = msg; atualizarIlha(); }

document.getElementById('lixeira').addEventListener('click', () =>
  notificar('Lixeira', 'Vazia. Meus bugs também... quase.', 'fa fa-trash-can'));

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
  if (janelasCmd.includes(alvo)) { escrever('Abrindo ' + alvo + '…', 'ok'); abrir(alvo); notificar('Terminal', 'Abrindo ' + alvo, 'fa fa-terminal'); }
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
    window.ghResumo = `${u.public_repos} repositórios públicos · ${u.followers} seguidores`;
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
const SPOTIFY_PLAYLIST = 'https://open.spotify.com/playlist/39ijsJu8n8li6P3pipFk48?si=33267e6e6e0e403f';

let musicaCarregada = false;
const fmt = ms => { const s = Math.floor((ms || 0) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

function iframeSimples(onde, id) {
  const f = document.createElement('iframe');
  f.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
  f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  f.loading = 'lazy'; f.title = 'Playlist do Spotify';
  onde.appendChild(f);
}
function atualizarProgresso(d) {
  if (!d) return;
  const tocando = !d.isPaused;
  if (tocando !== musicaTocando) { musicaTocando = tocando; atualizarIlha(); }
  document.getElementById('ilhaProg').style.width = (d.duration ? (d.position / d.duration) * 100 : 0) + '%';
  document.getElementById('ilhaTempo').textContent = fmt(d.position);
  document.getElementById('ilhaDur').textContent = fmt(d.duration);
  document.getElementById('ilhaPlayIc').className = 'fa ' + (tocando ? 'fa-pause' : 'fa-play');
}
function carregarMusica() {
  if (musicaCarregada) return;
  musicaCarregada = true;
  const corpo = document.getElementById('musicaCorpo');
  const id = (SPOTIFY_PLAYLIST.match(/playlist\/([A-Za-z0-9]+)/) || [])[1];
  if (!id) {
    corpo.innerHTML = '<div class="aviso-musica">Nenhuma playlist configurada. No <code>js.js</code>, cole o link da sua playlist do Spotify em <code>SPOTIFY_PLAYLIST</code>.</div>';
    return;
  }
  const alvo = document.createElement('div');
  corpo.appendChild(alvo);
  window.onSpotifyIframeApiReady = IFrameAPI => {
    IFrameAPI.createController(alvo, { uri: `spotify:playlist:${id}`, width: '100%', height: 352, theme: '0' }, ctl => {
      musicaCtl = ctl;
      ctl.addListener('playback_update', e => atualizarProgresso(e.data));
    });
  };
  const s = document.createElement('script');
  s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true;
  s.onerror = () => { alvo.replaceChildren(); iframeSimples(alvo, id); };
  document.body.appendChild(s);
  // se a API não responder, usa o player simples (sem controles na ilha)
  setTimeout(() => { if (!musicaCtl && !alvo.querySelector('iframe')) iframeSimples(alvo, id); }, 7000);
}
document.querySelectorAll('[data-abrir="musica"]').forEach(el => el.addEventListener('click', carregarMusica));

// controles da ilha
ilha.addEventListener('click', () => {
  if (!musicaCtl || avisoAtual || guiaMsg) return;
  musicaAberta = !musicaAberta; atualizarIlha();
});
document.getElementById('ilhaPlay').addEventListener('click', e => { e.stopPropagation(); if (musicaCtl) musicaCtl.togglePlay(); });
document.getElementById('ilhaAbrir').addEventListener('click', e => {
  e.stopPropagation(); musicaAberta = false; atualizarIlha(); abrir('musica');
});
document.addEventListener('pointerdown', e => {
  if (musicaAberta && !e.target.closest('#ilha')) { musicaAberta = false; atualizarIlha(); }
});

// aviso ao abrir o GitHub
document.querySelectorAll('[data-abrir="github"]').forEach(el => el.addEventListener('click', () => {
  if (window.ghResumo) notificar('GitHub', window.ghResumo, 'fa-brands fa-github');
}));

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
function alternarTema() {
  aplicarTema(raiz.dataset.tema === 'light' ? 'dark' : 'light');
  notificar('Tema', raiz.dataset.tema === 'light' ? 'Modo claro ativado' : 'Modo escuro ativado', 'fa fa-circle-half-stroke');
}
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
// Coloque a imagem da guia em img/paimon.png (PNG com fundo transparente). Sem ela, aparece uma estrela dourada.
const gBalao = document.getElementById('guiaBalao');
const gTexto = document.getElementById('guiaTexto');
const gOpcoes = document.getElementById('guiaOpcoes');
const gInput = document.getElementById('guiaInput');
const gImg = document.getElementById('guiaImg');
const gAvatar = document.getElementById('guiaAvatar');
const reduzirMov = matchMedia('(prefers-reduced-motion: reduce)').matches;
const dormir = ms => new Promise(r => setTimeout(r, reduzirMov ? 0 : ms));
let digitando, ocupado = false, ultimoMenu = 'principal';

// ── imagem da guia ──
function falhaImagem() {
  const s = document.createElement('span');
  s.className = 'guia-fallback'; s.textContent = '✦';
  gImg.replaceWith(s);
}
gImg.addEventListener('error', falhaImagem, { once: true });
if (gImg.complete && gImg.naturalWidth === 0) falhaImagem();

// o "slot" guarda o lugar dela enquanto ela sai voando
const slot = document.createElement('div');
slot.className = 'guia-slot';
gAvatar.replaceWith(slot);
slot.appendChild(gAvatar);

// ── fala ──
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

// ── a guia voa e aperta os botões ──
let voando = false;
const posicionar = (x, y) => { gAvatar.style.transform = `translate(${x}px, ${y}px)`; };

async function decolar() {
  if (voando) return;
  const r = slot.getBoundingClientRect();
  gAvatar.style.transition = 'none';
  posicionar(r.left, r.top);
  gAvatar.classList.add('voando');
  void gAvatar.offsetWidth;
  gAvatar.style.transition = '';
  voando = true;
}
function mostrarOnda(x, y) {
  const o = document.createElement('div');
  o.className = 'guia-onda';
  o.style.left = x + 'px'; o.style.top = y + 'px';
  document.body.appendChild(o);
  setTimeout(() => o.remove(), 450);
}
async function clicarEm(el) {
  if (!el) return;
  await decolar();
  const w = slot.getBoundingClientRect().width;
  const r = el.getBoundingClientRect();
  const x = Math.min(Math.max(r.left + r.width / 2 - w / 2, 4), innerWidth - w - 4);
  const y = r.top > w + 40 ? r.top - w + 14 : r.bottom - 14; // pousa acima do botão (ou abaixo, se ele estiver no topo)
  posicionar(x, y);
  await dormir(950);
  gAvatar.classList.add('apertando'); el.classList.add('clicado-guia');
  mostrarOnda(r.left + r.width / 2, r.top + r.height / 2);
  await dormir(340);
  gAvatar.classList.remove('apertando'); el.classList.remove('clicado-guia');
}
async function voltar() {
  if (!voando) return;
  const r = slot.getBoundingClientRect();
  posicionar(r.left, r.top);
  await dormir(900);
  gAvatar.classList.remove('voando');
  gAvatar.style.transform = '';
  voando = false;
}
async function digitar(campo, texto) {
  campo.focus();
  for (const c of texto) {
    campo.value += c;
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    await dormir(70);
  }
}
const enter = campo => campo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

async function abrirApp(id) {
  const el = document.querySelector(`.dock-item[data-abrir="${id}"]`);
  ilhaGuia('Abrindo ' + (el?.dataset.nome || id));
  await clicarEm(el);
  if (el) el.click();
  await dormir(350);
}
async function demoTerminal(cmds) {
  await abrirApp('terminal');
  for (const c of cmds) {
    ilhaGuia('Rodando: ' + c);
    await digitar(termInput, c);
    await dormir(250);
    enter(termInput);
    await dormir(700);
  }
}
const roteiros = {
  async vivo() {
    await abrirApp('projetos');
    await dormir(300);
    const card = document.querySelector('.proj[data-demo]');
    await clicarEm(card);
    card.click();
  },
  async mensagem() {
    await abrirApp('contato');
    const campo = document.getElementById('nome');
    await clicarEm(campo);
    campo.focus();
  },
  async linkedin() {
    const a = document.querySelector('.dock-item[data-nome="LinkedIn"]');
    await clicarEm(a);
    a.click();
  },
  async tema() {
    ilhaGuia('Trocando o tema');
    const b = document.querySelector('[data-cc]');
    await clicarEm(b); b.click();
    await dormir(300);
    const t = document.getElementById('ccTema');
    await clicarEm(t); t.click();
    await dormir(600);
    await clicarEm(b); b.click();
  },
  async busca() {
    ilhaGuia('Usando a busca');
    const b = document.querySelector('[data-spot]');
    await clicarEm(b); b.click();
    await dormir(300);
    await digitar(spotInput, 'projetos');
    await dormir(500);
    enter(spotInput);
  },
  async lixeira() {
    const l = document.getElementById('lixeira');
    await clicarEm(l); l.click();
  }
};

async function agir(roteiro, fim, opcoes) {
  if (ocupado) return;
  ocupado = true; gAvatar.classList.add('agindo'); ilhaGuia('Em ação…');
  const inicios = ['Deixa que Paimon clica!', 'Já abro, um segundinho!', 'Paimon cuida disso!'];
  falar(inicios[Math.floor(Math.random() * inicios.length)]);
  try { await roteiro(); } catch (e) { console.error(e); }
  await voltar();
  gAvatar.classList.remove('agindo'); ocupado = false; ilhaGuia(null);
  falar(fim, opcoes);
}

// ── conteúdo ──
const R = {
  quem: ['Este é o Lucas! 19 anos, de São Paulo, estudante de ADS na FAM e estagiário de TI na Progroup. Ele une suporte técnico com desenvolvimento full-stack.', () => abrirApp('sobre')],
  formacao: ['Ele cursa Análise e Desenvolvimento de Sistemas na FAM desde 2025, com foco em desenvolvimento web, lógica de programação, banco de dados e infraestrutura.', () => abrirApp('experiencia')],
  skills: ['HTML, CSS, JavaScript, Node.js, Python, Git, redes e IA/APIs. Fora do código, Help Desk e manutenção de computadores.', () => abrirApp('skills')],
  exp: ['Desde agosto de 2025 ele faz Help Desk na Progroup: atende usuários, registra chamados e conserta computadores no laboratório de TI.', () => abrirApp('experiencia')],
  projetos: ['São três: a landing do Corinthians com chatbot de IA, um sistema de estoque em desenvolvimento e a landing da Limpeza SP.', () => abrirApp('projetos')],
  vivo: ['Esse é o site da Limpeza SP rodando ao vivo, dentro do portfólio!', roteiros.vivo],
  github: ['Os repositórios do Lucas, direto do GitHub.', () => abrirApp('github')],
  curriculo: ['Aqui está o currículo. Dá para baixar pelo botão.', () => abrirApp('curriculo')],
  musica: ['A playlist de quem programa ouvindo música.', () => abrirApp('musica')],
  mensagem: ['Pronto! É só escrever seu nome e a mensagem: ela chega direto no WhatsApp do Lucas.', roteiros.mensagem],
  contratar: ['O Lucas está aberto a oportunidades, freelas e parcerias! Paimon abriu o formulário para você.', roteiros.mensagem],
  linkedin: ['Paimon clicou no LinkedIn dele. Se a aba não abriu, o navegador bloqueou o pop-up.', roteiros.linkedin],
  terminal: ['O terminal é de verdade! Paimon digitou dois comandos. Tente também o help.', () => demoTerminal(['whoami', 'ls'])],
  tema: ['Tema trocado! Dá para voltar do mesmo jeito.', roteiros.tema],
  busca: ['Essa é a busca. Ctrl+K em qualquer momento acha janelas e projetos.', roteiros.busca]
};
const fatos = [
  'O Lucas já diagnosticou e consertou computadores com defeito no laboratório de TI da Progroup.',
  'O chatbot do projeto do Corinthians guarda as chaves de API no backend, com Node.js, por segurança.',
  'Este portfólio inteiro é feito com HTML, CSS e JavaScript puros, sem framework nenhum.',
  'O Lucas junta suporte técnico e programação: sabe resolver o problema e também construir a solução.',
  'Aperte Ctrl+K em qualquer lugar do site para buscar janelas e projetos.'
];

const menus = {
  principal: ['Paimon pode abrir os apps por você! Escolha uma categoria:', [['Sobre o Lucas', 'sobre'], ['Trabalho', 'trabalho'], ['Contato', 'contato'], ['Explorar o site', 'explorar'], ['Passeio guiado', 'tour'], ['Surpresa', 'surpresa']]],
  sobre: ['O que você quer saber sobre o Lucas?', [['Quem é ele?', 'quem'], ['Formação', 'formacao'], ['Skills', 'skills'], ['Curiosidade', 'curiosidade'], ['Voltar', 'principal']]],
  trabalho: ['Vamos ver o trabalho dele:', [['Experiência', 'exp'], ['Projetos', 'projetos'], ['Ver Limpeza SP ao vivo', 'vivo'], ['Código no GitHub', 'github'], ['Currículo', 'curriculo'], ['Voltar', 'principal']]],
  contato: ['Como você quer falar com ele?', [['Mandar mensagem', 'mensagem'], ['LinkedIn', 'linkedin'], ['Currículo', 'curriculo'], ['Está contratando?', 'contratar'], ['Voltar', 'principal']]],
  explorar: ['Coisas legais para explorar:', [['Terminal em ação', 'terminal'], ['Música', 'musica'], ['Trocar tema', 'tema'], ['Busca (Ctrl+K)', 'busca'], ['Voltar', 'principal']]]
};
const mapOps = ops => ops.map(([rotulo, a]) => [rotulo, () => ir(a)]);
function mostrarMenu(nome = 'principal') {
  const [t, ops] = menus[nome];
  ultimoMenu = nome;
  falar(t, mapOps(ops));
}
function menu() { mostrarMenu('principal'); }
function ir(chave) {
  if (chave === 'menu') return mostrarMenu('principal');
  if (menus[chave]) return mostrarMenu(chave);
  responder(chave);
}
const volta = () => ultimoMenu === 'principal'
  ? [['Menu principal', menu]]
  : [['Voltar', () => mostrarMenu(ultimoMenu)], ['Menu principal', menu]];

function curiosidade() {
  const f = fatos[Math.floor(Math.random() * fatos.length)];
  falar(f, [['Outra curiosidade', curiosidade], ...volta()]);
}
function surpresa() {
  const s = Math.floor(Math.random() * 3);
  if (s === 0) return curiosidade();
  if (s === 1) return agir(() => demoTerminal(['sudo']), 'Paimon tentou um comando proibido e o terminal não perdoou!', volta());
  agir(roteiros.lixeira, 'Paimon mexeu na lixeira e achou uma mensagem!', volta());
}
function responder(chave) {
  if (chave === 'tour') return iniciarTour();
  if (chave === 'curiosidade') return curiosidade();
  if (chave === 'surpresa') return surpresa();
  if (chave === 'oi') return falar('Oi, viajante! Paimon está aqui. Pergunte algo ou escolha uma opção.', mapOps(menus.principal[1]));
  const r = R[chave];
  if (r) agir(r[1], r[0], volta());
}
function guiaSaudar() {
  ultimoMenu = 'principal';
  falar('Oi, viajante! Eu sou a Paimon, guia deste portfólio. Paimon abre os apps por você: é só escolher!', mapOps(menus.principal[1]));
}

const intencoes = [
  [['ao vivo', 'demo', 'previa'], 'vivo'],
  [['contrat', 'vaga', 'oportunidade', 'freela'], 'contratar'],
  [['mandar mensagem', 'enviar mensagem', 'whatsapp', 'formulario'], 'mensagem'],
  [['linkedin'], 'linkedin'],
  [['contat', 'mensagem', 'falar'], 'contato'],
  [['formacao', 'faculdade', 'estuda', 'curso'], 'formacao'],
  [['experienc', 'estagio', 'trabalh', 'progroup', 'help desk', 'suporte'], 'exp'],
  [['skill', 'habilidade', 'tecnolog', 'stack', 'linguagem'], 'skills'],
  [['projeto', 'portfolio', 'corinthians', 'estoque', 'limpeza'], 'projetos'],
  [['curricul', 'cv', 'pdf'], 'curriculo'],
  [['github', 'codigo', 'repositorio'], 'github'],
  [['terminal', 'comando'], 'terminal'],
  [['musica', 'spotify', 'playlist'], 'musica'],
  [['tema', 'escuro', 'claro', 'noite'], 'tema'],
  [['busca', 'pesquis', 'ctrl'], 'busca'],
  [['curiosidade', 'fato'], 'curiosidade'],
  [['surpresa', 'aleatorio'], 'surpresa'],
  [['passeio', 'tour', 'guiar'], 'tour'],
  [['ajuda', 'opcoes', 'menu'], 'menu'],
  [['quem', 'sobre', 'lucas', 'apresent'], 'quem']
];
function entender(q) {
  if (ocupado) return;
  const n = norm(q);
  const hit = intencoes.find(([ks]) => ks.some(k => n.includes(k)));
  if (hit) return ir(hit[1]);
  if (n.split(/\W+/).some(t => ['oi', 'ola', 'opa', 'hey', 'eai'].includes(t))) return responder('oi');
  falar('Hm, Paimon não entendeu essa... Tente uma destas opções:', mapOps(menus.principal[1]));
}

// ── passeio guiado ──
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
  const ultimo = passo === passos.length - 1;
  agir(() => abrirApp(id), t, ultimo
    ? [['Fim do passeio', menu]]
    : [['Próximo', () => { passo++; mostrarPasso(); }], ['Parar', menu]]);
}

gAvatar.addEventListener('click', () => { if (ocupado) return; gBalao.hidden ? menu() : (gBalao.hidden = true); });
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