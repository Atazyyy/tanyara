// Data contoh Tanyara — seluruh nama, percakapan, pesanan, dan angka bersifat FIKTIF.
// Timestamp dihitung relatif terhadap waktu halaman dibuka supaya demo
// selalu terlihat "hidup" (ada percakapan baru, antrean, dsb).

export const WA_NUMBER = "6281234567890";

export const BRAND = {
  name: "Tanyara",
  store: "Amara Store",
};

let _seq = 0;
const mk = (role, text, minAgo, extra = {}) => ({
  id: `seed${++_seq}`,
  role,
  text,
  ts: Date.now() - minAgo * 60000,
  ...extra,
});

// ---------- Pesanan demo (untuk intent "status pesanan") ----------
export const ORDERS = [
  {
    code: "TNY-20451",
    item: "Sneakers Kanvas Nori — Ukuran 41",
    status: "Dikirim",
    detail: "Dibawa kurir Dedi · estimasi tiba hari ini 16.00–18.00",
  },
  {
    code: "TNY-30777",
    item: "Tumbler Stainless Igo 500 ml",
    status: "Dikemas",
    detail: "Siap diserahkan ke kurir besok pagi",
  },
  {
    code: "TNY-11209",
    item: "Kaos Katun Combed 30s — Ukuran M",
    status: "Diterima",
    detail: "Diterima 2 hari lalu di receptionis · terima kasih!",
  },
];

export const findOrder = (code) =>
  ORDERS.find((o) => o.code === String(code || "").toUpperCase());

export const extractOrderCode = (text) => {
  const m = String(text || "").toUpperCase().match(/TNY[\s-]?(\d{4,6})/);
  return m ? "TNY-" + m[1] : null;
};

// ---------- Quick reply ----------
export const DEFAULT_CHIPS = [
  "Jam buka toko",
  "Cek ongkir",
  "Status pesanan",
  "Metode pembayaran",
  "Bicara dengan agen",
];

// ---------- Teks baku chatbot ----------
export const ASK_ORDER_TEXT =
  "Boleh ketik kode pesananmu? Formatnya TNY-xxxxx — contoh: TNY-20451. Aku cek posisinya sekarang ya.";

export const AGENT_OFFER_TEXT =
  "Oke, aku bisa hubungkan ke agen manusia. Agen kami online sampai 21.00 — tekan tombol di bawah untuk langsung masuk antrean ya.";

export const FALLBACK_1 =
  "Hmm, aku belum yakin dengan pertanyaan itu. Aku paham topik: jam buka, ongkir, status pesanan, pembayaran, refund, retur, promo, dan akun. Pilih salah satu di bawah ya.";

export const FALLBACK_2 =
  "Waduh, pertanyaanmu tampaknya di luar basis jawabanku. Supaya cepat selesai, mau aku hubungkan ke agen manusia?";

// ---------- Basis jawaban (intent rule-based) ----------
export const BASE_INTENTS = [
  {
    id: "salam",
    name: "Sapaan",
    keywords: ["halo", "hai", "hello", "pagi", "siang", "sore", "assalamualaikum"],
    questions: ["Halo, ada orang?", "Pagi kak"],
    answer:
      "Halo! Selamat datang di layanan CS Amara Store. Aku Tanyara, asisten virtual yang siap bantu 24/7. Silakan pilih topik di bawah atau langsung ketik pertanyaanmu ya.",
    quick: ["Jam buka toko", "Cek ongkir", "Status pesanan", "Metode pembayaran"],
  },
  {
    id: "jam_buka",
    name: "Jam Buka",
    keywords: ["jam buka", "jam operasional", "buka jam", "tutup jam", "operasional", "kapan buka", "hari minggu buka"],
    questions: ["Toko buka jam berapa?", "Hari Minggu buka nggak?"],
    answer:
      "Amara Store buka Senin–Jumat 08.00–21.00 dan Sabtu 09.00–17.00; hari Minggu libur. Aku (chatbot) tetap standby 24/7 kok. Pengiriman mengikuti jam operasional gudang.",
    quick: ["Cek ongkir", "Metode pembayaran"],
  },
  {
    id: "ongkir",
    name: "Ongkir",
    keywords: ["ongkir", "ongkos kirim", "biaya kirim", "biaya pengiriman", "tarif kirim", "gratis ongkir"],
    questions: ["Ongkir ke Surabaya berapa?", "Ada gratis ongkir?"],
    answer:
      "Ongkir dalam kota mulai Rp10.000 (Reguler 2–3 hari), Rp18.000 (Express besok tiba), dan Rp25.000 (Same Day untuk order sebelum 15.00). Gratis ongkir untuk belanja minimum Rp150.000 ke seluruh Indonesia.",
    quick: ["Metode pembayaran", "Status pesanan"],
  },
  {
    id: "status_pesanan",
    name: "Status Pesanan",
    needsOrder: true,
    keywords: ["status pesanan", "status order", "pesanan saya", "paket saya", "tracking", "lacak", "dikirim", "resi"],
    questions: ["Pesanan saya sudah sampai mana?", "Lacak paket TNY-20451"],
    answer: ASK_ORDER_TEXT,
    quick: null,
  },
  {
    id: "pembayaran",
    name: "Metode Pembayaran",
    keywords: ["bayar", "pembayaran", "payment", "transfer", "qris", "cod", "e-wallet", "virtual account"],
    questions: ["Bisa bayar COD?", "Pembayaran lewat apa saja?"],
    answer:
      "Pembayaran bisa lewat transfer bank, QRIS, e-wallet, dan COD (khusus Jabodetabek, maksimum Rp1.000.000). Pesanan diproses setelah pembayaran terkonfirmasi otomatis.",
    quick: ["Cek ongkir", "Status pesanan"],
  },
  {
    id: "refund",
    name: "Refund",
    keywords: ["refund", "uang kembali", "pengembalian dana", "dana kembali", "uang saya"],
    questions: ["Refund berapa lama masuk?", "Kapan uang saya kembali?"],
    answer:
      "Refund diproses maksimal 3 hari kerja setelah pengajuan disetujui, dikembalikan ke metode pembayaran awal. Syaratnya: pesanan belum digunakan dan diajukan maksimal 7 hari sejak diterima.",
    quick: ["Status pesanan", "Bicara dengan agen"],
  },
  {
    id: "retur",
    name: "Retur & Penukaran",
    keywords: ["retur", "tukar barang", "penukaran", "barang rusak", "barang cacat", "salah ukuran", "salah kirim"],
    questions: ["Barang saya rusak, mau retur", "Bisa tukar ukuran?"],
    answer:
      "Bisa retur/tukar dalam 7 hari sejak paket diterima. Buka menu Pesanan → Ajukan Retur, upload foto produk dan kemasan, kurir kami jemput gratis dalam 1×24 jam.",
    quick: ["Refund", "Bicara dengan agen"],
  },
  {
    id: "kirim_lambat",
    name: "Pengiriman Lambat",
    keywords: ["lambat", "telat", "terlambat", "belum sampai", "lama sekali", "delay", "kapan sampai"],
    questions: ["Paket saya lambat sekali", "Kapan sampai ya?"],
    answer:
      "Mohon maaf ya paketnya molor. Coba ketik kode pesananmu (TNY-xxxxx) biar aku cek posisinya. Kalau sudah lewat 3 hari dari estimasi, aku langsung eskalasi ke tim logistik.",
    quick: ["Status pesanan", "Bicara dengan agen"],
  },
  {
    id: "akun",
    name: "Akun & Login",
    keywords: ["login", "password", "daftar", "akun", "otp", "masuk"],
    questions: ["Lupa password gimana?", "Cara daftar akun?"],
    answer:
      "Lupa password? Klik 'Lupa Password' di halaman login, lalu ikuti tautan yang dikirim ke emailmu (cek juga folder spam). Belum punya akun? Daftar gratis pakai email atau nomor HP.",
    quick: ["Bicara dengan agen"],
  },
  {
    id: "promo",
    name: "Promo",
    keywords: ["promo", "diskon", "voucher", "kupon", "kode promo", "cashback"],
    questions: ["Ada promo bulan ini?", "Voucher diskon dong"],
    answer:
      "Promo bulan ini: kode AMARA10 — diskon 10% (maksimum Rp25.000) untuk minimal belanja Rp100.000, berlaku sampai akhir bulan. Gratis ongkir otomatis untuk belanja di atas Rp150.000.",
    quick: ["Metode pembayaran", "Cek ongkir"],
  },
  {
    id: "terima_kasih",
    name: "Terima Kasih",
    keywords: ["terima kasih", "makasih", "thanks", "thank you", "oke sip", "mantap"],
    questions: ["Makasih ya", "Thanks!"],
    answer:
      "Sama-sama! Senang bisa membantu. Kalau nanti butuh apa-apa lagi, aku di sini 24/7 ya. Semangat harimu!",
    quick: null,
  },
  {
    id: "bicara_agen",
    name: "Bicara dengan Agen",
    keywords: ["agen", "manusia", "cs", "admin", "orang asli", "bicara langsung", "customer service"],
    questions: ["Saya mau bicara dengan agen", "Ada orang nggak?"],
    answer: "",
  },
];

// Mesin pencocokan kata kunci: hitung skor tiap intent, ambil tertinggi.
export function matchIntent(text, intents) {
  const t = String(text || "").toLowerCase();
  if (!t) return null;
  let best = null;
  let bestScore = 0;
  for (const it of intents) {
    let score = 0;
    for (const kw of it.keywords || []) {
      if (t.includes(kw.toLowerCase())) score += kw.length >= 5 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = it;
    }
  }
  return bestScore > 0 ? best : null;
}

// ---------- Canned responses (panel agen) ----------
export const CANNED = [
  "Halo, terima kasih sudah menunggu! Saya dari Tim Tanyara, ada yang bisa dibantu?",
  "Bisa bantu sertakan kode pesanan (TNY-xxxxx) supaya saya cek lebih cepat?",
  "Mohon maaf atas kendalanya. Saya teruskan ke tim terkait dan kabari maksimal 1×24 jam ya.",
  "Pengajuan refund sudah saya teruskan ke tim keuangan, estimasi masuk 3 hari kerja.",
  "Sip, sudah saya catat. Ada lagi yang bisa saya bantu?",
  "Terima kasih sudah menghubungi Tanyara. Senang bisa membantu!",
];

export const AGENTS = [
  { id: "a1", name: "Raka Pratama", shift: "08.00–16.00", chats: 6 },
  { id: "a2", name: "Dewi Anggraini", shift: "16.00–24.00", chats: 9 },
];

// ---------- Percakapan mock untuk panel agen ----------
function mockConvs() {
  return [
    {
      id: "c1",
      name: "Rina Kartika",
      channel: "Web Widget",
      status: "menunggu",
      handler: "queue",
      escalatedAt: Date.now() - 5 * 60000,
      unread: true,
      mine: false,
      messages: [
        mk("customer", "Halo, saya mau tanya refund. Pesanan TNY-20410 sudah saya ajukan 5 hari lalu tapi dana belum masuk.", 14),
        mk("bot", "Mohon maaf atas keterlambatannya, Bu Rina. Refund normalnya masuk maksimal 3 hari kerja setelah disetujui. Boleh saya cek dulu status pengajuannya?", 13, { chips: ["Refund", "Bicara dengan agen"] }),
        mk("customer", "Sudah lewat 3 hari kerja. Ini yang ke-dua kalinya saya tanya.", 8),
        mk("bot", "Mohon maaf sekali lagi. Karena melewati estimasi, sebaiknya percakapan ini saya teruskan ke agen manusia ya, biar bisa dicek langsung ke tim keuangan.", 7, { offer: true }),
        mk("customer", "Iya dong, hubungkan ke agen.", 6),
        mk("system", "Percakapan dieskalasi ke agen manusia.", 6),
        mk("bot", "Kamu ada di antrean nomor 2 — estimasi tunggu ±3 menit.", 5),
      ],
    },
    {
      id: "c2",
      name: "Budi Santoso",
      channel: "Web Widget",
      status: "bot",
      handler: "bot",
      escalatedAt: null,
      unread: false,
      mine: false,
      messages: [
        mk("customer", "Halo, ongkir ke Surabaya berapa ya?", 22),
        mk("bot", "Halo Kak Budi! Ongkir Reguler ke Surabaya mulai Rp12.000 (2–3 hari) dan Express Rp20.000 (besok tiba). Gratis ongkir kalau belanja di atas Rp150.000.", 21, { chips: ["Metode pembayaran", "Status pesanan"] }),
        mk("customer", "Oke sip, makasih infonya.", 18),
        mk("bot", "Sama-sama! Kalau ada yang mau ditanyakan lagi, aku standby 24/7 ya.", 17),
      ],
    },
    {
      id: "c3",
      name: "Siti Rahmawati",
      channel: "WhatsApp",
      status: "dibahas",
      handler: "agent",
      agentName: "Dewi Anggraini",
      escalatedAt: Date.now() - 47 * 60000,
      unread: false,
      mine: false,
      messages: [
        mk("customer", "Halo kemarin, barang saya sampai dalam kondisi pecah. Ini gimana ya?", 55),
        mk("bot", "Wah, mohon maaf sekali, Bu Siti. Barang rusak saat pengiriman bisa diajukan retur penggantian — bebas biaya. Ajukan dalam 7 hari sejak diterima lewat menu Pesanan → Ajukan Retur, lalu upload foto produk dan kemasan ya.", 54, { chips: ["Retur", "Bicara dengan agen"] }),
        mk("customer", "Saya bingung cara uploadnya, sudah coba gagal terus.", 50),
        mk("bot", "Hmm, untuk kendala teknis seperti ini lebih baik ditangani agen langsung ya. Mau saya hubungkan?", 49, { offer: true }),
        mk("customer", "Iya tolong, cepat ya.", 48),
        mk("system", "Percakapan dieskalasi ke agen manusia.", 47),
        mk("bot", "Kamu ada di antrean nomor 1. Mohon tunggu sebentar.", 46),
        mk("system", "Agen Dewi Anggraini bergabung ke percakapan.", 43),
        mk("agent", "Halo Bu Siti, saya Dewi dari Tim Tanyara. Mohon maaf atas pengalamannya tadi. Biar lebih mudah, bisa kirim foto kerusakan langsung ke chat ini? Nanti saya bantu proses returnya sekaligus.", 42),
        mk("customer", "Ini sudah saya kirim fotonya. Mohon diproses ya, terima kasih.", 40),
      ],
    },
    {
      id: "c4",
      name: "Agus Prasetyo",
      channel: "Web Widget",
      status: "selesai",
      handler: "bot",
      escalatedAt: null,
      unread: false,
      mine: false,
      messages: [
        mk("customer", "Malam, pesanan TNY-11209 saya sudah sampai mana ya?", 95),
        mk("bot", "Malam, Pak Agus! Ini status pesanan Anda:", 94, { order: ORDERS[2] }),
        mk("customer", "Oh sudah sampai ternyata, makasih banyak ya.", 92),
        mk("bot", "Sama-sama! Jangan lupa beri ulasan produknya ya. Ada lagi yang bisa dibantu?", 91, { chips: ["Promo", "Cek ongkir"] }),
        mk("system", "Percakapan selesai — dijawab penuh oleh bot tanpa eskalasi.", 90),
      ],
    },
    {
      id: "c5",
      name: "Mega Puspita",
      channel: "Web Widget",
      status: "bot",
      handler: "bot",
      escalatedAt: null,
      unread: false,
      mine: false,
      messages: [
        mk("customer", "Kak, ada promo bulan ini?", 26),
        mk("bot", "Ada, Kak Mega! Pakai kode AMARA10 untuk diskon 10% (maksimum Rp25.000) minimal belanja Rp100.000 — berlaku sampai akhir bulan. Bonus: gratis ongkir otomatis untuk belanja di atas Rp150.000.", 25, { chips: ["Metode pembayaran", "Cek ongkir"] }),
        mk("customer", "Kodenya berlaku buat semua produk?", 24),
        mk("bot", "Berlaku untuk semua produk kecuali kategori gift card ya, Kak. Kalau ada kendala saat pakai kode, kabari aku lagi ya.", 23),
      ],
    },
    {
      id: "c6",
      name: "Hendra Gunawan",
      channel: "WhatsApp",
      status: "menunggu",
      handler: "queue",
      escalatedAt: Date.now() - 4 * 60000,
      unread: true,
      mine: false,
      messages: [
        mk("customer", "Paket saya udah 4 hari belum sampai. Estimasi katanya 2 hari. Ini gimana???", 9),
        mk("bot", "Mohon maaf banget, Pak Hendra, paketnya molor. Boleh ketik kode pesananmu (format TNY-xxxxx) biar saya cek posisinya sekarang.", 8, { chips: ["Status pesanan", "Bicara dengan agen"] }),
        mk("customer", "TNY-30884. Dan tolong jangan balas pake template lagi, saya sudah chat 3 kali.", 7),
        mk("bot", "Maaf, kode TNY-30884 tidak ada di data demo. Coba kode contoh: TNY-20451, TNY-30777, atau TNY-11209 ya.", 6),
        mk("customer", "Bukan itu maksud saya. Ayo tolong disambungkan ke agen manusia sekarang.", 5),
        mk("system", "Percakapan dieskalasi ke agen manusia.", 4),
        mk("bot", "Kamu ada di antrean nomor 2 — mohon tunggu sebentar.", 3),
      ],
    },
  ];
}

// ---------- Percakapan milik pengunjung demo ----------
export function freshMe() {
  return {
    id: "me",
    name: "Kamu (Pelanggan Demo)",
    channel: "Web Widget",
    status: "bot",
    handler: "bot",
    agentName: null,
    escalatedAt: null,
    unread: true,
    mine: true,
    fallbacks: 0,
    awaiting: null,
    messages: [
      mk(
        "bot",
        "Halo! Aku Tanyara, asisten CS demo. Tanya apa aja: jam buka, ongkir, status pesanan, refund, promo — atau pilih topik di bawah ya.",
        0,
        { chips: DEFAULT_CHIPS }
      ),
    ],
  };
}

export function buildMockConvs() {
  return mockConvs();
}
