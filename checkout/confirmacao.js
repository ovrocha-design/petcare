// confirmacao.js

document.addEventListener('DOMContentLoaded', function () {

    // Usa o número gerado em revisao.js, ou gera um fallback
    const numero = localStorage.getItem('petcare_numero_pedido')
        || 'PET-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('codigo-pedido').textContent = numero;

    // Limpa os dados temporários do checkout
    localStorage.removeItem('petcare_entrega');
    localStorage.removeItem('petcare_pagamento');
    localStorage.removeItem('petcare_numero_pedido');
});