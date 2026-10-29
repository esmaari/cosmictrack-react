# Yeni Supabase API key’lerine geçiş (senin checklist)

Kod hem **yeni** hem **legacy** key okur. Tercih: yeni.

## 1) Dashboard’da key oluştur

Supabase → **Project Settings** → **API Keys** → **Publishable and secret API keys**

- Yoksa **Create new API keys** (legacy’yi bozmaz)
- **Publishable** (`sb_publishable_...`) kopyala
- **Secret** (`sb_secret_...`) kopyala — gizli

Legacy sekmesindeki `anon` / `service_role` şimdilik **kalsın** (geri dönüş için). Hepsi çalışınca sonra deaktive edilir.

## 2) Local `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

Eski `ANON_KEY` / `SERVICE_ROLE_KEY` satırlarını silebilirsin (veya yedek tutup yorum satırı yap).

`npm run dev`’i yeniden başlat.

## 3) Netlify env

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | (zaten var) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |
| `SUPABASE_SECRET_KEY` | `sb_secret_...` (Secret) |

Redeploy.

İstersen eski `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`’i Netlify’den sonra sil.

## 4) Test

1. Local giriş / çıkış
2. Test hesabıyla **hesap silme**
3. Netlify’de aynı (deploy sonrası)

## Yapma

- Secret’ı GitHub’a / chate koyma
- Legacy key’leri **hemen** Dashboard’dan kapatma — önce test et

## Not (AI edge)

UI flag: `NEXT_PUBLIC_AI_ENABLED=true` (Netlify / `.env.local`).

Edge kill-switch: Supabase → Edge Functions → `ai` → Secrets → `AI_ENABLED=true`.
Without that secret the function returns `503 AI_DISABLED`.

Apply SQL migration first (atomic quota):
`supabase/migrations/20261028150000_reserve_ai_credit.sql` → SQL Editor → Run.

Then deploy the function:
```bash
supabase functions deploy ai
```
(Or Dashboard.) Client sends `{ title, locale, cards }` only — not a raw `prompt`.
Quota: `reserve_ai_credit` before OpenAI; `release_ai_credit` if upstream fails.
Response shape: `{ interpretation, plan, limit, used, remaining }` (JSON from the model, validated server-side).
Invalid model JSON → `502 INVALID_AI_READING` and credit released.

## Site adı düzeltmesi (cosmictrac → cosmictrack)

Repo içinde eski `cosmictrac-react` URL’si yok. **Senin Dashboard’da** güncelle:

### Supabase → Authentication → URL Configuration

**Site URL** (canlı kullanıyorsan):
```
https://cosmictrack-react.netlify.app
```

**Redirect URLs** — ekle (eski `cosmictrac-react` varsa sil veya bırak, zararsız):
```
https://cosmictrack-react.netlify.app/**
https://cosmictrack-react.netlify.app/auth/callback
https://cosmictrack-react.netlify.app/en/auth/callback
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3000/en/auth/callback
```

Mail reset / confirm linkleri Site URL + bu listeye göre gider.
