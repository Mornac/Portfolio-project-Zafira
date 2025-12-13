import type {NextConfig} from 'next';

const uploadPatterns = [
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '3001',
    pathname: '/uploads/**',
  },
];

if (process.env.NEXT_PUBLIC_API_BASE) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_API_BASE);
    const basePath = url.pathname.replace(/\/$/, '');
    const prefix = basePath && basePath !== '/' ? basePath : '';
    uploadPatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: `${prefix}/uploads/**`,
    });
  } catch {
    // ignore invalid URL, default localhost pattern remains
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: uploadPatterns,
    unoptimized: true,
  },
};

export default nextConfig;
