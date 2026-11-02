import React, { useState } from 'react';
import { initialForumPosts } from '../data/forumAndAnnouncements';
import { ForumPost } from '../types';
import { sound } from '../utils/audio';
import { MessageSquare, ThumbsUp, Send, PlusCircle, ShieldCheck, User } from 'lucide-react';

export const ForumDiscussionView: React.FC<{ currentUserRole?: string; currentUserName?: string }> = ({
  currentUserRole = 'siswa',
  currentUserName = 'Rafi Ahmad Pratama',
}) => {
  const [posts, setPosts] = useState<ForumPost[]>(initialForumPosts);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('Etika Digital');
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const handleVote = (postId: string) => {
    sound.playClick();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const voted = p.userVoted;
          return {
            ...p,
            upvotes: voted ? p.upvotes - 1 : p.upvotes + 1,
            userVoted: !voted,
          };
        }
        return p;
      })
    );
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;

    sound.playCorrect();
    const newPost: ForumPost = {
      id: `fp-${Date.now()}`,
      authorName: currentUserName,
      authorRole: currentUserRole === 'guru' ? 'Guru Pengampu' : 'Siswa SMANDE',
      avatar: currentUserRole === 'guru' ? '👨‍🏫' : '👨‍🎓',
      timeAgo: 'Baru saja',
      title: newTopicTitle,
      content: newTopicContent,
      category: newTopicCategory,
      upvotes: 1,
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setShowNewTopicModal(false);
    setNewTopicTitle('');
    setNewTopicContent('');
  };

  const handleSendReply = (postId: string) => {
    if (!replyInput.trim()) return;
    sound.playCorrect();

    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: currentUserName,
      authorRole: currentUserRole === 'guru' ? 'Guru Pendidikan Pancasila' : 'Siswa SMANDE',
      content: replyInput,
      timeAgo: 'Baru saja',
    };

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p))
    );

    setReplyInput('');
    setActiveReplyPostId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 border border-sky-500 rounded-3xl p-6 md:p-8 shadow-xl text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5 mb-2">
            <MessageSquare size={14} /> Mimbar Musyawarah Digital • SMA Negeri 1 Mande (SMANDE)
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Forum Diskusi & Refleksi Etika Kewarganegaraan
          </h2>
          <p className="text-xs md:text-sm text-sky-100 max-w-2xl leading-relaxed">
            Ruang dialog santun berlandaskan Sila ke-4: kemukakan argumen berbobot, dengarkan pandangan berbeda dengan penuh hormat, dan temukan solusi bersama.
          </p>
        </div>

        <button
          onClick={() => setShowNewTopicModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 border border-sky-300 font-bold text-xs md:text-sm text-white rounded-xl shadow-lg transition-all"
        >
          <PlusCircle size={16} /> Buat Topik Diskusi Baru
        </button>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            {/* Post Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl bg-slate-950 p-2 rounded-xl border border-slate-800">
                  {post.avatar}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">{post.authorName}</h5>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-amber-400">{post.authorRole}</span>
                    <span>• {post.timeAgo}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold uppercase bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <h4 className="text-base font-bold text-white mb-2">{post.title}</h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-slate-800 text-xs">
              <button
                onClick={() => handleVote(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  post.userVoted
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ThumbsUp size={14} />
                <span>{post.upvotes} Mendukung</span>
              </button>

              <button
                onClick={() =>
                  setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <MessageSquare size={14} />
                <span>{post.replies.length} Tanggapan Musyawarah</span>
              </button>
            </div>

            {/* Replies Section */}
            {post.replies.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2.5">
                {post.replies.map((rep) => (
                  <div key={rep.id} className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{rep.authorName}</span>
                      <span className="text-[10px] text-slate-500">{rep.timeAgo}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Form */}
            {activeReplyPostId === post.id && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Sampaikan pendapatmu dengan santun dan berlandaskan argumentasi logis..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 outline-none"
                />
                <button
                  onClick={() => handleSendReply(post.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md"
                >
                  <Send size={13} /> Kirim
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4">Gagas Topik Diskusi Musyawarah</h4>
            <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Kategori Topik:</label>
                <select
                  value={newTopicCategory}
                  onChange={(e) => setNewTopicCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Etika Digital">Etika Digital & Media Sosial</option>
                  <option value="Demokrasi Pancasila">Demokrasi & Musyawarah Mufakat</option>
                  <option value="Harmoni Keberagaman">Toleransi & Bhinneka Tunggal Ika</option>
                  <option value="Penegakan Hukum">Norma, Hukum & Keadilan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Judul Permasalahan:</label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="Contoh: Bagaimana menyikapi perbedaan pandangan di kelas tanpa bermusuhan?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Uraian / Pemantik Diskusi:</label>
                <textarea
                  rows={4}
                  required
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  placeholder="Jelaskan latar belakang permasalahan dan ajakan refleksi..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Terbitkan Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
