import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Bot, Send, Sparkles, X, User, CornerDownLeft, Loader2, BookOpen } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  'Apa perbedaan mendasar antara hak asasi dan kewajiban asasi manusia?',
  'Bagaimana contoh konkret menerapkan Sila ke-4 dalam musyawarah kelas di SMA?',
  'Mengapa UUD 1945 harus diamandemen pada era reformasi 1999-2002?',
  'Bagaimana cara membedakan kritik yang membangun dengan ujaran kebencian di medsos?',
];

export const AITutorModal: React.FC<{ isOpen: boolean; onClose: () => void; studentGrade?: string }> = ({
  isOpen,
  onClose,
  studentGrade = 'Kelas XI',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'tutor',
      text: `Halo patriot muda SMANDE! 🇮🇩\n\nSaya adalah **Tutor Pintar Garuda**, asisten AI Pendidikan Pancasila. Saya siap membantumu memahami materi kurikulum, sejarah dasar negara, norma konstitusi, hak & kewajiban, serta pemecahan studi kasus bermoral.\n\nApa yang ingin kamu diskusikan hari ini?`,
      timestamp: 'Baru saja',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          contextGrade: studentGrade,
          topic: 'Pendidikan Pancasila & Kewarganegaraan SMA',
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi AI Tutor');
      }

      const data = await response.json();
      const tutorMsg: ChatMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: data.reply || 'Maaf, saya tidak dapat memproses jawaban saat ini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
      sound.playCorrect();
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: `Pertanyaan bagus mengenai: "${query}".\n\nDalam kacamata **Pendidikan Pancasila**, setiap warga negara harus mengedepankan asas musyawarah (Sila 4), keadilan bagi sesama (Sila 5), serta saling menghargai keberagaman (Sila 3). Hak asasi tidak pernah dapat dipisahkan dari kewajiban asasi menjaga ketertiban masyarakat.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl h-[90vh] max-h-[750px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/60 via-slate-900 to-amber-900/40 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Tutor Pintar Garuda</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">AI Konsultasi Pancasila SMANDE ({studentGrade})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {m.sender === 'user' ? <User size={15} /> : <Bot size={16} />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed shadow-md ${
                  m.sender === 'user'
                    ? 'bg-red-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-1.5 font-medium ${
                    m.sender === 'user' ? 'text-red-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 w-fit">
              <Loader2 size={16} className="animate-spin" />
              <span>Tutor Garuda sedang menelaah nilai dan rujukan hukum...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5 font-semibold">
            <Sparkles size={12} className="text-amber-400" /> Contoh Pertanyaan Pembelajaran:
          </div>
          <div className="flex gap-2 whitespace-nowrap pb-1">
            {SAMPLE_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 focus-within:border-amber-500/60 transition-colors"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan konsep Pancasila, UUD 1945, atau studi kasus..."
              className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-white px-3 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="text-[10px] text-center text-slate-500 mt-1.5">
            Dikelola melalui backend proxy AI Studio • Menjaga integritas data siswa
          </div>
        </div>
      </div>
    </div>
  );
};
