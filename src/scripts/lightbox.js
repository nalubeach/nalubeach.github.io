// Classe Lightbox para exibir imagens em tela cheia
class Lightbox {
  constructor() {
    this.createLightboxContainer();
    this.initGalleryItems();
  }

  // Criar o container do lightbox
  createLightboxContainer() {
    const lightboxHTML = `
      <div class="lightbox">
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img class="lightbox-image" src="" alt="Lightbox Image">
          <div class="lightbox-caption"></div>
          <button class="lightbox-prev">&lsaquo;</button>
          <button class="lightbox-next">&rsaquo;</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    this.lightbox = document.querySelector('.lightbox');
    this.lightboxImage = document.querySelector('.lightbox-image');
    this.lightboxCaption = document.querySelector('.lightbox-caption');
    this.lightboxClose = document.querySelector('.lightbox-close');
    this.lightboxPrev = document.querySelector('.lightbox-prev');
    this.lightboxNext = document.querySelector('.lightbox-next');

    // Adicionar eventos para os controles do lightbox
    this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    this.lightboxPrev.addEventListener('click', () => this.showPrevImage());
    this.lightboxNext.addEventListener('click', () => this.showNextImage());

    // Permitir fechar o lightbox clicando fora da imagem
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Permitir navegação com teclado
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        this.closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        this.showPrevImage();
      } else if (e.key === 'ArrowRight') {
        this.showNextImage();
      }
    });
  }

  // Inicializar os itens da galeria
  initGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    this.images = [];
    this.currentIndex = 0;

    galleryItems.forEach((item, index) => {
      const image = item.querySelector('img');

      if (image) {
        // === CORTA AQUI ===
        // Este bloco impede a ativação do lightbox
        return; // ← Isto impede o clique e o lightbox só para esta galeria
        // === CORTA AQUI ===
  
        this.images.push({
          src: image.src,
          alt: image.alt || 'Gallery Image'
        });
  
        item.classList.add('gallery-item-clickable');
  
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.openLightbox(index);
        });
      }
    });
  }

  // Abrir o lightbox com a imagem específica
  openLightbox(index) {
    if (this.images.length === 0) return;

    this.currentIndex = index;
    const image = this.images[this.currentIndex];

    this.lightboxImage.src = image.src;
    this.lightboxImage.alt = image.alt;
    this.lightboxCaption.textContent = image.alt;

    // Mostrar ou esconder as setas de navegação dependendo do número de imagens
    if (this.images.length <= 1) {
      this.lightboxPrev.style.display = 'none';
      this.lightboxNext.style.display = 'none';
    } else {
      this.lightboxPrev.style.display = 'block';
      this.lightboxNext.style.display = 'block';
    }

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  }

  // Fechar o lightbox
  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
  }

  // Mostrar imagem anterior
  showPrevImage() {
    if (this.images.length <= 1) return;

    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    const image = this.images[this.currentIndex];

    this.lightboxImage.src = image.src;
    this.lightboxImage.alt = image.alt;
    this.lightboxCaption.textContent = image.alt;
  }

  // Mostrar próxima imagem
  showNextImage() {
    if (this.images.length <= 1) return;

    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    const image = this.images[this.currentIndex];

    this.lightboxImage.src = image.src;
    this.lightboxImage.alt = image.alt;
    this.lightboxCaption.textContent = image.alt;
  }
}

// Inicializar o lightbox quando o DOM estiver carregado
function initLightbox() {
  new Lightbox();
}

export { initLightbox };
