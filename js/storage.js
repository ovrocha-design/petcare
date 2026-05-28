/* ============================================================
   PetCare — storage.js
   CRUD completo via localStorage. NÃO EDITAR — arquivo compartilhado.
   Uso: Storage.get(key) | .set(key, data) | .remove(key) | .clear()
   ============================================================ */

const Storage = (() => {

  /* ---- utilidades internas ---- */
  const _parse = (value) => {
    try { return JSON.parse(value); }
    catch { return value; }
  };

  /* ---- API pública ---- */

  /** Retorna o item (objeto/array/string) ou null */
  function get(key) {
    const raw = localStorage.getItem(key);
    return raw !== null ? _parse(raw) : null;
  }

  /** Salva qualquer valor (serializa automaticamente) */
  function set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /** Remove uma chave */
  function remove(key) {
    localStorage.removeItem(key);
  }

  /** Apaga tudo do localStorage */
  function clear() {
    localStorage.clear();
  }

  /* ---- helpers para listas ---- */

  /** Retorna array da chave (ou [] se vazio) */
  function getList(key) {
    const data = get(key);
    return Array.isArray(data) ? data : [];
  }

  /** Adiciona item à lista da chave (gera id automático se não tiver) */
  function addToList(key, item) {
    const list = getList(key);
    if (!item.id) item.id = Date.now();
    list.push(item);
    set(key, list);
    return item;
  }

  /** Atualiza item na lista pelo id */
  function updateInList(key, id, newData) {
    const list = getList(key);
    const index = list.findIndex(i => i.id == id);
    if (index === -1) return false;
    list[index] = { ...list[index], ...newData };
    set(key, list);
    return list[index];
  }

  /** Remove item da lista pelo id */
  function removeFromList(key, id) {
    const list = getList(key).filter(i => i.id != id);
    set(key, list);
  }

  /** Retorna item da lista pelo id */
  function findInList(key, id) {
    return getList(key).find(i => i.id == id) || null;
  }

  return { get, set, remove, clear, getList, addToList, updateInList, removeFromList, findInList };

})();
const PRODUTOS_PADRAO = [
  {
    id: 1,
    nome: "Ração Premium para Cães",
    descricao: "Alimentação completa e balanceada para cães de todas as idades.",
    preco: 89.90,
    cat: "alimentacao",
    img: "images/produto1.png"
  },
  {
    id: 2,
    nome: "Brinquedo Plastico Osso",
    descricao: "Brinquedo macio com apito interno para diversão.",
    preco: 34.90,
    cat: "brinquedos",
    img: "images/produto2.png"
  },
  {
    id: 3,
    nome: "Mordedor para Cães",
    descricao: "Brinquedo resistente para cães que gostam de morder.",
    preco: 45.90,
    cat: "brinquedos",
    img: "images/produto3.png"
  },
  {
    id: 4,
    nome: "Shampoo Curology",
    descricao: "Elimina pulgas e carrapatos, fórmula suave.",
    preco: 29.90,
    cat: "higiene",
    img: "images/produto4.png"
  },
  {
    id: 5,
    nome: "Oculus para Cães",
    descricao: "Para deiar seu cachorro estiloso e protegido do sol.",
    preco: 19.90,
    cat: "acessorios",
    img: "images/produto5.png"
  },
    {
    id: 6,
    nome: "Arranhados para gatos",
    descricao: "Para deiar seu gato feliz e protegido.",
    preco: 39.90,
    cat: "brinquedos",
    img: "images/produto6.png"
  }
];

function initProdutosPadrao() {
  const KEY_PRODUTOS = 'petcare_produtos';
  const produtosExistentes = Storage.getList(KEY_PRODUTOS);

  if (produtosExistentes.length === 0) {
    PRODUTOS_PADRAO.forEach(produto => {
      Storage.addToList(KEY_PRODUTOS, produto);
    });
    console.log("✅ Produtos padrão carregados!");
  }
}

// Inicializa automaticamente
initProdutosPadrao();
