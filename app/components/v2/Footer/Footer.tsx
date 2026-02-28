import { useEffect, useState, useCallback } from "react";
import { Link, useFetcher } from "react-router";
import { cn } from "~/lib/utils";
import SubscribeModal from "~/components/EmailSubscribeModal";
import type { ApiErrorResponse } from "~/shared/types";

export interface FooterLinkGroup {
  heading: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  /** Newsletter section */
  newsletterHeading?: string;
  newsletterSubtext?: string;
  onNewsletterSubmit?: (email: string) => void;
  /** Link columns (typically 2: "Shop" + "Customer care") */
  linkGroups?: FooterLinkGroup[];
  /** About column */
  aboutHeading?: string;
  aboutDescription?: string;
  aboutLinkLabel?: string;
  aboutLinkHref?: string;
  /** Bottom bar */
  regionLabel?: string;
  regionFlag?: React.ReactNode;
  copyrightText?: string;
  legalLinks?: { label: string; href: string }[];
  socialLinks?: { label: string; href: string; icon: React.ReactNode }[];
  paymentIcons?: React.ReactNode[];
  className?: string;
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Footer({
  newsletterHeading = "Join our mailing list",
  newsletterSubtext = "Get exclusive offers and early access to new products.",
  linkGroups = [],
  aboutHeading = "About",
  aboutDescription,
  aboutLinkLabel = "Learn More",
  aboutLinkHref = "/about",
  regionLabel = "Australia (AUD $)",
  regionFlag,
  copyrightText = `© ${new Date().getFullYear()} PeasyDeal. All rights reserved.`,
  legalLinks = [],
  socialLinks = [],
  paymentIcons = [],
  className,
}: FooterProps) {
  const fetcher = useFetcher();
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  useEffect(() => {
    if (fetcher.state !== "idle") return;
    if (fetcher.data === undefined) return;

    const result = fetcher.data as
      | { ok: true }
      | ({ ok: false } & ApiErrorResponse)
      | ApiErrorResponse
      | undefined;

    if (!result) return;

    if ("ok" in result) {
      if (!result.ok) {
        setError(result);
        return;
      }

      setError(null);
      setOpenModal(true);
      return;
    }

    if (result?.error) {
      setError(result);
      return;
    }

    setError(null);
    setOpenModal(true);
  }, [fetcher.data, fetcher.state]);

  const onCloseModal = useCallback(() => {
    setOpenModal(false);
    setError(null);
  }, []);

  return (
    <>
      <SubscribeModal open={openModal} onClose={onCloseModal} error={error} />

      <footer
        className={cn(
          "w-full bg-white border-t border-[#E0E0E0]",
          className
        )}
      >
      <div className="mx-auto max-w-[var(--container-max)] px-12 pt-16 pb-8 max-redesign-sm:px-4">
        {/* Main 4-column grid */}
        <div
          className={cn(
            "mb-12 grid gap-12",
            "grid-cols-1 redesign-sm:grid-cols-2 redesign-md:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]"
          )}
        >
          {/* Column 1 — Newsletter */}
          <div>
            <h3 className="mb-2 font-heading text-[24px] font-bold leading-[1.2] text-black">
              {newsletterHeading}
            </h3>
            <p className="mb-5 font-body text-[14px] font-normal leading-[1.5] text-[#666]">
              {newsletterSubtext}
            </p>

            <fetcher.Form
              action="/api/email-subscribe"
              method="post"
              className="flex h-11 rounded-rd-sm border-[1.5px] border-[#E0E0E0] overflow-hidden focus-within:border-black transition-colors duration-fast"
            >
              <input
                name="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "flex-1 px-3.5 border-none bg-white font-body text-[14px] text-black outline-none placeholder:text-[#AAA]",
                  error && "ring-1 ring-destructive"
                )}
                autoComplete="email"
                aria-invalid={!!error}
                required
              />
              <button
                type="submit"
                className="w-11 h-full bg-transparent border-none cursor-pointer flex items-center justify-center text-black hover:bg-[#F5F5F5] transition-colors duration-fast"
                disabled={fetcher.state !== "idle"}
                aria-label="Subscribe"
              >
                <ArrowRightIcon />
              </button>
            </fetcher.Form>

            {error && (
              <div className="mt-2 text-left text-sm text-red-500">
                {error.error}
              </div>
            )}

            <p className="mt-3 font-body text-[12px] font-normal leading-[1.4] text-[#888]">
              By signing up, you agree to our{" "}
              <Link to="/terms-of-use" className="text-black underline">Terms of Use</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-black underline">Privacy Policy</Link>.
            </p>
          </div>

          {/* Columns 2-3 — Link groups */}
          {linkGroups.map((group, i) => (
            <nav key={i}>
              <h3 className="mb-5 font-body text-[16px] font-bold text-black">
                {group.heading}
              </h3>
              <div className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="font-body text-[14px] font-normal text-[#666] no-underline hover:text-black transition-colors duration-fast"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}

          {/* Column 4 — About */}
          <div>
            <h3 className="mb-5 font-body text-[16px] font-bold text-black">
              {aboutHeading}
            </h3>
            {aboutDescription && (
              <p className="mb-4 max-w-[280px] font-body text-[14px] font-normal leading-[1.6] text-[#666]">
                {aboutDescription}
              </p>
            )}
            {aboutLinkLabel && (
              <Link
                to={aboutLinkHref}
                className={cn(
                  "font-body text-[14px] font-medium text-black no-underline",
                  "border-b-[1.5px] border-black pb-0.5",
                  "hover:border-[#888] hover:text-[#666] transition-all duration-fast"
                )}
              >
                {aboutLinkLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={cn(
            "border-t border-[#E0E0E0] pt-6",
            "flex flex-wrap items-center justify-between gap-4",
            "max-redesign-sm:flex-col max-redesign-sm:items-start max-redesign-sm:gap-6"
          )}
        >
          {/* Left — Region */}
          <div className="flex items-center gap-2 cursor-pointer">
            {regionFlag && <span className="w-5 h-3.5">{regionFlag}</span>}
            <span className="font-body text-[13px] font-normal text-black">
              {regionLabel}
            </span>
          </div>

          {/* Center — Copyright + Legal */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-body text-[12px] text-[#888]">
              {copyrightText}
            </span>
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-[12px] text-[#888] no-underline hover:text-black transition-colors duration-fast"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Social + Payment */}
          <div className="flex items-center gap-4">
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#888] hover:text-black transition-colors duration-fast"
                    aria-label={social.label}
                  >
                    <span className="w-5 h-5 block">{social.icon}</span>
                  </a>
                ))}
              </div>
            )}

            {paymentIcons.length > 0 && (
              <div className="flex items-center gap-2 ml-6">
                {paymentIcons.map((icon, i) => (
                  <span key={i} className="h-6 w-auto grayscale-[30%]">
                    {icon}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}
