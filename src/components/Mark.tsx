export function Mark({ width = 20, height = 24, className }: { width?: number; height?: number; className?: string }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 168 204" fill="currentColor" aria-hidden="true">
      <rect x="64.0972" width="16.335" height="50.4254" rx="8.1675" />
      <rect x="0" y="64.2747" width="50.4254" height="16.335" rx="8.1675" />
      <rect x="94.4589" y="64.2747" width="73.1524" height="16.335" rx="8.1675" />
      <rect x="64.0972" y="94.459" width="16.335" height="109.373" rx="8.1675" />
      <circle cx="72.2647" cy="72.4422" r="8.1675" />
      <rect x="147.022" y="135.639" width="16.335" height="50.7086" rx="8.1675" transform="rotate(135 147.022 135.639)" />
    </svg>
  );
}

export const Arrow = () => <span className="ar" aria-hidden="true">›</span>;

export function Row({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={"row" + (className ? " " + className : "")} style={style}>
      <div className="side" />
      <div className="mid">{children}</div>
      <div className="side" />
    </div>
  );
}
