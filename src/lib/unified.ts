import { extractFrontmatter } from '@/lib/unified-plugins/extract-frontmatter';
import { extractTitle } from '@/lib/unified-plugins/extract-title';
import { extractToc } from '@/lib/unified-plugins/extract-toc';
import { h } from 'hastscript';
import { cache } from 'react';
import * as prod from 'react/jsx-runtime';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeReact from 'rehype-react';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkFrontmatter)
  .use(extractToc)
  .use(extractFrontmatter)
  .use(extractTitle)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    properties: {
      class: 'transition-opacity opacity-30 hover:opacity-100 inline-flex items-center justify-center align-middle mr-1',
    },
    content: h('svg', { style: 'width: 1em; height: 1em; display: inline-block' }, [
      h('use', { href: '#lucide-link' }),
    ]),
  })
  .use(rehypeExternalLinks)
  .use(rehypeReact, prod as any)
  .freeze();

export const load = cache(async (slot: string[]) => {
  const { default: md } = await import(`@/blogs/${slot.join('/')}.md`);
  const data = await processor.process(md);
  return {
    content: data.result,
    ...data.data,
  };
});
