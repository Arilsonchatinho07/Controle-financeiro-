# AC Midia Pro — Controle Diário (PWA → APK)

Site estático (sem build). Funciona offline e sincroniza via Supabase.

## 1. Supabase
SQL Editor → colar e executar `schema.sql`.
Project Settings → API → copiar **Project URL** e **anon public key** para `config.js`.

## 2. GitHub + Vercel
1. Crie um repositório no GitHub e envie TODOS estes ficheiros na raiz.
2. Vercel → Add New → Project → importe o repo → Framework: **Other** → Deploy (sem build command).
3. Abra o link `https://SEU-APP.vercel.app` no telemóvel e teste.

## 3. APK (sem Expo)
1. Abra **pwabuilder.com**, cole o link da Vercel e clique Start.
2. Package for stores → **Android** → gere o pacote (escolha APK/“Test package” para instalar direto; AAB é para a Play Store).
3. Descarregue o zip, instale o `.apk` no telemóvel (permitir “fontes desconhecidas”).
4. Para esconder a barra do navegador: coloque o `assetlinks.json` fornecido pelo PWABuilder em `.well-known/assetlinks.json` no repo e faça novo deploy.

## Notas
- Atualizações do site chegam ao APK sem reinstalar (o APK abre o link da Vercel).
- O código da casa funciona como palavra-passe: use um longo e difícil.
