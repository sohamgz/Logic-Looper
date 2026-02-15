import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  currentStreak: number;
  longestStreak: number;
  totalPuzzles: number;
  userName: string;
}

export const ShareStreak = ({ currentStreak, longestStreak, totalPuzzles, userName }: Props) => {
  const [copied, setCopied] = useState(false);
  const [imageGenerated, setImageGenerated] = useState(false);

  // Generate share text
  const shareText = `🔥 My Logic Looper Stats:
• Current Streak: ${currentStreak} days
• Longest Streak: ${longestStreak} days  
• Total Puzzles: ${totalPuzzles}

Challenge yourself daily at Logic Looper! 🧩`;

  // Copy to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate image using Canvas API
  const handleGenerateImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 400);
    gradient.addColorStop(0, '#414BEA');
    gradient.addColorStop(1, '#7752FE');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧩 Logic Looper', 400, 80);

    // User name
    ctx.font = '24px Poppins, sans-serif';
    ctx.fillText(userName, 400, 120);

    // Stats boxes
    const stats = [
      { label: 'Current Streak', value: `${currentStreak} 🔥`, y: 200 },
      { label: 'Longest Streak', value: `${longestStreak} 🏆`, y: 260 },
      { label: 'Total Puzzles', value: totalPuzzles, y: 320 },
    ];

    stats.forEach(stat => {
      // Label
      ctx.font = '18px Poppins, sans-serif';
      ctx.fillStyle = '#D9E2FF';
      ctx.fillText(stat.label, 400, stat.y);

      // Value
      ctx.font = 'bold 32px Poppins, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(String(stat.value), 400, stat.y + 35);
    });

    // Footer
    ctx.font = '16px Poppins, sans-serif';
    ctx.fillStyle = '#D9E2FF';
    ctx.fillText('Train your brain daily!', 400, 380);

    // Download image
    const link = document.createElement('a');
    link.download = 'logic-looper-streak.png';
    link.href = canvas.toDataURL();
    link.click();

    setImageGenerated(true);
    setTimeout(() => setImageGenerated(false), 3000);
  };

  // Share on Twitter/X
  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://logic-looper-one.vercel.app`;
    window.open(twitterUrl, '_blank');
  };

  // Share on WhatsApp
  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Progress 🎉</h3>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg p-6 text-white mb-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-3xl font-bold mb-1">{currentStreak} Day Streak!</div>
          <div className="text-sm opacity-90">Keep it up, {userName}!</div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Copy Text */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <span className="text-lg">✓</span>
              <span className="font-medium">Copied!</span>
            </>
          ) : (
            <>
              <span className="text-lg">📋</span>
              <span className="font-medium">Copy Text</span>
            </>
          )}
        </motion.button>

        {/* Generate Image */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateImage}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          {imageGenerated ? (
            <>
              <span className="text-lg">✓</span>
              <span className="font-medium">Downloaded!</span>
            </>
          ) : (
            <>
              <span className="text-lg">🖼️</span>
              <span className="font-medium">Save Image</span>
            </>
          )}
        </motion.button>

        {/* Twitter/X */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareTwitter}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          <span className="text-lg">𝕏</span>
          <span className="font-medium">Share on X</span>
        </motion.button>

        {/* WhatsApp */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <span className="text-lg">📱</span>
          <span className="font-medium">WhatsApp</span>
        </motion.button>
      </div>
    </div>
  );
};