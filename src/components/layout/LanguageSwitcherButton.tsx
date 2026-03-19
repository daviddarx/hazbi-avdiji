import { MenuItem } from '@headlessui/react';
import classNames from 'classnames';

export default function LanguageSwitcherButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <MenuItem>
      <button
        onClick={onClick}
        className={classNames('navigation-link', {
          'bg-themed-next': active,
        })}
      >
        <span className='flex-grow'>{label}</span>
      </button>
    </MenuItem>
  );
}
