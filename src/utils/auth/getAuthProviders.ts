import type { Provider } from "next-auth/providers";
import type { PublicProvider } from "next-auth/core/routes/providers";

/**
 * Get Server Providers
 *
 * @description Alternative to `getProviders` client method from NextAuth.js designed
 * specifically for use on the server / at build time (Primarily SSG).
 *
 * @param {Array} providers - Array of auth providers from your NextAuth.js config
 */
export function getServerProviders(
  providers: Array<Provider>
): Record<string, PublicProvider> {
  // Note: Deployment provider failover URL to add preview environment support
  const baseUrl =
    process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`;

  return Object.fromEntries(
    providers.map(({ id, name, type }): [string, PublicProvider] => [
      id,
      {
        callbackUrl: new URL(`/api/callback/${id}`, baseUrl).href,
        id,
        name,
        signinUrl: new URL(`/api/signin/${id}`, baseUrl).href,
        type,
      },
    ])
  );
}
