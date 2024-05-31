import Logo from '@/components/layout/Logo';
import PageLink from '@/components/ui/PageLink';
import t from '@/content/translations';

export default function Header() {
  return (
    <header className='grid-layout pointer-events-none w-full pt-gutter'>
      <h2 className='grid-item-full'>
        <PageLink href='/' className='pointer-events-auto relative z-70 inline-block'>
          <Logo className={'w-[80px] lg:w-[100px]'} />
          <span className='sr-only'>{t.logoTitle}</span>
          <span className='font-text mt-12 block max-w-[9em] text-xs leading-tight xs:mt-20 xs:text-sm'>
            {t.logoSubline}
          </span>
        </PageLink>
      </h2>
    </header>
  );
}
