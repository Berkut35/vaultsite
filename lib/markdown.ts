import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MarkdownDocument {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

/**
 * Retrieves a parsed markdown document given its structural scope (e.g., 'legal', 'blog') 
 * and localization (e.g., 'en', 'tr').
 */
export function getMarkdownDocument(scope: string, lang: string, slug: string): MarkdownDocument | null {
  const fullPath = path.join(contentDirectory, scope, lang, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content,
  };
}

/**
 * Returns a list of all markdown slugs within a specific scope and language.
 */
export function getAllDocumentSlugs(scope: string, lang: string): string[] {
  const targetDir = path.join(contentDirectory, scope, lang);
  
  if (!fs.existsSync(targetDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(targetDir);
  return fileNames
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}
