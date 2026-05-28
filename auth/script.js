// ============================================
// BANCO DE DADOS (array de usuários)
// ============================================
let usuarios = [];

// ============================================
// CARREGAR do Local Storage
// ============================================
function carregarUsuarios() {
  let dados = localStorage.getItem('usuarios');
  if (dados) {
    usuarios = JSON.parse(dados);
    // Migração: garante que admin sempre tenha isAdmin: true
    let atualizado = false;
    usuarios.forEach(u => {
      if (u.email === 'admin@petcare.com.br' && !u.isAdmin) {
        u.isAdmin = true;
        atualizado = true;
      }
    });
    if (atualizado) salvarUsuarios();

    // Atualiza sessão ativa se for o admin sem o campo
    const logado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (logado && logado.email === 'admin@petcare.com.br' && !logado.isAdmin) {
      logado.isAdmin = true;
      localStorage.setItem('usuarioLogado', JSON.stringify(logado));
    }
  } else {
    // Usuário admin padrão
    usuarios = [
      { nome: "Admin", email: "admin@petcare.com.br", senha: "admin123", isAdmin: true }
    ];
    salvarUsuarios();
  }
}

// ============================================
// SALVAR no Local Storage
// ============================================
function salvarUsuarios() {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// ============================================
// CADASTRAR
// ============================================
function fazerCadastro() {
  let nome = document.getElementById('cadNome').value;
  let email = document.getElementById('cadEmail').value;
  let senha = document.getElementById('cadSenha').value;
  let msg = document.getElementById('msgCadastro');

  // Validar campos
  if (nome == '' || email == '' || senha == '') {
    msg.innerHTML = 'Preencha todos os campos!';
    msg.className = 'mensagem erro';
    return;
  }

  // Validar senha
  if (senha.length < 3) {
    msg.innerHTML = 'Senha deve ter 3+ caracteres!';
    msg.className = 'mensagem erro';
    return;
  }

  // Verificar se email já existe
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email == email) {
      msg.innerHTML = 'E-mail já cadastrado!';
      msg.className = 'mensagem erro';
      return;
    }
  }

  // Adicionar novo usuário
  usuarios.push({ nome: nome, email: email, senha: senha, isAdmin: false });
  salvarUsuarios();

  msg.innerHTML = 'Cadastro realizado! Faça login.';
  msg.className = 'mensagem sucesso';

  // Limpar campos
  document.getElementById('cadNome').value = '';
  document.getElementById('cadEmail').value = '';
  document.getElementById('cadSenha').value = '';

  // Voltar para tela de login
  setTimeout(function() {
    mostrarTelaLogin();
    msg.innerHTML = '';
  }, 1500);
}

// ============================================
// LOGIN
// ============================================
function fazerLogin() {
  let email = document.getElementById('loginEmail').value;
  let senha = document.getElementById('loginSenha').value;
  let msg = document.getElementById('msgLogin');

  if (email == '' || senha == '') {
    msg.innerHTML = 'Digite e-mail e senha!';
    msg.className = 'mensagem erro';
    return;
  }

  // Procurar usuário
  let encontrado = null;
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email == email && usuarios[i].senha == senha) {
      encontrado = usuarios[i];
      break;
    }
  }

  if (encontrado) {
    // Salvar usuário logado
    localStorage.setItem('usuarioLogado', JSON.stringify(encontrado));
    msg.innerHTML = 'Login realizado! Redirecionando...';
    msg.className = 'mensagem sucesso';
    
    // Voltar para página inicial
    setTimeout(function() {
      window.location.href = '../index.html';
    }, 1000);
  } else {
    msg.innerHTML = 'E-mail ou senha incorretos!';
    msg.className = 'mensagem erro';
  }
}

// ============================================
// TROCAR TELA
// ============================================
function mostrarTelaCadastro() {
  document.getElementById('telaLogin').classList.add('hidden');
  document.getElementById('telaCadastro').classList.remove('hidden');
  document.getElementById('msgLogin').innerHTML = '';
  document.getElementById('msgCadastro').innerHTML = '';
}

function mostrarTelaLogin() {
  document.getElementById('telaCadastro').classList.add('hidden');
  document.getElementById('telaLogin').classList.remove('hidden');
  document.getElementById('msgLogin').innerHTML = '';
  document.getElementById('msgCadastro').innerHTML = '';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginSenha').value = '';
}

// ============================================
// INICIAR
// ============================================
carregarUsuarios(); 