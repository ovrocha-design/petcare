/* ============================================================
   PetCare — js/main.js
   Injeta header e footer. Alterar somente via Pull Request.
   ============================================================ */

/* Detecta se a página está em subpasta e define o prefixo de caminho (_BASE)
   para que todos os links funcionem tanto na raiz quanto em subpastas. */
const _pathParts = window.location.pathname.replace(/\\/g, '/').split('/');
const _parentDir = _pathParts[_pathParts.length - 2] || '';
const _SUBDIRS = ['produtos', 'auth', 'checkout', 'admin'];
const _BASE = _SUBDIRS.includes(_parentDir) ? '../' : '';

/* Ponto de entrada: executa ao carregar a página e inicializa
   header, footer, navegação ativa, badge do carrinho e toast. */
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();
  highlightActiveNav();
  updateCartBadge();
  createToastEl();
});

/* ── HEADER ── */
/* Cria e insere o header no topo da página.
   Adapta os botões de acordo com o estado do usuário
   (visitante, logado ou admin). */
function injectHeader() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  const isAdmin = usuarioLogado && usuarioLogado.isAdmin;

  const adminLink = isAdmin
    ? `<a href="${_BASE}admin/admin.html" class="admin-link">⚙️ Administrador</a>`
    : '';

  const userActions = usuarioLogado
    ? `<span class="user-name">👤 ${usuarioLogado.nome}</span>
       <button class="btn outline sm" onclick="logout()">Sair</button>`
    : `<button class="btn outline sm" onclick="location.href='${_BASE}auth/login.html'">Entrar</button>`;

  const header = document.createElement('header');
  header.id = 'site-header';
  header.innerHTML = `
    <div class="container">
      <a href="${_BASE}index.html" class="logo">
        <div class="logo-icon">🐾</div>
        <span>PetCare</span>
      </a>
      <nav class="main-nav">
        <a href="${_BASE}index.html">Início</a>
        <a href="${_BASE}produtos/produtos.html">Produtos</a>
        <a href="${_BASE}index.html#sobre">Sobre</a>
        <a href="${_BASE}index.html#contato">Contato</a>
        ${adminLink}
      </nav>
      <div class="header-actions">
        <div class="cart-icon" onclick="location.href='${_BASE}checkout/carrinho.html'" title="Carrinho">
          🛒
          <span class="cart-badge" id="cart-badge" style="display:none;">0</span>
        </div>
        ${userActions}
        <button class="btn green sm" onclick="location.href='${_BASE}agendamento.html'">📅 Agendar</button>
        <button class="menu-toggle" onclick="toggleMobileNav()" aria-label="Menu">☰</button>
      </div>
    </div>
  `;
  document.body.prepend(header);

  /* ── MENU MOBILE ── */
  /* Cria o painel lateral de navegação para celular e o overlay escuro ao fundo.
     Clicar no overlay fecha o menu. */
  const mobileNav = document.createElement('div');
  mobileNav.id = 'mobile-nav';
  mobileNav.className = 'mobile-nav';
  mobileNav.innerHTML = `
    <div class="mobile-nav-header">
      <span class="logo"><div class="logo-icon">🐾</div><span>PetCare</span></span>
      <button onclick="toggleMobileNav()" class="mobile-nav-close">✕</button>
    </div>
    <a href="${_BASE}index.html">🏠 Início</a>
    <a href="${_BASE}produtos/produtos.html">🛍️ Produtos</a>
    <a href="${_BASE}banho.html">🛁 Banho e Tosa</a>
    <a href="${_BASE}veterinario.html">🩺 Veterinário</a>
    <a href="${_BASE}hotel.html">🏨 Hotel para Pets</a>
    <a href="${_BASE}index.html#sobre">ℹ️ Sobre</a>
    <a href="${_BASE}index.html#contato">📞 Contato</a>
    <a href="${_BASE}checkout/carrinho.html">🛒 Carrinho</a>
    ${adminLink}
    <hr>
    <a href="${_BASE}auth/login.html" class="btn outline sm" style="margin-top:8px;justify-content:center;">Entrar</a>
    <a href="${_BASE}agendamento.html" class="btn green sm" style="margin-top:8px;justify-content:center;">📅 Agendar</a>
  `;
  document.body.appendChild(mobileNav);

  const mobileOverlay = document.createElement('div');
  mobileOverlay.id = 'mobile-nav-overlay';
  mobileOverlay.onclick = () => toggleMobileNav(false);
  document.body.appendChild(mobileOverlay);
}

/* Alterna a abertura do menu mobile. Trava a rolagem da página enquanto
   o menu está aberto. O parâmetro force permite forçar abrir (true) ou fechar (false). */
function toggleMobileNav(force) {
  const nav     = document.getElementById('mobile-nav');
  const overlay = document.getElementById('mobile-nav-overlay');
  if (!nav) return;
  const abrir = force !== undefined ? force : !nav.classList.contains('aberto');
  nav.classList.toggle('aberto', abrir);
  overlay.classList.toggle('aberto', abrir);
  document.body.style.overflow = abrir ? 'hidden' : '';
}

/* Remove a sessão do usuário do localStorage e redireciona para a página inicial. */
function logout() {
  localStorage.removeItem('usuarioLogado');
  location.href = _BASE + 'index.html';
}

/* ── FOOTER ── */
/* Cria e insere o rodapé no final da página com links de serviços,
   navegação, contato e ano atual gerado automaticamente. */
function injectFooter() {
  const footer = document.createElement('footer');
  footer.id = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo" style="color:#fff;"><div class="logo-icon">🐾</div><span>PetCare</span></div>
          <p>Cuidamos do seu melhor amigo com carinho e profissionalismo desde 2015.</p>
        </div>
        <div class="footer-col">
          <h4>Serviços</h4>
          <a href="${_BASE}banho.html">Banho e Tosa</a>
          <a href="${_BASE}veterinario.html">Consulta Veterinária</a>
          <a href="${_BASE}hotel.html">Hotel para Pets</a>
        </div>
        <div class="footer-col">
          <h4>Links</h4>
          <a href="${_BASE}index.html">Início</a>
          <a href="${_BASE}produtos/produtos.html">Produtos</a>
          <a href="${_BASE}agendamento.html">Agendamento</a>
          <a href="${_BASE}index.html#sobre">Sobre Nós</a>
        </div>
        <div class="footer-col">
          <h4>Contato</h4>
          <a href="${_BASE}index.html#contato">Fale Conosco</a>
          <a href="mailto:contato@petcare.com.br">contato@petcare.com.br</a>
          <a href="tel:+551199999999">(11) 9 9999-9999</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} PetCare. Todos os direitos reservados.</span>
        <span>Feito com amor para amantes de pets</span>
      </div>
    </div>
  `;
  document.body.append(footer);
}

/* ── NAV ATIVO ── */
/* Compara a URL atual com os links do menu e adiciona a classe
   'active' no link correspondente à página aberta. */
function highlightActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#site-header .main-nav a').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
}

/* ── BADGE CARRINHO ── */
/* Lê o carrinho do localStorage, soma as quantidades e exibe
   o total no ícone do carrinho. Oculta o badge se estiver vazio. */
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const carrinho = Storage ? Storage.getList('petcare_carrinho') : [];
  const total = carrinho.reduce((s, i) => s + (i.qtd || 1), 0);
  if (total > 0) { badge.textContent = total; badge.style.display = 'flex'; }
  else badge.style.display = 'none';
}

/* ── TOAST ── */
/* Cria o elemento de notificação (toast) uma única vez na página. */
function createToastEl() {
  if (document.getElementById('toast-el')) return;
  const el = document.createElement('div');
  el.id = 'toast-el';
  el.className = 'toast';
  document.body.append(el);
}

/* Exibe uma mensagem de notificação por 3 segundos.
   O parâmetro tipo define a cor: 'info', 'success' ou 'error'. */
function mostrarToast(msg, tipo = 'info') {
  const el = document.getElementById('toast-el');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast ${tipo}`;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}
