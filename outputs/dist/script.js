// Keep every conversion link on the exact WhatsApp destination supplied by Estrutec.
const whatsappUrl = 'https://wa.me/551196278767?text=Ol%C3%A1%20vi%20dos%20an%C3%BAncios%20e%20quero%20fazer%20um%20or%C3%A7amento';
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = whatsappUrl;
});
// Native details remain usable even when JavaScript is unavailable.
document.querySelectorAll('.questions details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.questions details').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});
