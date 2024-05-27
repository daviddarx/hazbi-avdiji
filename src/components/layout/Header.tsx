import Logo from '@/components/layout/Logo';
import PageLink from '@/components/ui/PageLink';

export default function Header() {
  return (
    <header className='grid-layout pointer-events-none w-full pt-gutter'>
      <h2 className='grid-item-full'>
        <PageLink href='/' className='pointer-events-auto relative z-70 inline-block'>
          <Logo className={'w-[80px] lg:w-[100px]'} />
          <span className='sr-only'>Dr. Hazbi Avdiji</span>
          <span className='font-text mt-12 block max-w-[9em] text-xs leading-tight xs:mt-20 xs:text-sm'>
            Votre généraliste en diversité et inclusion
          </span>
        </PageLink>
      </h2>
    </header>
  );
}
