// Preencha com o ID do Pixel da Meta para ligar a medição (ex.: '123456789012345').
// Vazio: nenhum cookie é usado e o aviso de cookies não aparece.
const META_PIXEL_ID = '';

const WHATSAPP_NUMBER = '5562985583519';
const DEFAULT_WHATSAPP_TEXT = 'Oi, Heryck! Vi o seu site e quero conversar sobre um sistema para a minha empresa.';
const CONSENT_KEY = 'cookie-consent';
const CAMPAIGN_KEY = 'campaign-ref';

let cookieBannerOpen = false;
let refreshStickyCta = () => {};

function readStorage(storage, key) {
    try {
        return storage.getItem(key);
    } catch (error) {
        return null;
    }
}

function writeStorage(storage, key, value) {
    try {
        storage.setItem(key, value);
    } catch (error) {
        // Navegação privada ou armazenamento bloqueado: segue sem guardar.
    }
}

// Guarda de qual anúncio a visita veio, para aparecer na mensagem do WhatsApp.
function getCampaignRef() {
    const params = new URLSearchParams(window.location.search);
    const parts = ['utm_source', 'utm_campaign', 'utm_content']
        .map((name) => (params.get(name) || '').replace(/[^\w.-]/g, '').slice(0, 40))
        .filter(Boolean);

    if (parts.length) {
        const ref = parts.join('/');
        writeStorage(window.sessionStorage, CAMPAIGN_KEY, ref);
        return ref;
    }

    return readStorage(window.sessionStorage, CAMPAIGN_KEY) || '';
}

function buildWhatsAppUrl(text, ref) {
    const message = ref ? `${text}\n\n(ref: ${ref})` : text;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initWhatsAppLinks() {
    const ref = getCampaignRef();

    document.querySelectorAll('a[data-wa]').forEach((link) => {
        const text = link.getAttribute('data-wa-text') || DEFAULT_WHATSAPP_TEXT;
        link.href = buildWhatsAppUrl(text, ref);

        link.addEventListener('click', () => {
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Contact', { content_name: link.getAttribute('data-wa') });
            }
        });
    });
}

function loadMetaPixel() {
    if (!META_PIXEL_ID || typeof window.fbq === 'function') return;

    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
}

function initCookieConsent() {
    const banner = document.getElementById('cookieBanner');
    if (!META_PIXEL_ID) return;

    const saved = readStorage(window.localStorage, CONSENT_KEY);
    if (saved === 'aceito') {
        loadMetaPixel();
        return;
    }
    if (saved === 'recusado' || !banner) return;

    banner.hidden = false;
    cookieBannerOpen = true;
    refreshStickyCta();

    banner.querySelectorAll('[data-cookie]').forEach((button) => {
        button.addEventListener('click', () => {
            const accepted = button.getAttribute('data-cookie') === 'aceitar';
            writeStorage(window.localStorage, CONSENT_KEY, accepted ? 'aceito' : 'recusado');
            if (accepted) loadMetaPixel();

            banner.hidden = true;
            cookieBannerOpen = false;
            refreshStickyCta();
        });
    });
}

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    function closeMenu() {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
        hamburger?.setAttribute('aria-label', 'Abrir menu');
        document.body.classList.remove('menu-open');
    }

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });

    hamburger?.addEventListener('click', () => {
        const isOpen = Boolean(navMenu?.classList.toggle('active'));
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        document.body.classList.toggle('menu-open', isOpen);
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

// No celular, o botão fixo aparece depois do topo e some na chamada final.
function initStickyCta() {
    const stickyCta = document.querySelector('.sticky-cta');
    const hero = document.getElementById('inicio');
    const finalCta = document.getElementById('contato');
    if (!stickyCta || !hero || !('IntersectionObserver' in window)) return;

    let heroVisible = true;
    let finalVisible = false;

    refreshStickyCta = () => {
        stickyCta.hidden = heroVisible || finalVisible || cookieBannerOpen;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.target === hero) heroVisible = entry.isIntersecting;
            if (entry.target === finalCta) finalVisible = entry.isIntersecting;
        });
        refreshStickyCta();
    }, { threshold: 0.15 });

    observer.observe(hero);
    if (finalCta) observer.observe(finalCta);
}

// Amplia as telas dos projetos sem sair da página.
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || typeof lightbox.showModal !== 'function') return;

    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');

    document.querySelectorAll('.shot a').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const figure = link.closest('.shot');
            const thumb = link.querySelector('img');

            image.src = link.href;
            image.alt = thumb?.alt || '';
            image.classList.toggle('is-phone', Boolean(figure?.classList.contains('shot-phone')));
            caption.textContent = figure?.querySelector('figcaption')?.textContent || '';
            lightbox.showModal();
        });
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target.closest('.lightbox-close') || !event.target.closest('img')) {
            lightbox.close();
        }
    });

    lightbox.addEventListener('close', () => {
        image.removeAttribute('src');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWhatsAppLinks();
    initStickyCta();
    initCookieConsent();
    initLightbox();
});
