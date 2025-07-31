# Tunggu Monitoring - Website Pemerintah Indonesia

Platform monitoring real-time untuk ketersediaan website penting pemerintah Indonesia. Sistem ini dirancang untuk memberikan transparansi dan aksesibilitas informasi ketersediaan layanan digital pemerintah.

## 🚀 Fitur Utama

- **Monitoring Real-time**: Pantau status website pemerintah secara real-time dengan update setiap 5 menit
- **Website Penting Indonesia**: Fokus pada website vital seperti Satu Data, DPR, POLRI, dan lembaga pemerintah lainnya
- **Dashboard Interaktif**: Interface yang mudah digunakan dengan visualisasi status yang jelas
- **Filter Kategori**: Filter website berdasarkan kategori (Data & Statistik, Legislatif, Keamanan, dll)
- **Response Time**: Informasi waktu respons website untuk analisis performa
- **Akses Gratis**: Layanan monitoring gratis untuk kepentingan publik

## 📋 Website yang Dimonitor

### Data & Statistik
- Satu Data Indonesia (data.go.id)
- BPS (bps.go.id)

### Legislatif
- DPR RI (dpr.go.id)

### Keamanan
- POLRI (polri.go.id)

### Ekonomi
- Kementerian Keuangan (kemenkeu.go.id)
- Bank Indonesia (bi.go.id)

### Kesehatan
- Kementerian Kesehatan (kemkes.go.id)

### Pendidikan
- Kementerian Pendidikan (kemdikbud.go.id)

### Pemerintahan
- Kementerian Dalam Negeri (kemendagri.go.id)
- Kementerian Luar Negeri (kemlu.go.id)

## 🛠️ Cara Kerja

### Metode Monitoring yang Efisien

Sistem menggunakan pendekatan yang efisien dan tidak terlalu teknis:

1. **HTTP HEAD Request**: Hanya memeriksa header response, tidak mengunduh konten penuh
2. **Timeout 10 Detik**: Batas waktu untuk menghindari hanging request
3. **Parallel Processing**: Semua website diperiksa secara bersamaan
4. **Error Handling**: Graceful handling jika website tidak dapat diakses

### API Endpoint

```
GET /api/monitoring
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Satu Data Indonesia",
      "url": "https://data.go.id",
      "category": "Data & Statistik",
      "status": "online",
      "responseTime": 245,
      "lastChecked": "2024-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd tunggu-monitoring
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

4. Buka browser dan akses `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📊 Monitoring Interval

- **Development**: Update setiap 5 menit
- **Production**: Dapat disesuaikan sesuai kebutuhan

## 🔧 Konfigurasi

### Menambah Website Baru

1. Edit file `app/api/monitoring/route.ts`
2. Tambahkan website baru ke array `websites`
3. Update komponen `WebsiteStatus.tsx` jika diperlukan

### Mengubah Interval Monitoring

Edit file `components/WebsiteStatus.tsx`:
```javascript
// Ubah interval dari 5 menit ke interval yang diinginkan
const interval = setInterval(checkAllWebsites, 5 * 60 * 1000);
```

## 🎨 Teknologi yang Digunakan

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Deployment**: Vercel (recommended)

## 📈 Keuntungan Pendekatan Ini

1. **Efisien**: Tidak memerlukan database atau server terpisah
2. **Sederhana**: Implementasi straightforward dengan Next.js
3. **Scalable**: Mudah ditambahkan website baru
4. **Real-time**: Update otomatis setiap interval
5. **Responsive**: Interface yang responsif untuk semua device

## 🔍 Troubleshooting

### Website Tidak Terdeteksi
- Periksa URL website
- Pastikan website mendukung HTTP HEAD request
- Cek firewall atau CORS policy

### Performance Issues
- Kurangi interval monitoring
- Implementasi caching jika diperlukan
- Gunakan CDN untuk static assets

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat pull request atau laporkan issue.

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

---

**Tunggu Monitoring** - Transparansi Digital Pemerintah Indonesia 🇮🇩
