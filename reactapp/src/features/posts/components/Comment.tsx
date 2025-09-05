export default function Comment() {
  return (
    <div className="border border-border w-full pt-4 flex flex-row items-start gap-4 hover:bg-primary/10 transition-colors rounded-lg p-3 animate-fade-in bg-card">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
        AT
      </div>
      <div className="flex flex-col items-start justify-center space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-secondary">
            Ahmad Tomeh
          </span>
          <span className="text-xs text-muted-foreground">@ahmadtomeh</span>
          <span className="text-xs text-muted-foreground">· 1 day ago</span>
        </div>
        <p className="text-sm text-foreground">
          This is a sample comment with style.
        </p>
      </div>
    </div>
  );
}
