/**** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{ source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' },
			{ source: '/ws', destination: 'http://localhost:4000/ws' }
		];
	},
};
module.exports = nextConfig;