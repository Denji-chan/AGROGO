# AGROGO

Fermerdan eksportgacha — bitta platforma.

## Loyiha strukturasi

- `app/[locale]/page.tsx` — `/uz`, `/ru`, `/en` sahifalari va shu tilga mos SEO.
- `app/layout.tsx`, `app/globals.css` — umumiy maket, Manrope, ranglar, responsive qoidalar va dark mode.
- `middleware.ts`, `i18n/config.ts` — saqlangan til, brauzer tili, `uz` fallback.
- `messages/uz.json`, `ru.json`, `en.json` — barcha sarlavha, izoh, tugma, ariza, xato va alt matnlari.
- `components/header.tsx`, `footer.tsx`, `providers.tsx`, `shared.tsx` — umumiy komponentlar.
- `components/sections/hero.tsx` — suratli parallax bosh ekran.
- `components/sections/problem.tsx` — to‘rtta muammo.
- `components/sections/journey.tsx` — oltita bosqich, GSAP ScrollTrigger.
- `components/sections/services.tsx` — beshta xizmat va pointer tilt.
- `components/sections/example.tsx` — bir tonna pomidor va komissiya tushuntirishi.
- `components/sections/geography.tsx` — hududlar xaritasi va eksport bozorlari.
- `components/three/export-globe.tsx` — lazy loaded Three.js / React Three Fiber globusi.
- `components/sections/audience.tsx` — to‘rtta auditoriya tabi.
- `components/sections/impact.tsx` — ko‘rinishga kirganda sanaydigan raqamlar.
- `components/sections/join.tsx` — fermer / hamkor qiziqish arizasi.
- `app/api/leads/route.ts`, `lib/lead-schema.ts`, `db/leads.ts` — server tekshiruvi va arizalarni saqlash.
- `db/schema.ts`, `drizzle/` — ma’lumotlar tuzilmasi va migratsiya.
- `data/` — xaritalarning geografik geometriyasi.
- `public/images/` — foydalanuvchi bergan suratlarning optimallashtirilgan WebP nusxalari.

## Texnologiyalar

Next.js 16 App Router API, React 19, TypeScript, Tailwind CSS 4, next-intl, Framer Motion, GSAP ScrollTrigger, Three.js va React Three Fiber. Sites muhiti Next.js App Router kodini Vite/Vinext orqali Cloudflare Workers uchun yig‘adi. D1 arizalarni sessiyalar orasida saqlaydi. Standart loyiha buyruqlari saqlangan.

## Dizayn

To‘q yashil `#1B4332`, krem `#F7F8F2`, hosil sariq `#F6CB46`. Manrope lotin va kirill yozuvlarida. Suratli Hero, keng oraliqlar, turli kompozitsiyadagi bo‘limlar, oddiy chiziqli ikonalar. 375px, 768px, 1024px va 1440px+ ekranlar uchun qoidalar bor. Tungi rejim tanlovi qurilmada saqlanadi.

## Suratlar

Taqdim etilgan suratlarning tanlanganlari:

| Manba fayl oxiri        | Saytdagi vazifasi                   |
| ----------------------- | ----------------------------------- |
| `5ednwc5ednwc5edn.jfif` | Hero, fermer va logistika manzarasi |
| `hi3f9uhi3f9uhi3f.jfif` | Sovutkichli ombor va qadoqlash      |
| `53k5zt53k5zt53k5.jfif` | Agrotexnika                         |
| `rpillnrpillnrpil.jfif` | Transport va eksport                |

Qolgan uchta tasvirning katakli foni JFIF ichiga tushgan; ular haqiqiy shaffof fayllar emas. Premium ko‘rinishni saqlash uchun sahifada toza fotosuratlar va interaktiv geografik chizma ishlatiladi. Asl yuklangan fayllar o‘zgartirilmagan.

## Funksional holat

- Til URL orqali almashtiriladi; tanlov cookie orqali eslab qolinadi. Birinchi tashrifda Accept-Language tekshiriladi, mos kelmasa o‘zbekcha ochiladi.
- Xizmat va auditoriya tugmalari formadagi rol/xizmatni; xarita tugmasi hududni tanlaydi.
- Muvaffaqiyat xabari faqat server arizani saqlagandan so‘ng ko‘rsatiladi. Xatoda kiritilgan qiymatlar formada qoladi.
- Idempotent ariza identifikatori qayta yuborishda aynan bir arizaning takror yozilishidan saqlaydi.
- Forma ism, xalqaro telefon, hudud, yo‘nalish va maqsadli rozilikni tekshiradi. Arizalar maxfiy D1 jadvalida; ularni ommaga ko‘rsatadigan endpoint yo‘q.
- Ro‘yxatdan o‘tish bu bosqichda qiziqish arizasi, yakunlangan hisob ochish yoki xizmat buyurtmasi emas.
- Ombor/texnika sonlari aniq belgilangan **namuna ma’lumotlari**. Haqiqiy hamkorlar reyestri taqdim etilmagan.
- Impact raqamlari: 5 xizmat, 4 maqsadli bozor, 1 platforma. Ular erishilgan natijalar yoki tejamkorlik foizlari sifatida berilmagan.
- 5–15% komissiya foydalanuvchi bergan biznes modelidan olingan; xizmat bo‘yicha aniq tariflar to‘qib chiqarilmagan.
- Telefon, email va rasmiy ijtimoiy tarmoq manzillari taqdim etilmagan. Bog‘lanish tugmalari ishlaydigan ariza formasiga olib boradi; uydirma tashqi havolalar kiritilmagan.

## Animatsiya va samaradorlik

Hero parallax, kirishda reveal, scroll progress, xizmatlarda pointer tilt. GSAP pinned bosqich faqat katta va baland ekranlarda ishlaydi; kichik ekranda oddiy ketma-ket tanlash qoladi. React Three Fiber globusi eksport tabi ko‘rinib turgandagina yuklanadi; mobil va reduced-motion holatida statik xarita chiqadi. WebGL xatosi uchun zaxira ko‘rinish bor. DPR cheklangan; offscreen sahna to‘xtaydi. Statik suratlar WebP, rasmlar `next/image` orqali joylashtirilgan, Hero ustuvor yuklanadi.

## Ishga tushirish

- `npm install` — bog‘liqliklar.
- `npm run dev` — mahalliy ishlab chiqish.
- `npx tsc --noEmit` — TypeScript tekshiruvi.
- `npm run db:generate` — schema o‘zgarganida yangi Drizzle migratsiyasi.
- `npm run build` — Cloudflare Workers uchun yig‘ish.

Saytning tashqi domeni o‘zgarsa, `app/[locale]/page.tsx`, `app/robots.ts` va `app/sitemap.ts` ichidagi domenni moslang.

## Manbalar

Xarita: [Natural Earth public domain geoma’lumotlari](https://www.naturalearthdata.com/about/terms-of-use/), [rasmiy repozitoriy nusxasi](https://github.com/nvkelso/natural-earth-vector).

Texnik ma’lumot: [next-intl konfiguratsiyasi](https://next-intl.dev/docs/usage/configuration), [React Three Fiber samaradorligi](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [GSAP matchMedia va reduced motion](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/).
