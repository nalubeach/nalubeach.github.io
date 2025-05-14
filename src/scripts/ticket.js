function mostrarPagamento(zona) {
  const secao = document.getElementById('secao-pagamento');
  const info = document.getElementById('zona-escolhida');
  const valorInput = document.getElementById('valor-bilhete');
  const orderIdInput = document.querySelector('input[name="orderId"]');

  let preco = 0;
  let nomeZona = '';
  let prefixo = '';

  switch (zona) {
    case 'golden':
      preco = 3000; // €30
      nomeZona = 'Golden Circle';
      prefixo = 'GOLDEN';
      break;
    case 'premium':
      preco = 2000; // €20
      nomeZona = 'Área Premium';
      prefixo = 'PREMIUM';
      break;
    case 'mobilidade':
      preco = 1500; // €15
      nomeZona = 'Acesso Mobilidade Reduzida';
      prefixo = 'MOB';
      break;
  }

  const orderId = `${prefixo}-${Date.now()}`;

  valorInput.value = preco;
  orderIdInput.value = orderId;
  info.textContent = nomeZona;
  secao.style.display = 'block';

  secao.scrollIntoView({ behavior: 'smooth' });
}

function filtrarEventos(categoria) {
  const cards = document.querySelectorAll('.event-card');
  const botoes = document.querySelectorAll('.filter-btn');

  botoes.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.filter-btn[onclick="filtrarEventos('${categoria}')"]`).classList.add('active');

  cards.forEach(card => {
    const cardCategoria = card.getAttribute('data-category');
    if (categoria === 'all' || cardCategoria === categoria) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}


function filtrarEventos(categoria) {
  const cards = document.querySelectorAll('.event-card');
  const botoes = document.querySelectorAll('.filter-btn');

  botoes.forEach(btn => btn.classList.remove('active'));
  const btnAtivo = document.querySelector(`.filter-btn[data-filter="${categoria}"]`);
  if (btnAtivo) btnAtivo.classList.add('active');

  cards.forEach(card => {
    const cat = card.getAttribute('data-category') || '';
    // Verifica se a categoria está presente na lista de categorias do card
    const categorias = cat.split(' ');
    card.style.display = (categoria === 'all' || categorias.includes(categoria)) ? 'block' : 'none';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const filtro = params.get('filter') || 'all';
  filtrarEventos(filtro);

  const hash = window.location.hash;
  if (hash === '#eventos') {
    const alvo = document.getElementById('eventos');
    if (alvo) {
      setTimeout(() => {
        alvo.scrollIntoView({ behavior: 'smooth' });
      }, 100); // pequena espera para garantir que o DOM carregou
    }
  }
});

