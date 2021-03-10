/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Structured-React-Hook',
  tagline: '面向企业级的次世代结构化 React 应用研发框架',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/structured-react-hook/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'servyou', // Usually your GitHub org/user name.
  projectName: 'structured-react-hook', // Usually your repo name.
  themes:['@docusaurus/theme-live-codeblock'],
  themeConfig: {
    navbar: {
      title: 'Structured-React-Hook',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        // {
        //   to: 'blog',
        //   label: 'Blog',
        //   position: 'left',
        // },
        {
          href: 'https://github.com/kinop112365362/structured-react-hook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: '上手',
              to: 'docs/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: '掘金',
              href: 'https://juejin.im',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/kinop112365362/structured-react-hook',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} structured-react-hook, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
