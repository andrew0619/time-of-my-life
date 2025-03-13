export const metadata = {
  title: '時光模擬器 | Time Simulator',
  description: '以視覺方式呈現人生時間的流逝 | Visualize the passage of time in your life',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
} 