import './global.css';
import { Header } from '../components/layout/Header';

export const metadata = {
  title: {
    default: 'Epicure',
    template: '%s | Epicure',
  },
  description:
    'Discover the finest restaurant experiences, curated by world-class chefs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
