# Kent Bostanları — Güz 2026 Rehberi (PWA)

Çankaya Belediyesi · Park ve Bahçeler Müdürlüğü

## Yayınlama (GitHub Pages)

1. GitHub'da yeni bir depo aç, örn. `guz-rehberi`
2. Bu klasördeki **tüm dosyaları** depoya yükle. Hepsi aynı seviyededir, alt klasör yoktur —
   telefondan da tek seferde seçilebilir.
3. Settings → Pages → Source: **Deploy from a branch**, Branch: **main / (root)** → Save
4. Birkaç dakika içinde adres hazır olur:
   `https://<kullanici>.github.io/guz-rehberi/`

Bağlantıya sahip herkes açabilir; hesap veya giriş gerekmez.

## Dosyalar

| Dosya | İşlev |
|---|---|
| `index.html` | Uygulamanın tamamı (içerik, tasarım, kod) |
| `manifest.json` | Uygulama adı, simgeler, kısayollar |
| `sw.js` | Service worker — çevrimdışı çalışma |
| `*.png` | Uygulama simgeleri (6 dosya) |

## İçerik

| Sekme | İçerik |
|---|---|
| Bu dönem | Tarihe göre aktif dönem + kontrol listesi |
| Araçlar | Parsel malzeme hesaplayıcı, yerleşim krokisi, toprak kesiti, don riski simülatörü |
| Takvim, Fidelik, Dikim, Bakım, Türler | Güz 2026 dikim ve bakım rehberi |
| Hastalık | Hastalık–zararlı takip tablosu |
| Soru-Cevap | Eğitim sunumu (41 slayt) + evsel doğal ilaç tarifleri; çevrimdışı soru arama |
| Kayıt | Saha günlüğü (cihazda saklanır, metin olarak dışa aktarılır), telefona ekleme |

### Sesli anlatım

Her kartın ve her açılır bölümün sağ üstünde bir hoparlör düğmesi vardır; tıklandığında
o bölümün metni sesli okunur. Cihazın kendi konuşma motoru kullanılır — internet
gerektirmez, ücret yoktur.

Türkçe ses paketi cihazda yüklü değilse uygulama uyarı verir. Android'de
Ayarlar → Erişilebilirlik → Metin okuma, iOS'ta Ayarlar → Erişilebilirlik → Sözlü İçerik
bölümünden Türkçe ses indirilebilir.

## İçerik güncelleme

Metinler `index.html` içinde düz HTML olarak durur, doğrudan düzenlenebilir.
Dönem tanımları ve kontrol listeleri dosyanın sonundaki `PHASES` dizisindedir.

## ÖNEMLİ: Sürüm yükseltme

İçerikte **her değişiklikten sonra** `sw.js` dosyasındaki

    const CACHE_VERSION = 'v1';

satırındaki sayıyı artırın (`v2`, `v3`, …).

Bu yapılmazsa kullanıcıların telefonunda eski sürüm cache'te kalır ve
güncelleme görünmez. Sürüm artırıldığında eski cache otomatik silinir ve
kullanıcıya "Yeni sürüm hazır" bildirimi çıkar.


## Güvenlik

Uygulama tek sayfadan oluşur ve tamamen cihazda çalışır:

- Hiçbir dış kaynaktan script, stil, font veya resim yüklenmez (CDN yok, analytics yok)
- Sunucu, veritabanı, hesap ve giriş yok — toplanan veri yok
- Kamera, konum, mikrofon, bildirim gibi hiçbir izin istenmez
- `eval`, `new Function`, `document.write` kullanılmaz
- Kullanıcı girdisi (arama kutusu, saha günlüğü) DOM'a yalnızca `textContent` ile yazılır — XSS yüzeyi yoktur
- `Content-Security-Policy` meta etiketi dış kaynak yüklemeyi, `base` enjeksiyonunu ve dış forma gönderimi engeller
- Saha günlüğü kayıtları yalnızca `localStorage`'da, cihazda durur

### Yayın hesabının korunması

Uygulamanın en kritik güvenlik noktası, barındırıldığı hesaptır. Hesap ele
geçirilirse sayfa değiştirilebilir ve kullanıcılara zararlı içerik servis
edilebilir. Bu yüzden:

1. GitHub / Netlify hesabında **iki adımlı doğrulamayı (2FA) açın**
2. Depo yazma yetkisini yalnızca gerekli kişilere verin
3. Yayın öncesi `index.html` dosyasında beklenmedik `<script src="...">`
   satırı olup olmadığını kontrol edin

Service worker HTML için önce ağdan okur (network-first), bu yüzden düzeltilmiş
bir sürüm kullanıcılara hızla ulaşır; eski sürüm cache'te kilitli kalmaz.
