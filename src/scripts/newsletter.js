// ====== CONFIG ======
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzi7q4JEtEiaufAqtd4qGhS6RO_Ya872fei0O-r1qzuEKYj_We31kHCXGhm9VF57GGF/exec";

// ====== Helpers ======
const LS_CLOSED = "nl_popup_closed";
const LS_SUBMITTED = "nl_popup_submitted";

function show() {
  if (localStorage.getItem(LS_CLOSED) || localStorage.getItem(LS_SUBMITTED)) return;
  const m = document.getElementById("nl-modal");
  if (m) { m.classList.add("active"); m.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; }
}
function hide(persist=true){
  const m = document.getElementById("nl-modal");
  if (m) { m.classList.remove("active"); m.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }
  if (persist) localStorage.setItem(LS_CLOSED,"1");
}
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  // Mostra ao fim de 3s
  setTimeout(show, 3000);

  // Fechar
  document.querySelector(".nl-close")?.addEventListener("click", () => hide(true));
  document.getElementById("nl-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "nl-modal") hide(true);
  });

  // Submit
  const form = document.getElementById("nl-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") return; // bot

    const email = document.getElementById("nl-email").value.trim().toLowerCase();
    const consent = document.getElementById("nl-consent").checked ? "yes" : "no";
    const msg = document.getElementById("nl-msg");

    if (!validEmail(email)) {
      msg.hidden = false; msg.textContent = "Verifica o email, por favor."; msg.style.color = "#b91c1c";
      return;
    }

    try {
      // Envio para Google Apps Script (Sheets)
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

      const data = await res.json().catch(()=>({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "request_failed");

      localStorage.setItem(LS_SUBMITTED,"1");
      msg.hidden = false; msg.textContent = "Obrigado! Iremos avisar-te."; msg.style.color = "#065f46";
      setTimeout(()=> hide(false), 1200);

    } catch (err) {
      console.error(err);
      msg.hidden = false; msg.textContent = "Ups! Tenta novamente em instantes."; msg.style.color = "#b91c1c";
    }
  });
});
