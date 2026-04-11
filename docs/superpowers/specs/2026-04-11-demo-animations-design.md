# Demo Animasyonlari Tasarim Dokumani

**Tarih:** 2026-04-11
**Kapsam:** OmniSearch ve Metadata/Citation demo sahneleri + 1.25x hizlandirma

---

## Ozet

Mevcut AnimatedDemo.tsx'deki 4 sahnelik donguye 2 yeni sahne eklenir (toplam 6). Tum ic animasyonlar 1.25x hizlandirilir, sahne suresi (5s) ayni kalir.

---

## Sahne Siralamasi

```
1. Kutuphane (mevcut LibraryScene)
2. OmniSearch (YENI)
3. PDF Okuyucu (mevcut PdfScene)
4. Akilli Kunye (YENI - Metadata & Citation)
5. Bilgi Grafigi (mevcut CanvasScene)
6. Disa Aktarim (mevcut ExportScene)
```

Navigator: 4 nokta -> 6 nokta, ayni stil.

---

## Sahne 2: OmniSearch

### Animasyon Akisi

| Zaman | Olay | Animasyon |
|-------|------|-----------|
| 0.0s | Sahne acilir - bos arama cubugu + 5 belge karti grid | Fade-in, kartlar staggered (0.08s aralik) |
| 0.4s | Arama cubuguna typewriter efekti: `"Piaget"` harfleri tek tek yazilir | Her harf 0.08s, cursor yanip soner |
| 1.2s | Typewriter biter, 240ms debounce sonrasi arama baslar | Kucuk bir arama pulse efekti |
| 1.5s | Grid filtrelenir: 5 karttan 3'u kalir, eslesmeyenler fade-out + scale-down | 0.24s exit animasyonu |
| 1.8s | Kalan 3 kart yeniden pozisyonlanir (layout animation) | 0.32s spring animasyonu |
| 2.0s | Match rozetleri belirir | Staggered pop-in, 0.12s aralik |
| 3.0s | Kart 2'nin alinti rozeti vurgulanir, altinda mini preview | Slide-down + fade, 0.28s |
| 4.2s | Tum sonuclar yerlesik, hafif glow pulse | Subtle accent glow |

### UI Elemanlari

- Ust: Vault sidebar (paylasilan) + arama cubugu (magnifying glass icon + input)
- Orta: Belge kartlari grid'i (kucuk kartlar, Vault DocCard stilinde)
- Kartlarin uzerinde renkli match rozetleri

### Match Rozet Renkleri (Vault kaynak kodundan)

- `ad` (mavi): bg `rgba(96,165,250,0.1)`, border `rgba(96,165,250,0.22)`, text `#60A5FA`
- `ozet` (sari): bg `rgba(251,191,36,0.08)`, border `rgba(251,191,36,0.22)`, text `#FBBF24`
- `alinti` (mor): bg `rgba(167,139,250,0.08)`, border `rgba(167,139,250,0.22)`, text `#A78BFA`
- `icerik` (yesil): bg `rgba(52,211,153,0.08)`, border `rgba(52,211,153,0.22)`, text `#34D399`

### Ornek Belgeler

1. "Bilissel Gelisim Kurami - Piaget.pdf" -> `ad` + `icerik`
2. "Egitim Psikolojisi Notlari.docx" -> `alinti` (Piaget alintisi var)
3. "Gelisim Psikolojisi Arastirmasi.pdf" -> `icerik`
4. "Makine Ogrenmesi Giris.pdf" -> fade-out (eslesmez)
5. "Veri Analizi Yontemleri.epub" -> fade-out (eslesmez)

---

## Sahne 4: Akilli Kunye (Metadata & Citation)

### Animasyon Akisi

| Zaman | Olay | Animasyon |
|-------|------|-----------|
| 0.0s | Sahne acilir - Vault kutuphane gorunumu, 3 mevcut belge karti | Fade-in, staggered kartlar |
| 0.4s | Ustten bir PDF dosyasi duser: `"article_final_v3.pdf"` | Drop animasyonu (y: -40 -> 0), hafif bounce |
| 0.8s | Dosya karta donusur, uzerinde spinner + `"Metadata taraniyor..."` | Spin (0.52s), pulse border |
| 1.6s | Spinner durur -> yesil checkmark'a morph | Scale + color transition, 0.24s |
| 1.8s | Metadata etiketleri belirir: `DOI: 10.1234/...` -> `Crossref checkmark` | Staggered fade-in, 0.16s aralik |
| 2.4s | Slot-machine rename: `"article_final_v3.pdf"` -> `"Yapay Sinir Aglari ile Duygu Analizi - Kilic.pdf"` | SlotY (0.4s), eski ad yukari + yeni ad asagidan |
| 3.2s | Toast: `Referans kutuphanesine eklendi` | Slide-up, 0.22s, cubic-bezier(.34,1.56,.64,1) |
| 3.8s | Mini citation preview: `"Kilic, A. (2024). Yapay Sinir Aglari ile..."` APA | Fade-in + height expand, 0.28s |
| 4.5s | Kart hafif accent glow | Subtle pulse |

### UI Elemanlari

- Sol: Vault sidebar (paylasilan)
- Orta: Belge kartlari grid'i
- Yeni kart: vurgulu border (accent renk)
- Spinner -> checkmark gecisi (Vault OCR badge stilinde)
- Slot-machine rename animasyonu
- Toast: alt-ortada, Vault stili

### Mevcut Belgeler (arka plan)

1. "Bilissel Gelisim Kurami - Piaget.pdf"
2. "Egitim Psikolojisi Notlari.docx"
3. "Gelisim Psikolojisi Arastirmasi.pdf"

---

## 1.25x Hizlandirma

### Kapsam

Sahne suresi (SCENE_DURATION = 5000ms) AYNI kalir. Sadece ic animasyon duration ve delay degerleri 1.25'e bolunur.

### Donusum Tablosu

| Mevcut | 1.25x Hizli |
|--------|-------------|
| 0.4s | 0.32s |
| 0.55s | 0.44s |
| 0.45s | 0.36s |
| 0.1s delay | 0.08s |
| 0.15s delay | 0.12s |
| 0.8s (edge stroke) | 0.64s |
| 3s (canvas float) | 2.4s |

### Etkilenen Mevcut Sahneler

- **LibraryScene**: stagger delay, fade duration
- **PdfScene**: highlight delay, quote card slide timing
- **CanvasScene**: node scale delay, edge stroke, float animasyonu
- **ExportScene**: panel slide-in, button state transition

### Hizlandirilmayacak Degerler

- `SCENE_DURATION` (5000ms)
- Progress bar animasyonu (sahne suresine bagli)
- Scene gecis animasyonu (AnimatePresence exit/enter, 0.3s)

---

## Teknik Detaylar

### Dosya Degisiklikleri

| Dosya | Degisiklik |
|-------|-----------|
| `components/AnimatedDemo.tsx` | 2 yeni sahne eklenmesi, sahne siralamasi guncellenmesi, navigator 6 nokta, tum ic animasyon timing'leri 1.25x hizlandirma |

### Paylasilan Tema Objesi (T)

```javascript
{
  bg: '#080C14',
  surface: '#0F1623',
  border: 'rgba(255,255,255,0.055)',
  text: '#E2E8F0',
  accent: '#A78BFA',
  accentAmber: '#FBBF24',
  accentGreen: '#34D399'
}
```

### Animasyon Patterni

Mevcut `[0.22, 1, 0.36, 1]` ease curve kullanilir. Yeni sahneler mevcut pattern'lere uyumlu olacak sekilde Framer Motion `motion.div` + `AnimatePresence` kullanir.

### Hiz Sabiti

```javascript
const SPEED = 1.25;
// Kullanim: duration: 0.4 / SPEED, delay: 0.1 / SPEED
```

Tum timing degerleri bu sabit uzerinden hesaplanir, gelecekte kolayca ayarlanabilir.
