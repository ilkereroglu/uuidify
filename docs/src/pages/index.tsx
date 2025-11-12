import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/overview">
            Explore the API →
          </Link>
          <Link className="button button--outline button--lg" to="https://api.uuidify.io">
            Call the endpoint
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} · UUID & ULID API`}
      description="Documentation for UUIDify — globally distributed UUID/ULID generation API.">
      <HomepageHeader />
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6">
            <h2>Production-ready identifiers</h2>
            <p>
              UUIDify runs on Cloudflare Workers to keep latency low across 300+ cities. Use our
              query parameters to switch algorithms, output formats, and batch sizes on the fly.
            </p>
          </div>
          <div className="col col--6">
            <h2>Tooling that fits your workflow</h2>
            <p>
              Deploy new versions via GitHub Actions, monitor health with the dashboard, and pull
              structured metrics directly from the `/metrics` endpoint.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
