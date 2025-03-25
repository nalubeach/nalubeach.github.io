// Função para checar se um elemento está visível na viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0
  );
}

// Função para adicionar animações aos elementos quando estiverem visíveis
function handleScrollAnimations() {
  const animElements = document.querySelectorAll('.anim-fade-in, .anim-slide-up, .anim-slide-right, .anim-slide-left');

  animElements.forEach(element => {
    if (isElementInViewport(element) && !element.classList.contains('animated')) {
      element.classList.add('animated');
    }
  });
}

// Aplicar classe de animação inicial aos elementos
function initAnimations() {
  // Elementos que irão aparecer com fade-in
  const fadeElements = document.querySelectorAll('.intro h2, .intro p, .menus h2, .gallery-grid');
  fadeElements.forEach(el => el.classList.add('anim-fade-in'));

  // Elementos que irão deslizar para cima
  const slideUpElements = document.querySelectorAll('.intro-buttons, .menu-features, .partner-logos');
  slideUpElements.forEach(el => el.classList.add('anim-slide-up'));

  // Elementos que irão deslizar da esquerda
  const slideLeftElements = document.querySelectorAll('.footer-intro h4, .footer-column:nth-child(odd)');
  slideLeftElements.forEach(el => el.classList.add('anim-slide-left'));

  // Elementos que irão deslizar da direita
  const slideRightElements = document.querySelectorAll('.gallery-item:nth-child(even), .footer-column:nth-child(even)');
  slideRightElements.forEach(el => el.classList.add('anim-slide-right'));

  // Iniciar verificação de animações na rolagem
  window.addEventListener('scroll', handleScrollAnimations);

  // Verificar elementos visíveis na carga inicial da página
  handleScrollAnimations();
}

export { initAnimations };
