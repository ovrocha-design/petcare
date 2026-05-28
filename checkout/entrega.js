// entrega.js

// Ao carregar a página, preenche os campos se já houver dados salvos
document.addEventListener('DOMContentLoaded', function () {
    const entrega = JSON.parse(localStorage.getItem('petcare_entrega') || '{}');

    if (entrega.cep)         document.getElementById('cep').value         = entrega.cep;
    if (entrega.rua)         document.getElementById('rua').value         = entrega.rua;
    if (entrega.numero)      document.getElementById('numero').value      = entrega.numero;
    if (entrega.complemento) document.getElementById('complemento').value = entrega.complemento;
    if (entrega.bairro)      document.getElementById('bairro').value      = entrega.bairro;
    if (entrega.cidade)      document.getElementById('cidade').value      = entrega.cidade;
    if (entrega.estado)      document.getElementById('estado').value      = entrega.estado;

    // Máscara do CEP
    document.getElementById('cep').addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
        this.value = v;

        // Busca endereço automaticamente quando CEP estiver completo
        if (v.length === 9) buscarCEP(v);
    });
});

// Busca endereço pelo CEP (ViaCEP)
function buscarCEP(cep) {
    const cepLimpo = cep.replace('-', '');
    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(r => r.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('rua').value    = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro     || '';
                document.getElementById('cidade').value = data.localidade  || '';
                document.getElementById('estado').value = data.uf          || '';
            }
        })
        .catch(() => {}); // silencia erros de rede
}

// Salva e avança para pagamento
document.getElementById('btn-ir-para-pagamento').addEventListener('click', function (e) {
    e.preventDefault();

    const rua    = document.getElementById('rua').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const cep    = document.getElementById('cep').value.trim();

    if (!rua || !numero || !cidade || !cep) {
        alert('Por favor, preencha os campos obrigatórios: CEP, Rua, Número e Cidade.');
        return;
    }

    const entrega = {
        cep:         cep,
        rua:         rua,
        numero:      numero,
        complemento: document.getElementById('complemento').value.trim(),
        bairro:      document.getElementById('bairro').value.trim(),
        cidade:      cidade,
        estado:      document.getElementById('estado').value.trim(),
    };

    localStorage.setItem('petcare_entrega', JSON.stringify(entrega));
    window.location.href = 'pagamento.html';
});