import type { Root, Yaml } from 'mdast';
import { type Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { parse } from 'yaml';
import { z } from 'zod';

declare module 'vfile' {
  interface DataMap {
    frontmatter: ArticleFrontMatter;
  }
}

export type ArticleFrontMatter = z.infer<typeof schema>;

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().array().optional(),
});

export const extractFrontmatter: Plugin<[], Root, Root> = () => {
  return (root: Root, file) => {
    visit(root, (el): el is Yaml => (el.type === 'yaml'), node => {
      const object = parse(node.value);
      if (object) {
        file.data.frontmatter = schema.parse(object);
      }
      return false;
    });
  };
};
