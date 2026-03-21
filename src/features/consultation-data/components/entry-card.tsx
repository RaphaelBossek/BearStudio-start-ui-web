type EntryCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export const EntryCard = ({ title, subtitle, children }: EntryCardProps) => (
  <div className="rounded-md border p-3 space-y-2">
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
      {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
    </div>
    {children}
  </div>
);
