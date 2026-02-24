import { cn } from "~/lib/utils";

export interface AnnouncementBarProps {
  messages: string[];
  /** Pixels per second (default 50) */
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function AnnouncementBar({
  messages,
  speed = 50,
  pauseOnHover = true,
  className,
}: AnnouncementBarProps) {
  if (messages.length === 0) return null;

  // Join messages with spacer, duplicate for seamless loop
  const content = messages.join("   \u00B7   ");
  // Estimate duration: longer content = slower cycle
  const charWidth = 7.5; // rough px per char at 12px uppercase
  const totalWidth = content.length * charWidth;
  const duration = totalWidth / speed;

  return (
    <div
      className={cn(
        "w-full bg-black overflow-hidden",
        "h-9 max-redesign-sm:h-8",
        "flex items-center",
        className
      )}
      role="marquee"
      aria-live="off"
    >
      <div
        className={cn(
          "flex whitespace-nowrap",
          "animate-[marquee_var(--marquee-duration)_linear_infinite]",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={
          {
            "--marquee-duration": `${duration}s`,
          } as React.CSSProperties
        }
      >
        {/* Render content twice for seamless loop */}
        {[0, 1].map((i) => (
          <span
            key={i}
            className={cn(
              "font-body text-[12px] max-redesign-sm:text-[11px]",
              "font-medium text-white uppercase tracking-[1.5px]",
              "px-6"
            )}
          >
            {messages.map((msg, idx) => (
              <span key={idx}>
                {msg}
                {idx < messages.length - 1 && (
                  <span className="mx-6 opacity-40">&middot;</span>
                )}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
