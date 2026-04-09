# Vaultsite Arama ve Yapay Zeka Motoru Optimizasyon Planı (SEO, GEO, AEO)

Vaultsite kod tabanını üzerinde yaptığım inceleme sonucunda platformun görsel ve UI olarak üst düzey bir noktada olduğunu tespit ettim. Ancak, arama motorlarında (SEO), yapay zeka tabanlı cevap motorlarında (Perplexity, ChatGPT vb. - GEO) ve doğrudan cevap sunan motorlarda (Google Featured Snippets - AEO) platformun görünürlüğünü sekteye uğratacak bazı önemli mimari eksiklikler bulunmaktadır.

Aşağıda tespit edilen sorunların analizi ve bu sorunları giderecek detaylı uygulama planı (yol haritası) bulunmaktadır.

---

> [!WARNING]
> **Kritik Sorun: SEO Cezası Riski (Hidden Text)**
> Mevcut `app/page.tsx` içinde yer alan `AEOBlock` bileşeni `<div className="sr-only">` ile gizlenmiştir. Arama motorları (özellikle Google), kullanıcıya görünmeyen ancak bota verilen bu tür gizli metinleri "Black Hat SEO / Cloaking" olarak algılayıp siteyi tamamen indeks dışı bırakma veya cezalandırma eğilimindedir. Bu durumun **acilen** çözülmesi gerekir.

> [!WARNING]
> **Kritik Sorun: Dil URL Yapısı (Hreflang & Yönlendirme)**
> Sistemin dil değişimi şu an "Cookie" (çerez) üzerinden çalışıyor. Googlebot ve diğer örümcekler çerezleri çalıştırmaz. Bu yüzden sitenizin Türkçe versiyonu arama motorları tarafından **hiçbir şekilde indekslenemez**. Çoklu dil desteği URL üzerinden (`vault.app/en` ve `vault.app/tr`) yapılmalı ve `hreflang` etiketleriyle belirtilmelidir.

---

## 1. SEO (Search Engine Optimization) İyileştirmeleri

Sitenin klasik algoritmalarla çalışan Google, Bing gibi motorlarda üst sıralara çıkması için gerekli teknik dokunuşlar:

### Planlanan Değişiklikler:
- **`[ ]` Dinamik Route Tabanlı i18n:** Dil yapısını (middleware) değiştirerek `/[lang]/page.tsx` rotalarına geçiş yapılacak.
- **`[ ]` Hreflang Etiketleri:** İki dil arasındaki ilişkiyi botlara bildirmek için `<head>` içine HTML `hreflang` linkleri otomatik enjekte edilecek.
- **`[ ]` Sitemap ve Robots:** `app/sitemap.ts` ve `app/robots.ts` dosyaları tanımlanacak. Projede şu anda bir site haritası bulunmuyor, bu da tarama bütçesini ziyan eder.
- **`[ ]` Dinamik Metadata:** `layout.tsx` statik İngilizce meta veriler taşıyor. Her bir `[lang]` rotasına özgü dinamik "Title", "Description" ve "Open Graph" verileri oluşturulacak.

## 2. AEO (Answer Engine Optimization) İyileştirmeleri

Kullanıcıların "En iyi akademik araştırma programı hangisi?", "Vault ücretsiz mi?" gibi doğrudan sorularına arama sayfasında (sıfırıncı sıra) ve yapay zeka araçlarında yanıt olması için gerekenler:

### Planlanan Değişiklikler:
- **`[ ]` Gizli Bölümün Kaldırılması:** `AEOBlock` içindeki gizli metin dosyadan tamamen silinecek.
- **`[ ]` FAQPage JSON-LD Entegrasyonu:** Mevcut SSS (Sıkça Sorulan Sorular - `FAQ.tsx`) bölümü arka planda `Schema.org/FAQPage` formatında Google'a iletilecek. Bu sayede soru-cevap formatı Google'da doğrudan kart olarak çıkacak.
- **`[ ]` Anlamsal (Semantic) Hiyerarşi Optimizasyonu:** Sayfada sorular `<h3>` veya alt başlık olarak kalmalı, cevaplar `<p>` etiketinde direktif bir biçimde ("Vault şudur:" formatında) başlamalıdır.

## 3. GEO (Generative Engine Optimization) İyileştirmeleri

ChatGPT, Perplexity, Gemini, Claude gibi Üretken Yapay Zeka motorları veritabanlarına bilgi çekerken sayfanın güvenilirliğine, otoritesine ve yapılandırılmış tablolarına bakar.

### Planlanan Değişiklikler:
- **`[ ]` Güven Sinyalleri (Trust Signals):** Hero bölümündeki "Stanford, MIT" gibi ikonik marka gösterimleri AI için sadece birer resimden ibarettir. AI motorlarının markalarla çalıştığınızı bilmesi için bu kurumlara metin tabanlı referanslar (örn: "Trusted by researchers at Stanford, MIT, Harvard" metni erişilebilir şekilde) eklenecek.
- **`[ ]` Karşılaştırmalar:** `ComparisonTable.tsx` bileşeni (Zotero vs Vault) görsel olarak çok iyi olsa da AI için daha okunabilir anlamsal veri tablolamasına sahip olmalı.
- **`[ ]` AI Crawl Markdown Entegrasyonu (Gelecek Vizyonu):** Kök dizine LLM'lerin okumayı en sevdiği yöntem olan `/llms.txt` veya benzeri salt metin formatında dökümler hazırlayarak Vault hakkında "AI modeli eğitecek veriler" sağlanabilir.

---

## Kullanıcı Onayı Gereken Kararlar

Yukarıdaki aşamalar doğrultusunda şu iki konuda fikrinize ihtiyacım var:

1. **URL Yapısını (`/tr` ve `/en`) değiştirmek istiyor muyuz?** 
   Eğer değiştirmezsek, Türkçe pazarında hiçbir organik arama kaydı alamama riskini kabul etmiş oluruz. Benim tavsiyem Next.js App Router i18n altyapısına geçmektir.
2. **Gizli AEO metinleri:** Bunları tamamen silebilirim ve içeriğindeki bilgileri SSS (FAQ) alanına dahil ederek Google formatına çevirebilirim. Onaylıyor musunuz?

Onay verdiğinizde veya revize istediğinizde kod düzeyinde (aşama aşama) değişikliklere başlayacağım.
