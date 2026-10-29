import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Megaphone, Mic, Square, ChevronRight, RotateCcw } from 'lucide-react';
import { pinyin } from 'pinyin-pro';

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

type DrillItem = { hanzi: string; pinyin: string };

const ITEMS: DrillItem[] = [
  { hanzi: '车', pinyin: 'chē' },
  { hanzi: '策', pinyin: 'cè' },
  { hanzi: '吃', pinyin: 'chī' },
  { hanzi: '妈', pinyin: 'mā' },
  { hanzi: '麻', pinyin: 'má' },
  { hanzi: '马', pinyin: 'mǎ' },
  { hanzi: '骂', pinyin: 'mà' },
  { hanzi: '你好', pinyin: 'nǐ hǎo' },
  { hanzi: '你叫什么名字', pinyin: 'nǐ jiào shénme míngzì' },
  { hanzi: '我是中国人', pinyin: 'wǒ shì zhōngguó rén' },
  { hanzi: '谢谢你', pinyin: 'xièxiè nǐ' },
  { hanzi: '我很高兴认识你', pinyin: 'wǒ hěn gāoxìng rènshì nǐ' },
  { hanzi: '今天天气很好', pinyin: 'jīntiān tiānqì hěn hǎo' },
  { hanzi: '我想吃饭', pinyin: 'wǒ xiǎng chīfàn' },
  { hanzi: '你去哪里', pinyin: 'nǐ qù nǎlǐ' },
  { hanzi: '我在学中文', pinyin: 'wǒ zài xué zhōngwén' },
  { hanzi: '千里之行，始于足下。学而不思则罔，思而不学则殆。失败是成功之母，有志者事竟成。活到老，学到老。书山有路勤为径，学海无涯苦作舟。', pinyin: 'qiānlǐ zhī xíng, shǐ yú zú xià. xué ér bù sī zé wǎng, sī ér bù xué zé dài. shībài shì chénggōng zhī mǔ, yǒu zhì zhě shì jìng chéng. huó dào lǎo, xué dào lǎo. shūshān yǒu lù qín wéi jìng, xuéhǎi wú yá kǔ zuò zhōu.' },
];

function speak(text: string) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.9;
  // swap to pre-generated mp3 (Supabase signed URL) for production
  const zh = speechSynthesis.getVoices().find(v => v.lang.startsWith('zh'));
  if (zh) u.voice = zh;
  speechSynthesis.speak(u);
}

type Verdict = 'correct' | 'wrong' | 'unclear';

// ponytail: very loose matching — single syllables are unreliable in browser ASR,
// so we accept any evidence the user said the right sound (ignore tone entirely)
function judge(recognised: string, target: DrillItem): Verdict {
  const t = recognised.trim();
  if (!t) return 'unclear';

  // 1) direct hanzi containment (handles ASR padding like 妈妈, 什么车)
  if (t.includes(target.hanzi)) return 'correct';

  const tPy = pinyin(target.hanzi, { toneType: 'none' }).replace(/\s+/g, '').toLowerCase();

  // 2) full pinyin string match or substring (handles 妈的→"made" contains "ma")
  const rPy = pinyin(t, { toneType: 'none' }).replace(/\s+/g, '').toLowerCase();
  if (rPy === tPy || rPy.includes(tPy)) return 'correct';

  // 3) any syllable in recognised matches target pinyin
  const rArr = pinyin(t, { toneType: 'none', type: 'array' }).map(s => s.toLowerCase());
  if (rArr.some(s => s === tPy)) return 'correct';

  // 4) per-character: any recognised char has same pinyin as target
  //    catches homophones across tones (骂→吗, 马→妈, etc.)
  for (const ch of t) {
    if (/\s/.test(ch)) continue;
    const cPy = pinyin(ch, { toneType: 'none' }).toLowerCase();
    if (cPy === tPy) return 'correct';
  }

  return 'wrong';
}

export default function AdminPronunciation() {
  const [idx, setIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [recognised, setRecognised] = useState('');
  const recRef = useRef<SpeechRecognition | null>(null);
  const item = ITEMS[idx];

  // warm up voices list
  useEffect(() => { speechSynthesis.getVoices(); }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Browser tidak mendukung Speech Recognition'); return; }
    const rec = new SR();
    rec.lang = 'zh-CN';
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    let gotResult = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      gotResult = true;
      const alts = e.results[0];
      // check all alternatives — first match wins
      let best: Verdict = 'wrong';
      let bestText = alts[0].transcript;
      for (let i = 0; i < alts.length; i++) {
        const text = alts[i].transcript;
        const v = judge(text, item);
        if (v === 'correct') { best = 'correct'; bestText = text; break; }
      }
      setRecognised(bestText);
      setVerdict(best);
      setListening(false);
    };
    rec.onerror = () => { gotResult = true; setListening(false); setVerdict('unclear'); };
    rec.onend = () => { setListening(false); if (!gotResult) setVerdict('unclear'); };
    rec.start();
    recRef.current = rec;
    setListening(true);
    setVerdict(null);
    setRecognised('');
  }, [item]);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const go = (i: number) => { setIdx(i); setVerdict(null); setRecognised(''); };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border p-6 space-y-5">
        <h2 className="text-lg font-bold text-[#6A2B2B] text-center">Latihan Pelafalan</h2>

        {/* item picker */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {ITEMS.map((it, i) => (
            <button key={i} onClick={() => go(i)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors
                ${i === idx ? 'bg-[#6A2B2B] text-white border-[#6A2B2B]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-[#6A2B2B]/40'}`}>
              {it.hanzi.length <= 2 ? it.hanzi : it.hanzi.slice(0, 2) + '…'}
            </button>
          ))}
        </div>

        {/* hanzi + megaphone */}
        <div className="text-center">
          <div className={`font-bold leading-tight ${item.hanzi.length <= 2 ? 'text-6xl' : item.hanzi.length <= 4 ? 'text-4xl' : item.hanzi.length <= 10 ? 'text-2xl' : 'text-lg'}`}>{item.hanzi}</div>
          <div className={`text-gray-400 mt-1 mb-3 ${item.pinyin.length > 40 ? 'text-xs' : 'text-sm'}`}>{item.pinyin}</div>
          <Button variant="outline" size="sm" onClick={() => speak(item.hanzi)} className="gap-1.5">
            <Megaphone className="w-4 h-4" /> Dengar AI
          </Button>
        </div>

        {/* record */}
        <div className="flex justify-center">
          {!listening ? (
            <Button onClick={startListening} className="bg-[#6A2B2B] hover:bg-[#5a2323] text-white gap-2 h-12 px-6">
              <Mic className="w-4 h-4" /> Rekam
            </Button>
          ) : (
            <Button onClick={stopListening} variant="destructive" className="gap-2 h-12 px-6 animate-pulse">
              <Square className="w-4 h-4" /> Stop
            </Button>
          )}
        </div>

        {/* verdict */}
        {verdict && (
          <div className={`rounded-xl p-4 text-center border
            ${verdict === 'correct' ? 'bg-green-50 border-green-300' : verdict === 'wrong' ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
            {verdict === 'correct' && <div className="text-green-600 font-semibold text-lg">Benar!</div>}
            {verdict === 'wrong' && <div className="text-red-600 font-semibold">Kurang tepat</div>}
            {verdict === 'unclear' && <div className="text-gray-500">Nggak kedengaran, coba lagi</div>}
            {recognised && <div className="text-sm text-gray-400 mt-1">Dikenali: "{recognised}"</div>}

            <div className="flex justify-center gap-2 mt-3">
              {verdict !== 'correct' ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => speak(item.hanzi)} className="gap-1">
                    <Megaphone className="w-3 h-3" /> Dengar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setVerdict(null); setRecognised(''); }} className="gap-1">
                    <RotateCcw className="w-3 h-3" /> Coba lagi
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => go((idx + 1) % ITEMS.length)}
                  className="bg-[#6A2B2B] hover:bg-[#5a2323] text-white gap-1">
                  Lanjut <ChevronRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
