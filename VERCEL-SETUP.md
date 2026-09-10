# AGROGO — Vercel uchun tuzatish

Bu paket GitHub main dagi c066604 commit ustiga qo‘llanadi. To‘liq loyiha emas: faqat o‘zgargan fayllar.

## GitHub orqali yuklash

1. AGROGO-vercel-fix.zip ni kompyuterga yuklab oling va Extract All qiling.
2. GitHub → Denji-chan/AGROGO → Code: loyihaning asosiy sahifasini oching.
3. Add file → Upload files.
4. ZIP ichidan chiqqan app, db, lib papkalari va package.json, package-lock.json, vercel.json, VERCEL-SETUP.md fayllarini birgalikda yuklang. Ularni o‘rab turgan tashqi papkani yoki ZIPning o‘zini yuklamang.
5. Commit changes. GitHub faqat mos yo‘ldagi fayllarni yangilaydi, qolgan komponent va rasmlar qoladi.
6. Vercel yangi commitni yig‘adi. Logda `next build` yozilishi kerak.

Vercel sozlamalari: Framework Preset = Next.js, Build Command = npm run build, Output Directory = .next (standart), Root Directory = repository ildizi. vercel.json build va output qiymatlarini beradi. Node.js = 22.x.

## Nima tuzatildi

- `npm run build` endi Vinext o‘rniga haqiqiy Next.js build qiladi; `.next/routes-manifest.json` Next tomonidan yaratiladi.
- `dev` va `start` standart Next.js buyruqlariga almashtirildi.
- Vercel Function ichida Cloudflare Workers maxsus importi ishlatilmaydi. Arizalar mavjud D1 jadvaliga Cloudflare HTTPS API orqali yoziladi.
- Tekshirish, rozilik, honeypot va bir xil arizani qayta yuborganda takroriy yozmaslik saqlangan.
- SEO manzillari yangi hosting domenidan olinadi; eski chatgpt.site domeni ishlatilmaydi.
- Eski Vite/Sites vositalari repositoryda qolishi mumkin, lekin Vercel build buyrug‘i ularni ishga tushirmaydi.

## Forma uchun baza ulash (sayt buildidan alohida)

Sayt bazaga ulanish ma’lumotlarisiz build bo‘ladi. Ammo forma faqat haqiqiy bazaga yozilgach muvaffaqiyat ko‘rsatadi. Sozlamalar yo‘q bo‘lsa /api/leads 503 qaytaradi va foydalanuvchiga uning tilidagi xato ko‘rsatiladi; ariza saqlangan deb aytilmaydi.

Cloudflare hisobingizdagi D1 bazasi uchun Vercel → Project → Settings → Environment Variables bo‘limiga quyidagi qiymatlarni kiriting:

| Name | Qiymat |
| --- | --- |
| CLOUDFLARE_ACCOUNT_ID | D1 joylashgan Cloudflare hisob identifikatori |
| CLOUDFLARE_D1_DATABASE_ID | Haqiqiy D1 database UUID |
| CLOUDFLARE_API_TOKEN | Shu hisobda D1 Write/Edit ruxsatiga ega API token |
| SITE_URL | Ixtiyoriy: haqiqiy sayt domeni, masalan https://sizning-domeningiz.uz |

Tokenni GitHub fayllariga yoki chatga yozmang. Environment Variables serverda saqlanadi. Production muhitini belgilang, Preview forma sinovi kerak bo‘lsa unga ham qo‘llang. So‘ng oxirgi commitni Redeploy qiling.

Hosting konfiguratsiyasidagi `DB` baza identifikatori emas, binding nomidir. Asl Sites loyihasidagi bazaga avtomatik kirish berilmaydi. O‘zingizga tegishli D1 bazasi va uning ruxsatlari kerak; ushbu paket eski bazadagi ma’lumotlarni ko‘chirmaydi.

Yangi bo‘sh D1 baza yaratgan bo‘lsangiz, Cloudflare D1 Console da quyidagi SQLni bir marta bajaring (mavjud jadvalni o‘chirmaydi):

```sql
CREATE TABLE IF NOT EXISTS agrogo_leads (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  region TEXT NOT NULL,
  service TEXT NOT NULL,
  role TEXT NOT NULL,
  locale TEXT NOT NULL,
  consent INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
```

Ulangach, test ariza yuboring va D1 Console ichida test yozuvi kelganini tekshiring. Haqiqiy Vercel hisobiga deploy va haqiqiy Cloudflare bazasiga yozish ushbu paketni tayyorlash vaqtida bajarilmagan.

## Manbalar

- Next.js on Vercel: https://vercel.com/docs/frameworks/full-stack/nextjs
- D1 query API: https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/

## Tekshiruv natijalari

Node.js 22.23.2 da `next build` va TypeScript muvaffaqiyatli o‘tdi. `.next/routes-manifest.json` yaratilgani tasdiqlandi. Production serverda /uz, /ru, /en HTTP 200 va mos HTML lang qaytardi; brauzer tili orqali redirect, noma’lum til 404, noto‘g‘ri forma 400, baza sozlanmaganida 503 tekshirildi. D1 API transporti mock qilingan alohida tekshiruvda SQL haqiqiy lokal SQLite da bajarildi: parametrlar, takroriy ID, HTTP/API xatolari sinovdan o‘tdi. Haqiqiy Cloudflare D1 va Vercel deployment hali tekshirilmagan.
