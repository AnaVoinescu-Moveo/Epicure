import { Hero } from '../components/home/Hero';
import { PopularRestaurantsSection } from '../components/home/PopularRestaurantsSection';
import { SignatureDishesSection } from '../components/home/SignatureDishesSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularRestaurantsSection />
      <SignatureDishesSection />
    </>
  );
}
