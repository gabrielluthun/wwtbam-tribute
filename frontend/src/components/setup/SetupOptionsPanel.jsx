import { motion } from 'framer-motion';
import { Clock, Download, Eye, Shuffle, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

export const SetupOptionsPanel = ({
  fileInputRef,
  handleExport,
  handleImport,
  importError,
  importSuccess,
  timerEnabled,
  setTimerEnabled,
  timerDuration,
  onTimerDurationInputChange,
  shuffleEnabled,
  setShuffleEnabled,
}) => (
  <motion.div
    className="glass-light rounded-lg p-4 mb-6"
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Download size={18} className="text-[#00E5FF]" />
          Import / Export
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            className="btn-secondary text-sm flex items-center gap-2"
            onClick={handleExport}
            data-testid="export-btn"
          >
            <Download size={16} />
            Exporter JSON
          </button>
          <label className="btn-secondary text-sm flex items-center gap-2 cursor-pointer">
            <Upload size={16} />
            Importer JSON
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
              data-testid="import-input"
            />
          </label>
        </div>
        {importError && <p className="text-red-400 text-sm mt-2">{importError}</p>}
        {importSuccess && <p className="text-green-400 text-sm mt-2">{importSuccess}</p>}
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Clock size={18} className="text-[#FFD700]" />
          Timer (optionnel)
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={timerEnabled}
              onCheckedChange={setTimerEnabled}
              data-testid="timer-toggle"
            />
            <span className="text-[#B0B0C0] text-sm">
              {timerEnabled ? 'Activé' : 'Désactivé'}
            </span>
          </div>
          {timerEnabled && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="10"
                max="120"
                value={timerDuration}
                onChange={onTimerDurationInputChange}
                className="game-input w-20 text-center"
                data-testid="timer-duration"
              />
              <span className="text-[#B0B0C0] text-sm">secondes</span>
            </div>
          )}
        </div>
        {timerEnabled && (
          <p className="text-[#B0B0C0] text-xs mt-2">
            Le temps s'écoule pendant chaque question. Si le temps expire, la partie est perdue.
          </p>
        )}
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Shuffle size={18} className="text-[#E91E63]" />
          Mélanger l'ordre
        </h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={shuffleEnabled}
            onCheckedChange={setShuffleEnabled}
            data-testid="shuffle-toggle"
          />
          <span className="text-[#B0B0C0] text-sm">
            {shuffleEnabled ? 'Questions mélangées' : 'Ordre original'}
          </span>
        </div>
        <p className="text-[#B0B0C0] text-xs mt-2">
          {shuffleEnabled
            ? 'Les 15 questions seront posées dans un ordre aléatoire. Chaque partie sera différente !'
            : "Les questions seront posées dans l'ordre que vous avez défini."}
        </p>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Eye size={18} className="text-[#FFD700]" />
          Révélation manuelle
        </h3>
        <p className="text-[#B0B0C0] text-xs mt-2">
          À partir de la question 6, après &quot;C&apos;est mon dernier mot !&quot;, un bouton
          &quot;L&apos;animateur révèle la réponse&quot; apparaît. Les 5 premières questions
          restent en validation immédiate.
        </p>
      </div>
    </div>
  </motion.div>
);
