import { motion, AnimatePresence } from 'framer-motion';

export const ConfirmActionModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        data-testid="confirm-action-modal"
      >
        <motion.div
          className="phone-dialog w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-white font-bold font-['Chivo'] text-xl mb-3">{title}</h3>
          <p className="text-[#B0B0C0] mb-6">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-secondary flex-1" onClick={onCancel} data-testid="confirm-cancel-btn">
              Annuler
            </button>
            <button className="btn-danger flex-1" onClick={onConfirm} data-testid="confirm-accept-btn">
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
