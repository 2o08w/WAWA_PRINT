import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Hapus data?',
  description = 'Tindakan ini tidak dapat dibatalkan.',
  confirmLabel = 'Hapus',
}) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm" title="">
      <div className="flex flex-col items-center text-center gap-3 -mt-2">
        <div className="h-11 w-11 rounded-full bg-danger/10 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-danger" />
        </div>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-500">{description}</p>
        <div className="flex gap-2 w-full mt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
