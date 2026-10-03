import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BrandTitle } from '@/components/brand-title';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <BrandTitle />,
      url: '/docs',
      transparentMode: 'none',
    },
    links: [
      { text: 'GitHub', url: 'https://github.com/DragonQLF/orbit', external: true },
      { text: 'Changelog', url: '/docs/changelog' },
      { type: 'button', text: 'Download', url: 'https://github.com/DragonQLF/orbit/releases/latest', external: true },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
