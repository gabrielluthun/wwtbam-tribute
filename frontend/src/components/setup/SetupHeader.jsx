import { ArrowLeft, Library, Play, Save, Settings } from 'lucide-react';
import { SETUP_QUESTION_COUNT } from '../../setup/setupConstants';

export const SetupHeader = ({
  completedCount,
  themeStepCompleted,
  questionsStepCompleted,
  canLaunchGame,
  loadedTheme,
  shuffleEnabled,
  launchHint,
  onBack,
  onOpenThemeSelector,
  onOpenSaveThemeModal,
  onToggleOptions,
  onStartGame,
}) => (
  <div className="mb-6 space-y-4">
    <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
      <button
        className="flex items-center gap-2 text-[#B0B0C0] hover:text-white transition-colors"
        onClick={onBack}
        data-testid="back-btn"
      >
        <ArrowLeft size={20} />
        <span>Retour</span>
      </button>

      <div className="text-center w-full sm:w-auto">
        <h1 className="text-2xl sm:text-3xl font-bold font-['Chivo'] text-white">
          Créer vos questions
        </h1>
        <p className="text-[#D8D8E8] text-sm font-medium">
          {completedCount}/{SETUP_QUESTION_COUNT} questions complètes
        </p>
      </div>

      <div className="hidden sm:block w-[72px]" aria-hidden="true" />
    </div>

    <div className="flex items-center justify-center gap-2 flex-wrap text-xs sm:text-sm">
      <span
        className={`px-2 py-1 rounded-full border ${
          themeStepCompleted
            ? 'bg-green-500/10 text-green-300 border-green-500/30'
            : 'bg-white/5 text-[#B0B0C0] border-white/10'
        }`}
      >
        {themeStepCompleted ? 'Thème prêt' : 'Thème à définir'}
      </span>
      <span
        className={`px-2 py-1 rounded-full border ${
          questionsStepCompleted
            ? 'bg-green-500/10 text-green-300 border-green-500/30'
            : 'bg-white/5 text-[#B0B0C0] border-white/10'
        }`}
      >
        {completedCount}/{SETUP_QUESTION_COUNT} questions prêtes
      </span>
      <span
        className={`px-2 py-1 rounded-full border ${
          canLaunchGame
            ? 'bg-green-500/10 text-green-300 border-green-500/30'
            : 'bg-white/5 text-[#B0B0C0] border-white/10'
        }`}
      >
        {canLaunchGame ? 'Prêt à lancer' : 'Lancement verrouillé'}
      </span>
      {loadedTheme && (
        <span
          className="px-2 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `${loadedTheme.color}20`,
            color: loadedTheme.color,
            border: `1px solid ${loadedTheme.color}40`,
          }}
          data-testid="loaded-theme-badge"
        >
          {loadedTheme.name}
        </span>
      )}
      {shuffleEnabled && (
        <span
          className="px-2 py-1 rounded-full text-xs font-semibold bg-[#E91E63]/20 text-[#E91E63] border border-[#E91E63]/40"
          data-testid="shuffle-badge"
        >
          Mélangé
        </span>
      )}
    </div>

    <div className="glass-light rounded-lg p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          className={`btn-secondary flex items-center justify-center gap-2 text-sm ${
            !themeStepCompleted ? 'border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10' : ''
          }`}
          onClick={onOpenThemeSelector}
          data-testid="open-theme-selector"
        >
          <Library size={16} />
          Choisir un thème
        </button>
        <button
          className="btn-secondary flex items-center justify-center gap-2 text-sm"
          onClick={onOpenSaveThemeModal}
          data-testid="save-theme-btn"
        >
          <Save size={16} />
          Enregistrer ce thème
        </button>
        <button
          className="btn-secondary flex items-center justify-center gap-2 text-sm"
          onClick={onToggleOptions}
          data-testid="toggle-import-export"
        >
          <Settings size={16} />
          Options
        </button>
      </div>

      <div className="flex flex-col items-stretch lg:items-end gap-1 min-w-[220px]">
        <button
          className="btn-primary flex items-center justify-center gap-2 text-sm w-full lg:w-auto"
          onClick={onStartGame}
          disabled={!canLaunchGame}
          data-testid="start-game-btn"
          title={launchHint}
        >
          <Play size={18} />
          Lancer la partie
        </button>
        <p className="text-xs text-[#B0B0C0] text-center lg:text-right">{launchHint}</p>
      </div>
    </div>
  </div>
);
