const RELEASE_REPO = 'Berkut35/vault-releases';

export type OS = 'windows' | 'mac' | 'linux' | 'unknown';

export function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua)) return 'mac';
  if (/Linux/i.test(ua)) return 'linux';
  return 'unknown';
}

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: ReleaseAsset[];
}

function pickAsset(assets: ReleaseAsset[], os: OS): ReleaseAsset | null {
  if (os === 'windows') {
    return (
      assets.find(a => a.name.endsWith('.exe')) ??
      assets.find(a => a.name.endsWith('.msi')) ??
      null
    );
  }
  if (os === 'mac') {
    return assets.find(a => a.name.endsWith('.dmg')) ?? null;
  }
  if (os === 'linux') {
    return (
      assets.find(a => a.name.endsWith('.AppImage')) ??
      assets.find(a => a.name.endsWith('.deb')) ??
      null
    );
  }
  return null;
}

export interface DownloadTarget {
  url: string;
  filename: string;
  os: OS;
  version: string;
}

/**
 * Fetches the latest release from vault-releases, picks the right asset for
 * the current OS. Falls back to NEXT_PUBLIC_DOWNLOAD_URL env var if the API
 * call fails or returns no matching asset.
 */
export async function resolveDownloadUrl(): Promise<DownloadTarget | null> {
  const os = detectOS();

  try {
    const res = await fetch(
      `https://api.github.com/repos/${RELEASE_REPO}/releases/latest`,
      { headers: { Accept: 'application/vnd.github+json' } },
    );
    if (res.ok) {
      const release: GitHubRelease = await res.json();
      const asset = pickAsset(release.assets, os);
      if (asset) {
        return {
          url:      asset.browser_download_url,
          filename: asset.name,
          os,
          version:  release.tag_name,
        };
      }
    }
  } catch {
    // fall through to env var fallback
  }

  // Env var fallback (set in .env.local / Vercel env)
  const fallbackUrl = process.env.NEXT_PUBLIC_DOWNLOAD_URL;
  if (fallbackUrl && fallbackUrl !== '#') {
    const filename = fallbackUrl.split('/').pop() ?? 'Vault-setup.exe';
    return { url: fallbackUrl, filename, os, version: 'latest' };
  }

  return null;
}

/** Programmatically starts a file download in the browser. */
export function triggerBrowserDownload(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
