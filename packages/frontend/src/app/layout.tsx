import './global.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeaderVisibility } from '../components/layout/HeaderVisibility';
import { COPY } from '../constants/copy';
import { RestaurantsFilterProvider } from '../context/RestaurantsFilterContext';
import { DishModalProvider } from '../context/DishModalContext';
import { DishDetailOverlay } from '../components/dishes/DishDetailOverlay';
import { CartProvider } from '../context/CartContext';
import { CartPanel } from '../components/cart/CartPanel';
import { AuthModalProvider } from '../context/AuthModalContext';
import { SignInModal } from '../components/auth/SignInModal';
import { SearchProvider } from '../context/SearchContext';
import { OrderConfirmationProvider } from '../context/OrderConfirmationContext';
import { OrderConfirmationModal } from '../components/checkout/OrderConfirmationModal';
import { FloatingDeliveryBubble } from '../components/checkout/FloatingDeliveryBubble';

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
              <AuthModalProvider>
                <SearchProvider>
                  <OrderConfirmationProvider>
                    <HeaderVisibility>
                      <Header />
                    </HeaderVisibility>
                    <main>{children}</main>
                    <Footer />
                    <DishDetailOverlay footer={<Footer />} />
                    <CartPanel />
                    <SignInModal />
                    <OrderConfirmationModal />
                    <FloatingDeliveryBubble />
                  </OrderConfirmationProvider>
                </SearchProvider>
              </AuthModalProvider>
            </DishModalProvider>
          </CartProvider>
        </RestaurantsFilterProvider>
      </body>
    </html>
  );
}
