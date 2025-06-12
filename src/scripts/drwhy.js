// Dr. Why Quiz Registration Form JavaScript

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('quizForm');
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

    submitBtn.innerHTML = 'A processar...';
    submitBtn.disabled = true;

const formData = {
  participationType: individualRadio.checked ? 'individual' : 'team',
  teamName: teamNameInput.value.trim(),
  numPlayers: teamRadio.checked ? numPlayersSelect.value : '',
  submittedAt: new Date().toISOString()
};

const scriptURL = 'https://script.google.com/macros/s/AKfycbx-ZHqfPLNt0dqLB6q_R919e-dgOYvRQAj2VWoOc3GORpEZGPcnniGm4IrEDjjd62ER/exec';

const encoded = new URLSearchParams(formData);

fetch(scriptURL, {
  method: 'POST',
  body: encoded, // 👈 NÃO usar JSON!
})
.then(res => res.json())
.then(result => {
  if (result.success) {
    showSuccessMessage(formData);
  } else {
    alert('Erro ao submeter o formulário.');
  }
})
.catch(error => {
  console.error('Erro:', error);
  alert('Erro ao submeter o formulário.');
})
.finally(() => {
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
});


  function showSuccessMessage(data) {
    form.style.display = 'none';

    const successContent = document.querySelector('.success-message');
    if (data.participationType === 'team') {
      successContent.innerHTML = `
        <h3 style="color:white;">Inscrição Realizada com Sucesso!</h3>
        <p>A equipa <strong>${data.teamName}</strong> com <strong>${data.numPlayers} jogadores</strong> foi registada para o Quiz.</p>
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
