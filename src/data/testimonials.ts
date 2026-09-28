export type TestimonialGroup = "guru" | "spesialis" | "umum";

export interface Testimonial {
  id: number;
  text: string;
  categoryTitle: string;
  group: TestimonialGroup;
  date?: string;
  laoshi?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Asri cocok sama laoshi, cara belajarnya mudah di pahami, laose juga sabar, baik, cara menyampaikan pelajaran nya jelas dan sangat akurat 🥰",
    categoryTitle: "Cara Mengajar Jelas & Akurat",
    group: "umum",
    date: "Terdahulu"
  },
  {
    id: 2,
    text: "Selama belajar sama laoshi cara penyampaiannya simple dan mudah dimengerti, jadi saya belajarnya enjoy aja malah kadang-kadang gak pernah me-review tapi mudah diingat bukan sekedar menghafal mati.",
    categoryTitle: "Mudah Dimengerti & Enjoy",
    group: "umum",
    date: "Terdahulu"
  },
  {
    id: 3,
    text: "Seru kok belajar sama Laoshi Tasyaaa😉",
    categoryTitle: "Belajar Seru & Asik",
    group: "guru",
    laoshi: "Tasya Laoshi",
    date: "Terdahulu"
  },
  {
    id: 4,
    text: "老師 (Laoshi) paham materinya, ilmunya 很好 (sangat baik). Dari yang cuma ingat 我你一二三四謝謝大便小便 (saya, kamu, satu, dua, tiga, empat, terima kasih, buang air besar, buang air kecil) dan sebagainya, jadi belajar grammar, new vocab, pronunciation. 謝謝老師 (Terima kasih Laoshi) Weng dan 老師 (Laoshi) Michelle 👌🏽",
    categoryTitle: "Peningkatan Kemampuan Signifikan",
    group: "umum",
    laoshi: "Weng & Michelle",
    date: "27 Februari"
  },
  {
    id: 5,
    text: "Aku happy Laoshi, aku kurang di nada dan Laoshi sabar banget ngajarnya, walaupun belum lancar hope seterusnya nanti makin bisa dengan bimbingan Laoshi Kelly 🫰🏽",
    categoryTitle: "Sabar & Membimbing",
    group: "guru",
    laoshi: "Kelly Laoshi",
    date: "7 Maret"
  },
  {
    id: 6,
    text: "So far masukan belum ada. Tapi aku suka kedetailannya pas bedah hanzi, jadi lebih gampang inget sih, walaupun gak tau artinya bisa nangkep konteks hanzinya tentang apa.",
    categoryTitle: "Bedah Hanzi Detail & Mudah Dipahami",
    group: "umum",
    date: "7 Maret"
  },
  {
    id: 7,
    text: "Halo, overall aku ga expect sih Laoshinya itu energik bangettt, aku kira bakal belajar yang yaudah les pada umumnya gitu ternyata gurunya Gen Z gaul 😎 WKWKWK. Apalagi aku tuh belajarnya setelah pulang kerja jadi bener-bener mepet dan ya kalau habis kerja pasti energi sudah habis seharian, tapi Laoshi Tasya bisa ngebawa aku buat energik balik buat belajar.",
    categoryTitle: "Asik, Fun, & Energik",
    group: "guru",
    laoshi: "Tasya Laoshi",
    date: "8 Maret"
  },
  {
    id: 8,
    text: "Bisaa dong hehe.. Aku ga ada masukan yang gimana-gimana sih soalnya aku kayanya cocok aja sama metode belajarnya, terus Laoshinya juga asik dan bisa aku tanya-tanya jugaa. Soalnya kalau nanya ke temen Taiwan gitu kaya ga enak aja minta jelasinnya atau aku tetep ga paham juga, jadi semoga bisa membantu aku bgt kedepannya 🥰",
    categoryTitle: "Metode Belajar Asik & Solutif (Mandarin Taiwan)",
    group: "spesialis",
    date: "23 Maret"
  },
  {
    id: 9,
    text: "Murid 1: Dari pertemuan pertama oke banget sihh, langsung semangat belajar nambah 😁😁, pembelajarannya enak dijelasin 1-1 dan ditanya udh paham belom, ada pertanyaan tdk. Laoshinya terbaikkk emang 🥰🥰\n\nMurid 2: Iya Laoshi, untuk sejauh ini oke kok hehe.. Laoshi ngajarin nya jelas dan mudah di pahami. Interaktif juga 😀",
    categoryTitle: "Interaktif & Jelas",
    group: "guru",
    laoshi: "Ling Ling Laoshi",
    date: "25 April"
  },
  {
    id: 10,
    text: "Halo Laoshi, untuk sama Laoshi Olive saya cukup mengerti untuk penjelasannya dari beliau detail dan Ls Olive juga asik hehe. Awalnya saya takut awkward tapi ternyata Ls Olive ga seserem itu xixi 🫰🏽 Hehehe iya Laoshii jadi suasananya saya bisa enjoy untuk les nya, xiexie Laoshi 🫶🏽",
    categoryTitle: "Detail & Asik",
    group: "guru",
    laoshi: "Olive Laoshi",
    date: "25 April"
  },
  {
    id: 11,
    text: "Murid: Xiexiee Laoshii\n\nTim Ling Chinese Lab: Xiexieee ceeee 🥰🤝 Cari keren2 dari HSK 1 skrg HSK 4 😍🤝",
    categoryTitle: "Dari Nol hingga HSK 4",
    group: "umum",
    date: "3 Mei"
  },
  {
    id: 12,
    text: "Rekomendasi dari Akun Lain (Hualieen): Kalau kakak mau aku bisa saranin les TOCFL yang bagus kak. Bisa coba dicari IG-nya @lingchineselab ya kak. Pengajaran nya bener-bener bagus banget kak apalagi untuk TOCFL.\n\nCalon Murid: Ini Mandarin Taiwan ka? Okee kaa aku cari dulu yaa. Kaa sebelumnya makasih banyak yaaa.\n\nHualieen: Iya bener banget kak.",
    categoryTitle: "Rekomendasi Kursus TOCFL Terbaik",
    group: "spesialis",
    date: "Baru-baru ini"
  },
  {
    id: 13,
    text: "Aku nyari mentor buat ini susah yaa ka yg Chinese Taiwan. Kebanyakan aku dpt yg China. Trus tadi malam aku nemu akun yg bahas bahasa Taiwan gitu, aku DM tapi mereka ga buka les katanya, trus aku dikasih tau akun kakak disuruh les TOCFL di kakak, aku bersyukur banget.",
    categoryTitle: "Mentor Spesialis Mandarin Taiwan yang Langka",
    group: "spesialis",
    date: "Baru-baru ini"
  }
];
