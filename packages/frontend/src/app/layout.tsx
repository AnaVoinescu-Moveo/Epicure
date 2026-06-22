import './global.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { COPY } from '../constants/copy';
import { RestaurantsFilterProvider } from '../context/RestaurantsFilterContext';

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
        <RestaurantsFilterProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </RestaurantsFilterProvider>
      </body>
    </html>
  );
}
