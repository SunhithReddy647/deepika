declare global {
  interface Window {
    /**
     * Navigate to the auth page with a custom redirect URL
     * @param redirectUrl - URL to redirect to after successful authentication
     */
    navigateToAuth: (redirectUrl: string) => void;
  }
}

export {};

// Allow TypeScript to recognize CDN ESM imports used in runtime-only code.
declare module "https://esm.sh/three" {
  const three: any;
  export default three;
}