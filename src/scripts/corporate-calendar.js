// Classe para gerenciar o calendário interativo de disponibilidade
class CorporateCalendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentDate = new Date();
    this.selectedDate = null;
    this.availableTimeSlots = {};

    // Configurações do calendário
    this.daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    this.months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Dados simulados de disponibilidade (na prática viria de uma API)
    this.generateMockAvailability();

    // Inicializa o calendário
    this.init();
  }

  // Inicializa o calendário
  init() {
    this.createCalendarUI();
    this.renderCalendar();
    this.setupEventListeners();
  }

  // Gera disponibilidade simulada para os próximos 3 meses
  generateMockAvailability() {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    // Gera disponibilidade aleatória para os próximos 3 meses
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Pula finais de semana e dias atuais e passados
      const day = currentDate.getDay();
      const isWeekend = day === 0 || day === 6;
      const isPast = currentDate < startDate;

      if (!isWeekend && !isPast) {
        const dateString = this.formatDateKey(currentDate);

        // Espaços disponíveis
        const spaces = ['Main Dining Room', 'The Lounge', 'Private Dining Room', 'Jungle Terrace'];
        const availableSpaces = [];

        // Gerar disponibilidade aleatória para cada espaço
        spaces.forEach(space => {
          if (Math.random() > 0.3) { // 70% de chance de estar disponível
            // Horários disponíveis para o espaço
            const timeSlots = [];
            if (Math.random() > 0.4) timeSlots.push('Manhã (8:00 - 12:00)');
            if (Math.random() > 0.3) timeSlots.push('Tarde (13:00 - 17:00)');
            if (Math.random() > 0.5) timeSlots.push('Noite (18:00 - 23:00)');

            if (timeSlots.length > 0) {
              availableSpaces.push({
                name: space,
                timeSlots
              });
            }
          }
        });

        if (availableSpaces.length > 0) {
          this.availableTimeSlots[dateString] = availableSpaces;
        }
      }

      // Avança para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Cria a estrutura básica do UI do calendário
  createCalendarUI() {
    const calendarHTML = `
      <div class="calendar-container">
        <div class="calendar-header">
          <button class="calendar-btn prev-month">&lt;</button>
          <h3 class="calendar-month-year"></h3>
          <button class="calendar-btn next-month">&gt;</button>
        </div>
        <div class="calendar-weekdays"></div>
        <div class="calendar-days"></div>
        <div class="calendar-availability">
          <h4>Selecione uma data para ver a disponibilidade</h4>
          <div class="availability-content"></div>
        </div>
      </div>
    `;

    this.container.innerHTML = calendarHTML;

    // Referências dos elementos
    this.calendarMonthYear = this.container.querySelector('.calendar-month-year');
    this.calendarWeekdays = this.container.querySelector('.calendar-weekdays');
    this.calendarDays = this.container.querySelector('.calendar-days');
    this.availabilityContent = this.container.querySelector('.availability-content');
    this.prevMonthBtn = this.container.querySelector('.prev-month');
    this.nextMonthBtn = this.container.querySelector('.next-month');
  }

  // Configura os event listeners
  setupEventListeners() {
    this.prevMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    this.nextMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });
  }

  // Renderiza o calendário para o mês atual
  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Atualiza o cabeçalho do mês/ano
    this.calendarMonthYear.textContent = `${this.months[month]} ${year}`;

    // Renderiza os dias da semana
    this.renderWeekdays();

    // Renderiza os dias do mês
    this.renderDays(year, month);
  }

  // Renderiza os dias da semana
  renderWeekdays() {
    this.calendarWeekdays.innerHTML = '';

    this.daysOfWeek.forEach(day => {
      const weekdayElement = document.createElement('div');
      weekdayElement.classList.add('calendar-weekday');
      weekdayElement.textContent = day;
      this.calendarWeekdays.appendChild(weekdayElement);
    });
  }

  // Renderiza os dias do mês
  renderDays(year, month) {
    this.calendarDays.innerHTML = '';

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();

    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Dias do mês anterior para completar a primeira semana
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Data atual
    const today = new Date();
    const currentDateFormatted = this.formatDateKey(today);

    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('calendar-day', 'prev-month-day');
      dayElement.textContent = prevMonthLastDay - i;
      this.calendarDays.appendChild(dayElement);
    }

    // Dias do mês atual
    for (let i = 1; i <= totalDays; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('calendar-day');
      dayElement.textContent = i;

      // Verificar se é hoje
      const currentDayDate = new Date(year, month, i);
      const dateKey = this.formatDateKey(currentDayDate);

      if (dateKey === currentDateFormatted) {
        dayElement.classList.add('today');
      }

      // Verificar se é fim de semana
      const dayOfWeek = new Date(year, month, i).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayElement.classList.add('weekend');
      }

      // Verificar se há disponibilidade
      if (this.availableTimeSlots[dateKey]) {
        dayElement.classList.add('available');

        // Adicionar evento de clique
        dayElement.addEventListener('click', () => {
          // Remover seleção anterior
          const selectedDay = this.calendarDays.querySelector('.selected');
          if (selectedDay) {
            selectedDay.classList.remove('selected');
          }

          // Adicionar seleção atual
          dayElement.classList.add('selected');

          // Atualizar disponibilidade
          this.selectedDate = new Date(year, month, i);
          this.updateAvailability();
        });
      } else {
        dayElement.classList.add('unavailable');
      }

      // Verificar se é dia passado
      if (currentDayDate < today && dateKey !== currentDateFormatted) {
        dayElement.classList.add('past');
      }

      this.calendarDays.appendChild(dayElement);
    }

    // Dias do próximo mês para completar a última semana
    const totalCells = 42; // 6 semanas * 7 dias
    const remainingCells = totalCells - (startingDayOfWeek + totalDays);

    for (let i = 1; i <= remainingCells; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('calendar-day', 'next-month-day');
      dayElement.textContent = i;
      this.calendarDays.appendChild(dayElement);
    }
  }

  // Atualiza a seção de disponibilidade com base na data selecionada
  updateAvailability() {
    const dateKey = this.formatDateKey(this.selectedDate);
    const availableSpaces = this.availableTimeSlots[dateKey];

    let html = '';

    if (availableSpaces && availableSpaces.length > 0) {
      html += `
        <h4 class="availability-date">${this.formatDateDisplay(this.selectedDate)}</h4>
        <div class="spaces-list">
      `;

      availableSpaces.forEach(space => {
        html += `
          <div class="space-item">
            <h5>${space.name}</h5>
            <div class="time-slots">
              ${space.timeSlots.map(slot => `
                <div class="time-slot">
                  <span>${slot}</span>
                  <button class="btn-enquire" data-space="${space.name}" data-time="${slot}" data-date="${dateKey}">Consultar</button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      });

      html += `</div>`;
    } else {
      html = `<p>Não há disponibilidade para a data selecionada.</p>`;
    }

    this.availabilityContent.innerHTML = html;

    // Adicionar eventos para os botões de consulta
    const enquireButtons = this.availabilityContent.querySelectorAll('.btn-enquire');
    enquireButtons.forEach(button => {
      button.addEventListener('click', () => {
        const space = button.dataset.space;
        const time = button.dataset.time;
        const date = button.dataset.date;

        this.handleEnquiry(space, time, date);
      });
    });
  }

  // Trata a consulta de disponibilidade
  handleEnquiry(space, time, date) {
    // Formatação da data para exibição
    const dateParts = date.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    // Rolar até o formulário
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
      // Preencher campos do formulário
      const eventTypeSelect = document.getElementById('event-type');
      const dateInput = document.getElementById('date');
      const requirementsTextarea = document.getElementById('requirements');

      if (eventTypeSelect) {
        // Selecionar um tipo de evento com base no espaço
        const typeOptions = eventTypeSelect.options;
        for (let i = 0; i < typeOptions.length; i++) {
          if (typeOptions[i].value !== '') {
            eventTypeSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (dateInput) {
        dateInput.value = date;
      }

      if (requirementsTextarea) {
        requirementsTextarea.value = `Espaço preferido: ${space}\nHorário preferido: ${time}`;
      }

      // Rolar até o formulário
      enquiryForm.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Alternativa: alerta se o formulário não for encontrado
      alert(`Consulta para: ${space} em ${formattedDate} às ${time}. Entre em contato conosco para mais informações.`);
    }
  }

  // Formata a data para usar como chave no objeto de disponibilidade
  formatDateKey(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Formata a data para exibição
  formatDateDisplay(date) {
    const dayOfWeek = this.daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day} de ${month} de ${year}`;
  }
}

// Inicializa o calendário quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new CorporateCalendar('corporate-calendar');
});
