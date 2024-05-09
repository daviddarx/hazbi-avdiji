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
        'border-semi-transparent rounded-full p-6 transition-all duration-300 ease-out-quart hashover:hover:-rotate-180 hashover:hover:bg-theme-prev',
        className,
      )}
      onClick={onClick}
      aria-label={label}
    >
      <Icon name='close' />
    </button>
  );
}
