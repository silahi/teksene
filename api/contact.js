// API endpoint pour traiter les soumissions de formulaire
// Compatible avec Vercel, Netlify Functions, etc.

// Pour Vercel Functions
export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  try {
    const { Pool } = require('pg');
    
    // Configuration de la base de données
    const pool = new Pool({
      connectionString: 'postgresql://teksene_user:kpg_v8TeRa7ry45@ep-crimson-bonus-ad6n4wm7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      ssl: {
        rejectUnauthorized: false
      }
    });

    const {
      id,
      nom_complet,
      entreprise,
      email,
      whatsapp,
      besoin_principal,
      autre_besoin,
      contexte_projet,
      maturite_data,
      diagnostic_gratuit,
      disponibilite_contact
    } = req.body;

    // Requête d'insertion
    const query = `
      INSERT INTO prises_contact (
        id, nom_complet, entreprise, email, whatsapp,
        besoin_principal, autre_besoin, contexte_projet,
        maturite_data, diagnostic_gratuit, disponibilite_contact,
        date_soumission
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
      RETURNING id, date_soumission
    `;

    const values = [
      id,
      nom_complet,
      entreprise,
      email,
      whatsapp,
      besoin_principal,
      autre_besoin,
      contexte_projet,
      maturite_data,
      diagnostic_gratuit,
      disponibilite_contact
    ];

    const result = await pool.query(query, values);
    
    await pool.end();

    res.status(200).json({
      success: true,
      id: result.rows[0].id,
      date_soumission: result.rows[0].date_soumission,
      message: 'Contact enregistré avec succès'
    });

  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erreur lors de l\'enregistrement'
    });
  }
}

// Pour Netlify Functions, exportez comme:
/*
exports.handler = async (event, context) => {
  const req = {
    method: event.httpMethod,
    body: JSON.parse(event.body || '{}')
  };
  
  const res = {
    setHeader: () => {},
    status: (code) => ({ json: (data) => ({ statusCode: code, body: JSON.stringify(data) }) }),
    end: () => ({ statusCode: 200, body: '' })
  };
  
  return await handler(req, res);
};
*/
