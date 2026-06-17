import { Hero } from '../components/home/Hero';
import { PopularRestaurantsSection } from '../components/home/PopularRestaurantsSection';
import { SignatureDishesSection } from '../components/home/SignatureDishesSection';
import { FoodIconsSection } from '../components/home/FoodIconsSection';
import { ChefOfTheWeekSection } from '../components/home/ChefOfTheWeekSection';
import { AboutUsSection } from '../components/home/AboutUsSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularRestaurantsSection />
      <SignatureDishesSection />
      <FoodIconsSection />
      <ChefOfTheWeekSection />
      <AboutUsSection />
    </>
  );
}
