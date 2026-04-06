document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Mobile menu toggle (simplistic implementation for now)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const headerBtn = document.querySelector('.site-header .btn');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (mainNav.style.display === 'flex' || mainNav.style.display === 'block') {
                mainNav.style.display = 'none';
                if(headerBtn) headerBtn.style.display = 'none';
            } else {
                mainNav.style.display = 'flex';
                mainNav.style.flexDirection = 'column';
                mainNav.style.position = 'absolute';
                mainNav.style.top = '100%';
                mainNav.style.left = '0';
                mainNav.style.width = '100%';
                mainNav.style.backgroundColor = '#090c14';
                mainNav.style.padding = '1.5rem';
                mainNav.style.gap = '1.5rem';
                mainNav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                if(headerBtn) {
                    headerBtn.style.display = 'inline-flex';
                    headerBtn.style.position = 'absolute';
                    headerBtn.style.top = 'calc(100% + 150px)';
                    headerBtn.style.left = '1.5rem';
                }
            }
        });
    }

    // 4. Form Submission Simulation
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extracting values
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value;
            const email = document.getElementById('email').value;
            const challenge = document.getElementById('challenge').value;
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // Simulating loading state for a better UX
            submitBtn.innerText = 'Redirecionando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Formatting the message for WhatsApp
            const message = `Olá, sou o(a) *${name}* da empresa *${company}*.\n\nMeu e-mail de contato é: ${email}\n\n*Meu Desafio:* ${challenge}\n\nGostaria de falar com um especialista sobre as soluções da Metric Scan.`;
            const whatsappUrl = `https://wa.me/5514997481400?text=${encodeURIComponent(message)}`;
            
            setTimeout(() => {
                // Open WhatsApp in a new tab
                window.open(whatsappUrl, '_blank');
                
                // Success feedback on the form
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                formStatus.innerText = 'Redirecionando para o WhatsApp...';
                formStatus.className = 'form-status success';
                
                // Clear status after 5 seconds
                setTimeout(() => {
                    formStatus.innerText = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1000);
        });
    }
});
