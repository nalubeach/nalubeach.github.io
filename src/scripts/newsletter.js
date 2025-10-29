// /src/scripts/newsletter.js

// ====== CONFIG ======
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzi7q4JEtEiaufAqtd4qGhS6RO_Ya872fei0O-r1qzuEKYj_We31kHCXGhm9VF57GGF/exec";

// ====== TIMING ======
const MODAL_SHOW_DELAY_MS = 3000;     // atraso para abrir o popup após load
const SUCCESS_TOAST_MS    = 2000;     // duração do toast de sucesso
const SUCCESS_VISIBLE_MS  = 5000;     // quanto tempo o cartão de sucesso fica antes de fechar

// ====== LocalStorage keys ======
// const LS_CLOSED = "nl_popup_closed"; // NÃO usamos mais
const LS_SUBMITTED = "nl_popup_submitted";

// ====== State ======
let isInSuccess = false; // impede fechar por clique fora enquanto sucesso está ativo

// ====== Utils ======
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

function showModal() {
  // Só NÃO mostra se já estiver registado
  if (localStorage.getItem(LS_SUBMITTED)) return;

  const modal = document.getElementById("nl-modal");
  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const emailInput = document.getElementById("nl-email");
    if (emailInput) setTimeout(() => emailInput.focus(), 50);
  }
}

function hideModal() {
  const modal = document.getElementById("nl-modal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  isInSuccess = false;
}

// Toast (flutuante) para erros/avisos
function showToast(msg, type = "ok", ms = 2600) {
  const toastEl = document.getElementById("nl-toast");
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.remove("ok", "warn");
  toastEl.classList.add(type);
  toastEl.hidden = false;
  // reflow p/ transição
  // eslint-disable-next-line no-unused-expressions
  toastEl.offsetHeight;
  toastEl.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => (toastEl.hidden = true), 250);
  }, ms);
}

// Troca formulário -> cartão de sucesso
function showSuccessCard() {
  const form = document.getElementById("nl-form");
  const successEl = document.getElementById("nl-success");
  if (form) form.hidden = true;
  if (successEl) successEl.hidden = false;
  isInSuccess = true;
}

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  // Se já está registado, nem arma o timeout; caso contrário, mostra sempre
  if (!localStorage.getItem(LS_SUBMITTED)) {
    setTimeout(showModal, MODAL_SHOW_DELAY_MS);
  }

  // Fechar pelo X (fecha só nesta sessão/visita; volta a aparecer no próximo load)
  document.querySelector(".nl-close")?.addEventListener("click", () => hideModal());

  // Fechar ao clicar fora do cartão — bloqueado enquanto sucesso está ativo
  document.getElementById("nl-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "nl-modal") {
      if (isInSuccess) return; // ignora clique fora durante sucesso
      hideModal();
    }
  });

  // Submissão do formulário
  const form = document.getElementById("nl-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") return;

    const emailInput = document.getElementById("nl-email");
    const consentEl  = document.getElementById("nl-consent");
    const submitBtn  = form.querySelector(".nl-submit");

    const email   = (emailInput?.value || "").trim().toLowerCase();
    const consent = consentEl?.checked ? "yes" : "no";

    if (!validEmail(email)) {
      showToast("Hmm, that email doesn’t look right. Try again?", "warn");
      emailInput?.focus();
      return;
    }

    try {
      if (submitBtn) submitBtn.disabled = true;

      const payload = new URLSearchParams({
        email,
        source: location.pathname || "/",
        user_agent: navigator.userAgent || "",
        locale: navigator.language || "",
        consent
      });

      const res = await fetch(GAS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "request_failed");

      // marcou: já subscreveu -> pára de aparecer no futuro
      localStorage.setItem(LS_SUBMITTED, "1");

      showToast("Subscribed!", "ok", SUCCESS_TOAST_MS);
      showSuccessCard();

      // fecha o modal (não precisamos persistir “fechado”)
      setTimeout(() => hideModal(), SUCCESS_VISIBLE_MS);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "warn", 3600);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
