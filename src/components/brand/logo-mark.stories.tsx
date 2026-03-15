import type { Meta } from '@storybook/react-vite';

import { LogoMark } from './logo-mark';

export default {
  title: 'Brand/LogoMark',
} satisfies Meta<typeof LogoMark>;

export const Default = () => {
  return <LogoMark className="w-32" />;
};

export const Small = () => {
  return <LogoMark className="w-16" />;
};

export const Large = () => {
  return <LogoMark className="w-64" />;
};
