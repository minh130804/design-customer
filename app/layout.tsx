import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import './globals.css';

/**
 * Bẫy tiếng Việt: Google Fonts tách tiếng Việt thành unicode-range riêng.
 * Thiếu subset 'vietnamese' thì ế ộ ữ rơi xuống font dự phòng — lệch nét,
 * lệch chiều cao, một dòng lẫn hai font. Gần như vô hình khi review bằng
 * nội dung tiếng Anh, nên phải khai từ đầu.
 *
 * next/font tự host lúc build → không có request nào tới Google lúc chạy.
 */
const sans = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans-loaded',
  display: 'swap',
});

const serif = Noto_Serif({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  variable: '--font-serif-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  // Ảnh Open Graph khai bằng đường dẫn tương đối ở từng trang; thiếu
  // `metadataBase` thì Next ghép chúng với `http://localhost:3000` và mọi lượt
  // chia sẻ lên mạng xã hội mất ảnh. Ở production đọc từ biến môi trường.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://podmarket.example'),
  title: 'POD Market',
  description: 'Independent design marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body
        style={
          {
            '--font-sans': `var(--font-sans-loaded), 'Segoe UI', system-ui, sans-serif`,
            '--font-serif': `var(--font-serif-loaded), Charter, Georgia, serif`,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
