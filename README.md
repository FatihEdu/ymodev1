# ymodev1

Bu proje, **Express.js** kullanılarak geliştirilmiş bir **asal sayı testi API** uygulamasıdır.  
Kullanıcıdan alınan sayılar üzerinde asal sayı kontrolü yapılır ve sonuç API üzerinden döndürülür.

## Özellikler

- Express.js tabanlı REST API yapısı
- Asal sayı testi işlemleri
- İş kuyruğu mantığı ile işlem yönetimi
- `/health` endpointi ile servis durum kontrolü
- Swagger/OpenAPI desteği
- Geliştirmeye açık modüler proje yapısı

## Proje Yapısı

```bash
src/
 ├── config/        # Swagger ve diğer yapılandırmalar
 ├── controllers/   # İstekleri yöneten controller dosyaları
 ├── routes/        # API route tanımları
 ├── services/      # İş mantığı
 ├── workers/       # Arka plan işleyicilerie
```

## Kurulum

Projeyi bilgisayarına almak için:

```bash
git clone <repo-link>
cd ymodev1
npm install
```

## Çalıştırma

Geliştirme ortamında projeyi başlatmak için:

```bash
npm start
```

veya dosya değişince otomatik yeniden başlaması için:

```bash
npm run dev
```

Uygulama çalıştıktan sonra API istekleri gönderilebilir.

## Endpointler

### Ana endpoint
`GET /`

Örnek cevap:
```json
{
  "status": "ok",
  "message": "Express Jobs ile Asal Sayi Testleri API çalışıyor."
}
```

### Health check endpoint
`GET /health`

Örnek cevap:
```json
{
  "status": "ok"
}
```
