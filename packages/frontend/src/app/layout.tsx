import './global.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/home/Footer';
import { COPY } from '../constants/copy';

export const metadata = {
  title: {
    default: COPY.site.name,
    template: COPY.site.titleTemplate,
  },
  description: COPY.site.description,
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
        <Footer />
      </body>
    </html>
  );
}
