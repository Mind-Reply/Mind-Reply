export const metadata = {
  title: "MindReply",
  description: "AI-powered clarity engine"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
