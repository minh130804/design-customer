import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,

  images: {
    // Ảnh sản phẩm thật đi qua CDN → Object Storage, prefix public
    // (diagram.md: BR → CDN → OS · public: listing · thumb · mockup · preview)
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.podmarket.com', pathname: '/public/**' },
      // Ảnh demo. Chỉ dùng dạng `/seed/<khoá>/…` chứ không dùng URL ngẫu nhiên:
      // ảnh phải giữ nguyên qua mỗi lần dựng, nếu không trang tĩnh và ảnh sẽ
      // lệch nhau, và mỗi lần tải lại là một sản phẩm khác mặt.
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/seed/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ⚠️ File ở prefix PRIVATE (raw · template · print files) không bao giờ đi qua
  // next/image — Next sẽ proxy và cache lại trên đĩa server. Chúng chỉ được phát
  // qua /api/downloads/{token} sau khi backend kiểm quyền.

  // Route sai chính tả thành lỗi biên dịch chứ không phải lỗi 404 lúc chạy.
  // (Ở Next 15 khoá này đã ra khỏi `experimental`.)
  typedRoutes: true,

  experimental: {
    // lucide-react xuất ~1500 icon từ một barrel file. Không có dòng này thì
    // bundler kéo cả barrel vào rồi mới tree-shake — chậm build và dễ sót.
    optimizePackageImports: ['lucide-react'],

    // TypeScript 7 là bản viết lại bằng Go và KHÔNG còn compiler API kiểu cũ mà
    // `next build` vẫn gọi. Cờ này bảo Next chạy `tsc` qua CLI thay vì nhúng API.
    // Bỏ cờ đi thì build dừng ngay ở bước "Running TypeScript".
    useTypeScriptCli: true,
  },
};

export default config;
