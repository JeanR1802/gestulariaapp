declare module '@heroicons/react/24/outline' {
  import * as React from 'react';
  type IconProps = React.ComponentProps<'svg'> & { title?: string };
  const Icon: React.FC<IconProps>;
  export const SunIcon: typeof Icon;
  export const MoonIcon: typeof Icon;
  export const UserCircleIcon: typeof Icon;
  export const XMarkIcon: typeof Icon;
  export const PlusIcon: typeof Icon;
  export const CheckIcon: typeof Icon;
  export default Icon;
}

declare module '@heroicons/react/20/solid' {
  import * as React from 'react';
  type IconProps = React.ComponentProps<'svg'> & { title?: string };
  const Icon: React.FC<IconProps>;
  export default Icon;
}
