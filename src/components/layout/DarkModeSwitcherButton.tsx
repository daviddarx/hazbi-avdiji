import type { darkModeType } from '@/components/layout/DarkModeSwitcher';
import Icon from '@/components/ui/Icon';
import { MenuItem } from '@headlessui/react';
import classNames from 'classnames';

export default function DarkModeSwitcherButton({
  value,
  label,
  onClick,
  active,
}: {
  value: darkModeType;
  label: string;
  onClick: (value: darkModeType) => void;
  active: boolean;
}) {
  return (
    <MenuItem>
      <button
        onClick={() => {
          onClick(value);
        }}
        className={classNames('navigation-link', {
          'bg-themed-next': active,
        })}
      >
        <span className='flex-grow'>{label}</span>
        <Icon name={value} />
      </button>
    </MenuItem>
  );
}
