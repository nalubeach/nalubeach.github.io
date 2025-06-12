// --- IMPORTAÇÕES DE MÓDULOS ---
import { initAnimations } from './animations.js';
import { initLightbox } from './lightbox.js';

// --- ELEMENTOS DOM GLOBAIS ---
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const reservationButtons = document.querySelectorAll('.btn-reservation');
const modal = document.getElementById('mothersDay');
const closeModalBtn = document.querySelector('.close-btn');
const bookingModal = document.querySelector('.booking-modal');
const popupImage = document.getElementById('popup-image');
const popupCloseBtn = document.getElementById('popup-close-btn');

// --- FUNCIONALIDADES GERAIS DO SITE ---
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initLightbox();

  if (popupImage && !localStorage.getItem('popupShown')) {
    setTimeout(() => {
      popupImage.classList.add('active');
      localStorage.setItem('popupShown', 'true');
    }, 2000);
  }

  if (popupCloseBtn) {
    popupCloseBtn.addEventListener('click', () => popupImage.classList.remove('active'));
  }

  if (popupImage) {
    popupImage.addEventListener('click', (e) => {
      if (e.target === popupImage) popupImage.classList.remove('active');
    });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (bookingModal) {
    reservationButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.classList.add('active');
      });
    });

    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) bookingModal.classList.remove('active');
    });
  }
});

// --- HEADER SCROLL ---
window.addEventListener('scroll', function () {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// --- PREFERRED DATE RESTRICTION ---
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// --- VIRTUAL TOUR TOGGLE ---
const exploreBtn = document.getElementById('explore-venues-btn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const container = document.getElementById("iframe-container");
    const existingIframe = document.getElementById("collab-frame-UBacSsVP4F4NBFtZt11S7M");

    if (isSafari) {
      window.open("https://cloud.chaos.com/collaboration/n/UBacSsVP4F4NBFtZt11S7M/present", "_blank");
    } else {
      if (existingIframe) {
        container.innerHTML = "";
        container.style.display = "none";
        this.textContent = "Virtual Tour";
      } else {
        container.style.display = "block";
        this.textContent = "Close Virtual Tour";
        const script = document.createElement("script");
        script.defer = true;
        script.type = "text/javascript";
        script.src = "data:text/javascript,document.getElementById('collab-frame-UBacSsVP4F4NBFtZt11S7M').addEventListener('mouseover',function(e){e.target.focus()});";

        const wrapper = document.createElement("div");
        wrapper.className = "responsive-iframe-wrapper";
        const iframe = document.createElement("iframe");
        iframe.id = "collab-frame-UBacSsVP4F4NBFtZt11S7M";
        iframe.src = "https://cloud.chaos.com/collaboration/n/UBacSsVP4F4NBFtZt11S7M/present?embed";
        iframe.allow = "fullscreen; xr-spatial-tracking; accelerometer; gyroscope;";
        iframe.referrerPolicy = "strict-origin";
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("loading", "lazy");
        wrapper.appendChild(iframe);
        container.appendChild(script);
        container.appendChild(wrapper);
      }
    }
  });
}

// --- EMAILJS CORPORATE FORM ---
const corpForm = document.getElementById('corporate-form');
if (corpForm) {
  corpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    emailjs.sendForm('service_j1dzd4n', 'template_r6or7hv', this)
      .then(() => {
        document.getElementById('success-modal').style.display = 'flex';
        this.reset();
      }, (error) => {
        alert('Erro ao enviar: ' + JSON.stringify(error));
      });
  });
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('success-modal').style.display = 'none';
  });
}

// --- DRWHY FORM SCRIPT (sem submissão a backend) ---
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('quizForm');
  if (!form) return;

  const individualRadio = document.getElementById('individual');
  const teamRadio = document.getElementById('team');
  const numPlayersGroup = document.getElementById('numPlayersGroup');
  const numPlayersSelect = document.getElementById('numPlayers');
  const teamNameInput = document.getElementById('teamName');
  const nameLabel = document.getElementById('nameLabel');
  const successMessage = document.getElementById('successMessage');
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent || 'Inscrever-se no Quiz';

  function toggleParticipationType() {
    if (teamRadio.checked) {
      numPlayersGroup.style.display = 'flex';
      nameLabel.textContent = 'Nome da Equipa';
      teamNameInput.placeholder = 'Digite o nome da equipa';
      numPlayersSelect.required = true;
    } else {
      numPlayersGroup.style.display = 'none';
      nameLabel.textContent = 'Nome do Jogador';
      teamNameInput.placeholder = 'Digite o seu nome';
      numPlayersSelect.required = false;
      numPlayersSelect.value = '';
    }
  }

  individualRadio.addEventListener('change', toggleParticipationType);
  teamRadio.addEventListener('change', toggleParticipationType);

  function validateForm() {
    let isValid = true;
    if (!teamNameInput.value.trim()) {
      teamNameInput.style.borderColor = '#c15423';
      isValid = false;
    } else {
      teamNameInput.style.borderColor = '#5ca096';
    }
    if (teamRadio.checked && !numPlayersSelect.value) {
      numPlayersSelect.style.borderColor = '#c15423';
      isValid = false;
    } else if (teamRadio.checked) {
      numPlayersSelect.style.borderColor = '#5ca096';
    }
    return isValid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Simulação de sucesso (sem backend)
    showSuccessMessage({
      participationType: individualRadio.checked ? 'individual' : 'team',
      teamName: teamNameInput.value.trim(),
      numPlayers: teamRadio.checked ? numPlayersSelect.value : ''
    });
  });

  function showSuccessMessage(data) {
    form.style.display = 'none';
    const successContent = document.querySelector('.success-message');
    if (data.participationType === 'team') {
      successContent.innerHTML = `
        <h3 style="color:white;">Inscrição Realizada com Sucesso!</h3>
        <p>A equipa <strong>${data.teamName}</strong> com <strong>${data.numPlayers} jogadores</strong> foi registada.</p>
        <p>Vemo-nos no Nalu Beach Club!</p>
        <button onclick="resetForm()" class="reset-btn">Nova Inscrição</button>
      `;
    } else {
      successContent.innerHTML = `
        <h3 style="color:white;">Inscrição Realizada com Sucesso!</h3>
        <p><strong>${data.teamName}</strong> foi registado(a) para o Quiz.</p>
        <p>Vemo-nos no Nalu Beach Club!</p>
        <button onclick="resetForm()" class="reset-btn">Nova Inscrição</button>
      `;
    }
    successMessage.style.display = 'block';
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(20px)';
    setTimeout(() => {
      successMessage.style.transition = 'all 0.5s ease';
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
    }, 100);
  }

  window.resetForm = function () {
    form.style.display = 'flex';
    successMessage.style.display = 'none';
    form.reset();
    toggleParticipationType();
    teamNameInput.style.borderColor = '#2d6b78';
    numPlayersSelect.style.borderColor = '#2d6b78';
  };

  teamNameInput.addEventListener('input', function () {
    this.style.borderColor = this.value.trim() ? '#5ca096' : '#2d6b78';
  });
  numPlayersSelect.addEventListener('change', function () {
    this.style.borderColor = this.value ? '#5ca096' : '#2d6b78';
  });

  toggleParticipationType();
});
