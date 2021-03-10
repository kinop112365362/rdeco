import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

const features = [
  {
    title: '简单易用, 快速上手',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        API 设计简单, 基于对象的组件描述模式, 扁平易于理解, 打破固有组件开发的黑盒思路, 让开发者与调用者充分交流
      </>
    ),
  },
  {
    title: '次世代组件开发模式, 一次编写无限扩展',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        内置大量的有益的编程特性, 使用 SRH 开发的 React 组件具有惊人的可扩展性, 高度复用已有的代码, 同时保持较低的维护成本
      </>
    ),
  },
  {
    title: 'React 原生 API, 轻量稳定',
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        使用 React 原生 API 开发, 基于 useReducer 的状态驱动, 稳定可靠
      </>
    ),
  },
]

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/')}
            >
              上手
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  )
}
