import { IconDefs } from '@/components/icon-defs';
import { load } from '@/lib/unified';
import { glob } from 'glob';

export default async function Page ({ params }: { params: { slot: string[] } }) {
  const article = await load(params.slot);

  return (
    <>
      <IconDefs />
      <div className="flex gap-4 mx-auto py-8 px-4 justify-center">
        <article className="prose prose-neutral prose-sm flex-1 !max-w-screen-md">
          {article.content}
        </article>
        <div className="flex-shrink-0 w-48 hidden md:block">
          <div className="sticky top-0">
            {article.toc}
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateMetadata ({ params }: { params: { slot: string[] } }) {
  const article = await load(params.slot);

  return {
    title: article.title,
  };
}

export async function generateStaticParams () {
  const names = await glob.glob('**/*.md', { cwd: 'src/blogs' });
  return names.map((name) => ({
    slot: name.replace(/\.md$/, '').split('/'),
  }));
}

export const dynamicParams = false;
