// Matrix Rain Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%+-/~{[|`]}";
const matrixArray = matrix.split("");

const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const newColumns = canvas.width / fontSize;
    drops.length = 0;
    for (let x = 0; x < newColumns; x++) {
        drops[x] = 1;
    }
});

// Language Management
let currentLang = localStorage.getItem('language') || 'pt';
const typingTextsPt = [
    'Full Stack Developer',
    'PHP | Laravel | Node.js',
    'Vue.js | TypeScript',
    'Desenvolvedor de Software'
];
const typingTextsEn = [
    'Full Stack Developer',
    'PHP | Laravel | Node.js',
    'Vue.js | TypeScript',
    'Software Developer'
];

// Typing Effect
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout = null;
const TYPING_SPEED = 80; // Velocidade fixa para digitar (ms)
const DELETING_SPEED = 50; // Velocidade fixa para deletar (ms)
const PAUSE_BEFORE_DELETE = 2000; // Pausa antes de começar a deletar (ms)
const PAUSE_BEFORE_TYPE = 500; // Pausa antes de começar a digitar novo texto (ms)

function getTypingTexts() {
    return currentLang === 'en' ? typingTextsEn : typingTextsPt;
}

function typeText() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const typingTexts = getTypingTexts();
    if (!typingTexts || typingTexts.length === 0) return;
    
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        // Texto completo, pausa antes de deletar
        isDeleting = true;
        typingTimeout = setTimeout(typeText, PAUSE_BEFORE_DELETE);
    } else if (isDeleting && charIndex === 0) {
        // Texto deletado, muda para próximo
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingTimeout = setTimeout(typeText, PAUSE_BEFORE_TYPE);
    } else {
        // Continua digitando ou deletando
        const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
        typingTimeout = setTimeout(typeText, speed);
    }
}

// Language Toggle Function
function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    localStorage.setItem('language', currentLang);
    updateLanguage();
    updateTypingText();
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-lang-pt], [data-lang-en]');
    elements.forEach(element => {
        const ptText = element.getAttribute('data-lang-pt');
        const enText = element.getAttribute('data-lang-en');
        
        if (ptText && enText) {
            const targetText = currentLang === 'pt' ? ptText : enText;
            
            // Check if text contains HTML
            if (targetText.includes('<strong>') || targetText.includes('<br>') || targetText.includes('<')) {
                element.innerHTML = targetText;
            } else {
                element.textContent = targetText;
            }
        }
    });
    
    // Update language toggle button
    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = currentLang === 'pt' ? 'PT' : 'EN';
    }
}

function updateTypingText() {
    // Limpa timeout anterior se existir
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    textIndex = 0;
    charIndex = 0;
    isDeleting = false;
    typingElement.textContent = '';
    
    // Inicia o efeito após um pequeno delay
    setTimeout(() => {
        typeText();
    }, 300);
}

// Language toggle will be initialized in the main DOMContentLoaded below

// Navigation Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.remove('active');
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Skill Bars Animation
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target;
            const progressValue = progress.getAttribute('data-progress');
            progress.style.width = progressValue + '%';
            skillObserver.unobserve(progress);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Timeline Items Animation
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-50px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    timelineObserver.observe(item);
});

// Project Cards Animation
const projectCards = document.querySelectorAll('.project-card');

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150);
            projectObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    projectObserver.observe(card);
});

// Contact Form Handler with Mailto
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Coleta os dados do formulário
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Desabilita o botão e mostra loading
        submitButton.disabled = true;
        submitButton.textContent = 'Abrindo email...';
        
        // Prepara o mailto
        const subject = encodeURIComponent(`Contato do Portfólio - ${name}`);
        const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);
        const mailtoLink = `mailto:heryckmota@gmail.com?subject=${subject}&body=${body}`;
        
        // Abre o cliente de email
        window.location.href = mailtoLink;
        
        // Mostra mensagem de sucesso
        showFormMessage('Redirecionando para seu cliente de email...', 'success');
        
        // Reseta o formulário após um delay
        setTimeout(() => {
            contactForm.reset();
            resetFormLabels();
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }, 2000);
    });
}

// Função para mostrar mensagens de feedback
function showFormMessage(message, type) {
    // Remove mensagem anterior se existir
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    
    // Insere antes do botão de submit
    const submitButton = contactForm.querySelector('button[type="submit"]');
    contactForm.insertBefore(messageDiv, submitButton);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Função para resetar labels do formulário
function resetFormLabels() {
    if (contactForm) {
        contactForm.querySelectorAll('label').forEach(label => {
            label.style.top = '1rem';
            label.style.left = '1rem';
            label.style.fontSize = '1rem';
            label.style.color = 'var(--text-secondary)';
            label.style.background = 'transparent';
            label.style.padding = '0';
        });
    }
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

// Cursor Glow Effect (optional enhancement)
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        cursor.remove();
    }, 300);
});

// Add glow effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .cursor-glow {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 65, 0.5) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        animation: cursorFade 0.3s ease-out;
    }
    
    @keyframes cursorFade {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }
`;
document.head.appendChild(style);

// Tech Items Hover Effect
document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active state style
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-link.active {
        color: var(--matrix-green) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeStyle);

// Load project images dynamically
function loadProjectImage(imageElement) {
    const imageUrl = imageElement.getAttribute('data-image');
    if (!imageUrl) return;
    
    const img = new Image();
    img.onload = function() {
        imageElement.style.backgroundImage = `url('${imageUrl}')`;
        imageElement.classList.add('loaded');
    };
    img.onerror = function() {
        // Image failed to load, placeholder will remain visible
        imageElement.classList.add('error');
    };
    img.src = imageUrl;
}

// Load all project images and initialize language
document.addEventListener('DOMContentLoaded', () => {
    // Load all project images
    const projectImages = document.querySelectorAll('.project-image[data-image]');
    projectImages.forEach(imageElement => {
        loadProjectImage(imageElement);
    });
    
    // Initialize language system
    if (typeof updateLanguage === 'function' && document.querySelector('.lang-text')) {
        const langText = document.querySelector('.lang-text');
        if (!langText.textContent) {
            updateLanguage();
        }
    }
    
    // Inicia o efeito de digitação após um delay para garantir que o DOM está pronto
    setTimeout(() => {
        const typingElement = document.querySelector('.typing-text');
        if (typingElement && !typingElement.textContent) {
            typeText();
        }
    }, 500);
    
    // Ensure language toggle is set up
    const langToggle = document.getElementById('languageToggle');
    if (langToggle && !langToggle.hasAttribute('data-listener')) {
        langToggle.setAttribute('data-listener', 'true');
        langToggle.addEventListener('click', toggleLanguage);
    }
});

