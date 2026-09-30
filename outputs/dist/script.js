// Keep every conversion link on the exact WhatsApp destination supplied by Estrutec.
const whatsappUrl = 'https://wa.me/551196278767?text=Ol%C3%A1%20vi%20dos%20an%C3%BAncios%20e%20quero%20fazer%20um%20or%C3%A7amento';
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = whatsappUrl;
});

const track = (event, extra) => {
  (window.dataLayer = window.dataLayer || []).push(Object.assign({ event }, extra));
};

// Every form (the hero form and the popup copy) sends the lead to the same endpoint.
function initLeadForm(form, onSaved) {
  const submitButton = form.querySelector('.lead-submit');
  const formStatus = form.querySelector('.form-status');
  const continueLink = form.querySelector('.whatsapp-continue');
  const submitLabel = submitButton.innerHTML;
  let pendingLead = null;
  let submitting = false;
  submitButton.disabled = false;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    const phoneInput = form.elements.telefone;
    phoneInput.setCustomValidity('');
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (!/^(?:55)?[1-9][0-9][0-9]{8,9}$/.test(phoneDigits)) {
      phoneInput.setCustomValidity('Informe um WhatsApp válido com DDD.');
    }
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(fields)) fields[key] = fields[key].trim();
    if (fields.nome.length < 2 || fields.cidade.length < 2) {
      formStatus.dataset.state = 'error';
      formStatus.textContent = 'Preencha seu nome e sua cidade com pelo menos 2 caracteres.';
      return;
    }
    if (fields.website) return;
    const endpoint = window.ESTRUTEC_LEAD_ENDPOINT;
    if (!endpoint) {
      formStatus.dataset.state = 'error';
      formStatus.textContent = 'O cadastro está temporariamente indisponível. Fale com a equipe pelo WhatsApp.';
      continueLink.hidden = false;
      return;
    }
    // Reuse the request ID for retries of identical data: a lost response cannot create a second row.
    const origem = form.dataset.origem || '';
    const signature = JSON.stringify(fields) + origem;
    if (!pendingLead || pendingLead.signature !== signature) {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 15) | 64;
      bytes[8] = (bytes[8] & 63) | 128;
      const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
      pendingLead = { signature, requestId: `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}` };
    }
    submitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando cadastro…';
    formStatus.dataset.state = 'pending';
    formStatus.textContent = 'Aguarde a confirmação do seu cadastro.';
    continueLink.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', redirect: 'follow', credentials: 'omit',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...fields, origem, brand: 'estrutec', requestId: pendingLead.requestId }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('http_error');
      const result = await response.json();
      if (result.ok !== true || result.requestId !== pendingLead.requestId) throw new Error('not_saved');
      formStatus.dataset.state = 'success';
      formStatus.textContent = 'Cadastro recebido! Continue seu atendimento no WhatsApp.';
      continueLink.hidden = false;
      track('lead_form_submit', { origem });
      form.reset();
      pendingLead = null;
      if (onSaved) onSaved();
      window.location.assign(whatsappUrl);
    } catch (error) {
      formStatus.dataset.state = 'error';
      formStatus.textContent = 'Não conseguimos confirmar seu cadastro. Tente novamente ou fale diretamente pelo WhatsApp.';
      continueLink.hidden = false;
    } finally {
      clearTimeout(timeout);
      submitting = false;
      submitButton.disabled = false;
      submitButton.innerHTML = submitLabel;
    }
  });
  form.elements.telefone.addEventListener('input', () => form.elements.telefone.setCustomValidity(''));
  return {
    reset() {
      formStatus.textContent = '';
      delete formStatus.dataset.state;
      continueLink.hidden = true;
    }
  };
}

const heroForm = document.getElementById('lead-form');
initLeadForm(heroForm);

// Popup: a copy of the hero form. Without JavaScript the buttons still open WhatsApp directly.
const heroPanel = heroForm.closest('.lead-panel');
const modal = document.createElement('dialog');
modal.id = 'lead-modal';
modal.setAttribute('aria-labelledby', 'lead-modal-title');
const modalPanel = heroPanel.cloneNode(true);
modalPanel.removeAttribute('id');
modalPanel.querySelector('h2').id = 'lead-modal-title';
const modalForm = modalPanel.querySelector('form');
modalForm.removeAttribute('id');
const closeButton = document.createElement('button');
closeButton.type = 'button';
closeButton.className = 'modal-close';
closeButton.setAttribute('aria-label', 'Fechar');
closeButton.textContent = '×';
modal.append(closeButton, modalPanel);
document.body.append(modal);
const modalController = initLeadForm(modalForm, () => modal.close());
closeButton.addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

document.addEventListener('click', event => {
  const link = event.target.closest('a[data-whatsapp]');
  if (!link || link.closest('form') || link.closest('dialog')) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (typeof modal.showModal !== 'function') return;
  event.preventDefault();
  const label = link.textContent.replace(/[↗↑]/g, '').trim();
  modalForm.dataset.origem = 'botao: ' + label;
  modalController.reset();
  track('lead_form_open', { origem: label });
  modal.showModal();
  modalForm.elements.nome.focus();
});

// Native details remain usable even when JavaScript is unavailable.
document.querySelectorAll('.questions details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.questions details').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});
