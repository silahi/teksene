# Configuration EmailJS pour Teksene

## Étapes de configuration

### 1. Créer un compte EmailJS
1. Aller sur [emailjs.com](https://www.emailjs.com/)
2. Créer un compte gratuit
3. Confirmer votre email

### 2. Configurer un service email
1. Dans le dashboard, aller dans **Email Services**
2. Cliquer **Add New Service**
3. Choisir **Gmail** (recommandé)
4. Connecter votre compte Gmail
5. Noter le **Service ID** (ex: `service_xyz123`)

### 3. Créer un template d'email
1. Aller dans **Email Templates**
2. Cliquer **Create New Template**
3. Utiliser ce template :

```html
Sujet: 🔔 Nouvelle demande de contact Teksene - {{from_name}}

Bonjour Ali,

Une nouvelle demande de contact a été soumise sur le site Teksene.

📋 INFORMATIONS CLIENT
Nom : {{from_name}}
Entreprise : {{entreprise}}
Email : {{from_email}}
WhatsApp : {{whatsapp}}

💼 BESOINS
Besoins principaux : {{besoins}}
Autre besoin : {{autre_besoin}}

📊 CONTEXTE
Maturité data : {{maturite}}
Diagnostic gratuit : {{diagnostic}}

📝 DESCRIPTION
{{contexte}}

⏰ DISPONIBILITÉS
{{disponibilites}}

🕐 Date de soumission : {{date_soumission}}

---
Formulaire automatique Teksene
```

4. Dans les paramètres du template :
   - **To Email**: `silahi.alihoussene@gmail.com`
   - **From Name**: `Site Teksene`
   - **Reply To**: `{{from_email}}`

5. Noter le **Template ID** (ex: `template_abc456`)

### 4. Obtenir la clé publique
1. Aller dans **Account** > **General**
2. Copier la **Public Key** (ex: `pk_xyz789`)

### 5. Mettre à jour le code
Dans `js/database.js`, remplacer :

```javascript
const EMAIL_CONFIG = {
  serviceId: 'service_xyz123', // Votre Service ID
  templateId: 'template_abc456', // Votre Template ID  
  publicKey: 'pk_xyz789' // Votre Public Key
};
```

## Test de configuration

Une fois configuré, testez avec ce code dans la console du navigateur :

```javascript
emailjs.send('service_xyz123', 'template_abc456', {
  to_email: 'silahi.alihoussene@gmail.com',
  from_name: 'Test',
  from_email: 'test@example.com',
  entreprise: 'Test Company',
  whatsapp: '+33123456789',
  besoins: 'Test',
  autre_besoin: 'Aucun',
  contexte: 'Test de configuration',
  maturite: 'Test',
  diagnostic: 'Oui',
  disponibilites: 'Test',
  date_soumission: new Date().toLocaleString('fr-FR')
}, 'pk_xyz789').then(function(response) {
  console.log('SUCCESS!', response.status, response.text);
}, function(error) {
  console.log('FAILED...', error);
});
```

## Limites du plan gratuit
- 200 emails/mois
- Support EmailJS branding
- Pour plus : plans payants à partir de $15/mois

## Alternative gratuite
Si vous préférez, vous pouvez utiliser **Formspree** ou **Netlify Forms** qui sont plus simples à configurer.
