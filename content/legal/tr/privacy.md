---
title: "Gizlilik Politikası"
date: "2024-04-10"
updatedAt: "2024-04-10"
description: "Vault'un yerel öncelikli prensiplerle verilerinizi nasıl işlediğine dair detaylar."
---

Vault ekibi olarak akademik araştırmaların doğası gereği özel ve mahrem olduğuna inanıyoruz. Mimarimiz **"Yerel Öncelikli" (Local-First)** prensibi etrafında tasarlanmış olup, verilerinizin mutlak kontrolünün sizde kalmasını sağlar.

## 1. Yerel Öncelikli Mimari ve Belge Gizliliği

Geleneksel bulut tabanlı araştırma araçlarının aksine, Vault; PDF belgelerinizi, EPUB dosyalarınızı, notlarınızı veya bilgi grafiklerinizi varsayılan olarak sunucularımıza yüklemez.
- **IndexedDB Depolama:** Tüm belgeleriniz ve notlarınız cihazınızda, tarayıcınızın güvenli kum havuzu (sandboxed) alanında (IndexedDB) yerel olarak saklanır.
- **Veri Egemenliği:** Okuduğunuz literatürün içeriğine veya aldığınız notlara kesinlikle erişim hakkımız ve yetkimiz yoktur.
- **Bulut Senkronizasyonu:** Okuma gruplarınızı veya çalışma alanlarınızı cihazlar arasında senkronize etmeyi isteğe bağlı olarak seçerseniz, Supabase altyapımız üzerinden yalnızca meta veriler ve şifrelenmiş ilişkisel yapılar senkronize edilir.

## 2. Topladığımız Bilgiler

Temel hizmetlerimizi sunabilmek için yalnızca minimum düzeyde veri toplarız:
- **Hesap Bilgileri:** Supabase kimlik doğrulama işlemi sırasında e-posta adresi ve isim.
- **Ödeme Bilgileri:** Tamamen güvenli ödeme altyapımız (örn. Stripe/Iyzico) tarafından işlenir. Kredi kartı bilgilerinizi sunucularımızda saklamayız.
- **Analitik Verileri:** Uygulama performansını izlemek için Vercel Analytics ve Speed Insights kullanıyoruz. Bu analiz verileri tamamen anonimleştirilmiş olup, kişisel olarak tanımlanabilir hiçbir bilgi (PII) içermez.

## 3. KVKK ve GDPR Uyumluluğu

Vault, Kişisel Verilerin Korunması Kanunu (KVKK) ve Genel Veri Koruma Yönetmeliği'ne (GDPR) tam uyumlu olarak faaliyet gösterir.
- **Erişim ve Silme Hakkı:** Destek ekibiyle iletişime geçerek hesap verilerinizin dışa aktarılmasını veya hesabınızın derhal silinmesini talep edebilirsiniz. Yerel odaklı doğamız gereği, tarayıcınızın yerel depolama alanını temizlemek araştırma materyallerinizi cihandan tamamen siler.
- **Açık Rıza:** Sizi internet üzerinde diğer web sitelerinde takip etmeyiz. İsteğe bağlı hizmet analizleri, Çerez Paneli (Cookie Banner) üzerinden açık rızanızı (Consent) gerektirir.

## 4. Üçüncü Taraf Hizmetleri

Vault'u size ulaştırabilmek için aşağıdaki güvenli altyapıları kullanıyoruz:
- **Supabase:** Kimlik doğrulama ve isteğe bağlı veritabanı senkronizasyonu için.
- **Vercel:** Dünya çapında hızlı (edge) barındırma ve performans analizi için.

Verileriniz hiçbir şart altında üçüncü şahıslara, reklam ağlarına veya veri komisyoncularına satılmaz.

## 5. İletişim

Verileriniz ile ilgili yasal haklarınız veya gizlilik hakkında sorularınız için Veri Koruma Yetkilimizle `privacy@vault.app` adresinden iletişime geçebilirsiniz.
