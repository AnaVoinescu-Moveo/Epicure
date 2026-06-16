import { Hero } from '../components/home/Hero';
import { PopularRestaurantsSection } from '../components/home/PopularRestaurantsSection';
import { SignatureDishesSection } from '../components/home/SignatureDishesSection';
import { FoodIconsSection } from '../components/home/FoodIconsSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularRestaurantsSection />
      <SignatureDishesSection />
      <FoodIconsSection />
    </>
  );
}
