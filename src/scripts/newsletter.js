// /src/scripts/newsletter.js

// ====== CONFIG ======
const GAS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzi7q4JEtEiaufAqtd4qGhS6RO_Ya872fei0O-r1qzuEKYj_We31kHCXGhm9VF57GGF/exec";

// ====== TIMING ======
const MODAL_SHOW_DELAY_MS = 3000; // atraso para abrir o popup após load

// ====== LocalStorage keys ======
const LS_SUBMITTED = "nl_popup_submitted";

// ====== Utils ======
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

function showModal() {
  // Só não mostra se já estiver registado
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
}

// Toast (usado só para erros/avisos)
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

// Mostra apenas o cartão de sucesso e esconde o resto
function showSuccessCard() {
  const right = document.querySelector(".nl-right");
  const successEl = document.getElementById("nl-success");

  // Esconde TODOS os irmãos (título, textos, form, etc.) excepto #nl-success e #nl-toast
  if (right) {
    Array.from(right.children).forEach((ch) => {
      if (ch.id !== "nl-success" && ch.id !== "nl-toast") ch.hidden = true;
    });
    right.classList.add("success-state"); // para estilos (fundo escuro + texto branco)
  }

  if (successEl) {
    // Força os 3 textos exatamente como pediste
    const h3 = successEl.querySelector("h3") || document.createElement("h3");
    const p1 = successEl.querySelector("p:nth-of-type(1)") || document.createElement("p");
    const p2 = successEl.querySelector("p:nth-of-type(2)") || document.createElement("p");

    h3.textContent = "You're in!";
    p1.textContent = "Thanks for subscribing — we'll be in touch soon.";
    // sol monocromático (unicode) e deixamos o CSS controlar a cor
    p2.innerHTML = 'See you in Summer 2026 <span class="sun" aria-hidden="true">☀</span>';

    successEl.innerHTML = ""; // limpa qualquer markup anterior
    successEl.appendChild(h3);
    successEl.appendChild(p1);
    successEl.appendChild(p2);

    // Centro total + tipografia branca
    successEl.classList.add("nl-success-centered");
    successEl.hidden = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Se não estiver registado, mostra sempre após o delay
  if (!localStorage.getItem(LS_SUBMITTED)) {
    setTimeout(showModal, MODAL_SHOW_DELAY_MS);
  }

  // Fechar pelo X
  document.querySelector(".nl-close")?.addEventListener("click", () => hideModal());

  // Fechar ao clicar fora do cartão
  document.getElementById("nl-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "nl-modal") hideModal();
  });

  // Submissão do formulário
  const form = document.getElementById("nl-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") return;

    const emailInput = document.getElementById("nl-email");
    const consentEl = document.getElementById("nl-consent");
    const submitBtn = form.querySelector(".nl-submit");

    const email = (emailInput?.value || "").trim().toLowerCase();
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
        consent,
      });

      const res = await fetch(GAS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "request_failed");

      // marcou: já subscreveu -> pára de aparecer no futuro
      localStorage.setItem(LS_SUBMITTED, "1");

      // MOSTRA só o cartão de sucesso (sem fechar e sem toast de sucesso)
      showSuccessCard();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "warn", 3600);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});

// ===== A11y & UX: focus trap + ESC para fechar =====
(function () {
  const modal = document.getElementById("nl-modal");
  if (!modal) return;

  function ensureId(el, fallbackId) {
    if (!el) return null;
    if (!el.id) el.id = fallbackId;
    return el.id;
  }
  const titleId = ensureId(document.querySelector(".nl-title"), "nl-title-aria");
  const descId = ensureId(
    document.querySelector(".nl-strong, .nl-right p"),
    "nl-desc-aria"
  );

  let lastFocusedBeforeOpen = null;

  const getFocusable = () =>
    modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

  function openModalA11y() {
    lastFocusedBeforeOpen = document.activeElement;
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    if (titleId) modal.setAttribute("aria-labelledby", titleId);
    if (descId) modal.setAttribute("aria-describedby", descId);
    const f = getFocusable();
    if (f.length) f[0].focus();
  }

  function closeModalA11y() {
    modal.removeAttribute("aria-modal");
    if (lastFocusedBeforeOpen && lastFocusedBeforeOpen.focus) {
      lastFocusedBeforeOpen.focus();
    }
  }

  // Hook nas funções existentes para aplicar A11y automaticamente
  const _showModal = showModal;
  window.showModal = function () {
    _showModal();
    if (modal.classList.contains("active")) openModalA11y();
  };

  const _hideModal = hideModal;
  window.hideModal = function (...args) {
    _hideModal(...args);
    closeModalA11y();
  };

  // Trap de foco e tecla ESC
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideModal();
      return;
    }
    if (e.key !== "Tab") return;

    const focusables = Array.from(getFocusable()).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
