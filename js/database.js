// Configuration et fonctions pour la base de données PostgreSQL et l'envoi d'emails
// Teksene - Formulaire de contact

// Configuration de la base de données
const DB_CONFIG = {
  connectionString: 'postgresql://teksene_user:kpg_v8TeRa7ry45@ep-crimson-bonus-ad6n4wm7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
};

// Configuration EmailJS (à configurer avec vos clés)
const EMAIL_CONFIG = {
  serviceId: 'service_mzhk0j5', // À remplacer par votre service ID
  templateId: 'template_619y3pp', // À remplacer par votre template ID
  publicKey: 'orF_et9Zl5ZS43tma' // À remplacer par votre clé publique
};

// Fonction pour insérer les données via Netlify Function
async function insertContactToDatabase(contactData) {
  try {
    // URL de la Netlify Function (automatiquement générée)
    const apiUrl = '/.netlify/functions/contact';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erreur API: ${response.status} - ${errorData.message || 'Erreur inconnue'}`);
    }

    const result = await response.json();
    
    console.log('✅ Réponse Netlify Function:', result);
    return result;

  } catch (error) {
    console.error('❌ Erreur insertion base de données:', error);
    throw error;
  }
}

// Fonction alternative utilisant un service cloud (Supabase, PlanetScale, etc.)
async function insertViaCloudService(contactData) {
  // Cette fonction peut être utilisée avec des services qui supportent les requêtes REST
  // Exemple avec Supabase:
  /*
  const response = await fetch('https://your-project.supabase.co/rest/v1/prises_contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'your-anon-key',
      'Authorization': 'Bearer your-anon-key'
    },
    body: JSON.stringify(contactData)
  });
  */
}

// Fonction pour envoyer l'email de notification
async function sendEmailNotification(contactData) {
  try {
    // Initialiser EmailJS si pas déjà fait
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAIL_CONFIG.publicKey);
    } else {
      throw new Error('EmailJS non disponible');
    }

    // Préparer les données pour l'email
    const emailData = {
      to_email: 'silahi.alihoussene@gmail.com',
      from_name: contactData.nom_complet,
      from_email: contactData.email,
      entreprise: contactData.entreprise,
      whatsapp: contactData.whatsapp || 'Non renseigné',
      besoins: contactData.besoin_principal.join(', '),
      autre_besoin: contactData.autre_besoin || 'Aucun',
      contexte: contactData.contexte_projet,
      maturite: contactData.maturite_data,
      diagnostic: contactData.diagnostic_gratuit ? 'Oui' : 'Non',
      disponibilites: contactData.disponibilite_contact || 'Non renseignées',
      date_soumission: new Date().toLocaleString('fr-FR')
    };

    // Envoyer l'email
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      emailData
    );

    console.log('Email envoyé avec succès:', response);
    return response;

  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
}

// Fonction principale pour traiter le formulaire
async function processContactForm(contactData) {
  const results = {
    database: null,
    email: null,
    errors: []
  };

  try {
    // 1. Insérer en base de données
    try {
      results.database = await insertContactToDatabase(contactData);
      console.log('✅ Données insérées en base:', results.database);
    } catch (dbError) {
      results.errors.push('Erreur base de données: ' + dbError.message);
      console.error('❌ Erreur DB:', dbError);
    }

    // 2. Envoyer l'email de notification
    try {
      results.email = await sendEmailNotification(contactData);
      console.log('✅ Email envoyé:', results.email);
    } catch (emailError) {
      results.errors.push('Erreur envoi email: ' + emailError.message);
      console.error('❌ Erreur Email:', emailError);
    }

    return results;

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    results.errors.push('Erreur générale: ' + error.message);
    return results;
  }
}

// Export des fonctions pour utilisation dans main.js
window.processContactForm = processContactForm;
window.sendEmailNotification = sendEmailNotification;
