export const COPY = {
  ui: {
    starsAriaLabel: (rating: number) => `${rating} out of 5 stars`,
  },
  site: {
    name: 'Epicure',
    titleTemplate: '%s | Epicure',
    description:
      'Discover the finest restaurant experiences, curated by world-class chefs.',
  },
  header: {
    logoText: 'EPICURE',
    logoAlt: 'Epicure',
    logoAriaLabel: 'Epicure home',
    searchAriaLabel: 'Search',
    profileAriaLabel: 'Profile',
    cartAriaLabel: 'Cart',
  },
  mobileMenu: {
    openAriaLabel: 'Open navigation menu',
    dialogAriaLabel: 'Navigation menu',
    closeAriaLabel: 'Close navigation menu',
    contactUs: 'Contact Us',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
  },
  popularRestaurants: {
    sectionTitle: 'POPULAR RESTAURANT IN EPICURE:',
    ctaText: 'All restaurants',
    ctaArrowAlt: 'View all restaurants',
  },
  signatureDishes: {
    sectionTitle: 'SIGNATURE DISH OF:',
    ctaText: 'All restaurants',
    ctaArrowAlt: 'View all restaurants',
    spicyAlt: 'Spicy',
    vegetarianAlt: 'Vegetarian',
    veganAlt: 'Vegan',
    shekelSign: '₪',
  },
  foodIcons: {
    sectionTitle: 'THE MEANING OF OUR ICONS:',
    spicyLabel: 'Spicy',
    spicyAlt: 'Spicy dish icon',
    vegetarianLabel: 'Vegetarian',
    vegetarianAlt: 'Vegetarian dish icon',
    veganLabel: 'Vegan',
    veganAlt: 'Vegan dish icon',
  },
  chefOfTheWeek: {
    sectionTitle: 'CHEF OF THE WEEK:',
    restaurantsTitle: (firstName: string) => `${firstName}'s restaurants`,
  },
  aboutUs: {
    logoAlt: 'Epicure',
    googleAlt: 'Get it on Google Play',
    appleAlt: 'Download on the App Store',
    title: 'ABOUT US',
    paragraph1:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a lacus vel justo fermentum bibendum non eu ipsum. Cras porta malesuada eros, eget blandit turpis suscipit at. Vestibulum sed massa in magna sodales porta. Vivamus elit urna, dignissim a vestibulum.',
    paragraph2:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a lacus vel justo fermentum bibendum non eu ipsum. Cras porta malesuada eros.',
  },
} as const;
