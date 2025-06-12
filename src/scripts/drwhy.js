document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizForm');
  if (!form) return;

  const individual = document.getElementById('individual');
  const team = document.getElementById('team');
  const numGroup = document.getElementById('numPlayersGroup');
  const numPlayers = document.getElementById('numPlayers');
  const teamName = document.getElementById('teamName');
  const nameLabel = document.getElementById('nameLabel');
  const successMsg = document.getElementById('successMessage');
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  const scriptURL = 'https://script.google.com/macros/s/AKfycbx-ZHqfPLNt0dqLB6q_R919e-dgOYvRQAj2VWoOc3GORpEZGPcnniGm4IrEDjjd62ER/exec';

  function toggle() {
    if (team.checked) {
      numGroup.style.display = 'flex';
      nameLabel.textContent = 'Nome da Equipa';
      teamName.placeholder = 'Digite o nome da equipa';
      numPlayers.required = true;
    } else {
      numGroup.style.display = 'none';
      nameLabel.textContent = 'Nome do Jogador';
      teamName.placeholder = 'Digite o seu nome';
      numPlayers.required = false;
      numPlayers.value = '';
    }
  }

  individual.addEventListener('change', toggle);
  team.addEventListener('change', toggle);
  toggle();

  function validate() {
    let ok = true;
    if (!teamName.value.trim()) {
      teamName.style.borderColor = '#c15423'; ok = false;
    } else teamName.style.borderColor = '#5ca096';

    if (team.checked && !numPlayers.value) {
      numPlayers.style.borderColor = '#c15423'; ok = false;
    } else if (team.checked) {
      numPlayers.style.borderColor = '#5ca096';
    }

    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return alert('Preencha todos os campos!');

    submitBtn.textContent = 'A processar…';
    submitBtn.disabled = true;

    const payload = {
      participationType: team.checked ? 'team' : 'individual',
      teamName: teamName.value.trim(),
      numPlayers: team.checked ? numPlayers.value : '',
      submittedAt: new Date().toISOString()
    };

    fetch(scriptURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) showSuccess(payload.teamName, payload.numPlayers, payload.participationType === 'team');
        else alert('Erro interno. Tenta novamente.');
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao submeter o formulário.');
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });

  function showSuccess(name, num, isTeam) {
    form.style.display = 'none';
    successMsg.innerHTML = isTeam
      ? `<h3>Inscrição com Sucesso!</h3><p>Equipa <b>${name}</b> (${num} jogadores) registada.</p><button onclick="location.reload()">Nova</button>`
      : `<h3>Inscrição com Sucesso!</h3><p><b>${name}</b> registado(a) para o Quiz.</p><button onclick="location.reload()">Nova</button>`;
    successMsg.style.display = 'block';
  }
});
