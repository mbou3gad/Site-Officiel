document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Spam Check (Honeypot)
            const honeypot = document.getElementById('bot-field').value;
            if (honeypot !== '') {
                // Silently drop
                return;
            }
            
            // In a real environment, submit the form via AJAX here.
            // For now, simulate success.
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Envoi en cours...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                
                formMessage.textContent = "Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.";
                formMessage.className = "form-message success";
                contactForm.reset();
            }, 1000);
        });
    }
});
