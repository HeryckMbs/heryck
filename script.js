const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentLang = localStorage.getItem('language') === 'en' ? 'en' : 'pt';
let typingTimeout = null;
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingTexts = {
    pt: [
        'Laravel, PHP e Livewire',
        'APIs, ERPs e integrações',
        'Vue.js, Node.js e TypeScript',
        'Arquitetura para sistemas reais'
    ],
    en: [
        'Laravel, PHP, and Livewire',
        'APIs, ERPs, and integrations',
        'Vue.js, Node.js, and TypeScript',
        'Architecture for real systems'
    ]
};

const uiText = {
    loadingEmail: {
        pt: 'Abrindo e-mail...',
        en: 'Opening email...'
    },
    emailSuccess: {
        pt: 'Redirecionando para seu cliente de e-mail...',
        en: 'Redirecting to your email client...'
    }
};

function translate(key) {
    return uiText[key]?.[currentLang] || uiText[key]?.pt || '';
}

function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]</>=+-_';
    const matrixArray = matrix.split('');
    const fontSize = 15;
    let drops = [];

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const columns = Math.ceil(window.innerWidth / fontSize);
        drops = Array.from({ length: columns }, () => 1);
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(7, 8, 8, 0.08)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = 'rgba(116, 242, 189, 0.55)';
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((drop, index) => {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, index * fontSize, drop * fontSize);

            if (drop * fontSize > window.innerHeight && Math.random() > 0.985) {
                drops[index] = 0;
            }

            drops[index]++;
        });
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.setInterval(drawMatrix, 70);
}

function getTypingTexts() {
    return typingTexts[currentLang] || typingTexts.pt;
}

function typeText() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const options = getTypingTexts();
    const currentText = options[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingTimeout = window.setTimeout(typeText, 1800);
        return;
    }

    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % options.length;
        typingTimeout = window.setTimeout(typeText, 450);
        return;
    }

    typingTimeout = window.setTimeout(typeText, isDeleting ? 38 : 70);
}

function updateTypingText() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    if (typingTimeout) {
        window.clearTimeout(typingTimeout);
    }

    textIndex = 0;
    charIndex = getTypingTexts()[0].length;
    isDeleting = true;
    typingElement.textContent = getTypingTexts()[0];

    if (prefersReducedMotion) {
        typingElement.textContent = getTypingTexts()[0];
        return;
    }

    typingTimeout = window.setTimeout(typeText, 1800);
}

function updateLanguage() {
    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-lang-pt], [data-lang-en]').forEach((element) => {
        const ptText = element.getAttribute('data-lang-pt');
        const enText = element.getAttribute('data-lang-en');
        const targetText = currentLang === 'pt' ? ptText : enText;

        if (!targetText) return;

        if (targetText.includes('<')) {
            element.innerHTML = targetText;
        } else {
            element.textContent = targetText;
        }
    });

    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = currentLang === 'pt' ? 'PT' : 'EN';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    localStorage.setItem('language', currentLang);
    updateLanguage();
    updateTypingText();
}

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    function closeMenu() {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    });

    hamburger?.addEventListener('click', () => {
        const isOpen = navMenu?.classList.toggle('active');
        hamburger.classList.toggle('active', Boolean(isOpen));
        hamburger.setAttribute('aria-expanded', String(Boolean(isOpen)));
        document.body.classList.toggle('menu-open', Boolean(isOpen));
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            closeMenu();
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        const offset = window.scrollY + 140;
        let current = 'home';

        sections.forEach((section) => {
            if (offset >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    setActiveLink();
    window.addEventListener('scroll', setActiveLink);
}

function initRevealAnimations() {
    const revealItems = document.querySelectorAll('section, .timeline-item, .project-card, .skill-category');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
    });

    revealItems.forEach((item) => {
        item.classList.add('fade-in');
        observer.observe(item);
    });
}

function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        skillBars.forEach((bar) => {
            bar.style.width = `${bar.getAttribute('data-progress')}%`;
        });
        return;
    }

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const progress = entry.target;
            progress.style.width = `${progress.getAttribute('data-progress')}%`;
            skillObserver.unobserve(progress);
        });
    }, { threshold: 0.5 });

    skillBars.forEach((bar) => skillObserver.observe(bar));
}

function loadProjectImage(imageElement) {
    const imageUrl = imageElement.getAttribute('data-image');
    if (!imageUrl) return;

    const image = new Image();
    image.onload = () => {
        imageElement.style.backgroundImage = `url("${imageUrl}")`;
        imageElement.classList.add('loaded');
    };
    image.onerror = () => {
        imageElement.classList.add('error');
    };
    image.src = imageUrl;
}

function initProjectImages() {
    document.querySelectorAll('.project-image[data-image]').forEach(loadProjectImage);
}

function showFormMessage(message, type) {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const existingMessage = contactForm.querySelector('.form-message');
    existingMessage?.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    contactForm.insertBefore(messageDiv, submitButton);

    window.setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        submitButton.disabled = true;
        submitButton.textContent = translate('loadingEmail');

        const subject = encodeURIComponent(`Contato do portfolio - ${name}`);
        const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);

        window.location.href = `mailto:heryckmota@gmail.com?subject=${subject}&body=${body}`;
        showFormMessage(translate('emailSuccess'), 'success');

        window.setTimeout(() => {
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    updateTypingText();
    initMatrix();
    initNavigation();
    initActiveNavigation();
    initRevealAnimations();
    initSkillBars();
    initProjectImages();
    initContactForm();

    document.getElementById('languageToggle')?.addEventListener('click', toggleLanguage);
});
