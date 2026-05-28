// pagamento.js

// ── 1. Troca de aba (Cartão, Boleto, PIX) ──
function trocarAba(painelId, abaBotao) {
    // Remove "ativa" de todas as abas e painéis
    document.querySelectorAll('.aba').forEach(function(a) {
        a.classList.remove('ativa');
    });
    document.querySelectorAll('.painel').forEach(function(p) {
        p.classList.remove('ativo');
    });

    // Ativa a aba clicada e o painel correspondente
    abaBotao.classList.add('ativa');
    document.getElementById('painel-' + painelId).classList.add('ativo');
}


// ── 2. PIX: troca o tipo de chave ──
let pixAtual = 'cpf'; // guarda qual tipo de chave está selecionado

function trocarPix(tipo, botao) {
    pixAtual = tipo;

    // Remove "ativa" de todos os botões de opção PIX
    document.querySelectorAll('.opcao-pix').forEach(function(b) {
        b.classList.remove('ativa');
    });
    botao.classList.add('ativa');

    // Atualiza o label e placeholder do campo de acordo com o tipo
    var label = document.getElementById('pix-label');
    var input = document.getElementById('pix-input');

    if (tipo === 'cpf') {
        label.textContent = 'CPF';
        input.placeholder = '000.000.000-00';
        input.maxLength = 14;
    } else if (tipo === 'telefone') {
        label.textContent = 'Telefone';
        input.placeholder = '(11) 99999-9999';
        input.maxLength = 15;
    } else {
        label.textContent = 'E-mail';
        input.placeholder = 'seuemail@exemplo.com';
        input.maxLength = 60;
    }

    input.value = ''; // limpa o campo ao trocar
}

// Aplica máscara no campo PIX conforme o tipo selecionado
function mascaraPix(input) {
    var v = input.value.replace(/\D/g, ''); // remove tudo que não é número

    if (pixAtual === 'cpf') {
        v = v.slice(0, 11); // máximo 11 dígitos
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        input.value = v;

    } else if (pixAtual === 'telefone') {
        v = v.slice(0, 11);
        v = v.replace(/(\d{2})(\d)/, '($1) $2');
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
        input.value = v;

    }
    // e-mail: sem máscara, deixa digitar livremente
}


// ── 3. Formatação do número do cartão ──
function formatarCartao(input) {
    // Remove tudo que não é número
    var v = input.value.replace(/\D/g, '');
    v = v.slice(0, 16); // máximo 16 dígitos

    // Agrupa de 4 em 4 com espaço
    var grupos = v.match(/.{1,4}/g);
    input.value = grupos ? grupos.join(' ') : v;
}

// Formatação da validade (MM/AA)
function formatarValidade(input) {
    var v = input.value.replace(/\D/g, '');
    v = v.slice(0, 4);
    if (v.length >= 3) {
        v = v.slice(0, 2) + '/' + v.slice(2);
    }
    input.value = v;
}


// ── 4. Copiar código do boleto ──
function copiarCodigo() {
    var codigo = document.getElementById('codigo-boleto').textContent.trim();
    navigator.clipboard.writeText(codigo);

    // Mostra feedback visual por 2 segundos
    var btn = document.querySelector('.btn-copiar');
    btn.textContent = '✅ Copiado!';
    setTimeout(function() {
        btn.textContent = '📋 Copiar código';
    }, 2000);
}


// ── 5. Salvar e avançar para a revisão ──
function salvarEAvancar() {
    // Descobre qual aba está ativa pelo texto do botão
    var abaAtiva = document.querySelector('.aba.ativa');
    var metodo = abaAtiva ? abaAtiva.textContent.trim() : 'Cartão de Crédito';

    // Monta a descrição detalhada conforme o método escolhido
    var descricao = metodo;

    if (metodo === '💳 Cartão de Crédito') {
        var parcela = document.querySelector('#painel-cartao select');
        descricao = parcela ? 'Cartão de Crédito – ' + parcela.value : 'Cartão de Crédito';

    } else if (metodo === '📱 PIX') {
        var chave = document.getElementById('pix-input').value.trim();
        descricao = chave ? 'PIX (' + chave + ')' : 'PIX';

    } else if (metodo === '🧾 Boleto') {
        descricao = 'Boleto Bancário';
    }

    // Salva metodo E descricao no localStorage
    localStorage.setItem('petcare_pagamento', JSON.stringify({ metodo: metodo, descricao: descricao }));

    window.location.href = 'revisao.html';
}