import PageLink from '@/components/ui/PageLink';

export default function Header() {
  return (
    <header>
      <h2 className='p-gutter lg:fixed lg:left-0 lg:top-0'>
        <PageLink href='/'>
          <span className='h3'>Dr. Hazbi Avdiji</span>
          <span className='block text-base'>Diversity | Post-growth | Design</span>
        </PageLink>
      </h2>
    </header>
  );
}
