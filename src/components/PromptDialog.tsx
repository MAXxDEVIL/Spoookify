import { useEffect, useRef, useState, type FormEvent } from 'react'

type Props = {
  open: boolean
  title: string
  label: string
  initialValue?: string
  submitLabel: string
  onClose: () => void
  onSubmit: (value: string) => Promise<void>
}

export default function PromptDialog({
  open,
  title,
  label,
  initialValue = '',
  submitLabel,
  onClose,
  onSubmit,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [value, setValue] = useState(initialValue)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      dialog.current?.close()
      return
    }
    setValue(initialValue)
    setError('')
    dialog.current?.showModal()
  }, [open, initialValue])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = value.trim()
    if (!name || busy) return
    setBusy(true)
    setError('')
    try {
      await onSubmit(name)
      onClose()
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      onClose={onClose}
      aria-label={title}
      className="m-auto w-[min(100%-2rem,24rem)] rounded-lg border border-border bg-surface p-0 text-text shadow-pop backdrop:bg-bg/80"
    >
      <form onSubmit={submit} className="flex flex-col gap-3 p-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <label className="flex flex-col gap-1 text-sm">
          {label}
          <input
            autoFocus
            required
            maxLength={100}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="rounded-md border border-border-input bg-surface px-3 py-2 text-base focus:border-accent focus:outline-none"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-pill border border-border px-4 py-2 text-sm text-text-muted hover:text-text disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !value.trim()}
            className="rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-40"
          >
            {busy ? 'Saving…' : submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  )
}
