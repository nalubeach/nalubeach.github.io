// Classe para gerenciar a validação do formulário de reserva
class ReservationForm {
  constructor() {
    this.form = document.getElementById('reservation-form');
    this.bookingModal = document.querySelector('.booking-modal');
    this.closeBtn = this.bookingModal?.querySelector('.close-btn');
    this.reservationButtons = document.querySelectorAll('.btn-reservation');

    this.initFormEvents();
    this.initModalEvents();
  }

  // Inicializar eventos do formulário
  initFormEvents() {
    if (!this.form) return;

    // Adicionando eventos de validação em tempo real para cada campo
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.type !== 'checkbox') {
        input.addEventListener('blur', () => this.validateField(input));
      }
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Evento de envio do formulário
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  // Inicializar eventos do modal
  initModalEvents() {
    if (!this.bookingModal || !this.closeBtn) return;

    // Botão de fechar
    this.closeBtn.addEventListener('click', () => {
      this.bookingModal.classList.remove('active');
    });

    // Fechar ao clicar fora
    this.bookingModal.addEventListener('click', (e) => {
      if (e.target === this.bookingModal) {
        this.bookingModal.classList.remove('active');
      }
    });

    // Abrir modal de reserva ao clicar nos botões de reserva
    if (this.reservationButtons) {
      this.reservationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.bookingModal.classList.add('active');
        });
      });
    }
  }

  // Validar um campo específico
  validateField(field) {
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Validar campo obrigatório
    if (field.required && !field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório';
    } else {
      // Validar email
      if (fieldName === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          errorMessage = 'Por favor, insira um email válido';
        }
      }

      // Validar telefone
      if (fieldName === 'phone' && field.value) {
        // Regex simples para telefone (aceita diversos formatos)
        const phoneRegex = /^[+\d() -]{8,20}$/;
        if (!phoneRegex.test(field.value)) {
          isValid = false;
          errorMessage = 'Por favor, insira um número de telefone válido';
        }
      }

      // Validar data (não permitir datas passadas)
      if (fieldName === 'date' && field.value) {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetar hora para comparação apenas da data

        if (selectedDate < today) {
          isValid = false;
          errorMessage = 'A data não pode ser no passado';
        }
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  // Mostrar erro em um campo
  showFieldError(field, message) {
    // Primeiro, remover erro existente
    this.clearFieldError(field);

    // Adicionar classe de erro ao campo
    field.classList.add('error');

    // Criar e inserir a mensagem de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    // Inserir após o campo ou após seu label
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      formGroup.appendChild(errorElement);
    } else {
      field.insertAdjacentElement('afterend', errorElement);
    }
  }

  // Limpar erro de um campo
  clearFieldError(field) {
    field.classList.remove('error');

    // Remover mensagem de erro se existir
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      const errorElement = formGroup.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  // Validar o formulário completo
  validateForm() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      // Para checkbox, verificar apenas se é obrigatório
      if (input.type === 'checkbox' && input.required) {
        if (!input.checked) {
          isValid = false;
          this.showFieldError(input, 'Você deve aceitar os termos');
        } else {
          this.clearFieldError(input);
        }
      } else {
        // Para outros campos, validar normalmente
        if (!this.validateField(input)) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  // Lidar com envio do formulário
  handleSubmit(e) {
    e.preventDefault();

    if (this.validateForm()) {
      // Simulação de envio bem-sucedido
      this.showSuccessMessage();
    }
  }

  // Mostrar mensagem de sucesso
  showSuccessMessage() {
    // Limpar o formulário
    this.form.innerHTML = `
      <div class="success-message">
        <h3>Reserva Confirmada!</h3>
        <p>Agradecemos sua reserva. Enviaremos um email de confirmação em breve.</p>
        <button type="button" class="btn btn-success">Fechar</button>
      </div>
    `;

    // Adicionar evento para fechar o modal na mensagem de sucesso
    const closeButton = this.form.querySelector('.btn-success');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.bookingModal.classList.remove('active');

        // Após um tempo, restaurar o formulário para futuras reservas
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    }
  }
}

// Inicializar o formulário de reserva quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new ReservationForm();
});
