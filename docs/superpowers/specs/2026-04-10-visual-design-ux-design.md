# Vaultsite — Area B: Görsel Tasarım & UX İyileştirmeleri

**Tarih:** 2026-04-10  
**Kapsam:** Global ambient arka plan katmanı, HowItWorks görsel zaman tüneli, FinalCTA görsel güçlendirme  
**Kapsam Dışı:** Testimonial fotoğrafları, testimonial carousel, bölüm bazlı arka plan renkleri

---

## Bağlam

Vaultsite Next.js 15 landing page'i. Tüm bölümler aynı `#050505` arka planı paylaşıyor; sayfada görsel derinlik ve çeşitlilik yok. HowItWorks adımları yalnızca ikon + metin + ince border çizgisiyle ayrılıyor. FinalCTA dönüşüm noktası olmasına rağmen görsel ağırlıktan yoksun. Ambient arka plan elementleri (glow, orb) mevcut değil.

---

## Karar Alınan Yaklaşım

**Global Ambient Katmanı (Yaklaşım B):** Tek bir `AmbientBackground` bileşeni tüm sayfayı etkiler. HowItWorks'e animasyonlu zaman tüneli eklenir. FinalCTA'ya radial glow + dot mesh eklenir. Mevcut bileşenlere minimal dokunuş.

---

## Kritik Dosyalar

| Dosya | İşlem |
|---|---|
| `components/AmbientBackground.tsx` | YENİ — global ambient orb katmanı |
| `app/[lang]/layout.tsx` | GÜNCELLE — `<AmbientBackground />` ekle |
| `components/sections/HowItWorks.tsx` | GÜNCELLE — animasyonlu zaman tüneli |
| `components/sections/FinalCTA.tsx` | GÜNCELLE — radial glow + dot mesh |

---

## Tasarım Detayları

### 1. `AmbientBackground` Bileşeni

**Konum:** `components/AmbientBackground.tsx` (yeni dosya)

**Yerleşim:**
```
position: fixed
inset: 0
pointer-events: none
z-index: 0
overflow: hidden
```

`app/[lang]/layout.tsx` içinde `<body>` altına, tüm sayfa içeriğinin arkasına eklenir.

**3 Gradient Orb:**

| Orb | Renk | Boyut | Başlangıç Konumu | Paralaks Faktörü |
|---|---|---|---|---|
| Orb 1 | `rgba(168,85,247,0.10)` | 700px | sol üst (`-15%, -10%`) | `0.10` — scroll'la yukarı |
| Orb 2 | `rgba(251,191,36,0.07)` | 500px | sağ orta (`85%, 45%`) | `-0.08` — scroll'la aşağı |
| Orb 3 | `rgba(99,102,241,0.08)` | 600px | orta-alt (`40%, 85%`) | `0` — sabit |

Her orb: `border-radius: 50%`, `background: radial-gradient(circle, <color>, transparent 70%)`, `filter: blur(80px)`.

**Scroll mekanizması:**
```ts
useEffect(() => {
  const handler = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}, []);
```

Orb 1 `translateY`: `scrollY * -0.10`  
Orb 2 `translateY`: `scrollY * 0.08`  
Orb 3: sabit

**Erişilebilirlik:** `prefers-reduced-motion: reduce` medya sorgusunda tüm `transform` sıfırlanır, orb'lar statik konumlarında kalır.

---

### 2. HowItWorks — Animasyonlu Zaman Tüneli

**Dosya:** `components/sections/HowItWorks.tsx`

**Değişiklikler:**

**a) Üst bağlantı çizgisi (yalnızca `lg:` ekranlar):**
- Step grid'inin üstüne `position: relative` wrapper eklenir
- İçine `position: absolute; top: 22px; left: 12.5%; right: 12.5%` konumlu bir SVG `<line>`:
  - `stroke`: `rgba(168,85,247,0.25)`
  - `strokeWidth`: `1`
  - `strokeDasharray` + `strokeDashoffset`: bölüm `inView` olduğunda 0'a animasyonlanır
  - Süre: `0.8s ease-out`
- Framer Motion `motion.line` veya `useEffect` + CSS transition ile çizilir

**b) Step badge'leri:**
- Her adımın ikon container'ı (`44x44px` mor daire) `inView` tetiklenince sırayla pulse animasyonu yapar:
  ```css
  @keyframes stepPulse {
    0%   { box-shadow: 0 0 0 0 rgba(168,85,247,0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(168,85,247,0); }
    100% { box-shadow: 0 0 0 0 rgba(168,85,247,0); }
  }
  ```
  Stagger: `delay: i * 0.15s`, bir kez tetiklenir.

**c) Ok badge animasyonu:**
- Mevcut `→` dairesi korunur
- `inView` tetiklenince `opacity: 0 → 1`, `scale: 0.6 → 1`, `delay: 0.5s`

**Mevcut border-r çizgileri:** Değiştirilmez.

---

### 3. FinalCTA — Radial Glow + Dot Mesh

**Dosya:** `components/sections/FinalCTA.tsx`

**a) Radial glow katmanları (`position: absolute; inset: 0; pointer-events: none`):**

Birinci glow (mor, altta ortalı):
```css
background: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(168,85,247,0.14), transparent)
```

İkinci glow (altın, sağ üstte):
```css
background: radial-gradient(ellipse 30% 40% at 78% 18%, rgba(251,191,36,0.07), transparent)
```

**b) Dot mesh arka plan:**
- Bölümün `background` stiline ek olarak `backgroundImage` eklenir:
  ```css
  background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  ```
- Mevcut `background: '#0d0d0d'` korunur, mesh üstüne overlay olarak eklenir.

**c) Üst kenar gradyanı:**
- Mevcut `borderTop: '1px solid var(--border-subtle)'` → CSS linear-gradient ile mor kenar:
  ```
  borderTop: '1px solid transparent'
  backgroundClip: 'padding-box'  /* artık kullanılamaz, farklı yol: */
  ```
  Bunun yerine `position: absolute; top: 0; left: 0; right: 0; height: 1px` div ile:
  ```css
  background: linear-gradient(90deg, transparent, rgba(168,85,247,0.4), rgba(251,191,36,0.3), transparent)
  ```

---

## Erişilebilirlik

- `prefers-reduced-motion`: `AmbientBackground` paralaks kapatılır, `HowItWorks` pulse/çizgi animasyonları devre dışı kalır
- Ambient katman `aria-hidden="true"` — ekran okuyuculardan gizlenir
- Tüm animasyonlar `viewport: { once: true }` — tek kez tetiklenir, loop yok

---

## Doğrulama

1. `npm run dev` — sayfada mor/altın orb'lar görünüyor mu?
2. Scroll yaparken orb'lar paralaks hareket ediyor mu?
3. HowItWorks görünüme girince çizgi soldan sağa çiziliyor mu?
4. Badge'ler sırayla pulse yapıyor mu?
5. FinalCTA arka planında glow + dot mesh görünüyor mu?
6. `prefers-reduced-motion` açıkken tüm animasyonlar durdu mu?
7. `npm run build` — TypeScript hatası yok mu?
