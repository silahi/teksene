# Configuration Webhook pour Teksene

## Solutions recommandées pour insérer en base sans backend

### Option 1: Zapier (Recommandée)
1. Créer un nouveau Zap sur zapier.com
2. **Trigger**: Webhooks by Zapier -> Catch Hook
3. Copier l'URL du webhook généré
4. **Action**: PostgreSQL -> Create Record
5. Configurer la connexion PostgreSQL avec vos credentials
6. Mapper les champs du formulaire

### Option 2: Make.com (Integromat)
1. Créer un nouveau scénario sur make.com
2. **Module 1**: Webhooks -> Custom Webhook
3. **Module 2**: PostgreSQL -> Insert a Record
4. Configurer la connexion et le mapping

### Option 3: Netlify Functions (Gratuit)
1. Créer un compte Netlify
2. Déployer le fichier `api/contact.js` comme Netlify Function
3. URL sera: `https://votre-site.netlify.app/.netlify/functions/contact`

### Option 4: Vercel Functions (Gratuit)
1. Créer un compte Vercel
2. Déployer le fichier `api/contact.js`
3. URL sera: `https://votre-projet.vercel.app/api/contact`

## Structure des données envoyées

```json
{
  "id": 1704123456789,
  "nom_complet": "Jean Dupont",
  "entreprise": "Ma Société SARL",
  "email": "jean.dupont@masociete.com",
  "whatsapp": "+33612345678",
  "besoin_principal": ["Audit et collecte de données", "Création de dashboards"],
  "autre_besoin": null,
  "contexte_projet": "Nous avons besoin d'améliorer notre suivi des ventes...",
  "maturite_data": "Je collecte des données mais sans les structurer",
  "diagnostic_gratuit": true,
  "disponibilite_contact": "cette semaine, 14h-16h",
  "date_soumission": "2024-01-01T14:30:00.000Z"
}
```

## SQL pour créer la table (si nécessaire)

```sql
CREATE TABLE prises_contact (
    id BIGINT PRIMARY KEY,
    nom_complet VARCHAR(150) NOT NULL,
    entreprise VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    whatsapp VARCHAR(30),
    besoin_principal TEXT[] NOT NULL,
    autre_besoin TEXT,
    contexte_projet TEXT NOT NULL,
    maturite_data VARCHAR(100) NOT NULL CHECK (maturite_data IN (
        'Je ne collecte pas encore de données',
        'Je collecte des données mais sans les structurer',
        'J''ai déjà des dashboards mais ils sont peu utilisés',
        'Je suis bien structuré mais je veux aller plus loin'
    )),
    diagnostic_gratuit BOOLEAN NOT NULL,
    disponibilite_contact VARCHAR(100),
    date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
