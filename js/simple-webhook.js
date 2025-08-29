// Solution simple avec webhook pour PostgreSQL
// Alternative à database.js qui utilise un service externe

// Configuration du webhook (remplacer par votre URL)
const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY/'; // URL Zapier
// ou
// const WEBHOOK_URL = 'https://hook.eu1.make.com/XXXXXXXXXXXXX'; // URL Make.com
// ou  
// const WEBHOOK_URL = 'https://votre-site.netlify.app/.netlify/functions/contact'; // Netlify

// Fonction pour envoyer directement à PostgreSQL via webhook
async function sendToWebhook(contactData) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      throw new Error(`Erreur webhook: ${response.status}`);
    }

    // Certains services retournent du JSON, d'autres du texte
    let result;
    try {
      result = await response.json();
    } catch {
      result = { success: true, message: 'Webhook executed' };
    }

    return result;

  } catch (error) {
    console.error('Erreur webhook:', error);
    throw error;
  }
}

// Fonction principale simplifiée
async function processSimpleForm(contactData) {
  const results = {
    database: null,
    email: null,
    errors: []
  };

  try {
    // Envoyer via webhook (qui gère base + email)
    results.database = await sendToWebhook(contactData);
    results.email = { success: true }; // Assumé géré par le webhook
    
    console.log('✅ Webhook envoyé:', results.database);
    return results;

  } catch (error) {
    console.error('❌ Erreur webhook:', error);
    results.errors.push('Erreur envoi: ' + error.message);
    return results;
  }
}

// Pour utiliser cette version au lieu de database.js :
// 1. Commenter l'import de database.js dans index.html
// 2. Importer ce fichier à la place
// 3. Remplacer processContactForm par processSimpleForm dans main.js

// Export
window.processSimpleForm = processSimpleForm;
