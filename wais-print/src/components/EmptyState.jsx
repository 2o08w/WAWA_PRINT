export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-ink-800 border border-ink-600 flex items-center justify-center mb-4">
          <Icon className="h-5 w-5 text-slate-500" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
