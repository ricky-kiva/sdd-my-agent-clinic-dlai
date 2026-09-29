/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  allowedDevOrigins: ['192.168.11.108', 'localhost', '127.0.0.1'],
};

module.exports = nextConfig;
