interface ThreadsIconProps {
  className?: string;
  size?: number;
}

export function ThreadsIcon({ className = "", size = 24 }: ThreadsIconProps) {
  return (
    <img
      src="/threads-icon.svg"
      alt="Threads"
      width={size}
      height={size}
      className={className}
    />
  );
}
