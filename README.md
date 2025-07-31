# Tunggu Monitoring - Website Analytics & Heatmap Tracking

Platform analytics dan heatmap tracking yang dirancang untuk memberikan insight mendalam tentang perilaku pengunjung website Anda. Dengan integrasi mudah dan dashboard yang informatif, Tunggu Monitoring membantu Anda memahami user behavior dan meningkatkan conversion rate.

## 🚀 Fitur Utama

- **Real-time Analytics**: Pantau traffic website, pageviews, dan user behavior secara real-time
- **Interactive Heatmaps**: Visualisasi klik, scroll, dan hover behavior pengunjung
- **Easy Integration**: Integrasi mudah dengan satu baris kode JavaScript
- **User Behavior Insights**: Analisis mendalam tentang interaksi pengunjung
- **Conversion Tracking**: Lacak conversion rate dan optimalkan website
- **Privacy Compliant**: GDPR compliance dan data anonymization

## 🛠️ Cara Kerja

### Integrasi Mudah

Hanya perlu menambahkan satu baris kode ke website Anda:

```html
<script src="https://your-domain.com/monitor.js" data-site-id="YOUR_SITE_ID"></script>
```

### Data yang Dilacak

- **Pageviews**: Setiap kunjungan halaman
- **Clicks**: Lokasi dan elemen yang diklik
- **Scrolls**: Kedalaman scroll dan behavior
- **Device Info**: Browser, OS, screen resolution
- **Referrer**: Sumber traffic

### Dashboard Analytics

- **Real-time Stats**: Pageviews, clicks, scroll events
- **Top Pages**: Halaman paling populer
- **Device Distribution**: Desktop, mobile, tablet
- **Conversion Tracking**: Rate dan trend

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

## 📊 Dashboard Features

### Analytics Dashboard
- Real-time pageview tracking
- Click behavior analysis
- Scroll depth monitoring
- Device and browser statistics
- Top performing pages

### Heatmap Visualization
- Click heatmaps
- Scroll depth visualization
- Hover behavior tracking
- Interactive overlay
- Color-coded activity levels

## 🔧 Konfigurasi

### Menambah Website Baru

1. Akses dashboard di `/dashboard`
2. Klik "Add New Site"
3. Masukkan nama website dan domain
4. Copy tracking code yang diberikan
5. Paste ke website Anda

### Custom Tracking

```javascript
// Custom event tracking
trackEvent('custom_action', {
  category: 'engagement',
  value: 1
});
```

## 🎨 Teknologi yang Digunakan

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma + SQLite/PostgreSQL
- **Deployment**: Vercel (recommended)

## 📈 Keuntungan Platform

1. **Mudah Digunakan**: Setup dalam hitungan menit
2. **Real-time Data**: Update data secara real-time
3. **Privacy First**: GDPR compliant dan data anonymization
4. **Scalable**: Mendukung ribuan website
5. **Cost Effective**: Gratis untuk penggunaan dasar

## 🔍 Use Cases

### E-commerce
- Track product page interactions
- Analyze checkout funnel
- Monitor conversion rates
- Optimize user experience

### Content Websites
- Understand reading patterns
- Track engagement metrics
- Optimize content placement
- Monitor user journey

### SaaS Applications
- Track feature usage
- Analyze user onboarding
- Monitor user engagement
- Optimize conversion funnels

## 🔍 Troubleshooting

### Tracking Code Tidak Berfungsi
- Periksa console browser untuk error
- Pastikan domain sudah terdaftar
- Cek network connectivity
- Verifikasi site ID

### Data Tidak Muncul
- Tunggu beberapa menit untuk data pertama
- Periksa filter tanggal di dashboard
- Pastikan tracking code sudah benar
- Cek browser compatibility

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat pull request atau laporkan issue.

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

---

**Tunggu Monitoring** - Website Analytics & Heatmap Tracking Platform 🚀
