import { defineNuxtRouteMiddleware, navigateTo, useRequestHeaders } from '#app';

/**
 * Business subdomains: `<slug>.<host>` serves that business's public page, the way
 * vendors get their own address on Erranders.
 *
 * This is deliberately conservative. Getting host detection wrong would take the
 * whole site down (for example treating `www` as a business slug and redirecting
 * every visitor to `/businesses/www`), so:
 *
 *  - only hosts with MORE labels than the configured apex are considered,
 *  - a fixed set of infrastructure labels (www, api, admin, app…) is always ignored,
 *  - raw IPs, localhost and the common preview domains never match,
 *  - and if anything at all is ambiguous we simply do nothing.
 *
 * `?business=<slug>` is supported in `pages/businesses/[slug].vue` as a fallback for
 * localhost and preview URLs where wildcard DNS does not exist.
 */

/** Hosts that are infrastructure, never a tenant. */
const RESERVED = new Set([
  'www', 'api', 'admin', 'app', 'dashboard', 'staging', 'preview', 'dev',
  'mail', 'smtp', 'cdn', 'assets', 'static',
]);

/** Domains where the first label is part of the provider, not a tenant. */
const PREVIEW_SUFFIXES = ['vercel.app', 'netlify.app', 'pages.dev', 'onrender.com', 'ngrok.io', 'localhost'];

const isIpAddress = (host: string) => /^\d{1,3}(\.\d{1,3}){3}$/.test(host);

/** Returns the tenant slug for this host, or null when the host is not a tenant host. */
export function businessSlugFromHost(host: string, apex: string): string | null {
  const clean = (host || '').split(':')[0].toLowerCase().trim();
  if (!clean || isIpAddress(clean)) return null;

  if (PREVIEW_SUFFIXES.some((suffix) => clean.endsWith(suffix))) return null;

  const cleanApex = (apex || '').toLowerCase().trim();
  if (!cleanApex || !clean.endsWith(`.${cleanApex}`)) return null;

  const prefix = clean.slice(0, -(cleanApex.length + 1));
  if (!prefix) return null;

  // Only a single label counts; a deeper host is not a tenant address.
  if (prefix.includes('.')) return null;
  if (RESERVED.has(prefix)) return null;
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(prefix)) return null;

  return prefix;
}

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig();

  // A tenant host always wins over the requested path: the subdomain IS the address.
  const apex = String((config.public as any).businessApexDomain || '');
  if (!apex) return;

  const headers = import.meta.server ? useRequestHeaders(['host']) : {};
  const host = import.meta.server
    ? String((headers as Record<string, string>).host || '')
    : (typeof window !== 'undefined' ? window.location.hostname : '');

  const slug = businessSlugFromHost(host, apex);
  if (!slug) return;

  const alreadyThere = to.path === `/businesses/${slug}`;
  if (alreadyThere) return;

  return navigateTo(`/businesses/${slug}`, { redirectCode: 302 });
});
