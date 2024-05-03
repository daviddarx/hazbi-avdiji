import Icon from '@/components/ui/Icon';
import classNames from 'classnames';

export default function CloseButton(props: { className?: string; onClick?: () => void }) {
  return (
    <button
      className={classNames(
        'rounded-full border border-black/20 p-6 transition-all duration-300 ease-out-quart hashover:hover:-rotate-180 hashover:hover:bg-theme-prev',
        props.className,
      )}
      onClick={props.onClick}
    >
      <Icon name='close' />
    </button>
  );
}
