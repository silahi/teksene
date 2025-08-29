# Guide de déploiement Netlify pour Teksene

## 🚀 Déploiement rapide

### Méthode 1: Interface web Netlify (Recommandée)

1. **Créer un compte Netlify**
   - Aller sur [netlify.com](https://netlify.com)
   - S'inscrire avec GitHub/GitLab/email

2. **Déployer le site**
   - Glisser-déposer le dossier `teksene` sur Netlify
   - Ou connecter votre repo Git

3. **Configurer les variables d'environnement**
   - Aller dans **Site settings** > **Environment variables**
   - Ajouter :
     ```
     DATABASE_URL = postgresql://teksene_user:kpg_v8TeRa7ry45@ep-crimson-bonus-ad6n4wm7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     ```

4. **Redéployer**
   - Cliquer **Trigger deploy** dans l'onglet **Deploys**

### Méthode 2: CLI Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser le projet
netlify init

# Déployer
netlify deploy --prod
```

## 🔧 Configuration automatique

Les fichiers suivants configurent automatiquement Netlify :

- **`netlify.toml`** - Configuration du build et des fonctions
- **`package.json`** - Dépendances Node.js
- **`netlify/functions/contact.js`** - Function serverless

## 🔍 Test de la fonction

Une fois déployé, testez avec :

```javascript
// Dans la console du navigateur sur votre site
fetch('/.netlify/functions/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nom_complet: 'Test User',
    entreprise: 'Test Company',
    email: 'test@example.com',
    besoin_principal: ['Test'],
    contexte_projet: 'Test context',
    maturite_data: 'Je ne collecte pas encore de données',
    diagnostic_gratuit: true
  })
})
.then(r => r.json())
.then(console.log);
```

## 📧 Configuration email (optionnelle)

Pour l'envoi d'emails automatiques, ajoutez dans les variables d'environnement :

```
SMTP_HOST = smtp.gmail.com
SMTP_USER = votre.email@gmail.com
SMTP_PASS = votre_mot_de_passe_app
```

## 🛠 Debugging

- **Logs des functions** : Netlify Dashboard > Functions > View logs
- **Console du site** : F12 > Network pour voir les requêtes
- **Test local** : `netlify dev` pour tester en local

## 🎯 URLs importantes

Après déploiement, vos URLs seront :
- **Site** : `https://votre-site.netlify.app`
- **API** : `https://votre-site.netlify.app/.netlify/functions/contact`

## ⚡ Avantages Netlify

- ✅ **Gratuit** jusqu'à 100GB/mois
- ✅ **HTTPS automatique**
- ✅ **CDN global**
- ✅ **Déploiements atomiques**
- ✅ **Functions serverless incluses**
- ✅ **Variables d'environnement sécurisées**

Votre site sera opérationnel en quelques minutes ! 🚀
