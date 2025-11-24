# Instructions pour merger sur GitHub

## Méthode 1 : Via GitHub (Pull Request) - RECOMMANDÉE ✅

### Étapes :
1. **Aller sur GitHub** : https://github.com/CelsiaGANGBE/Tasky
2. **Créer une Pull Request** :
   - Cliquez sur l'onglet "Pull requests"
   - Cliquez sur "New pull request"
   - **Base branch** : `main`
   - **Compare branch** : `Saliou_New_Branch`
   - Cliquez sur "Create pull request"
   - Ajoutez un titre et une description
   - Cliquez sur "Create pull request"

3. **Merger la Pull Request** :
   - Sur la page de la PR, cliquez sur "Merge pull request"
   - Cliquez sur "Confirm merge"
   - Optionnel : Supprimez la branche après le merge

---

## Méthode 2 : Via ligne de commande (Moins recommandé)

### Étapes :

1. **Passer sur la branche main** :
   ```bash
   git checkout main
   ```

2. **Mettre à jour main depuis GitHub** :
   ```bash
   git pull origin main
   ```

3. **Merger votre branche dans main** :
   ```bash
   git merge Saliou_New_Branch
   ```

4. **Pousser les changements sur GitHub** :
   ```bash
   git push origin main
   ```

5. **Supprimer la branche locale (optionnel)** :
   ```bash
   git branch -d Saliou_New_Branch
   ```

6. **Supprimer la branche distante (optionnel)** :
   ```bash
   git push origin --delete Saliou_New_Branch
   ```

---

## ⚠️ Recommandations

- **Utilisez la Méthode 1 (Pull Request)** car elle permet :
  - Une revue de code avant le merge
  - Une discussion sur les changements
  - Un historique clair des modifications
  - Une meilleure collaboration en équipe

