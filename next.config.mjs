/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false, // hides the round Next.js badge that `npm run dev` shows at the bottom left
};
export default nextConfig;
