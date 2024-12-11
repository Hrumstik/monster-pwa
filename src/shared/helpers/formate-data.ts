export function extractDomain(url: string): string | null {
  try {
    if (!/^https?:\/\//.test(url)) {
      url = "https://" + url;
    }

    const hostname = new URL(url).hostname;

    const domainParts = hostname.split(".");
    if (domainParts.length > 2) {
      return domainParts.slice(-2).join(".");
    }

    return hostname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}
