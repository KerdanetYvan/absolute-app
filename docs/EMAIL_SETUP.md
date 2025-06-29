# Configuration Email - ANOMI

## Configuration Ethereal Mail (Actuelle)

Le système utilise maintenant **exclusivement Ethereal Mail** pour la simplicité et les tests.

### Avantages d'Ethereal
- ✅ **Simplicité** : Aucune configuration requise
- ✅ **Test universel** : Fonctionne avec n'importe quelle adresse email
- ✅ **Prévisualisation** : URL de prévisualisation automatique
- ✅ **Pas de restriction** : Pas de limitation de domaine/destinataire
- ✅ **Logs clairs** : Messages de debug faciles à comprendre

### Fonctionnement

#### Lors de l'inscription
```bash
✅ Email de vérification envoyé via Ethereal: <message-id>
📧 Prévisualisation email: https://ethereal.email/message/abc123...
```

#### Template email
- **Couleur du bouton** : `#FCB259` (orange ANOMI)
- **Design** : Template responsive avec logo ANOMI
- **Contenu** : Lien de vérification + instructions

### Variables d'environnement

```env
# Optionnel - URL de base pour les liens
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

### Test en développement

1. **Inscription** : Utiliser n'importe quelle adresse email
2. **Vérification des logs** : Chercher l'URL de prévisualisation dans la console
3. **Consultation** : Ouvrir l'URL Ethereal pour voir l'email
4. **Test du lien** : Copier le lien de vérification depuis l'email

### Dépendances

```json
{
  "nodemailer": "^7.0.3"
}
```

**Note** : Resend a été supprimé des dépendances pour simplifier le projet.
