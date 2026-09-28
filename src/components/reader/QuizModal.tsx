import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2, XCircle, Trophy, RefreshCcw, ArrowRight } from 'lucide-react';

export type Question = {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  answer: string;
  explanation: string;
};

// --- DATA KUIS ---
export const QUIZ_DATABASE: Record<number, Question[]> = {
  11: [
    { id: 1, question: 'Hanzi yang tepat untuk melengkapi kalimat "Saya ... tiga kali makan setiap hari" adalah:', options: [{ label: 'A', text: '喝 (hē)' }, { label: 'B', text: '吃 (chī)' }, { label: 'C', text: '咬 (yǎo)' }, { label: 'D', text: '吞 (tūn)' }], answer: 'B', explanation: '吃 (chī) berarti "makan", sehingga sesuai dengan kalimat "makan tiga kali sehari".' },
    { id: 2, question: 'Hanzi yang tepat untuk melengkapi "Guru ... sebuah pertanyaan" adalah:', options: [{ label: 'A', text: '答 (dá)' }, { label: 'B', text: '叫 (jiào)' }, { label: 'C', text: '问 (wèn)' }, { label: 'D', text: '告 (gào)' }], answer: 'C', explanation: '问 (wèn) berarti "bertanya", sehingga guru mengajukan sebuah pertanyaan.' },
    { id: 3, question: 'Pinyin yang benar untuk 喝 (minum) adalah ...', options: [{ label: 'A', text: 'hē' }, { label: 'B', text: 'hé' }, { label: 'C', text: 'hě' }, { label: 'D', text: 'hè' }], answer: 'A', explanation: '喝 (hē) dibaca hē dengan nada pertama ( ̄ ).' },
    { id: 4, question: 'Dia bernyanyi sangat ... !', options: [{ label: 'A', text: '响 (xiǎng)' }, { label: 'B', text: '味 (wèi)' }, { label: 'C', text: '善 (shàn)' }, { label: 'D', text: '古 (gǔ)' }], answer: 'A', explanation: '响 (xiǎng) berarti "nyaring", sesuai untuk menggambarkan suara nyanyian.' },
    { id: 5, question: 'Arti dari 吹 (chuī) adalah ...', options: [{ label: 'A', text: 'Menghisap' }, { label: 'B', text: 'Menghembuskan / meniup' }, { label: 'C', text: 'Memuntahkan' }, { label: 'D', text: 'Mengunyah' }], answer: 'B', explanation: '吹 (chuī) berarti meniup atau menghembuskan udara.' },
    { id: 6, question: '... kue ini sangat enak.', options: [{ label: 'A', text: '嘴 (zuǐ)' }, { label: 'B', text: '喉咙 (hóu lóng)' }, { label: 'C', text: '味道 (wèi dào)' }, { label: 'D', text: '唇 (chún)' }], answer: 'C', explanation: '味道 (wèi dào) berarti "rasa", sehingga kalimat membahas rasa kue.' },
    { id: 7, question: 'Hanzi yang berarti "tenggorokan" adalah ...', options: [{ label: 'A', text: '喉咙 (hóu long)' }, { label: 'B', text: '唇 (chún)' }, { label: 'C', text: '嘴 (zuǐ)' }, { label: 'D', text: '口 (kǒu)' }], answer: 'A', explanation: '喉咙 (hóu long) berarti "tenggorokan".' },
    { id: 8, question: 'Tolong ... saya nomor teleponmu.', options: [{ label: 'A', text: '听 (tīng)' }, { label: 'B', text: '告诉 (gàosu)' }, { label: 'C', text: '叫 (jiào)' }, { label: 'D', text: '吸 (xī)' }], answer: 'B', explanation: '告 (gào) (dalam 告诉 (gào sù)) berarti "memberi tahu".' },
    { id: 9, question: 'Pasangan yang TEPAT antara Hanzi dan artinya adalah ...', options: [{ label: 'A', text: '左 (zuǒ) = kanan' }, { label: 'B', text: '右 (yòu) = kiri' }, { label: 'C', text: '和 (hé) = dan / dengan' }, { label: 'D', text: '台 (tái) = kuno' }], answer: 'C', explanation: '和 (hé) digunakan untuk menghubungkan dua kata atau lebih.' },
    { id: 10, question: 'Pilih hanzi yang berarti "menelan":', options: [{ label: 'A', text: '嚼 (jiáo)' }, { label: 'B', text: '吐 (tǔ)' }, { label: 'C', text: '吞 (tūn)' }, { label: 'D', text: '吸 (xī)' }], answer: 'C', explanation: '吞 (tūn) berarti "menelan", yaitu memasukkan makanan ke dalam tenggorokan.' },
  ],
  16: [
    { id: 1, question: 'Hanzi yang berarti "membaca" adalah:', options: [{ label: 'A', text: '读 (dú)' }, { label: 'B', text: '写 (xiě)' }, { label: 'C', text: '听 (tīng)' }, { label: 'D', text: '说 (shuō)' }], answer: 'A', explanation: '读 (dú) berarti "membaca", sesuai dengan kegiatan guru membaca teks pelajaran.' },
    { id: 2, question: 'Hanzi yang berarti "bahasa" adalah:', options: [{ label: 'A', text: '言 (yán)' }, { label: 'B', text: '语 (yǔ)' }, { label: 'C', text: '词 (cí)' }, { label: 'D', text: '话 (huà)' }], answer: 'B', explanation: '语 (yǔ) berarti "bahasa", sehingga kalimat berarti "berbicara tiga bahasa".' },
    { id: 3, question: 'Hanzi yang berarti "mengatakan / mengajukan" adalah:', options: [{ label: 'A', text: '叫 (jiào)' }, { label: 'B', text: '答 (dá)' }, { label: 'C', text: '问 (wèn)' }, { label: 'D', text: '说 (shuō)' }], answer: 'D', explanation: '说 (shuō) berarti "mengatakan" atau "mengajukan", sesuai dengan satu pertanyaan.' },
    { id: 4, question: 'Hanzi yang digunakan untuk meminta bantuan dengan sopan (tolong/silakan):', options: [{ label: 'A', text: '求 (qiú)' }, { label: 'B', text: '请 (qǐng)' }, { label: 'C', text: '谢 (xiè)' }, { label: 'D', text: '让 (ràng)' }], answer: 'B', explanation: '请 (qǐng) berarti "tolong" atau "silakan".' },
    { id: 5, question: 'Hanzi yang berarti "mengingat / menghafal" adalah:', options: [{ label: 'A', text: '记 (jì)' }, { label: 'B', text: '忘 (wàng)' }, { label: 'C', text: '想 (xiǎng)' }, { label: 'D', text: '念 (niàn)' }], answer: 'A', explanation: '记 (jì) berarti "mengingat" atau "menghafal", sesuai dengan mengingat nama seseorang.' },
    { id: 6, question: 'Hanzi yang sesuai dengan ungkapan terima kasih adalah:', options: [{ label: 'A', text: '客气 (kè qì)' }, { label: 'B', text: '对不起 (duì bù qǐ)' }, { label: 'C', text: '感谢 (gǎnxiè)' }, { label: 'D', text: '没关系 (méi guān xì)' }], answer: 'C', explanation: '谢 (xiè) berarti "berterima kasih".' },
    { id: 7, question: 'Hanzi yang berarti "mengenali" adalah:', options: [{ label: 'A', text: '认 (rèn)' }, { label: 'B', text: '识 (shí)' }, { label: 'C', text: '知 (zhī)' }, { label: 'D', text: '觉 (jué)' }], answer: 'A', explanation: '认 (rèn) berarti "mengenali", sehingga 认错人 (rèn cuò rén) berarti "salah mengenali orang".' },
    { id: 8, question: 'Hanzi yang berarti "membahas / berdiskusi" adalah:', options: [{ label: 'A', text: '谈 (tán)' }, { label: 'B', text: '论 (lùn)' }, { label: 'C', text: '讲 (jiǎng)' }, { label: 'D', text: '议 (yì)' }], answer: 'A', explanation: '谈 (tán) berarti "membahas" atau "berdiskusi", sesuai dengan rencana kerja.' },
    { id: 9, question: 'Hanzi yang berarti "kebohongan" adalah:', options: [{ label: 'A', text: '真 (zhēn)' }, { label: 'B', text: '谎 (huǎng)' }, { label: 'C', text: '骗 (piàn)' }, { label: 'D', text: '假 (jiǎ)' }], answer: 'B', explanation: '谎 (huǎng) berarti "kebohongan".' },
    { id: 10, question: 'Hanzi yang berarti "mengatur / menyesuaikan" adalah:', options: [{ label: 'A', text: '调 (tiáo)' }, { label: 'B', text: '理 (lǐ)' }, { label: 'C', text: '整 (zhěng)' }, { label: 'D', text: '治 (zhì)' }], answer: 'A', explanation: '调 (tiáo) berarti "mengatur" atau "menyesuaikan", sesuai dengan mengatur suhu AC.' },
  ],
  24: [
    { id: 1, question: 'Hanzi yang berarti "lapar" adalah:', options: [{ label: 'A', text: '饱 (bǎo)' }, { label: 'B', text: '饿 (è)' }, { label: 'C', text: '渴 (kě)' }, { label: 'D', text: '累 (lèi)' }], answer: 'B', explanation: '饿 (è) berarti "lapar", sesuai dengan kondisi tidak makan pagi.' },
    { id: 2, question: 'Hanzi yang berarti "nasi / makanan" adalah:', options: [{ label: 'A', text: '饭 (fàn)' }, { label: 'B', text: '菜 (cài)' }, { label: 'C', text: '肉 (ròu)' }, { label: 'D', text: '面 (miàn)' }], answer: 'A', explanation: '饭 (fàn) berarti "nasi" atau "makanan".' },
    { id: 3, question: 'Pinyin yang benar untuk 饺 (jiǎo) adalah:', options: [{ label: 'A', text: 'jiāo' }, { label: 'B', text: 'jiǎo' }, { label: 'C', text: 'jiáo' }, { label: 'D', text: 'jiào' }], answer: 'B', explanation: '饺 (jiǎo) dibaca jiǎo dengan nada ketiga.' },
    { id: 4, question: 'Hanzi yang digunakan dalam kata "bakpao" adalah:', options: [{ label: 'A', text: '饼 (bǐng)' }, { label: 'B', text: '包 (bāo)' }, { label: 'C', text: '糕 (gāo)' }, { label: 'D', text: '卷 (juàn)' }], answer: 'B', explanation: '包 (bāo) dalam kata 包子 (bāo zǐ) berarti "bakpao".' },
    { id: 5, question: 'Arti dari 馆 (guǎn) adalah:', options: [{ label: 'A', text: 'Restoran / tempat' }, { label: 'B', text: 'Jalan' }, { label: 'C', text: 'Rumah' }, { label: 'D', text: 'Sekolah' }], answer: 'A', explanation: '馆 (guǎn) berarti tempat atau bangunan tertentu (seperti perpustakaan atau restoran).' },
    { id: 6, question: 'Hanzi yang berarti "teh" adalah:', options: [{ label: 'A', text: '水 (shuǐ)' }, { label: 'B', text: '酒 (jiǔ)' }, { label: 'C', text: '茶 (chá)' }, { label: 'D', text: '奶 (nǎi)' }], answer: 'C', explanation: '茶 (chá) berarti "teh".' },
    { id: 7, question: 'Hanzi yang berarti "gula" adalah:', options: [{ label: 'A', text: '盐 (garam)' }, { label: 'B', text: '酱 (saus)' }, { label: 'C', text: '糖 (táng)' }, { label: 'D', text: '醋 (cuka)' }], answer: 'C', explanation: '糖 (táng) berarti "gula".' },
    { id: 8, question: 'Hanzi yang berarti "harum / aroma enak" adalah:', options: [{ label: 'A', text: '香 (xiāng)' }, { label: 'B', text: '臭 (chòu)' }, { label: 'C', text: '酸 (suān)' }, { label: 'D', text: '甜 (tián)' }], answer: 'A', explanation: '香 (xiāng) berarti "harum" atau memiliki aroma yang enak.' },
    { id: 9, question: 'Arti dari 营 (yíng) adalah:', options: [{ label: 'A', text: 'Bekerja' }, { label: 'B', text: 'Bermain' }, { label: 'C', text: 'gizi / mengelola' }, { label: 'D', text: 'Tidur' }], answer: 'C', explanation: '营 (yíng) dapat berarti "mengelola" atau terdapat dalam kata 营养 (yíng yǎng) yang berarti gizi.' },
    { id: 10, question: 'Hanzi yang berarti nasi atau makanan yang sudah dimasak adalah:', options: [{ label: 'A', text: '米 (mǐ)' }, { label: 'B', text: '谷 (gǔ)' }, { label: 'C', text: '饭 (fàn)' }, { label: 'D', text: '粥 (zhōu)' }], answer: 'C', explanation: '饭 (fàn) berarti nasi atau makanan yang sudah dimasak.' },
  ],
  31: [
    { id: 1, question: 'Hanzi yang berarti "haus" adalah:', options: [{ label: 'A', text: '渴 (kě)' }, { label: 'B', text: '饿 (è)' }, { label: 'C', text: '冷 (lěng)' }, { label: 'D', text: '热 (rè)' }], answer: 'A', explanation: '渴 (kě) berarti "haus", sesuai dengan kondisi merasa haus karena cuaca panas.' },
    { id: 2, question: 'Hanzi yang berarti "jernih" adalah:', options: [{ label: 'A', text: '浊 (zhuó)' }, { label: 'B', text: '脏 (zāng)' }, { label: 'C', text: '清 (qīng)' }, { label: 'D', text: '净 (jìng)' }], answer: 'C', explanation: '清 (qīng) berarti "jernih", sehingga air sungai yang jernih membuat batu di dasar terlihat.' },
    { id: 3, question: 'Hanzi yang berarti "tenggelam" adalah:', options: [{ label: 'A', text: '浮 (fú)' }, { label: 'B', text: '沉 (chén)' }, { label: 'C', text: '没 (méi)' }, { label: 'D', text: '落 (luò)' }], answer: 'B', explanation: '沉 (chén) berarti "tenggelam", yaitu bergerak turun ke dalam air.' },
    { id: 4, question: 'Hanzi yang berarti "mencuci" adalah:', options: [{ label: 'A', text: '洗 (xǐ)' }, { label: 'B', text: '刷 (shuā)' }, { label: 'C', text: '擦 (cā)' }, { label: 'D', text: '扫 (sǎo)' }], answer: 'A', explanation: '洗 (xǐ) berarti "mencuci", sesuai dengan kegiatan mencuci pakaian.' },
    { id: 5, question: 'Hanzi yang berarti "menyiram" adalah:', options: [{ label: 'A', text: '洒 (sǎ)' }, { label: 'B', text: '浇 (jiāo)' }, { label: 'C', text: '泼 (pō)' }, { label: 'D', text: '淋 (lín)' }], answer: 'B', explanation: '浇 (jiāo) berarti "menyiram", digunakan untuk menyiram tanaman atau bunga.' },
    { id: 6, question: 'Hanzi yang berarti "danau" adalah:', options: [{ label: 'A', text: '海 (hǎi)' }, { label: 'B', text: '湖 (hú)' }, { label: 'C', text: '河 (hé)' }, { label: 'D', text: '江 (jiāng)' }], answer: 'B', explanation: '湖 (hú) berarti "danau", tempat ikan dapat berenang.' },
    { id: 7, question: 'Hanzi yang berarti "sup" adalah:', options: [{ label: 'A', text: '汁 (zhī)' }, { label: 'B', text: '汤 (tāng)' }, { label: 'C', text: '水 (shuǐ)' }, { label: 'D', text: '液 (yè)' }], answer: 'B', explanation: '汤 (tāng) berarti "sup", sehingga cocok dengan kalimat tentang makanan yang asin.' },
    { id: 8, question: 'Hanzi yang berarti "air mata" adalah:', options: [{ label: 'A', text: '汗 (keringat)' }, { label: 'B', text: '泪 (lèi)' }, { label: 'C', text: '血 (xuè)' }, { label: 'D', text: '液 (yè)' }], answer: 'B', explanation: '泪 (lèi) berarti "air mata", sesuatu yang mengalir dari wajah.' },
    { id: 9, question: 'Hanzi yang berarti "dangkal" adalah:', options: [{ label: 'A', text: '深 (shēn)' }, { label: 'B', text: '浅 (qiǎn)' }, { label: 'C', text: '低 (dī)' }, { label: 'D', text: '短 (duǎn)' }], answer: 'B', explanation: '浅 (qiǎn) berarti "dangkal", sehingga anak kecil dapat berdiri di kolam.' },
    { id: 10, question: 'Hanzi yang berarti "meluap / bergelombang naik" adalah:', options: [{ label: 'A', text: '涨 (zhǎng)' }, { label: 'B', text: '流 (liú)' }, { label: 'C', text: '涌 (yǒng)' }, { label: 'D', text: '波 (bō)' }], answer: 'C', explanation: '涌 (yǒng) berarti "meluap" atau "bergelombang naik", sesuai dengan air laut yang naik.' },
  ],
  38: [
    { id: 1, question: 'Hanzi yang berarti "menumis" adalah:', options: [{ label: 'A', text: '炒 (chǎo)' }, { label: 'B', text: '煮 (zhǔ)' }, { label: 'C', text: '烤 (kǎo)' }, { label: 'D', text: '蒸 (zhēng)' }], answer: 'A', explanation: '炒 (chǎo) berarti "menumis".' },
    { id: 2, question: 'Hanzi yang berarti "panas" adalah:', options: [{ label: 'A', text: '冷 (lěng)' }, { label: 'B', text: '热 (rè)' }, { label: 'C', text: '温 (wēn)' }, { label: 'D', text: '凉 (liáng)' }], answer: 'B', explanation: '热 (rè) berarti "panas", sesuai dengan cuaca di atas 35°C.' },
    { id: 3, question: 'Hanzi yang berarti "nyala api" adalah:', options: [{ label: 'A', text: '火 (huǒ)' }, { label: 'B', text: '焰 (yàn)' }, { label: 'C', text: '光 (guāng)' }, { label: 'D', text: '烟 (yān)' }], answer: 'B', explanation: '焰 (yàn) berarti "nyala api", menggambarkan besarnya kobaran api saat kebakaran.' },
    { id: 4, question: 'Hanzi yang berarti "memadamkan" adalah:', options: [{ label: 'A', text: '烧 (shāo)' }, { label: 'B', text: '点 (diǎn)' }, { label: 'C', text: '熄 (xī)' }, { label: 'D', text: '灭 (miè)' }], answer: 'C', explanation: '熄 (xī) berarti "memadamkan", digunakan untuk mematikan api atau lilin.' },
    { id: 5, question: 'Pinyin untuk 炸 (zhà) (deep-fry) adalah:', options: [{ label: 'A', text: 'zhà' }, { label: 'B', text: 'zhá' }, { label: 'C', text: 'zhǎ' }, { label: 'D', text: 'zhā' }], answer: 'B', explanation: '炸 (zhà) (deep-fry) dibaca zhá dengan nada kedua.' },
    { id: 6, question: 'Hanzi yang berarti "gosong" adalah:', options: [{ label: 'A', text: '糊 (hú)' }, { label: 'B', text: '黑 (hēi)' }, { label: 'C', text: '焦 (jiāo)' }, { label: 'D', text: '黄 (huáng)' }], answer: 'C', explanation: '焦 (jiāo) berarti "gosong", sehingga roti tidak bisa dimakan.' },
    { id: 7, question: 'Arti dari 灭 (miè) adalah:', options: [{ label: 'A', text: 'Menyalakan' }, { label: 'B', text: 'Memadamkan' }, { label: 'C', text: 'Membakar' }, { label: 'D', text: 'Memasak' }], answer: 'B', explanation: '灭 (miè) berarti "memadamkan" atau "memusnahkan", terutama api.' },
    { id: 8, question: 'Hanzi yang berarti "bencana" adalah:', options: [{ label: 'A', text: '灾 (zāi)' }, { label: 'B', text: '难 (nán)' }, { label: 'C', text: '祸 (huò)' }, { label: 'D', text: '险 (xiǎn)' }], answer: 'A', explanation: '灾 (zāi) berarti "bencana", seperti gempa bumi dan banjir.' },
    { id: 9, question: 'Arti dari 炖 (dùn) adalah:', options: [{ label: 'A', text: 'Menggoreng' }, { label: 'B', text: 'Membakar' }, { label: 'C', text: 'Merebus lama' }, { label: 'D', text: 'Mengukus' }], answer: 'C', explanation: '炖 (dùn) berarti "merebus dalam waktu lama".' },
    { id: 10, question: 'Hanzi yang berarti "arang" adalah:', options: [{ label: 'A', text: '煤 (méi)' }, { label: 'B', text: '炭 (tàn)' }, { label: 'C', text: '灰 (huī)' }, { label: 'D', text: '木 (mù)' }], answer: 'B', explanation: '炭 (tàn) berarti "arang", yaitu bahan bakar yang berasal dari kayu yang dibakar.' },
  ],
  45: [
    { id: 1, question: 'Hanzi yang berarti "cabang / ranting" adalah:', options: [{ label: 'A', text: '叶 (yè)' }, { label: 'B', text: '枝 (zhī)' }, { label: 'C', text: '干 (gān)' }, { label: 'D', text: '根 (gēn)' }], answer: 'B', explanation: '枝 (zhī) berarti "cabang" atau "ranting".' },
    { id: 2, question: 'Hanzi yang berarti "meja / kursi" adalah:', options: [{ label: 'A', text: '桌 (zhuō) / 椅 (yǐ)' }, { label: 'B', text: '床 (chuáng) / 柜 (guì)' }, { label: 'C', text: '门 (mén) / 窗 (chuāng)' }, { label: 'D', text: '灯 (dēng) / 镜 (jìng)' }], answer: 'A', explanation: '桌 (zhuō) berarti "meja" dan 椅 (yǐ) berarti "kursi", sesuai dengan isi sebuah ruangan.' },
    { id: 3, question: 'Pinyin untuk 森 (hutan lebat) adalah:', options: [{ label: 'A', text: 'sēn' }, { label: 'B', text: 'sén' }, { label: 'C', text: 'sěn' }, { label: 'D', text: 'sèn' }], answer: 'A', explanation: '森 (sēn) dibaca sēn dengan nada pertama, yang berarti "hutan lebat".' },
    { id: 4, question: 'Hanzi yang berarti "pohon / akar" adalah:', options: [{ label: 'A', text: '树 (shù) / 根 (gēn)' }, { label: 'B', text: '草 (cǎo) / 花 (huā)' }, { label: 'C', text: '叶 (yè) / 枝 (zhī)' }, { label: 'D', text: '果 (guǒ) / 籽 (zǐ)' }], answer: 'A', explanation: '树 (shù) berarti "pohon" dan 根 (gēn) berarti "akar".' },
    { id: 5, question: 'Arti dari 桥 (qiáo) adalah:', options: [{ label: 'A', text: 'Jalan' }, { label: 'B', text: 'Sungai' }, { label: 'C', text: 'Jembatan' }, { label: 'D', text: 'Gunung' }], answer: 'C', explanation: '桥 (qiáo) berarti "jembatan", yaitu bangunan yang menghubungkan dua tempat.' },
    { id: 6, question: 'Hanzi yang berarti "persik / plum" adalah:', options: [{ label: 'A', text: '桃 (táo) / 梅 (méi)' }, { label: 'B', text: '苹 (píng) / 果 (guǒ)' }, { label: 'C', text: '橘 (jú) / 柚 (yòu)' }, { label: 'D', text: '瓜 (guā) / 豆 (dòu)' }], answer: 'A', explanation: '桃 (táo) berarti "persik" dan 梅 (méi) berarti "plum".' },
    { id: 7, question: 'Hanzi yang berarti "papan" adalah:', options: [{ label: 'A', text: '木 (mù)' }, { label: 'B', text: '板 (bǎn)' }, { label: 'C', text: '块 (kuài)' }, { label: 'D', text: '条 (tiáo)' }], answer: 'B', explanation: '板 (bǎn) berarti "papan", yaitu lempengan kayu atau bahan datar lainnya.' },
    { id: 8, question: 'Hanzi yang berarti "meja" adalah:', options: [{ label: 'A', text: '几 (jǐ)' }, { label: 'B', text: '台 (tái)' }, { label: 'C', text: '桌 (zhuō)' }, { label: 'D', text: '案 (àn)' }], answer: 'C', explanation: '桌 (zhuō) berarti "meja", tempat yang paling umum untuk meletakkan buku.' },
    { id: 9, question: 'Arti dari 楼 (lóu) adalah:', options: [{ label: 'A', text: 'Rumah' }, { label: 'B', text: 'Kamar' }, { label: 'C', text: 'Gedung / lantai' }, { label: 'D', text: 'Atap' }], answer: 'C', explanation: '楼 (lóu) berarti "gedung" atau "lantai" pada sebuah bangunan.' },
    { id: 10, question: 'Hanzi yang berarti "gelas / cangkir" adalah:', options: [{ label: 'A', text: '碗 (wǎn)' }, { label: 'B', text: '杯子 (bēi zi)' }, { label: 'C', text: '盘 (pán)' }, { label: 'D', text: '瓶 (píng)' }], answer: 'B', explanation: '杯子 (bēi zi) berarti "gelas" atau "cangkir", digunakan sebagai wadah minuman.' },
  ],
  53: [
    { id: 1, question: 'Hanzi yang berarti "dia (perempuan)" adalah:', options: [{ label: 'A', text: '他 (tā)' }, { label: 'B', text: '她 (tā)' }, { label: 'C', text: '它 (tā)' }, { label: 'D', text: '男 (nán)' }], answer: 'B', explanation: '她 (tā) berarti "dia" untuk perempuan, sehingga sesuai dengan kata "ibu".' },
    { id: 2, question: 'Hanzi yang berarti "kakak perempuan" dan "adik perempuan" adalah:', options: [{ label: 'A', text: '姐 (jiě) / 妹 (mèi)' }, { label: 'B', text: '哥 (gē) / 弟 (dì)' }, { label: 'C', text: '姑 (gū) / 姨 (yí)' }, { label: 'D', text: '妈 (mā) / 奶 (nǎi)' }], answer: 'A', explanation: '姐 (jiě) berarti "kakak perempuan" dan 妹 (mèi) berarti "adik perempuan".' },
    { id: 3, question: 'Pinyin untuk 女 (perempuan) adalah:', options: [{ label: 'A', text: 'nū' }, { label: 'B', text: 'nǚ' }, { label: 'C', text: 'nú' }, { label: 'D', text: 'nǔ' }], answer: 'B', explanation: '女 (nǚ) dibaca nǚ dengan bunyi ü dan nada ketiga.' },
    { id: 4, question: 'Hanzi yang berarti "indah / hebat / luar biasa" adalah:', options: [{ label: 'A', text: '好 (hǎo)' }, { label: 'B', text: '美 (měi)' }, { label: 'C', text: '妙 (miào)' }, { label: 'D', text: '奇 (qí)' }], answer: 'C', explanation: '妙 (miào) berarti "indah", "hebat", atau "luar biasa".' },
    { id: 5, question: 'Arti dari 妻子 (qī zi) adalah:', options: [{ label: 'A', text: 'Suami' }, { label: 'B', text: 'Istri' }, { label: 'C', text: 'Anak' }, { label: 'D', text: 'Orang tua' }], answer: 'B', explanation: '妻子 (qī zi) berarti "istri".' },
    { id: 6, question: 'Hanzi yang berarti "memaafkan / memohon maaf" adalah:', options: [{ label: 'A', text: '恕 (shù)' }, { label: 'B', text: '怨 (yuàn)' }, { label: 'C', text: '恨 (hèn)' }, { label: 'D', text: '怒 (nù)' }], answer: 'A', explanation: '恕 (shù) berarti "memaafkan" atau "memohon maaf".' },
    { id: 7, question: 'Hanzi yang berarti "pernikahan" adalah:', options: [{ label: 'A', text: '恋 (liàn)' }, { label: 'B', text: '爱 (ài)' }, { label: 'C', text: '婚 (hūn)' }, { label: 'D', text: '情 (qíng)' }], answer: 'C', explanation: '婚 (hūn) berarti "pernikahan", seperti pada kata 婚礼 (hūn lǐ) (upacara pernikahan).' },
    { id: 8, question: 'Hanzi yang berarti "berdandan / rias" adalah:', options: [{ label: 'A', text: '服 (fú)' }, { label: 'B', text: '妆 (zhuāng)' }, { label: 'C', text: '衣 (yī)' }, { label: 'D', text: '打 (dǎ)' }], answer: 'B', explanation: '妆 (zhuāng) berarti "berdandan" atau "rias".' },
    { id: 9, question: 'Arti dari 婶 (shěn) adalah:', options: [{ label: 'A', text: 'Bibi dari ayah' }, { label: 'B', text: 'Bibi dari ibu' }, { label: 'C', text: 'Istri paman' }, { label: 'D', text: 'Kakak ipar perempuan' }], answer: 'C', explanation: '婶 (shěn) berarti "istri paman". 姑 (gū) adalah bibi dari ayah, 姨 (yí) adalah bibi dari ibu, dan 嫂 (sǎo) adalah kakak ipar perempuan.' },
    { id: 10, question: 'Hanzi yang berarti "baik / bagus" adalah:', options: [{ label: 'A', text: '坏 (huài)' }, { label: 'B', text: '错 (cuò)' }, { label: 'C', text: '好 (hǎo)' }, { label: 'D', text: '差 (chà)' }], answer: 'C', explanation: '好 (hǎo) berarti "baik" atau "bagus".' },
  ],
  60: [
    { id: 1, question: 'Hanzi yang berarti "sayur" adalah:', options: [{ label: 'A', text: '肉 (ròu)' }, { label: 'B', text: '菜 (cài)' }, { label: 'C', text: '果 (guǒ)' }, { label: 'D', text: '汤 (tāng)' }], answer: 'B', explanation: '菜 (cài) berarti "sayur", sesuai dengan kegiatan menumis di dapur.' },
    { id: 2, question: 'Hanzi yang berarti "teh" adalah:', options: [{ label: 'A', text: '水 (shuǐ)' }, { label: 'B', text: '酒 (jiǔ)' }, { label: 'C', text: '茶 (chá)' }, { label: 'D', text: '奶 (nǎi)' }], answer: 'C', explanation: '茶 (chá) berarti "teh", sehingga sesuai dengan kalimat "minum segelas teh".' },
    { id: 3, question: 'Pinyin untuk 草 (rumput) adalah:', options: [{ label: 'A', text: 'cǎo' }, { label: 'B', text: 'cáo' }, { label: 'C', text: 'cāo' }, { label: 'D', text: 'cào' }], answer: 'A', explanation: '草 (cǎo) dibaca cǎo dengan nada ketiga.' },
    { id: 4, question: 'Hanzi yang berarti "bunga" adalah:', options: [{ label: 'A', text: '树 (shù)' }, { label: 'B', text: '叶 (yè)' }, { label: 'C', text: '花 (huā)' }, { label: 'D', text: '草 (cǎo)' }], answer: 'C', explanation: '花 (huā) berarti "bunga", sehingga sesuai dengan sesuatu yang harum.' },
    { id: 5, question: 'Arti dari 药 (yào) adalah:', options: [{ label: 'A', text: 'Racun' }, { label: 'B', text: 'Obat' }, { label: 'C', text: 'Pil' }, { label: 'D', text: 'Suntik' }], answer: 'B', explanation: '药 (yào) berarti "obat".' },
    { id: 6, question: 'Hanzi yang berarti "stroberi" adalah:', options: [{ label: 'A', text: '苹果 (píng guǒ)' }, { label: 'B', text: '草莓 (cǎoméi)' }, { label: 'C', text: '香蕉 (xiāng jiāo)' }, { label: 'D', text: '西瓜 (xī guā)' }], answer: 'B', explanation: '草莓 (cǎo méi) berarti "stroberi".' },
    { id: 7, question: 'Hanzi yang berarti "bawang putih" adalah:', options: [{ label: 'A', text: '葱 (cōng)' }, { label: 'B', text: '蒜 (suàn)' }, { label: 'C', text: '姜 (jiāng)' }, { label: 'D', text: '椒 (jiāo)' }], answer: 'B', explanation: '蒜 (suàn) berarti "bawang putih", yang sering digunakan sebagai bumbu masakan.' },
    { id: 8, question: 'Hanzi yang berarti "pahit" adalah:', options: [{ label: 'A', text: '甜 (tián)' }, { label: 'B', text: '酸 (suān)' }, { label: 'C', text: '苦 (kǔ)' }, { label: 'D', text: '辣 (là)' }], answer: 'C', explanation: '苦 (kǔ) berarti "pahit", rasa yang sering dikaitkan dengan obat.' },
    { id: 9, question: 'Arti dari 荷 (hé) adalah:', options: [{ label: 'A', text: 'Krisan' }, { label: 'B', text: 'Bunga teratai' }, { label: 'C', text: 'Plum' }, { label: 'D', text: 'Mawar' }], answer: 'B', explanation: '荷 (hé) berarti "teratai" (lotus). 菊 (jú) berarti krisan dan 梅 (méi) berarti plum.' },
    { id: 10, question: 'Hanzi 花 (huā) berarti ... (Berdasarkan kunci jawaban buku):', options: [{ label: 'A', text: 'Rumput / Bunga' }, { label: 'B', text: 'Pohon' }, { label: 'C', text: 'Akar' }, { label: 'D', text: 'Daun' }], answer: 'A', explanation: '花 (huā) pada umumnya berarti bunga (namun dalam konteks soal/kunci jawaban ini juga merujuk ke tanaman sejenisnya).' },
  ],
  67: [
    { id: 1, question: 'Hanzi yang berarti "menelepon" pada kata 打电话 (dǎ diàn huà) adalah:', options: [{ label: 'A', text: '打 (dǎ)' }, { label: 'B', text: '拍 (pāi)' }, { label: 'C', text: '接 (jiē)' }, { label: 'D', text: '挂 (guà)' }], answer: 'A', explanation: '打 (dǎ) berarti "menelepon" pada kata 打电话 (dǎ diàn huà), yaitu melakukan panggilan telepon.' },
    { id: 2, question: 'Hanzi yang berarti "menopang / membantu" (orang terjatuh) adalah:', options: [{ label: 'A', text: '拉 (lā)' }, { label: 'B', text: '推 (tuī)' }, { label: 'C', text: '扶 (fú)' }, { label: 'D', text: '抱 (bào)' }], answer: 'C', explanation: '扶 (fú) berarti "menopang" atau "membantu", sesuai dengan orang yang hampir terjatuh.' },
    { id: 3, question: 'Pinyin untuk 打 (dǎ) adalah:', options: [{ label: 'A', text: 'dā' }, { label: 'B', text: 'dá' }, { label: 'C', text: 'dǎ' }, { label: 'D', text: 'dà' }], answer: 'C', explanation: '打 (dǎ) dibaca dǎ dengan nada ketiga.' },
    { id: 4, question: 'Hanzi yang berarti "mencari" adalah:', options: [{ label: 'A', text: '找 (zhǎo)' }, { label: 'B', text: '看 (kàn)' }, { label: 'C', text: '见 (jiàn)' }, { label: 'D', text: '寻 (xún)' }], answer: 'A', explanation: '找 (zhǎo) berarti "mencari", sesuai dengan mencari buku di dalam tas.' },
    { id: 5, question: 'Arti dari 握 (wò) adalah:', options: [{ label: 'A', text: 'Memukul' }, { label: 'B', text: 'Berjabat tangan / menggenggam' }, { label: 'C', text: 'Melempar' }, { label: 'D', text: 'Menangkap' }], answer: 'B', explanation: '握 (wò) berarti "menggenggam" atau "berjabat tangan".' },
    { id: 6, question: 'Hanzi yang berarti "mengaduk / mencampur" adalah:', options: [{ label: 'A', text: '炒 (chǎo)' }, { label: 'B', text: '炸 (zhà)' }, { label: 'C', text: '拌 (bàn)' }, { label: 'D', text: '煮 (zhǔ)' }], answer: 'C', explanation: '拌 (bàn) berarti "mengaduk" atau "mencampur", dilakukan saat menyiapkan masakan.' },
    { id: 7, question: 'Hanzi yang berarti "menunjuk" adalah:', options: [{ label: 'A', text: '点 (diǎn)' }, { label: 'B', text: '指 (zhǐ)' }, { label: 'C', text: '画 (huà)' }, { label: 'D', text: '按 (àn)' }], answer: 'B', explanation: '指 (zhǐ) berarti "menunjuk", yaitu mengarahkan jari ke suatu objek.' },
    { id: 8, question: 'Hanzi yang berarti "mengangkat" adalah:', options: [{ label: 'A', text: '抬 (tái)' }, { label: 'B', text: '提 (tí)' }, { label: 'C', text: '挑 (tiāo)' }, { label: 'D', text: '背 (bèi)' }], answer: 'A', explanation: '抬 (tái) berarti "mengangkat", sehingga 抬手 (tái shǒu) berarti "mengangkat tangan".' },
    { id: 9, question: 'Arti dari 换 (huàn) adalah:', options: [{ label: 'A', text: 'Membeli' }, { label: 'B', text: 'Menjual' }, { label: 'C', text: 'Menukar / mengganti' }, { label: 'D', text: 'Meminjam' }], answer: 'C', explanation: '换 (huàn) berarti "menukar" atau "mengganti" sesuatu dengan yang lain.' },
    { id: 10, question: 'Hanzi yang berarti "mencengkeram / menangkap" adalah:', options: [{ label: 'A', text: '抓 (zhuā)' }, { label: 'B', text: '放 (fàng)' }, { label: 'C', text: '扔 (rēng)' }, { label: 'D', text: '丢 (diū)' }], answer: 'A', explanation: '抓 (zhuā) berarti "mencengkeram", "menangkap", atau "meraih" dengan tangan.' },
  ],
  75: [
    { id: 1, question: 'Hanzi yang berarti "menendang" adalah:', options: [{ label: 'A', text: '踢 (tī)' }, { label: 'B', text: '跑 (pǎo)' }, { label: 'C', text: '跳 (tiào)' }, { label: 'D', text: '步 (bù)' }], answer: 'A', explanation: '踢 (tī) berarti "menendang", seperti menendang bola ke gawang.' },
    { id: 2, question: 'Hanzi yang berarti "berlutut" dan "berdiri" adalah:', options: [{ label: 'A', text: '坐 (zuò) / 躺 (tǎng)' }, { label: 'B', text: '蹲 (dūn) / 爬 (pá)' }, { label: 'C', text: '跪 (guì) / 站 (zhàn)' }, { label: 'D', text: '走 (zǒu) / 跑 (pǎo)' }], answer: 'C', explanation: '跪 (guì) berarti "berlutut" dan 站 (zhàn) berarti "berdiri".' },
    { id: 3, question: 'Hanzi yang berarti "melompat" adalah:', options: [{ label: 'A', text: '走 (zǒu) / 跑 (pǎo)' }, { label: 'B', text: '跳 (tiào) / 跃 (yuè) (tiào / yuè)' }, { label: 'C', text: '爬 (pá) / 滚 (gǔn)' }, { label: 'D', text: '飞 (fēi) / 游 (yóu)' }], answer: 'B', explanation: '跳 (tiào) dan 跃 (yuè) sama-sama berarti "melompat".' },
    { id: 4, question: 'Hanzi yang berarti "mengikuti" dan "berlari" adalah:', options: [{ label: 'A', text: '追 (zhuī) / 逃 (táo)' }, { label: 'B', text: '跟 (gēn) / 跑 (pǎo)' }, { label: 'C', text: '随 (suí) / 步 (bù)' }, { label: 'D', text: '迎 (yíng) / 送 (sòng)' }], answer: 'B', explanation: '跟 (gēn) berarti "mengikuti", sedangkan 跑 (pǎo) berarti "berlari".' },
    { id: 5, question: 'Arti dari 迹 (jì) adalah:', options: [{ label: 'A', text: 'Jejak kaki / jejak' }, { label: 'B', text: 'Langkah' }, { label: 'C', text: 'Jalan' }, { label: 'D', text: 'Arah' }], answer: 'A', explanation: '迹 (jì) berarti "jejak", seperti pada kata 足迹 (zújì) yang berarti jejak kaki.' },
    { id: 6, question: 'Hanzi yang berarti "menginjak" adalah:', options: [{ label: 'A', text: '踩 (cǎi)' }, { label: 'B', text: '踏 (tà)' }, { label: 'C', text: '跨 (kuà)' }, { label: 'D', text: '迈 (mài)' }], answer: 'A', explanation: '踩 (cǎi) berarti "menginjak" dan merupakan kata yang alami untuk percakapan sehari-hari.' },
    { id: 7, question: 'Hanzi yang berarti "sepak bola" adalah:', options: [{ label: 'A', text: '篮球 (lán qiú)' }, { label: 'B', text: '排球 (pái qiú)' }, { label: 'C', text: '足球 (zúqiú)' }, { label: 'D', text: '网球 (wǎng qiú)' }], answer: 'C', explanation: '足球 (zú qiú) berarti "sepak bola", sehingga 足球比赛 (zú qiú bǐ sài) berarti pertandingan sepak bola.' },
    { id: 8, question: 'Hanzi yang berarti "berlari / meloncat" adalah:', options: [{ label: 'A', text: '跑 (pǎo) / 跃 (yuè) (pǎo / yuè)' }, { label: 'B', text: '走 (zǒu) / 跳 (tiào)' }, { label: 'C', text: '飞 (fēi) / 爬 (pá)' }, { label: 'D', text: '游 (yóu) / 滚 (gǔn)' }], answer: 'A', explanation: '跑 (pǎo) berarti "berlari" dan 跃 (yuè) berarti "meloncat" atau "melompat".' },
    { id: 9, question: 'Arti dari 踪 (zōng) adalah:', options: [{ label: 'A', text: 'Jarak' }, { label: 'B', text: 'Jejak langkah' }, { label: 'C', text: 'Mengikuti' }, { label: 'D', text: 'Jatuh' }], answer: 'B', explanation: '踪 (zōng) berarti "jejak" atau "bekas langkah". 距 (jù) berarti jarak, 跟 (gēn) berarti mengikuti.' },
    { id: 10, question: 'Hanzi yang berarti "jongkok" dan "berlutut" adalah:', options: [{ label: 'A', text: '蹲 (dūn) / 跪 (guì)' }, { label: 'B', text: '坐 (zuò) / 站 (zhàn)' }, { label: 'C', text: '躺 (tǎng) / 趴 (pā)' }, { label: 'D', text: '靠 (kào) / 倚 (yǐ)' }], answer: 'A', explanation: '蹲 (dūn) berarti "jongkok" dan 跪 (guì) berarti "berlutut", sesuai gerakan mencari kunci di tanah.' },
  ],
  83: [
    { id: 1, question: 'Hanzi yang berarti "tembok / dinding" adalah:', options: [{ label: 'A', text: '墙 (qiáng)' }, { label: 'B', text: '门 (mén)' }, { label: 'C', text: '窗 (chuāng)' }, { label: 'D', text: '顶 (dǐng)' }], answer: 'A', explanation: '墙 (qiáng) berarti "tembok" atau "dinding", sesuai dengan tembok tinggi di kota.' },
    { id: 2, question: 'Hanzi yang berarti "membuka / mengolah lahan" adalah:', options: [{ label: 'A', text: '种植 (zhǒng zhí)' }, { label: 'B', text: '开垦 (kāikěn)' }, { label: 'C', text: '收割 (shōu gē)' }, { label: 'D', text: '浇水 (jiāo shuǐ)' }], answer: 'B', explanation: '垦 (kěn) berarti "membuka atau mengolah lahan", sesuai kegiatan petani menyiapkan tanah baru.' },
    { id: 3, question: 'Hanzi yang berarti "tanah subur" adalah:', options: [{ label: 'A', text: '泥 (ní)' }, { label: 'B', text: '沙 (shā)' }, { label: 'C', text: '壤 (rǎng)' }, { label: 'D', text: '石 (shí)' }], answer: 'C', explanation: '壤 (rǎng) berarti "tanah" atau "tanah yang subur", cocok untuk tanah pertanian.' },
    { id: 4, question: 'Hanzi yang berarti "makam / kuburan" adalah:', options: [{ label: 'A', text: '坟 (fén)' }, { label: 'B', text: '墓 (mù)' }, { label: 'C', text: '碑 (bēi)' }, { label: 'D', text: '陵 (líng)' }], answer: 'A', explanation: '坟 (fén) berarti "makam" atau "kuburan", sesuai dengan makam kakek.' },
    { id: 5, question: 'Hanzi yang berarti "datar / rata" adalah:', options: [{ label: 'A', text: '崎岖 (qí qū)' }, { label: 'B', text: '平坦 (píngtǎn)' }, { label: 'C', text: '陡峭 (dǒu qiào)' }, { label: 'D', text: '弯曲 (wān qū)' }], answer: 'B', explanation: '平坦 (píng tǎn) berarti "datar" atau "rata", sehingga jalan aman dilalui kendaraan.' },
    { id: 6, question: 'Hanzi yang berarti "kuat / kokoh" adalah:', options: [{ label: 'A', text: '坚 (jiān)' }, { label: 'B', text: '软 (ruǎn)' }, { label: 'C', text: '弱 (ruò)' }, { label: 'D', text: '脆 (cuì)' }], answer: 'A', explanation: '坚 (jiān) berarti "kuat" atau "kokoh", seperti pada 坚固 (jiān gù).' },
    { id: 7, question: 'Hanzi yang berarti "bendungan" adalah:', options: [{ label: 'A', text: '坝 (bà)' }, { label: 'B', text: '桥 (qiáo)' }, { label: 'C', text: '堤 (dī)' }, { label: 'D', text: '堰 (yàn)' }], answer: 'A', explanation: '坝 (bà) berarti "bendungan", yaitu bangunan yang menahan aliran air.' },
    { id: 8, question: 'Hanzi yang berarti "alamat / lokasi" adalah:', options: [{ label: 'A', text: '址 (zhǐ)' }, { label: 'B', text: '路 (lù)' }, { label: 'C', text: '街 (jiē)' }, { label: 'D', text: '巷 (xiàng)' }], answer: 'A', explanation: '址 (zhǐ) berarti "alamat atau lokasi", seperti pada 地址 (dì zhǐ).' },
    { id: 9, question: 'Hanzi yang berarti "rusak" adalah:', options: [{ label: 'A', text: '好 (hǎo)' }, { label: 'B', text: '坏 (huài)' }, { label: 'C', text: '旧 (jiù)' }, { label: 'D', text: '破 (pò)' }], answer: 'B', explanation: '坏 (huài) berarti "rusak", sehingga 椅子坏了 (yǐ zi huài le) berarti "kursinya rusak".' },
    { id: 10, question: 'Hanzi yang berarti "jurang / lembah yang dalam" adalah:', options: [{ label: 'A', text: '沟壑 (gōuhè)' }, { label: 'B', text: '山峰 (shān fēng)' }, { label: 'C', text: '平原 (píng yuán)' }, { label: 'D', text: '丘陵 (qiū líng)' }], answer: 'A', explanation: '壑 (hè) (dalam 沟壑 (gōu hè)) berarti "jurang" atau "lembah yang dalam".' },
  ]
};

export const QUIZ_TITLES: Record<number, string> = {
  11: "Bab 1 Unsur Mulut (口 (kǒu))",
  16: "Bab 2 Unsur Ucapan (讠 (yán))",
  24: "Bab 3 Unsur Makanan (饣 (shí))",
  31: "Bab 4 Unsur Air (氵 (shuǐ))",
  38: "Bab 5 Unsur Api (火 (huǒ) / 灬 (huǒ))",
  45: "Bab 6 Unsur Kayu (木 (mù))",
  53: "Bab 7 Unsur Perempuan (女 (nǚ))",
  60: "Bab 8 Unsur Rumput (艹 (cǎo))",
  67: "Bab 9 Unsur Tangan (扌 (shǒu))",
  75: "Bab 10 Unsur Kaki (⻊ (zú))",
  83: "Bab 11 Unsur Tanah (土 (tǔ))"
};

export const HANZI_DICT: Record<string, string> = {
  "喝": "Minum", "吃": "Makan", "咬": "Menggigit", "吞": "Menelan",
  "答": "Menjawab", "叫": "Memanggil", "问": "Bertanya", "告": "Memberitahu",
  "响": "Nyaring / Bunyi", "味": "Rasa / Bau", "善": "Baik", "古": "Kuno",
  "嘴": "Mulut", "喉咙": "Tenggorokan", "味道": "Rasa", "唇": "Bibir",
  "口": "Mulut", "听": "Mendengar", "告诉": "Memberitahu", "吸": "Menghisap",
  "左": "Kiri", "右": "Kanan", "和": "Dan / Dengan", "台": "Meja / Mimbar",
  "嚼": "Mengunyah", "吐": "Meludah / Muntah", "读": "Membaca", "写": "Menulis",
  "说": "Berbicara", "言": "Kata / Ucapan", "语": "Bahasa", "词": "Kosakata",
  "话": "Perkataan", "求": "Memohon", "请": "Silakan / Tolong", "谢": "Terima kasih",
  "让": "Membiarkan", "记": "Mengingat", "忘": "Lupa", "想": "Berpikir / Ingin",
  "念": "Membaca / Merindukan", "客气": "Sungkan", "对不起": "Maaf", "感谢": "Berterima kasih",
  "没关系": "Tidak apa-apa", "认": "Mengenali", "识": "Mengenal / Tahu", "知": "Tahu",
  "觉": "Merasa", "谈": "Berbincang", "论": "Membahas", "讲": "Bicara / Menjelaskan",
  "议": "Bermusyawarah", "真": "Benar / Asli", "谎": "Bohong", "骗": "Menipu",
  "假": "Palsu", "调": "Mengatur / Menyesuaikan", "理": "Mengurus", "整": "Mengatur / Rapi",
  "治": "Mengobati / Mengatur", "饱": "Kenyang", "饿": "Lapar", "渴": "Haus",
  "累": "Lelah", "饭": "Nasi / Makanan", "菜": "Sayur / Masakan", "肉": "Daging",
  "面": "Mie / Tepung", "饼": "Kue kering / Biskuit", "包": "Roti isi (bakpao)", "糕": "Kue",
  "卷": "Gulungan", "水": "Air", "酒": "Arak / Minuman keras", "茶": "Teh",
  "奶": "Susu", "盐": "Garam", "酱": "Saus / Kecap", "糖": "Gula / Permen",
  "醋": "Cuka", "香": "Harum / Wangi", "臭": "Bau busuk", "酸": "Asam",
  "甜": "Manis", "米": "Beras", "谷": "Biji-bijian / Lembah", "粥": "Bubur",
  "冷": "Dingin", "热": "Panas", "浊": "Keruh", "脏": "Kotor",
  "清": "Jernih", "净": "Bersih", "浮": "Mengapung", "沉": "Tenggelam",
  "没": "Tenggelam / Tidak ada", "落": "Jatuh / Turun", "洗": "Mencuci", "刷": "Menyikat",
  "擦": "Mengelap", "扫": "Menyapu", "洒": "Memercikkan", "浇": "Menyiram",
  "泼": "Menyiram / Menyimbah", "淋": "Menyiram / Basah kuyup", "海": "Laut", "湖": "Danau",
  "河": "Sungai", "江": "Sungai besar", "汁": "Jus / Sari", "汤": "Sup / Kuah",
  "液": "Cairan", "汗": "Keringat", "泪": "Air mata", "血": "Darah",
  "深": "Dalam", "浅": "Dangkal", "低": "Rendah", "短": "Pendek",
  "涨": "Naik / Pasang", "流": "Mengalir", "涌": "Meluap / Menyembur", "波": "Gelombang",
  "炒": "Menumis", "煮": "Merebus / Memasak", "烤": "Memanggang", "蒸": "Mengukus",
  "温": "Hangat", "凉": "Sejuk", "火": "Api", "焰": "Nyala api",
  "光": "Cahaya", "烟": "Asap", "烧": "Membakar", "点": "Menyalakan / Titik",
  "熄": "Memadamkan (api)", "灭": "Memadamkan / Musnah", "糊": "Gosong / Hangus", "黑": "Hitam",
  "焦": "Gosong", "黄": "Kuning", "灾": "Bencana", "难": "Sulit / Bencana",
  "祸": "Malapetaka", "险": "Bahaya", "煤": "Batu bara", "炭": "Arang",
  "灰": "Abu", "木": "Kayu", "叶": "Daun", "枝": "Dahan / Ranting",
  "干": "Batang / Kering", "根": "Akar", "桌椅": "Meja / Kursi", "床柜": "Ranjang / Lemari",
  "门窗": "Pintu / Jendela", "灯镜": "Lampu / Cermin", "树根": "Pohon / Akar", "草花": "Rumput / Bunga",
  "叶枝": "Daun / Ranting", "果籽": "Buah / Biji", "桃梅": "Persik / Plum", "苹果": "Apel",
  "橘柚": "Jeruk / Jeruk bali", "瓜豆": "Melon / Kacang", "板": "Papan", "块": "Potong / Bongkah",
  "条": "Helai / Batang", "几": "Meja kecil / Beberapa", "桌": "Meja", "案": "Meja panjang / Kasus",
  "碗": "Mangkuk", "杯子": "Gelas / Cangkir", "盘": "Piring", "瓶": "Botol",
  "他": "Dia (laki-laki)", "她": "Dia (perempuan)", "它": "Itu (hewan/benda)", "男": "Pria",
  "姐妹": "Kakak / Adik perempuan", "哥弟": "Kakak / Adik laki-laki", "姑姨": "Bibi dari ayah / Bibi dari ibu", "妈奶": "Ibu / Nenek",
  "好": "Baik / Bagus", "美": "Indah / Cantik", "妙": "Luar biasa / Ajaib", "奇": "Aneh / Ajaib",
  "恕": "Memaafkan", "怨": "Mengeluh / Membenci", "恨": "Benci", "怒": "Marah",
  "恋": "Cinta / Pacaran", "爱": "Cinta / Suka", "婚": "Menikah", "情": "Perasaan / Cinta",
  "服": "Pakaian / Tunduk", "妆": "Riasan / Berdandan", "衣": "Pakaian", "打": "Memukul / Menelepon",
  "坏": "Rusak / Buruk", "错": "Salah", "差": "Kurang / Buruk", "果": "Buah",
  "树": "Pohon", "花": "Bunga", "草": "Rumput", "草莓": "Stroberi",
  "香蕉": "Pisang", "西瓜": "Semangka", "葱": "Daun bawang", "蒜": "Bawang putih",
  "姜": "Jahe", "椒": "Lada / Cabai", "苦": "Pahit", "辣": "Pedas",
  "拍": "Menepuk / Memotret", "接": "Menerima / Menjemput", "挂": "Menggantung / Menutup telepon", "拉": "Menarik",
  "推": "Mendorong", "扶": "Menopang / Membantu berdiri", "抱": "Memeluk", "找": "Mencari",
  "看": "Melihat", "见": "Melihat / Bertemu", "寻": "Mencari", "炸": "Menggoreng (deep fry)",
  "拌": "Mengaduk / Mencampur", "指": "Menunjuk", "画": "Menggambar", "按": "Menekan",
  "抬": "Mengangkat", "提": "Menjinjing / Mengangkat", "挑": "Memilih / Memikul", "背": "Menggendong / Punggung",
  "抓": "Menangkap / Mencengkeram", "放": "Meletakkan / Melepaskan", "扔": "Melempar", "丢": "Kehilangan / Membuang",
  "踢": "Menendang", "跑": "Berlari", "跳": "Melompat", "步": "Langkah",
  "坐躺": "Duduk / Berbaring", "蹲爬": "Jongkok / Merangkak", "跪站": "Berlutut / Berdiri", "走跑": "Berjalan / Berlari",
  "跳跃": "Melompat / Meloncat", "爬滚": "Merangkak / Berguling", "飞游": "Terbang / Berenang", "追逃": "Mengejar / Melarikan diri",
  "跟跑": "Mengikuti / Berlari", "随步": "Mengikuti / Berjalan", "迎送": "Menyambut / Mengantar", "踩": "Menginjak",
  "踏": "Menginjak", "跨": "Melangkah", "迈": "Melangkah", "篮球": "Bola basket",
  "排球": "Bola voli", "足球": "Sepak bola", "网球": "Tenis", "跑跃": "Berlari / Meloncat",
  "走跳": "Berjalan / Melompat", "飞爬": "Terbang / Merangkak", "游滚": "Berenang / Berguling", "蹲跪": "Jongkok / Berlutut",
  "坐站": "Duduk / Berdiri", "躺趴": "Berbaring / Tengkurap", "靠倚": "Bersandar", "墙": "Tembok / Dinding",
  "门": "Pintu", "窗": "Jendela", "顶": "Atap / Puncak", "种植": "Menanam",
  "开垦": "Membuka lahan", "收割": "Memanen", "浇水": "Menyiram air", "泥": "Lumpur",
  "沙": "Pasir", "壤": "Tanah", "石": "Batu", "坟": "Makam / Kuburan",
  "墓": "Makam", "碑": "Prasasti / Batu nisan", "陵": "Makam kaisar / Bukit", "崎岖": "Terjal / Tidak rata",
  "平坦": "Datar / Rata", "陡峭": "Curam", "弯曲": "Melengkung / Berbelok", "坚": "Keras / Kokoh",
  "软": "Lunak / Lembut", "弱": "Lemah", "脆": "Renyah / Rapuh", "坝": "Bendungan",
  "桥": "Jembatan", "堤": "Tanggul", "堰": "Bendung", "址": "Alamat / Lokasi",
  "路": "Jalan", "街": "Jalan raya", "巷": "Gang", "旧": "Lama / Bekas",
  "破": "Rusak / Pecah", "沟壑": "Jurang / Lembah", "山峰": "Puncak gunung", "平原": "Dataran rendah",
  "丘陵": "Perbukitan"
};

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onPass: () => void;
  pageId: number;
}

export default function QuizModal({ isOpen, onClose, questions, onPass, pageId }: QuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  if (!isOpen || !questions || questions.length === 0) return null;

  const currentQ = questions[currentIdx];
  const isCorrect = selectedAnswer === currentQ.answer;
  const isPassed = true; // Tidak ada batas minimal untuk lulus


  const handleSelect = (label: string) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(label);
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    setIsAnswerRevealed(true);
    setUserAnswers(prev => ({ ...prev, [currentIdx]: selectedAnswer }));
    if (selectedAnswer === currentQ.answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setIsFinished(false);
    setUserAnswers({});
  };

  const handleFinish = () => {
    if (isPassed) {
      onPass();
      handleReset(); // reset for next time they open it manually
    } else {
      handleReset();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-sand w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-border">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-white">
          <h2 className="text-xl font-bold text-primary">📝 Kuis {QUIZ_TITLES[pageId] || `Bab (Hal. ${pageId})`}</h2>
          <Button variant="ghost" size="icon" onClick={() => { if(!isFinished || isPassed) onClose(); else handleReset(); }} className="rounded-full hover:bg-red-50 hover:text-red-500">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex-1 bg-cream/30 overflow-y-auto">
          {isFinished ? (
            <div className="flex flex-col h-full">
              <div className="text-center py-4 shrink-0">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Kuis Selesai!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Skor Anda: <span className="font-bold text-xl text-primary">{score} / {questions.length}</span>
                </p>
                <div className="flex justify-center">
                  <Button onClick={handleFinish} className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground text-base py-6 rounded-xl">
                    Lanjutkan Membaca <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="mt-8 text-left border-t pt-6 border-border">
                <h4 className="font-bold text-lg mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Pembahasan Kuis
                </h4>
                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const correctOpt = q.options.find(o => o.label === q.answer);
                    const userOptLabel = userAnswers[idx];
                    const userOpt = q.options.find(o => o.label === userOptLabel);
                    const isUserCorrect = userOptLabel === q.answer;

                    return (
                      <div key={q.id} className="bg-white p-4 rounded-xl border shadow-sm">
                        <p className="font-medium text-foreground mb-3">{idx + 1}. {q.question}</p>
                        
                        {isUserCorrect ? (
                          <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg mb-3 border border-green-100 text-sm">
                            <span className="font-bold">Jawaban Anda Benar:</span> {correctOpt?.label} - {correctOpt?.text}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="bg-red-50 text-red-800 px-3 py-2 rounded-lg border border-red-100 text-sm">
                              <span className="font-bold">Jawaban Anda Salah:</span> {userOpt ? `${userOpt.label} - ${userOpt.text}` : 'Tidak dijawab'}
                              {userOpt && userOpt.text.match(/[\u4e00-\u9fa5]/) && (
                                <span className="block mt-1 italic opacity-90">
                                  * {userOpt.text.replace(/[^\u4e00-\u9fa5]/g, '')} berarti "{HANZI_DICT[userOpt.text.replace(/[^\u4e00-\u9fa5]/g, '')] || 'Tidak diketahui'}"
                                </span>
                              )}
                            </div>
                            <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg border border-green-100 text-sm">
                              <span className="font-bold">Jawaban Benar:</span> {correctOpt?.label} - {correctOpt?.text}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-2">
                  <span>Soal {currentIdx + 1} dari {questions.length} ({Math.round(((currentIdx + 1) / questions.length) * 100)}% selesai)</span>
                  <span>Skor: {score}</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2 dark:bg-zinc-700">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-lg md:text-xl font-medium text-foreground mb-8 whitespace-pre-wrap leading-relaxed">
                {currentQ.question}
              </p>

              <div className="space-y-3 mb-8">
                {currentQ.options.map(opt => {
                  let optStyle = "border-border bg-white hover:border-primary/50 text-foreground";
                  if (isAnswerRevealed) {
                    if (opt.label === currentQ.answer) {
                      optStyle = "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-500/20";
                    } else if (opt.label === selectedAnswer) {
                      optStyle = "border-red-500 bg-red-50 text-red-800";
                    } else {
                      optStyle = "border-border bg-white/50 opacity-60";
                    }
                  } else if (selectedAnswer === opt.label) {
                    optStyle = "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary";
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelect(opt.label)}
                      disabled={isAnswerRevealed}
                      className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${optStyle}`}
                    >
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shrink-0 ${selectedAnswer === opt.label ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {opt.label}
                      </span>
                      <span className="font-medium">
                        {opt.text}
                        {isAnswerRevealed && opt.text.match(/[\u4e00-\u9fa5]/) && HANZI_DICT[opt.text.replace(/[^\u4e00-\u9fa5]/g, '')] && (
                          <span className="ml-2 opacity-80 font-normal italic">
                            - {HANZI_DICT[opt.text.replace(/[^\u4e00-\u9fa5]/g, '')]}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isAnswerRevealed && (
                <div className={`p-4 rounded-2xl mb-8 flex items-start gap-3 ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                  {isCorrect ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-green-600" /> : <XCircle className="w-6 h-6 shrink-0 mt-0.5 text-red-600" />}
                  <div>
                    <p className="font-bold mb-1">{isCorrect ? 'Jawaban Anda Benar!' : 'Jawaban Kurang Tepat'}</p>
                    <p className="text-sm opacity-90 leading-relaxed">{currentQ.explanation}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isFinished && (
          <div className="p-6 border-t bg-white flex justify-end">
            {!isAnswerRevealed ? (
              <Button 
                onClick={handleCheck} 
                disabled={!selectedAnswer}
                className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base rounded-xl"
              >
                Cek Jawaban
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="w-full md:w-auto px-8 bg-foreground hover:bg-foreground/90 text-background h-12 text-base rounded-xl"
              >
                {currentIdx + 1 < questions.length ? 'Lanjut Soal Berikutnya' : 'Lihat Hasil Akhir'}
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
