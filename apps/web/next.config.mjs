import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Dev previews often hit the app via 127.0.0.1 (or a tunnel host) while
  // `next dev` binds as localhost. Without this, Turbopack blocks cross-origin
  // chunk/HMR fetches and client charts never hydrate.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default withMDX(config);
