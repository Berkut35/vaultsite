export type Release = {
  tag_name: string;      // "v1.2.0"
  name: string;          // "Vault 1.2.0"
  published_at: string;  // ISO date string
  body: string;          // markdown release notes
};

function isRelease(obj: unknown): obj is Release {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.tag_name === 'string' &&
    typeof o.name === 'string' &&
    typeof o.published_at === 'string' &&
    typeof o.body === 'string'
  );
}

export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/Berkut35/vault-releases/releases',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          // Optional: raises rate limit from 60 to 5000 req/hr
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: false }, // build-time SSG only
      }
    );
    if (!res.ok) {
      console.error(`GitHub releases fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const data: unknown = await res.json();
    return Array.isArray(data) ? data.filter(isRelease) : [];
  } catch (error) {
    console.error('GitHub releases fetch error:', error);
    return [];
  }
}
