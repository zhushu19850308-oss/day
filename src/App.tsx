/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, MessageCircle, RefreshCw, Copy, Loader2, Heart } from 'lucide-react';
import { generateGrowthCard } from './services/gemini';
import { GrowthCardData } from './types';

export default function App() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<GrowthCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await generateGrowthCard(keyword);
      setCardData(data);
    } catch (err) {
      console.error(err);
      setError('生成失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!cardData) return;
    const text = `【今日成长卡片 - ${keyword}】\n\n✨ 金句：${cardData.quote}\n\n✅ 行动建议：${cardData.action}\n\n💭 反思问题：${cardData.reflection}`;
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板！');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-100">
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-4"
        >
          <Sparkles size={16} />
          <span>AI 驱动的成长伴侣</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-stone-800 mb-2"
        >
          每日成长卡片生成器
        </motion.h1>
        <p className="text-stone-500 max-w-md mx-auto">
          输入一个关键词，为孩子开启充满正能量的一天
        </p>
      </header>

      <main className="max-w-xl mx-auto px-6 pb-20">
        {/* Input Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="例如：专注力、阅读、自律..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-orange-200 transition-all text-lg placeholder:text-stone-300"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !keyword.trim()}
              className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-stone-200 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>正在构思成长能量...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>生成我的成长卡片</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-red-500 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Card Display Area */}
        <AnimatePresence mode="wait">
          {cardData && (
            <motion.div
              key={keyword + cardData.quote}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="space-y-6"
            >
              {/* The Card */}
              <div 
                ref={cardRef}
                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-400 via-pink-400 to-rose-400 p-1 shadow-2xl shadow-rose-200"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-[2.3rem] p-8 md:p-12 h-full flex flex-col items-center text-center relative">
                  {/* Decorative Elements */}
                  <div className="absolute top-6 left-6 text-orange-200 opacity-50">
                    <Heart size={40} fill="currentColor" />
                  </div>
                  <div className="absolute bottom-6 right-6 text-pink-200 opacity-50">
                    <Sparkles size={40} fill="currentColor" />
                  </div>

                  {/* Keyword Badge */}
                  <div className="px-4 py-1 rounded-full bg-orange-50 text-orange-500 text-xs font-bold uppercase tracking-widest mb-8">
                    {keyword}
                  </div>

                  {/* Quote */}
                  <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 leading-tight mb-12 italic">
                    “{cardData.quote}”
                  </h2>

                  {/* Content Sections */}
                  <div className="w-full space-y-8 text-left">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">今日行动建议</h3>
                        <p className="text-stone-700 leading-relaxed font-medium">
                          {cardData.action}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                        <MessageCircle size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">今日反思问题</h3>
                        <p className="text-stone-700 leading-relaxed font-medium">
                          {cardData.reflection}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-stone-100 w-full flex justify-center">
                    <p className="text-stone-300 text-xs font-medium">每日成长卡片 · 陪伴孩子快乐成长</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleGenerate}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors active:scale-95"
                >
                  <RefreshCw size={18} />
                  <span>重新生成</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-stone-800 text-white font-bold hover:bg-stone-900 transition-colors shadow-lg shadow-stone-200 active:scale-95"
                >
                  <Copy size={18} />
                  <span>复制内容</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Tips */}
        {!cardData && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 grid grid-cols-2 gap-4"
          >
            {['自律', '创造力', '勇气', '同理心'].map((tip) => (
              <button
                key={tip}
                onClick={() => setKeyword(tip)}
                className="p-4 rounded-2xl border border-dashed border-stone-200 text-stone-400 hover:border-orange-200 hover:text-orange-400 transition-all text-sm font-medium"
              >
                试试 “{tip}”
              </button>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 text-center pointer-events-none">
        <p className="text-[10px] text-stone-300 uppercase tracking-[0.2em] font-bold">
          Made with Love for the Next Generation
        </p>
      </footer>
    </div>
  );
}
