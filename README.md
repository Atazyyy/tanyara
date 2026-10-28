Kategori: Web App — Chatbot/Customer Service AI

# Tanyara — Chatbot & Customer Service AI

> **Kategori proyek: Web App — Chatbot/Customer Service AI.**
> Widget chat pelanggan dengan chatbot rule-based (pencocokan kata kunci,
> quick replies, eskalasi ke agen manusia) plus panel agen dan basis jawaban
> yang bisa dikembangkan.

Aplikasi customer service fiktif "Tanyara" — dari widget chat pelanggan
sampai panel agen internal. Proyek ini adalah **concept demo** untuk
portofolio jasa pembuatan web app — seluruh nama, percakapan, pesanan, dan
angka bersifat fiktif. Nama "Tanyara" sengaja dibuat unik (belum dipakai
entitas mana pun di internet).

**Live:** https://tanyara.vercel.app

## Fitur

- **Widget chat pelanggan**: chatbot rule-based murni client-side —
  mendeteksi kata kunci (jam buka, ongkir, status pesanan, pembayaran,
  refund, retur, promo, akun) lalu menjawab dengan quick reply chips.
- **Intent status pesanan cerdas**: bot mengenali pola kode `TNY-xxxxx` dan
  menampilkan kartu status pesanan demo (dikemas/dikirim/diterima).
- **Fallback + eskalasi simulasi**: dua kali gagal dipahami → bot menawarkan
  eskalasi; antrean bernomor, status menunggu → dibahas, lalu agen bergabung.
- **Panel agen**: daftar 6+ percakapan dengan status (bot / menunggu agen /
  dibahas agen / selesai), transkrip lengkap, tombol **Ambil Alih**, canned
  responses, dan input balasan bebas. Percakapanmu sendiri dari halaman Chat
  muncul di sini — bisa diambil alih dan dibalas.
- **Statistik bot vs agen**: donut SVG buatan sendiri (persentase
  percakapan yang diselesaikan bot vs butuh agen) + kartu eskalasi & SLA.
- **Tab Basis Jawaban**: daftar intent (kata kunci, contoh pertanyaan,
  jawaban) + form tambah intent baru — langsung aktif di chatbot, tersimpan
  di localStorage dan bisa dihapus.
- Riwayat chat pengunjung demo tersimpan di **localStorage** (tombol mulai
  ulang tersedia).
- Tema gelap aksen cyan, responsif desktop + mobile (tab bawah), animasi
  halus Framer Motion, ikon Lucide — **tanpa backend, tanpa API eksternal,
  tanpa library chart**.

## Untuk siapa demo ini?

Bisnis online, UMKM, atau agensi yang ingin menunjukkan kemampuan chatbot
customer service: jawaban instan untuk FAQ berulang, eskalasi mulus ke agen
manusia, dan basis jawaban yang mudah dikembangkan.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4 (token tema `@theme`)
- Framer Motion
- Lucide Icons
- Grafik/donut SVG custom (tanpa library chart)
- Rule-based engine + localStorage (tanpa API eksternal)

## Menjalankan

```bash
npm install
npm run dev      # development
npm run build    # production build ke folder dist/
npm run preview  # preview hasil build
```

---

Dibuat oleh [Agni Miftah Fauzi](https://github.com/Atazyyy) — jasa pembuatan
website & web app.
