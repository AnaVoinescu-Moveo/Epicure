import './global.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { COPY } from '../constants/copy';
import { RestaurantsFilterProvider } from '../context/RestaurantsFilterContext';
import { DishModalProvider } from '../context/DishModalContext';
import { DishDetailOverlay } from '../components/dishes/DishDetailOverlay';
import { CartProvider } from '../context/CartContext';
import { CartPanel } from '../components/cart/CartPanel';

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
          <CartProvider>
            <DishModalProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <DishDetailOverlay footer={<Footer />} />
              <CartPanel />
            </DishModalProvider>
          </CartProvider>
        </RestaurantsFilterProvider>
      </body>
    </html>
  );
}
