import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const CHECKPOINTS = ['Q5 : 1 500 €', 'Q10 : 48 000 €', 'Q15 : 1 000 000 €'];

export const HomeHowToPlayModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-testid="home-how-to-play-modal"
      >
        <motion.div
          className="home-help-modal"
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="home-help-header">
            <h3>Comment jouer</h3>
            <button
              className="home-help-close"
              onClick={onClose}
              aria-label="Fermer la fenêtre d'aide"
            >
              <X size={18} />
            </button>
          </div>

          <div className="home-help-content">
            <section>
              <h4>Objectif</h4>
              <p>
                Répondre correctement à 15 questions (A, B, C, D) pour atteindre
                <strong> 1 000 000 €</strong>.
              </p>
            </section>

            <section>
              <h4>Modes disponibles</h4>
              <ul>
                <li><strong>Solo :</strong> une seule progression continue.</li>
                <li><strong>Multijoueur local :</strong> 2 joueurs, tours alternés, score affiché.</li>
              </ul>
            </section>

            <section>
              <h4>Préparation de la partie</h4>
              <ul>
                <li>Créer 15 questions, 4 réponses par question, 1 bonne réponse.</li>
                <li>Ou charger un thème prêt à jouer (bibliothèque + thèmes persos).</li>
                <li>Import / export des quiz au format JSON.</li>
              </ul>
            </section>

            <section>
              <h4>Déroulé d’une question</h4>
              <ul>
                <li>Sélectionner une réponse puis confirmer avec “C’est mon dernier mot !”.</li>
                <li>À partir de la question 6, la révélation peut être manuelle (animateur).</li>
                <li>La pyramide des gains indique votre niveau actuel en temps réel.</li>
              </ul>
            </section>

            <section>
              <h4>Jokers (1 utilisation chacun)</h4>
              <ul>
                <li><strong>50:50 :</strong> retire deux mauvaises réponses.</li>
                <li><strong>Téléphone :</strong> conseil simulé avec niveau de confiance.</li>
                <li><strong>Avis du public :</strong> répartition en pourcentage des réponses.</li>
              </ul>
            </section>

            <section>
              <h4>Paliers de sécurité</h4>
              <p>
                En cas d’erreur, vous retombez sur le dernier palier validé :
              </p>
              <div className="home-help-checkpoints">
                {CHECKPOINTS.map((checkpoint) => (
                  <span key={checkpoint}>{checkpoint}</span>
                ))}
              </div>
            </section>

            <section>
              <h4>Fin de partie</h4>
              <ul>
                <li><strong>Mauvaise réponse :</strong> fin immédiate de la manche.</li>
                <li><strong>Partir avec les gains :</strong> vous pouvez sécuriser le montant acquis.</li>
                <li><strong>Mode chrono (optionnel) :</strong> 10 à 120 secondes, timeout = erreur.</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
