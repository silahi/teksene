// Netlify Function pour traiter les soumissions de formulaire Teksene
// Gère l'insertion PostgreSQL et l'envoi d'email

const { Pool } = require('pg');

// Configuration PostgreSQL depuis les variables d'environnement
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://teksene_user:kpg_v8TeRa7ry45@ep-crimson-bonus-ad6n4wm7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Fonction pour envoyer l'email de notification
async function sendNotificationEmail(contactData) {
  try {
    // Utiliser un service d'email simple comme Nodemailer avec Gmail
    // ou intégrer avec un service comme SendGrid, Mailgun, etc.
    
    // Pour simplifier, nous retournons les données à logger
    console.log('📧 Email à envoyer à silahi.alihoussene@gmail.com:', {
      subject: `🔔 Nouvelle demande Teksene - ${contactData.nom_complet}`,
      data: contactData
    });
    
    // TODO: Implémenter l'envoi d'email réel
    return { success: true, message: 'Email simulé' };
    
  } catch (error) {
    console.error('Erreur email:', error);
    throw error;
  }
}

exports.handler = async (event, context) => {
  // Configuration CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Gérer la requête OPTIONS pour CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    // Parser les données du formulaire
    const contactData = JSON.parse(event.body);
    
    console.log('📝 Données reçues:', contactData);

    // Validation des données obligatoires
    const requiredFields = ['nom_complet', 'entreprise', 'email', 'contexte_projet', 'maturite_data', 'diagnostic_gratuit'];
    const missingFields = requiredFields.filter(field => !contactData[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Champs manquants', 
          missing: missingFields 
        })
      };
    }

    // Générer un ID unique
    const id = Date.now();

    // Préparer la requête SQL
    const query = `
      INSERT INTO public.prises_contact (
        id, nom_complet, entreprise, email, whatsapp,
        besoin_principal, autre_besoin, contexte_projet,
        maturite_data, diagnostic_gratuit, disponibilite_contact,
        date_soumission
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
      RETURNING id, date_soumission
    `;

    const values = [
      id,
      contactData.nom_complet,
      contactData.entreprise,
      contactData.email,
      contactData.whatsapp || null,
      contactData.besoin_principal || [],
      contactData.autre_besoin || null,
      contactData.contexte_projet,
      contactData.maturite_data,
      contactData.diagnostic_gratuit,
      contactData.disponibilite_contact || null
    ];

    // Exécuter la requête
    console.log('💾 Insertion en base...');
    const result = await pool.query(query, values);
    
    console.log('✅ Insertion réussie:', result.rows[0]);

    // Envoyer l'email de notification
    let emailResult = null;
    try {
      emailResult = await sendNotificationEmail(contactData);
      console.log('✅ Email envoyé');
    } catch (emailError) {
      console.error('⚠️ Erreur email (non bloquante):', emailError);
    }

    // Réponse de succès
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: result.rows[0].id,
        date_soumission: result.rows[0].date_soumission,
        email_sent: !!emailResult,
        message: 'Contact enregistré avec succès'
      })
    };

  } catch (error) {
    console.error('❌ Erreur fonction Netlify:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        message: 'Erreur lors du traitement'
      })
    };
  }
};
