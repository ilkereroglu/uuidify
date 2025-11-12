import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'UUIDify Docs',
  tagline: 'Serverless UUID/ULID generation at global scale',
  favicon: 'img/logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.uuidify.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ilkereroglu',
  projectName: 'uuidify',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ilkereroglu/uuidify/tree/main/docs',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ilkereroglu/uuidify/tree/main/docs',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.svg',
    colorMode: {
      respectPrefersColorScheme: true,
      defaultMode: 'dark',
      disableSwitch: false,
    },
    navbar: {
      title: 'UUIDify',
      logo: {
        alt: 'UUIDify logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://api.uuidify.io',
          label: 'API',
          position: 'right',
        },
        {
          href: 'https://dashboard.uuidify.io',
          label: 'Dashboard',
          position: 'right',
        },
        {
          href: 'https://status.uuidify.io',
          label: 'Status',
          position: 'right',
        },
        {
          href: 'https://github.com/ilkereroglu/uuidify',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'UUIDify',
          items: [
            {
              label: 'Overview',
              to: '/docs/overview',
            },
            {
              label: 'Testing & Deploy',
              to: '/docs/testing-and-deploy',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'API Gateway',
              href: 'https://api.uuidify.io',
            },
            {
              label: 'Status',
              href: 'https://status.uuidify.io',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/ilkereroglu/uuidify/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/ilkereroglu/uuidify/issues',
            },
          ],
        },
      ],
      copyright: `MIT Licensed · ${new Date().getFullYear()} UUIDify`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
