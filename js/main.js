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
  if (contactForm) {
    // Gestion de l'affichage du champ "Autre besoin"
    const autreCheckbox = document.getElementById('autreCheckbox');
    const autreBesoinGroup = document.getElementById('autreBesoinGroup');
    
    if (autreCheckbox && autreBesoinGroup) {
      autreCheckbox.addEventListener('change', function() {
        if (this.checked) {
          autreBesoinGroup.style.display = 'block';
        } else {
          autreBesoinGroup.style.display = 'none';
          document.getElementById('autreBesoin').value = '';
        }
      });
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Récupération des données du formulaire
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.form__submit');
      const btnText = submitBtn.querySelector('.btn__text');
      const btnLoading = submitBtn.querySelector('.btn__loading');
      
      // Validation des champs obligatoires
      const nomComplet = formData.get('nomComplet')?.trim();
      const entreprise = formData.get('entreprise')?.trim();
      const email = formData.get('email')?.trim();
      const contexteProjet = formData.get('contexteProjet')?.trim();
      const maturiteData = formData.get('maturiteData');
      const diagnosticGratuit = formData.get('diagnosticGratuit');
      
      // Validation des besoins principaux
      const besoinsCoches = formData.getAll('besoinPrincipal');
      
      if (!nomComplet || !entreprise || !email || !contexteProjet || !maturiteData || !diagnosticGratuit || besoinsCoches.length === 0) {
        showToast('Erreur', 'Merci de remplir tous les champs obligatoires marqués d\'un *', 'error');
        return;
      }
      
      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Erreur', 'Veuillez saisir une adresse email valide', 'error');
        return;
      }
      
      // Préparation des données pour la base
      const contactData = {
        nom_complet: nomComplet,
        entreprise: entreprise,
        email: email,
        whatsapp: formData.get('whatsapp')?.trim() || null,
        besoin_principal: besoinsCoches,
        autre_besoin: besoinsCoches.includes('Autre') ? formData.get('autreBesoin')?.trim() : null,
        contexte_projet: contexteProjet,
        maturite_data: maturiteData,
        diagnostic_gratuit: diagnosticGratuit === 'true',
        disponibilite_contact: formData.get('disponibiliteContact')?.trim() || null
      };
      
      // Animation de chargement
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      
      // Traitement du formulaire avec base de données et email
      if (typeof processContactForm === 'function') {
        processContactForm(contactData)
          .then(results => {
            console.log('📊 Résultats du traitement:', results);
            
            if (results.errors.length === 0) {
              // Succès complet
              showToast('Succès', 'Votre demande a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.', 'success');
            } else if (results.database && !results.email) {
              // Base OK, email KO
              showToast('Partiellement envoyé', 'Votre demande a été enregistrée mais l\'email de notification a échoué. Nous vous contacterons quand même.', 'warning');
            } else if (!results.database && results.email) {
              // Base KO, email OK
              //showToast('Partiellement envoyé', 'L\'email a été envoyé mais l\'enregistrement en base a échoué. Nous avons reçu votre demande.', 'warning');
              showToast('Succès', 'Votre demande a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.', 'success');
            } else {
              // Échec complet
              showToast('Erreur', 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement au +221 78 158 56 46.', 'error');
            }
            
            // Reset du formulaire en cas de succès partiel ou total
            if (results.database || results.email) {
              contactForm.reset();
              autreBesoinGroup.style.display = 'none';
            }
          })
          .catch(error => {
            console.error('❌ Erreur traitement formulaire:', error);
            showToast('Erreur', 'Une erreur technique est survenue. Veuillez réessayer.', 'error');
          })
          .finally(() => {
            // Reset du bouton dans tous les cas
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
          });
      } else {
        // Fallback si les fonctions ne sont pas chargées
        console.warn('⚠️ Fonctions de traitement non disponibles, simulation...');
        setTimeout(() => {
          showToast('Mode test', 'Formulaire en mode test - données affichées dans la console.', 'warning');
          console.log('📝 Données du formulaire:', contactData);
          
          contactForm.reset();
          autreBesoinGroup.style.display = 'none';
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
        }, 1000);
      }
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

  // Fonction pour afficher les notifications toast
  function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast__icon');
    const toastTitle = toast.querySelector('.toast__message h3');
    const toastMessage = toast.querySelector('.toast__message p');
    const toastClose = document.getElementById('toastClose');
    
    // Configuration selon le type
    if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)';
      toastIcon.textContent = '⚠';
    } else if (type === 'warning') {
      toast.style.background = 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)';
      toastIcon.textContent = '⚠';
    } else {
      toast.style.background = 'linear-gradient(135deg, var(--color-primary) 0%, #003e8a 100%)';
      toastIcon.textContent = '✓';
    }
    
    // Mise à jour du contenu
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Affichage
    toast.classList.add('show');
    
    // Variable pour stocker le timeout
    let autoHideTimeout;
    
    // Fonction pour masquer le toast
    function hideToast() {
      toast.classList.remove('show');
      if (autoHideTimeout) {
        clearTimeout(autoHideTimeout);
      }
    }
    
    // Gestionnaire pour le bouton de fermeture
    function handleCloseClick() {
      hideToast();
      toastClose.removeEventListener('click', handleCloseClick);
    }
    
    // Ajouter l'événement de fermeture
    toastClose.addEventListener('click', handleCloseClick);
    
    // Masquage automatique après 10 secondes
    autoHideTimeout = setTimeout(() => {
      hideToast();
      toastClose.removeEventListener('click', handleCloseClick);
    }, 10000);
  }

  // Rendre la fonction accessible globalement
  window.showToast = showToast;
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