import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Info } from 'lucide-react';
import { HomeHowToPlayModal } from '../components/home/HomeHowToPlayModal';

export const Home = () => {
  const navigate = useNavigate();
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  return (
    <div className="min-h-screen studio-bg flex flex-col items-center justify-center p-6">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B1A]/70 via-[#0B0B1A]/50 to-[#0B0B1A]/80" />
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        {/* Title styled like the TV show */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          data-testid="game-logo"
        >
          <div className="relative">
            {/* Decorative glow */}
            <div className="absolute inset-0 blur-3xl bg-[#FFD700]/20 rounded-full" />
            
            {/* Question mark icon */}
            <div className="relative mx-auto w-24 h-24 mb-6 rounded-full border-4 border-[#FFD700] flex items-center justify-center bg-gradient-to-br from-[#1A1A3A] to-[#0B0B1A] glow-gold">
              <span className="text-5xl font-black font-['Chivo'] text-[#FFD700]">?</span>
            </div>
          </div>
        </motion.div>
        
        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Chivo'] text-white mb-4 tracking-tight text-glow-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          data-testid="game-title"
        >
          QUI VEUT GAGNER
        </motion.h1>
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Chivo'] text-[#FFD700] mb-8 tracking-tight text-glow-gold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          DES MILLIONS ?
        </motion.h2>
        
        {/* Subtitle */}
        <motion.p
          className="text-[#ECECFF] text-lg mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Répondez à 15 questions et grimpez jusqu'au million.
        </motion.p>

        <motion.div
          className="mode-intro"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82 }}
        >
          Choisissez votre mode de jeu
        </motion.div>

        {/* Mode cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            className="mode-card mode-card-primary"
            onClick={() => navigate('/setup')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="start-solo-btn"
          >
            <span className="mode-badge">Le plus immersif</span>
            <span className="mode-title">
              <Play size={20} />
              Jouer Solo
            </span>
            <span className="mode-subtitle">Gagnez le million, en retrouvant l'ambiance du jeu télévisé.</span>
          </motion.button>

          <motion.button
            className="mode-card mode-card-secondary"
            onClick={() => navigate('/setup?mode=multi')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="start-multi-btn"
          >
            <span className="mode-badge">Personnalisé</span>
            <span className="mode-title">
              <Users size={20} />
              Multijoueur
            </span>
            <span className="mode-subtitle">Remportez le million d'euros avec un(e) ami(e) !</span>
          </motion.button>
        </div>

        {/* Info */}
        <motion.div
          className="mt-6 glass-light rounded-lg p-3 max-w-md border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info size={18} className="text-[#00E5FF] flex-shrink-0" />
              <p className="text-[#D8D8E8] text-sm text-left">
                Tout le fonctionnement détaillé est disponible ici.
              </p>
            </div>
            <button
              className="btn-secondary text-sm"
              onClick={() => setIsHowToPlayOpen(true)}
              data-testid="open-how-to-play-modal-btn"
            >
              Comment jouer
            </button>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-xs italic text-[#B0B0C0]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          data-testid="home-created-by"
        >
          Created by gabri_ailes and Shivii, just for fun :D
        </motion.p>
      </div>

      <HomeHowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
};
