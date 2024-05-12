import Icon from '@/components/ui/Icon';
import classNames from 'classnames';

export default function CloseButton({
  label = 'Fermer',
  className = undefined,
  onClick = undefined,
}: {
  label?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={classNames(
        'border-light hashover:hover:bg-themed-prev rounded-full p-6 transition-all duration-300 ease-out-quart hashover:hover:-rotate-180',
        className,
      )}
      onClick={onClick}
      aria-label={label}
    >
      <Icon name='close' />
    </button>
  );
}
