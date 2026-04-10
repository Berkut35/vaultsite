export type Release = {
  tag_name: string;      // "v1.2.0"
  name: string;          // "Vault 1.2.0"
  published_at: string;  // ISO date string
  body: string;          // markdown release notes
};

export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/Berkut35/vault-releases/releases',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: false }, // build-time SSG only
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
