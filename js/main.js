// main.js - JS principal du site Teksene
// Scroll fluide, menu actif, animations, anti-robot formulaire, compteur dynamique

document.addEventListener('DOMContentLoaded', function () {
  // Scroll fluide sur menu et boutons
  const navLinks = document.querySelectorAll('.nav__link, .header__cta, .btn--primary');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  // Activation du lien courant au scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', function () {
    let scrollPos = window.scrollY + 80;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        document.querySelectorAll('.nav__link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Animation d'apparition sur scroll (services, steps, membres, stats)
  const revealElements = document.querySelectorAll('.service, .step, .membre, .stat');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.92;
    revealElements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Compteur animé pour leads
  const leadsCount = document.getElementById('leadsCount');
  if (leadsCount) {
    let start = 0;
    const end = 3;
    const duration = 1200;
    const stepTime = Math.abs(Math.floor(duration / end));
    function animateCount() {
      let current = start;
      const timer = setInterval(() => {
        current++;
        leadsCount.textContent = current;
        if (current >= end) clearInterval(timer);
      }, stepTime);
    }
    // Lance l'animation quand l'élément est visible
    function onScrollCount() {
      const rect = leadsCount.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && leadsCount.textContent === '0') {
        animateCount();
        window.removeEventListener('scroll', onScrollCount);
      }
    }
    window.addEventListener('scroll', onScrollCount);
    onScrollCount();
  }

  // Génération et vérification anti-robot
  const antiRobotQuestion = document.getElementById('antiRobotQuestion');
  const antiRobotInput = document.getElementById('antiRobot');
  let antiRobotAnswer = null;
  function generateAntiRobot() {
    // Génère une question simple aléatoire
    const a = Math.floor(Math.random() * 6) + 2; // 2 à 7
    const b = Math.floor(Math.random() * 5) + 2; // 2 à 6
    antiRobotAnswer = a + b;
    antiRobotQuestion.textContent = `Combien font ${a} + ${b} ?`;
    antiRobotInput.value = '';
  }
  if (antiRobotQuestion && antiRobotInput) generateAntiRobot();

  // Gestion du formulaire de contact
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Vérification anti-robot
      if (parseInt(antiRobotInput.value, 10) !== antiRobotAnswer) {
        formMessage.textContent = 'Réponse anti-robot incorrecte.';
        formMessage.style.color = '#d32f2f';
        generateAntiRobot();
        return;
      }
      // Vérification des champs
      const nom = contactForm.nom.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      if (!nom || !email || !message) {
        formMessage.textContent = 'Merci de remplir tous les champs.';
        formMessage.style.color = '#d32f2f';
        return;
      }
      // Email simple regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMessage.textContent = 'Adresse email invalide.';
        formMessage.style.color = '#d32f2f';
        return;
      }
      // Simulation d'envoi (à intégrer avec EmailJS, Formspree, etc.)
      formMessage.textContent = 'Envoi en cours...';
      formMessage.style.color = '#0057B7';
      setTimeout(() => {
        formMessage.textContent = 'Votre message a bien été envoyé !';
        formMessage.style.color = '#388e3c';
        contactForm.reset();
        generateAntiRobot();
      }, 1200);
    });
  }

  // Menu hamburger responsive
  const navHamburger = document.getElementById('navHamburger');
  const navMenu = document.getElementById('navMenu');
  if (navHamburger && navMenu) {
    navHamburger.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('nav--open');
      navHamburger.classList.toggle('open', isOpen);
      navHamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Fermer le menu après clic sur un lien
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', function () {
        navMenu.classList.remove('nav--open');
        navHamburger.classList.remove('open');
        navHamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Animation CTA : arrêt dans la section contact
  const ctaBtn = document.querySelector('.header__cta');
  const contactSection = document.getElementById('contact');
  function toggleCtaAnimation() {
    if (!ctaBtn || !contactSection) return;
    const rect = contactSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      ctaBtn.style.animationPlayState = 'paused';
    } else {
      ctaBtn.style.animationPlayState = 'running';
    }
  }
  window.addEventListener('scroll', toggleCtaAnimation);
  toggleCtaAnimation();
});

// Apparition animée (fade-in) pour les éléments révélés
const style = document.createElement('style');
style.innerHTML = `
  .service, .step, .membre, .stat {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1);
  }
  .service.visible, .step.visible, .membre.visible, .stat.visible {
    opacity: 1;
    transform: none;
  }
`;
document.head.appendChild(style); 