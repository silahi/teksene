# Configuration EmailJS pour Teksene

## 🎯 Étape 1 : Créer le compte EmailJS

1. **Aller sur [emailjs.com](https://www.emailjs.com/)**
2. **Cliquer "Sign Up"**
3. **Choisir "Sign up with Google"** (plus rapide) ou email
4. **Confirmer votre compte** via email

## 📧 Étape 2 : Configurer le service email

1. **Dans le dashboard EmailJS, cliquer "Email Services"**
2. **Cliquer "Add New Service"**
3. **Choisir "Gmail"** (recommandé)
4. **Se connecter avec le compte Gmail** : `silahi.alihoussene@gmail.com`
5. **Autoriser EmailJS** à accéder au compte
6. **Noter le Service ID** (ex: `service_abc123`)

## 📝 Étape 3 : Créer le template d'email

1. **Aller dans "Email Templates"**
2. **Cliquer "Create New Template"**
3. **Utiliser ce contenu :**

### Template Settings :
- **Template Name** : `Teksene Contact Notification`
- **Subject** : `🔔 Nouvelle demande Teksene - {{from_name}}`
- **To Email** : `silahi.alihoussene@gmail.com`
- **From Name** : `Site Teksene`
- **Reply To** : `{{from_email}}`

### Template Content :
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa;">
  
  <div style="background-color: #0057B7; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">🔔 Nouvelle demande de contact</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Site web Teksene</p>
  </div>
  
  <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <h2 style="color: #0057B7; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
      📋 Informations client
    </h2>
    
    <table style="width: 100%; margin-bottom: 25px;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #333;">Nom :</td>
        <td style="padding: 8px 0; color: #555;">{{from_name}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #333;">Entreprise :</td>
        <td style="padding: 8px 0; color: #555;">{{entreprise}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #333;">Email :</td>
        <td style="padding: 8px 0; color: #555;">{{from_email}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #333;">WhatsApp :</td>
        <td style="padding: 8px 0; color: #555;">{{whatsapp}}</td>
      </tr>
    </table>
    
    <h2 style="color: #0057B7; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
      💼 Besoins et contexte
    </h2>
    
    <p><strong>Besoins principaux :</strong><br>
    <span style="color: #555;">{{besoins}}</span></p>
    
    <p><strong>Autre besoin :</strong><br>
    <span style="color: #555;">{{autre_besoin}}</span></p>
    
    <p><strong>Maturité data :</strong><br>
    <span style="color: #555;">{{maturite}}</span></p>
    
    <p><strong>Diagnostic gratuit :</strong><br>
    <span style="color: #555;">{{diagnostic}}</span></p>
    
    <h2 style="color: #0057B7; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
      📝 Description du projet
    </h2>
    
    <div style="background-color: #f5f7fa; padding: 15px; border-radius: 8px; border-left: 4px solid #0057B7;">
      {{contexte}}
    </div>
    
    <h2 style="color: #0057B7; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
      ⏰ Disponibilités
    </h2>
    
    <p style="color: #555;">{{disponibilites}}</p>
    
    <div style="background-color: #e5e7eb; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center; color: #666;">
      <p style="margin: 0; font-size: 14px;">
        📅 Soumis le {{date_soumission}}<br>
        🌐 Formulaire automatique du site Teksene
      </p>
    </div>
    
  </div>
  
</div>
```

4. **Sauvegarder le template**
5. **Noter le Template ID** (ex: `template_xyz789`)

## 🔑 Étape 4 : Obtenir la clé publique

1. **Aller dans "Account" > "General"**
2. **Copier la "Public Key"** (ex: `pk_123456789`)

## ⚙️ Étape 5 : Mettre à jour le code

Ouvrir le fichier `js/database.js` et remplacer :

```javascript
const EMAIL_CONFIG = {
  serviceId: 'VOTRE_SERVICE_ID', // Remplacer ici
  templateId: 'VOTRE_TEMPLATE_ID', // Remplacer ici
  publicKey: 'VOTRE_PUBLIC_KEY' // Remplacer ici
};
```

## 🧪 Étape 6 : Tester

1. **Ouvrir votre site web**
2. **Remplir le formulaire de contact**
3. **Soumettre**
4. **Vérifier la boîte mail** `silahi.alihoussene@gmail.com`

## 🔧 Dépannage

### Erreur "Public key required"
- Vérifier que la clé publique est correcte
- S'assurer que EmailJS est bien initialisé

### Erreur "Template not found"
- Vérifier le Template ID
- S'assurer que le template est publié

### Email non reçu
- Vérifier les spams
- Vérifier que le service Gmail est bien connecté
- Tester avec un template simple d'abord

## 📊 Limites du plan gratuit

- **200 emails/mois**
- **Branding EmailJS** dans les emails
- Pour plus : plans payants à partir de $15/mois

---

**Une fois configuré, chaque soumission de formulaire enverra automatiquement un email détaillé à Ali ! 📧✨**
