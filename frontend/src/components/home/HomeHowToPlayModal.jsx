import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Clock3,
  FileJson,
  Goal,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

const CHECKPOINTS = [
  { question: 'Entre Q1 et Q5', amount: '0 €' },
  { question: 'Entre Q5 et Q10', amount: '1 500 €' },
  { question: 'Entre Q10 et Q15', amount: '48 000 €' },
];

const HELP_SECTIONS = [
  {
    id: 'objectif',
    icon: Goal,
    title: 'Objectif et structure',
    content: (
      <>
        <p>
          Le but est de répondre à <strong>15 questions</strong> à choix multiple (A, B, C, D)
          pour atteindre le gain final de <strong>1 000 000 €</strong>.
        </p>
        <ul>
          <li>La difficulté monte progressivement de la question 1 à 15.</li>
          <li>Chaque question valide le palier courant dans la pyramide des gains.</li>
          <li>Vous pouvez stopper la partie à tout moment pour sécuriser vos gains.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'modes',
    icon: Users,
    title: 'Modes de jeu',
    content: (
      <>
        <ul>
          <li><strong>Solo :</strong> vous jouez une progression unique jusqu’au million.</li>
          <li><strong>Multijoueur local :</strong> 2 joueurs avec alternance de tours.</li>
          <li>Le mode multijoueur affiche les scores et le joueur actif à l’écran.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'preparation',
    icon: Sparkles,
    title: 'Préparation de la partie',
    content: (
      <>
        <ul>
          <li>Créer 15 questions avec 4 réponses et 1 bonne réponse par question.</li>
          <li>Choisir un thème prédéfini ou un thème personnalisé sauvegardé localement.</li>
          <li>Activer le mélange des questions pour des parties différentes.</li>
          <li>Configurer un timer optionnel entre 10 et 120 secondes.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'jokers',
    icon: ShieldCheck,
    title: 'Jokers et aides',
    content: (
      <>
        <p>Chaque joker est utilisable une seule fois par partie :</p>
        <ul>
          <li><strong>50:50 :</strong> retire deux mauvaises réponses.</li>
          <li><strong>Téléphone :</strong> simule un appel à un ami pour une réponse rapide.</li>
          <li><strong>Avis du public :</strong> simule un vote du public et affiche une répartition en pourcentage.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'regles',
    icon: Clock3,
    title: 'Règles de progression et défaite',
    content: (
      <>
        <ul>
          <li>Une mauvaise réponse met fin à la manche immédiatement.</li>
          <li>
            En cas d’échec, vous retombez sur le dernier palier de sécurité validé :
          </li>
        </ul>
        <div className="home-help-checkpoints">
          {CHECKPOINTS.map((checkpoint) => (
            <div key={checkpoint.question} className="home-help-checkpoint-card">
              <span className="home-help-checkpoint-label">{checkpoint.question}</span>
              <span className="home-help-checkpoint-dot" aria-hidden="true" />
              <span className="home-help-checkpoint-amount">{checkpoint.amount}</span>
            </div>
          ))}
        </div>
        <ul>
          <li>Une révélation manuelle est effectuée à partir de la question 6 (3 000 €).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'import-export',
    icon: FileJson,
    title: 'Import de vos questions',
    content: (
      <>
        <div className="home-help-dual-grid">
          <article className="home-help-paragraph-card home-help-import-card">
            <h5>Solution 1 - Rapide avec IA</h5>
            <ol className="home-help-step-list">
              <li>Dans l’écran de préparation, ouvrez <strong>Options</strong> puis cliquez sur <strong>Exporter JSON</strong>.</li>
              <li>Donnez ce fichier à une IA et demandez-lui de remplir le quiz avec un thème de votre choix, tout en gardant le même format JSON.</li>
              <li>Téléchargez le nouveau fichier <strong>.json</strong> généré.</li>
              <li>Revenez dans <strong>Options</strong> puis cliquez sur <strong>Importer JSON</strong>.</li>
              <li>Contrôlez rapidement le résultat, sauvegardez le thème et lancez la partie.</li>
            </ol> <br />
            <p className="home-help-estimate">Temps estimé : ~2 minutes.</p>
          </article>

          <article className="home-help-paragraph-card home-help-export-card">
            <h5>Solution 2 - Saisie manuelle</h5>
            <ol className="home-help-step-list">
              <li>Renseignez vos 15 questions directement dans l’éditeur.</li>
              <li>Ajoutez 4 réponses pour chaque question.</li>
              <li>Définissez la bonne réponse à chaque étape en cliquant sur la lettre de la réponse correcte.</li>
              <li>Utilisez <strong>Suivant</strong> pour compléter toute la série.</li>
              <li>Relisez et corrigez, puis démarrez la partie.</li>
            </ol> <br />
            <p className="home-help-estimate">Temps estimé : variable selon le thème, la difficulté et le niveau de détail.</p>
          </article>
        </div>
      </>
    ),
  },
];

export const HomeHowToPlayModal = ({ isOpen, onClose }) => {
  const [openSectionId, setOpenSectionId] = useState('objectif');

  const toggleSection = (sectionId) => {
    setOpenSectionId((prev) => (prev === sectionId ? '' : sectionId));
  };

  return (
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
              <div>
                <h3>Guide complet du jeu</h3>
                <p className="home-help-intro">
                  Tout est inclus dans ce guide pour vous aider à jouer au mieux.
                </p>
              </div>
              <button
                className="home-help-close"
                onClick={onClose}
                aria-label="Fermer la fenêtre d'aide"
              >
                <X size={18} />
              </button>
            </div>


            <div className="home-help-accordion">
              {HELP_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isOpenSection = openSectionId === section.id;

                return (
                  <section key={section.id} className={`home-help-item ${isOpenSection ? 'is-open' : ''}`}>
                    <button
                      className="home-help-trigger"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={isOpenSection}
                    >
                      <span className="home-help-trigger-left">
                        <Icon size={18} />
                        {section.title}
                      </span>
                      <ChevronDown size={18} className={`home-help-chevron ${isOpenSection ? 'is-open' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpenSection && (
                        <motion.div
                          className="home-help-panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          <div className="home-help-panel-inner">{section.content}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
