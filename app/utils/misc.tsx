export function getDomainUrl(request: Request) {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export function getBrowserDomainUrl() {
  const host = window.location.host;
  const protocol = host.includes("localhost") ? "http" : "https"
  return `${protocol}://${host}`;
}