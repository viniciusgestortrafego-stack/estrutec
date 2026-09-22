// Keep every conversion link on the exact WhatsApp destination supplied by Estrutec.
const whatsappUrl = 'https://wa.me/551196278767?text=Ol%C3%A1%20vi%20dos%20an%C3%BAncios%20e%20quero%20fazer%20um%20or%C3%A7amento';
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = whatsappUrl;
});
const leadForm = document.getElementById('lead-form');
const submitButton = document.getElementById('lead-submit');
const formStatus = document.getElementById('form-status');
const continueLink = document.getElementById('whatsapp-continue');
let pendingLead = null;
let submitting = false;
submitButton.disabled = false;

leadForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;
  const phoneInput = leadForm.elements.telefone;
  phoneInput.setCustomValidity('');
  const phoneDigits = phoneInput.value.replace(/\D/g, '');
  if (!/^(?:55)?[1-9][0-9][0-9]{8,9}$/.test(phoneDigits)) {
    phoneInput.setCustomValidity('Informe um WhatsApp válido com DDD.');
  }
  if (!leadForm.reportValidity()) return;
  const fields = Object.fromEntries(new FormData(leadForm));
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
  const signature = JSON.stringify(fields);
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
      body: JSON.stringify({ ...fields, brand: 'estrutec', requestId: pendingLead.requestId }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('http_error');
    const result = await response.json();
    if (result.ok !== true || result.requestId !== pendingLead.requestId) throw new Error('not_saved');
    formStatus.dataset.state = 'success';
    formStatus.textContent = 'Cadastro recebido! Continue seu atendimento no WhatsApp.';
    continueLink.hidden = false;
    leadForm.reset();
    pendingLead = null;
    window.location.assign(whatsappUrl);
  } catch (error) {
    formStatus.dataset.state = 'error';
    formStatus.textContent = 'Não conseguimos confirmar seu cadastro. Tente novamente ou fale diretamente pelo WhatsApp.';
    continueLink.hidden = false;
  } finally {
    clearTimeout(timeout);
    submitting = false;
    submitButton.disabled = false;
    submitButton.innerHTML = 'Cadastrar e falar no WhatsApp <span aria-hidden="true">↗</span>';
  }
});
leadForm.elements.telefone.addEventListener('input', () => leadForm.elements.telefone.setCustomValidity(''));
// Native details remain usable even when JavaScript is unavailable.
document.querySelectorAll('.questions details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.questions details').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});
