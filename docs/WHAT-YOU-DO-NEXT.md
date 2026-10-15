# Durum

## Tamam
- Profiles / RLS (zaten Supabase’te vardı)
- Forgot / reset mail (local test OK) — Site URL Netlify’de olmalı
- Login `?next=` + girişliyken `/auth` yönlendirmesi (kod)

## Auth UX kontrolü — TAMAM

Login sonrası `/my-journeys` açıldı (`?next=` çalışıyor).

Site URL Netlify’de kalsın.

Auth paketi bu haliyle tamam. Sonraki işler (isteğe bağlı): Netlify deploy + göz gezdir, auth’lu E2E, billing.
