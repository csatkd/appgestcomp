# 🥋 Guide Opérationnel - Compétition Kyorugi

## 📋 Cycle de Vie Complet (12 Étapes)

### ✅ ÉTAPE 1 : Configuration de la Compétition
**Module** : `/admin`

**Actions** :
1. Définir le nom de la compétition
2. Configurer les dates (début et fin)
3. Spécifier le lieu
4. Déterminer le nombre d'aires de combat
5. Configurer les catégories de poids (8 catégories WT standards)

**Validation** :
- ✅ Nom de la compétition défini
- ✅ Dates et lieu configurés
- ✅ Aires de combat définies

---

### ✅ ÉTAPE 2 : Inscriptions des Athlètes
**Module** : `/athletes`

**Actions** :
1. Créer les clubs participants
2. Inscrire les athlètes avec leurs informations
3. Assigner chaque athlète à un club
4. Générer les licences FITKD

**Validation** :
- ✅ Tous les athlètes inscrits
- ✅ Clubs créés
- ✅ Licences générées

**Données requises** :
- Prénom et nom
- Année de naissance
- Sexe (M/F)
- Club d'appartenance
- Licence (auto-générée)

---

### ✅ ÉTAPE 3 : Pesée Officielle
**Module** : `/pesee`

**Actions** :
1. Enregistrer le poids de chaque athlète
2. Assignation automatique aux catégories de poids
3. Validation des pesées
4. Gestion des forfaits

**Validation** :
- ✅ Tous les athlètes pesés
- ✅ Catégories assignées
- ✅ Poids validés

**Catégories de poids WT** :
- Hommes : -58kg, -68kg, -80kg, +80kg
- Femmes : -49kg, -57kg, -67kg, +67kg

---

### ✅ ÉTAPE 4 : Gestion des Aires de Combat
**Module** : `/arenas`

**Actions** :
1. Configurer les aires de combat
2. Définir le statut de chaque aire (active, inactive, maintenance)
3. Assigner les arbitres aux aires

**Validation** :
- ✅ Aires configurées
- ✅ Statuts définis

---

### ✅ ÉTAPE 5 : Tirages au Sort
**Module** : `/tirages`

**Actions** :
1. Générer les tableaux pour chaque catégorie
2. Seeding automatique des athlètes
3. Gestion des exempts (byes)
4. Visualisation des brackets

**Validation** :
- ✅ Tous les tirages générés
- ✅ Brackets complets
- ✅ Exempts gérés

**Types de brackets** :
- Élimination directe
- Seeding équilibré
- Gestion automatique des byes

---

### ✅ ÉTAPE 6 : Planning des Combats
**Module** : `/schedule`

**Actions** :
1. Assigner les combats aux aires
2. Programmer les horaires
3. Organiser l'ordre des combats
4. Gérer les conflits d'horaire

**Validation** :
- ✅ Tous les combats assignés
- ✅ Horaires programmés
- ✅ Aires réparties

---

### ✅ ÉTAPE 7 : Système d'Appel
**Module** : `/call`

**Actions** :
1. Appeler les athlètes avant chaque combat
2. Countdown de 2 minutes pour se présenter
3. Confirmer la présence
4. Gérer les forfaits (no-show)

**Validation** :
- ✅ Athlètes appelés
- ✅ Présence confirmée
- ✅ Combat démarré

**Workflow d'appel** :
1. Sélectionner un combat
2. Appeler les athlètes (bouton "Appeler")
3. Countdown de 2 minutes
4. Confirmer la présence ou marquer forfait
5. Démarrer le combat

---

### ✅ ÉTAPE 8 : Live Scoring
**Module** : `/live`

**Actions** :
1. Diriger les combats en temps réel
2. Chronomètre WT (3 rounds × 2 min)
3. Scoring complet (poing, corps, tête, rotatifs)
4. Gestion des Gam-jeom
5. Point en or si égalité

**Validation** :
- ✅ Combats dirigés
- ✅ Scores enregistrés
- ✅ Vainqueurs déterminés

**Règles WT implémentées** :
- 3 rounds de 2 minutes
- 1 minute de repos entre les rounds
- Scoring : poing +1, corps +2, tête +3, rotatifs +4/+5
- Gam-jeom = +1 point à l'adversaire
- 10 Gam-jeom = PUN (disqualification)
- Point en or si égalité après 3 rounds

---

### ✅ ÉTAPE 9 : Gestion des Réclamations
**Module** : `/reclamations`

**Actions** :
1. Enregistrer les réclamations
2. Examiner les preuves
3. Prendre une décision
4. Documenter la décision

**Validation** :
- ✅ Réclamations traitées
- ✅ Décisions documentées

---

### ✅ ÉTAPE 10 : Résultats et Podiums
**Module** : `/resultats`

**Actions** :
1. Valider les résultats finaux
2. Déterminer les médaillés (or, argent, bronze)
3. Calculer le classement des clubs
4. Officialiser les podiums

**Validation** :
- ✅ Résultats validés
- ✅ Podiums déterminés
- ✅ Classement des clubs calculé

**Système de points** :
- Or = 5 points
- Argent = 3 points
- Bronze = 1 point

---

### ✅ ÉTAPE 11 : Certificats de Participation
**Module** : `/certificates`

**Actions** :
1. Générer les certificats individuels
2. Certificats personnalisés avec logo
3. Impression ou export PDF
4. Génération en masse

**Validation** :
- ✅ Certificats générés
- ✅ Informations vérifiées
- ✅ Prêts pour distribution

---

### ✅ ÉTAPE 12 : Mode TV et Cérémonie
**Module** : `/tv` et `/ceremony-sponsors`

**Actions** :
1. Afficher les podiums en grand écran
2. Affichage automatique des sponsors
3. Animations professionnelles
4. Mode plein écran pour projection

**Validation** :
- ✅ Podiums affichés
- ✅ Sponsors visibles
- ✅ Cérémonie prête

---

### ✅ ÉTAPE 13 : Rapport de Compétition
**Module** : `/report`

**Actions** :
1. Générer le rapport officiel
2. Statistiques complètes
3. Liste des médaillés
4. Classement des clubs
5. Export PDF

**Validation** :
- ✅ Rapport généré
- ✅ Statistiques vérifiées
- ✅ Prêt pour archivage

---

## 🎯 Workflow Opérationnel pour Aujourd'hui

### Matin (8h00 - 12h00)

**8h00 - 8h30** : Configuration finale
- Vérifier la configuration dans `/admin`
- Confirmer les dates, lieu, aires

**8h30 - 9h30** : Check-in des athlètes
- Utiliser `/checkin` pour enregistrer les présences
- Scanner les QR codes ou saisie manuelle

**9h30 - 10h30** : Pesée officielle
- Aller dans `/pesee`
- Enregistrer les poids de tous les athlètes
- Valider les catégories

**10h30 - 11h00** : Tirages au sort
- Aller dans `/tirages`
- Générer les brackets pour chaque catégorie
- Vérifier les tableaux

**11h00 - 12h00** : Planning des combats
- Aller dans `/schedule`
- Assigner les combats aux aires
- Programmer les horaires

### Après-midi (12h00 - 18h00)

**12h00 - 12h30** : Pause déjeuner

**12h30 - 13h00** : Appel des premiers athlètes
- Aller dans `/call`
- Appeler les athlètes pour les premiers combats
- Confirmer les présences

**13h00 - 17h00** : Compétition en cours
- Aller dans `/live` pour diriger les combats
- Utiliser le scoreboard pour chaque combat
- Gérer les réclamations dans `/reclamations` si nécessaire

**17h00 - 17h30** : Validation des résultats
- Aller dans `/resultats`
- Valider tous les résultats
- Déterminer les médaillés

**17h30 - 18h00** : Génération des certificats
- Aller dans `/certificates`
- Générer les certificats pour tous les participants
- Préparer pour la cérémonie

### Soirée (18h00 - 20h00)

**18h00 - 19h00** : Cérémonie de remise des prix
- Aller dans `/tv` pour afficher les podiums
- Utiliser `/ceremony-sponsors` pour afficher les sponsors
- Remettre les médailles et certificats

**19h00 - 19h30** : Rapport final
- Aller dans `/report`
- Générer le rapport de compétition
- Exporter en PDF

**19h30 - 20h00** : Clôture
- Archiver les données
- Envoyer le rapport aux officiels
- Féliciter les participants

---

## 📊 Statistiques en Temps Réel

### Dashboard Principal (`/`)
- Vue d'ensemble de la compétition
- Statistiques globales
- Combats à diriger
- Progression des catégories
- Podiums officiels

### Gestion Efficace (`/management`)
- Vue consolidée Kyorugi + Poomsae + Casse
- Alertes prioritaires
- Actions rapides
- Statistiques en temps réel

---

## 🚀 Raccourcis Opérationnels

### Raccourcis Clavier
- `Ctrl+K` : Recherche globale
- `Ctrl+L` : Live Scoring (accès rapide)
- `Ctrl+R` : Résultats
- `Ctrl+C` : Calendrier
- `Ctrl+A` : Athlètes

### Accès Rapide
- **Live Scoring** : `/live` - Pour diriger les combats
- **Pesée** : `/pesee` - Pour enregistrer les poids
- **Tirages** : `/tirages` - Pour générer les brackets
- **Résultats** : `/resultats` - Pour valider les podiums
- **Certificats** : `/certificates` - Pour générer les certificats

---

## 💡 Conseils Pratiques

### Pour les Organisateurs
1. **Préparer à l'avance** : Configurer la compétition la veille
2. **Vérifier les inscriptions** : S'assurer que tous les athlètes sont inscrits
3. **Tester le matériel** : Vérifier les écrans, scanners QR, etc.
4. **Former les arbitres** : S'assurer qu'ils connaissent le système
5. **Prévoir des backups** : Exporter les données régulièrement

### Pour les Arbitres
1. **Se familiariser avec le live scoring** : Tester avant la compétition
2. **Connaître les règles WT** : Scoring, Gam-jeom, point en or
3. **Utiliser les raccourcis** : Ctrl+L pour accès rapide au live
4. **Valider immédiatement** : Confirmer les résultats après chaque combat
5. **Gérer les réclamations** : Utiliser `/reclamations` si nécessaire

### Pour les Athlètes
1. **Arriver à l'heure** : Pour la pesée et le check-in
2. **Apporter leur licence** : Pour le check-in QR
3. **Vérifier leur catégorie** : S'assurer d'être dans la bonne catégorie
4. **Se préparer mentalement** : Utiliser le temps d'attente efficacement
5. **Respecter les règles** : Suivre les instructions des arbitres

---

## 🔧 Dépannage

### Problèmes Courants

**Un athlète n'apparaît pas dans le tirage**
- Vérifier qu'il est bien pesé dans `/pesee`
- Vérifier que sa catégorie est correcte
- Régénérer le tirage si nécessaire

**Le scoreboard ne se met pas à jour**
- Rafraîchir la page
- Vérifier la connexion internet
- Redémarrer le live scoring

**Un combat ne peut pas être démarré**
- Vérifier que les deux athlètes sont présents
- Vérifier que le combat est dans le planning
- Utiliser `/call` pour appeler les athlètes

**Les résultats ne sont pas validés**
- Aller dans `/resultats`
- Vérifier que tous les combats sont terminés
- Valider manuellement si nécessaire

---

## 📞 Support

### Documentation
- **GUIDE_KYORUGI_OPERATIONNEL.md** : Ce guide
- **CYCLE_DE_VIE_KYORUGI.md** : Documentation technique
- **README.md** : Vue d'ensemble de l'application

### Contact
- **Email** : support@dojang.ci
- **Téléphone** : +225 27 22 44 55 66
- **Forum** : https://forum.dojang.ci

---

## ✅ Checklist de Validation

### Avant la Compétition
- [ ] Configuration validée dans `/admin`
- [ ] Tous les athlètes inscrits dans `/athletes`
- [ ] Clubs créés et vérifiés
- [ ] Licences générées

### Jour de la Compétition - Matin
- [ ] Check-in des athlètes dans `/checkin`
- [ ] Pesée complète dans `/pesee`
- [ ] Catégories assignées automatiquement
- [ ] Aires configurées dans `/arenas`
- [ ] Tirages générés dans `/tirages`
- [ ] Planning établi dans `/schedule`

### Jour de la Compétition - Après-midi
- [ ] Athlètes appelés dans `/call`
- [ ] Combats dirigés dans `/live`
- [ ] Scores enregistrés en temps réel
- [ ] Réclamations gérées dans `/reclamations`
- [ ] Résultats validés dans `/resultats`

### Jour de la Compétition - Soirée
- [ ] Certificats générés dans `/certificates`
- [ ] Cérémonie préparée dans `/tv`
- [ ] Sponsors affichés dans `/ceremony-sponsors`
- [ ] Rapport généré dans `/report`
- [ ] Données archivées

### Après la Compétition
- [ ] Rapport envoyé aux officiels
- [ ] Certificats distribués
- [ ] Résultats publiés dans `/public-results`
- [ ] Feedback collecté
- [ ] Compétition clôturée

---

## 🎉 Conclusion

Le cycle de vie complet d'une compétition de kyorugi est maintenant **ENTIEREMENT OPÉRATIONNEL** dans DOJANG.

**Toutes les étapes sont couvertes** :
✅ Configuration → Inscriptions → Pesée → Aires → Tirages
✅ Planning → Appel → Live Scoring → Réclamations
✅ Résultats → Certificats → Cérémonie → Rapport

**L'application est prête pour gérer une compétition AUJOURD'HUI !** 🚀

---

**Version** : 1.0 - Guide Opérationnel
**Statut** : ✅ Production-ready
**Date** : 2026
**Compétition** : Prête à démarrer

---

🥋 **DOJANG - La Régie Numérique des Tatamis** 🥋
*Cycle de vie Kyorugi complet et opérationnel*

**Prêt pour la compétition d'aujourd'hui !** ✅
