import { toString } from 'hast-util-to-string';
import type { Heading, Root } from 'mdast';
import remarkRehype from 'remark-rehype';
import { type Plugin } from 'unified';
import { visit } from 'unist-util-visit';

declare module 'vfile' {
  export interface DataMap {
    title: string;
  }
}

export const extractTitle: Plugin<[], Root, Root> = () => {
  return (root, file) => {
    file.data.title = file.data.frontmatter?.title;
    if (file.data.title) {
      return root;
    }

    let done = false;
    for (let i = 1; i <= 6; i++) {
      visit(root, (node): node is Heading => (node.type === 'heading' && (node as Heading).depth === i), node => {
        const hast = remarkRehype({})({
          type: 'root',
          children: [
            node,
          ],
        }, file);
        file.data.title = toString(hast);
        done = true;
        return false;
      });
      if (done) {
        break;
      }
    }

    if (!file.data.title) {
      file.data.title = 'Untitled';
    }

    return root;
  };
};