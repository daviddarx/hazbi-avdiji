import Logo from '@/components/layout/Logo';
import PageLink from '@/components/ui/PageLink';

export default function Header() {
  return (
    <header>
      <h2 className='pl-gutter pt-gutter'>
        <PageLink href='/'>
          <Logo className={'w-[120px] lg:w-[148px]'} />
          <span className='sr-only'>
            Dr. Hazbi Avdiji - Votre généraliste en diversité et inclusion
          </span>
        </PageLink>
      </h2>
    </header>
  );
}
