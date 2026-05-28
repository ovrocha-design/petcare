// checkout.js

function avancarParaEntrega() {
    const nome     = document.getElementById('nome').value.trim();
    const email    = document.getElementById('email').value.trim();
    const cpf      = document.getElementById('cpf').value.trim();
    const telefone = document.getElementById('telefone').value.trim();

    if (nome === '' || email === '' || cpf === '') {
        alert('Por favor, preencha todos os campos obrigatórios (*)!');
        return;
    }

    // Salva direto no localStorage, sem depender do Storage do grupo
    const dadosUsuario = { nome, email, cpf, telefone };
    localStorage.setItem('petcare_usuario', JSON.stringify(dadosUsuario));

    window.location.href = 'entrega.html';
}

// Atualiza o resumo lateral ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    let subtotal = 0;

    // Tenta ler o carrinho do grupo, mas não trava se não existir
    try {
        const itensCarrinho = JSON.parse(localStorage.getItem('petcare_carrinho') || '[]');
        itensCarrinho.forEach(function (p) {
            subtotal += (p.preco * p.qtd);
        });
    } catch (e) {
        subtotal = 0;
    }

    const frete = 19.90;
    const total = subtotal > 0 ? subtotal + frete : 19.90;

    const elSubtotal = document.getElementById('resumo-subtotal');
    const elTotal    = document.getElementById('resumo-total');

    if (elSubtotal) elSubtotal.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
    if (elTotal)    elTotal.textContent    = 'R$ ' + total.toFixed(2).replace('.', ',');
});