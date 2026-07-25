import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Dev previews may load via 127.0.0.1, the LAN bind address, or a sandboxed
  // iframe (`Origin: null`). Next blocks those Turbopack/HMR fetches by default,
  // which leaves client UI (charts, sidebar accordions) inert after SSR.
  allowedDevOrigins: ['127.0.0.1', 'localhost', '172.30.0.2', 'null'],
};

export default withMDX(config);
