import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/components/v2/Button/Button";

/* ------------------------------------------------------------------ */
/*  Illustrations (minimal line-art SVGs)                              */
/* ------------------------------------------------------------------ */

function NotFoundIllustration() {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      className="mx-auto mb-10 opacity-60"
      aria-hidden="true"
    >
      {/* Page outline */}
      <rect x="50" y="30" width="100" height="130" rx="8" stroke="#000" strokeWidth="1.5" />
      {/* Fold corner */}
      <path d="M120 30V60H150" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M120 30L150 60" stroke="#000" strokeWidth="1.5" />
      {/* Question mark */}
      <path d="M90 95C90 85 95 78 105 78C115 78 120 85 118 93C116 101 107 101 107 110" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <circle cx="107" cy="120" r="2" fill="#000" />
      {/* Magnifying glass */}
      <circle cx="140" cy="150" r="18" stroke="#000" strokeWidth="1.5" />
      <path d="M153 163L168 178" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ServerErrorIllustration() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      className="mx-auto mb-10 opacity-50"
      aria-hidden="true"
    >
      {/* Gear outer */}
      <circle cx="80" cy="70" r="35" stroke="#000" strokeWidth="1.5" />
      {/* Gear inner */}
      <circle cx="80" cy="70" r="15" stroke="#000" strokeWidth="1.5" />
      {/* Gear teeth */}
      <path d="M80 30V22M80 118V110M45 70H37M123 70H115" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <path d="M55.2 45.2L49 39M105 101L111 107M55.2 94.8L49 101M105 39L111 45.2" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Wrench */}
      <path d="M60 120L90 135" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <path d="M55 115C50 120 50 128 55 133C60 138 68 138 73 133" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M85 140C90 145 98 145 103 140C108 135 108 127 103 122" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Error Pages                                                        */
/* ------------------------------------------------------------------ */

export interface NotFoundPageProps {
  className?: string;
}

export function NotFoundPage({ className }: NotFoundPageProps) {
  return (
    <div
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-[var(--container-padding)]",
        "py-[120px] text-center",
        "max-redesign-sm:py-20",
        className
      )}
    >
      <NotFoundIllustration />

      <p className="font-heading text-[80px] font-bold text-black leading-none mb-2 max-redesign-sm:text-[56px]">
        404
      </p>
      <h1 className="font-heading text-[28px] font-bold text-black mb-3">
        Page not found
      </h1>
      <p className="font-body text-[15px] text-rd-text-body leading-relaxed max-w-[420px] mx-auto mb-8">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex gap-3 justify-center">
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
        <Link to="/shop-all">
          <Button variant="secondary">Browse Products</Button>
        </Link>
      </div>
    </div>
  );
}

export interface ServerErrorPageProps {
  error?: Error;
  statusCode?: number;
  className?: string;
}

export function ServerErrorPage({
  error,
  statusCode,
  className,
}: ServerErrorPageProps) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-[var(--container-padding)]",
        "py-[120px] text-center",
        "max-redesign-sm:py-20",
        className
      )}
    >
      <ServerErrorIllustration />

      <h1 className="font-heading text-[28px] font-bold text-black mb-3">
        Something went wrong
      </h1>
      <p className="font-body text-[15px] text-rd-text-body leading-relaxed max-w-[420px] mx-auto mb-8">
        We're working on it. Please try again in a moment.
      </p>

      <div className="flex gap-3 justify-center">
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
        <Link to="/">
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>

      {isDev && error && (
        <div className="mt-6 p-4 bg-rd-bg-card rounded-rd-sm font-mono text-xs text-rd-text-muted text-left max-h-[200px] overflow-y-auto max-w-2xl mx-auto">
          <p className="font-semibold mb-2">
            {statusCode && `${statusCode}: `}
            {error.message}
          </p>
          {error.stack && (
            <pre className="whitespace-pre-wrap break-words">{error.stack}</pre>
          )}
        </div>
      )}
    </div>
  );
}
