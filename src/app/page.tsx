import { generateStaticParams } from '@/app/blogs/[[...slot]]/page';
import { load } from '@/lib/unified';
import Link from 'next/link';

export default async function Home () {
  const all = await generateStaticParams();

  const mds = await Promise.all(all.map(async item => ({
    url: '/blogs/' + item.slot.join('/'),
    title: (await load(item.slot)).title,
  })));
  return (
    <main>
      <article className='prose prose-neutral prose-sm mx-auto'>
        <h1>All blogs</h1>
        <ul className="space-y-4">
          {mds.map(md => (
            <li key={md.url}>
              <p>
                {md.url}
                &nbsp;
                <Link href={md.url}>
                  {md.title || md.url}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
