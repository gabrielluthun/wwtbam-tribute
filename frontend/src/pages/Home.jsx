import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Info } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen studio-bg flex flex-col items-center justify-center p-6">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B1A]/70 via-[#0B0B1A]/50 to-[#0B0B1A]/80" />
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        {/* Logo */}
        <motion.img
          src="https://static.prod-images.emergentagent.com/jobs/201663b8-c6e5-4fe3-9467-f84ce9541ef8/images/76761474e727d34111172a4702dee899a1423becbf008af6d82c07c820773241.png"
          alt="Qui Veut Gagner des Millions"
          className="game-logo w-full max-w-md mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          data-testid="game-logo"
        />
        
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
          className="text-[#B0B0C0] text-lg mb-12 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Créez vos propres questions et défiez vos amis dans ce jeu mythique !
        </motion.p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <motion.button
            className="btn-primary flex-1 flex items-center justify-center gap-3"
            onClick={() => navigate('/setup')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="start-solo-btn"
          >
            <Play size={24} />
            Jouer Solo
          </motion.button>
          
          <motion.button
            className="btn-secondary flex-1 flex items-center justify-center gap-3"
            onClick={() => navigate('/setup?mode=multi')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="start-multi-btn"
          >
            <Users size={24} />
            Multijoueur
          </motion.button>
        </div>
        
        {/* Info */}
        <motion.div
          className="mt-12 glass-light rounded-lg p-4 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-start gap-3">
            <Info size={20} className="text-[#00E5FF] flex-shrink-0 mt-1" />
            <p className="text-[#B0B0C0] text-sm text-left">
              <span className="text-white font-semibold">Comment jouer :</span> Créez 15 questions avec 4 réponses chacune (1 correcte, 3 fausses). 
              Utilisez vos 3 jokers stratégiquement pour atteindre le million !
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
