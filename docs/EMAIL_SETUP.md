# Configuration Email - ANOMI

## Problème Resend en développement

Resend a des restrictions strictes en mode développement/test :

### Limitations actuelles
- ✅ **Emails autorisés** : kerdanety@gmail.com (votre email vérifié)
- ❌ **Emails bloqués** : Toutes les autres adresses
- 📨 **Message d'erreur** : "You can only send testing emails to your own email address"

### Solutions

#### 1. **Mode développement (actuel)**
Le système utilise automatiquement **Ethereal Mail** en fallback quand Resend échoue :
- ✅ Permet de tester avec n'importe quelle adresse email
- ✅ Génère une URL de prévisualisation de l'email
- ✅ Pas de vraie livraison d'email (juste pour les tests)

#### 2. **Mode production (recommandé)**
Pour envoyer des emails à de vraies adresses :

##### Option A : Vérifier un domaine sur Resend
1. Aller sur [resend.com/domains](https://resend.com/domains)
2. Ajouter votre domaine (ex: anomi.com)
3. Configurer les enregistrements DNS
4. Changer `EMAIL_FROM=noreply@anomi.com`

##### Option B : Utiliser Gmail
```env
# Désactiver Resend
# RESEND_API_KEY=

# Activer Gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
EMAIL_FROM=votre-email@gmail.com
```

#### 3. **Test en développement**
Pour tester l'inscription :
```bash
# 1. Créer un compte avec kerdanety@gmail.com
# 2. Ou utiliser n'importe quelle adresse (utilisera Ethereal)
# 3. Vérifier les logs pour l'URL de prévisualisation
```

## Logs utiles

```javascript
// Succès Resend
✅ Email Resend envoyé: re_abc123...

// Fallback Ethereal
⚠️ Erreur Resend: You can only send testing emails...
🔄 Fallback vers Ethereal Mail pour le développement...
✅ Email de vérification envoyé via Ethereal: <message-id>
📧 Prévisualisation email: https://ethereal.email/message/abc123...
```

## Variables d'environnement

```env
# Production avec domaine vérifié
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@votredomaine.com

# Ou production avec Gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
EMAIL_FROM=votre-email@gmail.com

# Base URL pour les liens de vérification
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
```
