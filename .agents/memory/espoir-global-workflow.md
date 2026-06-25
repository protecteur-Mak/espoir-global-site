---
name: Espoir Global workflow
description: Flux de travail permanent entre Replit, GitHub et Vercel pour le site espoir-global.org
---

## Règle absolue

Toutes les modifications du site se font ici sur Replit. C'est le choix permanent de l'utilisateur.

## Flux de déploiement

1. Modifier le code sur Replit
2. L'utilisateur demande "pousse sur GitHub"
3. Pousser sur la branche `main` de `https://github.com/protecteur-mak/espoir-global-site.git`
4. Vercel détecte le push et redéploie automatiquement sur espoir-global.org (1-2 min)

**Why:** L'utilisateur veut éviter toute manipulation technique. Ce flux est entièrement automatique après le push.

**How to apply:** Avant tout push, demander confirmation. Ne jamais changer le remote ni la branche cible.

## Infos clés

- Remote : `https://github.com/protecteur-mak/espoir-global-site.git`
- Branche : `main`
- Domaine : espoir-global.org
- Hébergeur : Vercel (connecté automatiquement à GitHub)
- Dev local : `npm run dev` sur port 3000
