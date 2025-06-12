document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizForm');
  if (form) setupDrWhyForm();
});

function setupDrWhyForm() {
  const individual = document.getElementById('individual');
  const team = document.getElementById('team');
  const numGroup = document.getElementById('numPlayersGroup');
  const numPlayers = document.getElementById('numPlayers');
  const teamName = document.getElementById('teamName');
  const nameLabel = document.getElementById('nameLabel');
  const successMsg = document.getElementById('successMessage');
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;

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
      teamName.style.borderColor = '#c15423';
      ok = false;
    } else {
      teamName.style.borderColor = '#5ca096';
    }
    if (team.checked && !numPlayers.value) {
      numPlayers.style.borderColor = '#c15423';
      ok = false;
    } else if (team.checked) {
      numPlayers.style.borderColor = '#5ca096';
    }
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return alert('Preencha todos os campos!');
    submitBtn.textContent = 'A processar...';
    submitBtn.disabled = true;

    const fd = new FormData();
    fd.append('participationType', team.checked ? 'team' : 'individual');
    fd.append('teamName', teamName.value.trim());
    fd.append('numPlayers', team.checked ? numPlayers.value : '');
    fd.append('submittedAt', new Date().toISOString());

    fetch(form.action, { method: 'POST', body: fd })
      .then(r => r.text())
      .then(txt => {
        try {
          const json = JSON.parse(txt);
          if (json.success) {
            showSuccess(teamName.value.trim(), numPlayers.value, team.checked);
          } else {
            alert('Erro interno, tente novamente.');
          }
        } catch (err) {
          console.error('Resposta inválida:', txt);
          alert('Erro inesperado ao submeter. Ver consola.');
        }
      })
      .catch(err => {
        console.error('Erro no envio:', err);
        alert('Erro ao submeter formulário.');
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });

  function showSuccess(name, num, isTeam) {
    form.style.display = 'none';
    const sc = successMsg;
    sc.innerHTML = isTeam
      ? `<h3>Inscrição com Sucesso!</h3><p>Equipa <b>${name}</b> (${num} jogadores) registada.</p><button onclick="location.reload()">Nova</button>`
      : `<h3>Inscrição com Sucesso!</h3><p><b>${name}</b> registado.</p><button onclick="location.reload()">Nova</button>`;
    sc.style.display = 'block';
  }
}
