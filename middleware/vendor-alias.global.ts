/**
 * Old vendor links land on the Declutter site and 404.
 *
 * Vendors live on the Erranders marketplace at `www.erranders.org/vendors/<slug>`; on
 * Declutter the same business is at `/businesses/<slug>`. Anyone following an older
 * shared link, a QR code or a WhatsApp message that used the vendor path gets "Store Not
 * Found" — which reads as though the business has disappeared, when in fact they are on
 * a page we can simply forward them from.
 */
export default defineNuxtRouteMiddleware((to) => {
  // `/vendors` alone: send them to the directory rather than a dead page.
  if (to.path === '/vendors' || to.path === '/vendors/') {
    return navigateTo('/businesses', { redirectCode: 301 });
  }

  const match = to.path.match(/^\/vendors\/([^/]+)\/?$/);
  if (match) {
    const slug = decodeURIComponent(match[1]);
    // Reserved names are not businesses and must not be forwarded into one.
    if (!['decluttered', 'declutter', 'barter', 'marketplace'].includes(slug.toLowerCase())) {
      return navigateTo(`/businesses/${slug}`, { redirectCode: 301 });
    }
  }
});
