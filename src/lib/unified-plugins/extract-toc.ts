import { HeaderAnchor, HeaderAnchors } from '@/components/header-anchors';
import type { Root } from 'mdast';
import { toc } from 'mdast-util-toc';
import type { ReactElement } from 'react';
import * as prod from 'react/jsx-runtime';
import rehypeReact from 'rehype-react';
import remarkRehype from 'remark-rehype';
import { type Plugin, unified } from 'unified';

declare module 'vfile' {
  interface DataMap {
    toc: ReactElement;
  }
}

const tocProcessor = unified()
  .use(remarkRehype)
  .use(rehypeReact, {
    ...prod as any,
    components: {
      ul: HeaderAnchors,
      li: 'div',
      p: 'div',
      a: HeaderAnchor,
    },
  })
  .freeze();

export const extractToc: Plugin<[], Root, Root> = () => {
  return async (root, file) => {
    const { map } = toc(root, {
    });
    if (map) {
      const root = await tocProcessor.run({
        type: 'root',
        children: [map],
      });

      file.data.toc = tocProcessor.stringify(root);
    }
  };
};