export function MessageCard({ message, myName, accentColor }: { message: string; myName: string; accentColor: string }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-surface/70 p-8 shadow-soft backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.35em] text-text/60">Message</p>
      <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-text/85">{message}</p>
      <div className="mt-8 border-t border-white/10 pt-6 text-right text-sm text-text/70">
        <span className="block text-2xl font-semibold" style={{ color: accentColor }}>{myName}</span>
        <span className="text-xs uppercase tracking-[0.25em] text-text/50">with all my love</span>
      </div>
    </div>
  );
}
