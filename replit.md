# Espoir Global

Site de l'ONG Espoir Global — soutien aux orphelins et veuves. Modifié sur Replit, hébergé sur Vercel via GitHub.

## Run & Operate

- `npm run dev` — lancer le site en local (port 3000)
- `npm run build` — build de production
- Pour déployer : pousser sur la branche `main` GitHub → Vercel redéploie automatiquement

## Stack

- Next.js 16 (Turbopack)
- Tailwind CSS
- Radix UI / shadcn
- Hébergement : Vercel
- Domaine : espoir-global.org

## Where things live

- `app/` — pages et routes Next.js (App Router)
- `components/` — composants réutilisables
- `public/` — images, vidéos, assets statiques
- `lib/` — utilitaires et constantes

## Déploiement

GitHub remote : `https://github.com/protecteur-mak/espoir-global-site.git`  
Branche principale : `main`  
Vercel surveille `main` et redéploie automatiquement à chaque push.

## User preferences

- Toutes les modifications se font ici sur Replit. Ne jamais changer ce flux.
- Pour déployer : pousser sur GitHub (`main`) → Vercel redéploie automatiquement sur espoir-global.org.
- Ne jamais déconnecter le remote GitHub (`https://github.com/protecteur-mak/espoir-global-site.git`).
- Toujours demander confirmation à l'utilisateur avant de pusher sur GitHub.
