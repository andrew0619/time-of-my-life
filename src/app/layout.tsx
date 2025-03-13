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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
} 