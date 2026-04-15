/**
 * Affiliate link service. For MVP, links are pre-built in the products table.
 * In production, this would sign links with affiliate network tokens.
 */

export function buildAffiliateLink(affiliateUrl: string, userId: string): string {
  // Append user tracking parameter for analytics attribution
  const url = new URL(affiliateUrl);
  url.searchParams.set('uid', userId);
  url.searchParams.set('ts', Date.now().toString());
  return url.toString();
}
