// src/pages/HomePage.jsx
import { useState } from 'react';
import Hero from "../components/hero";
import FeaturedProducts from "../components/featured-products";
import About from "../components/about";
import Contact from "../components/contact";
import BrandStory from "../components/BrandStory";
import VisitorCounter from '../components/VisitorCounter';

export default function HomePage() {
  const [showBrandStory, setShowBrandStory] = useState(false);

  return (
    <main>
      <div className="absolute top-4 right-4 z-10">
        <VisitorCounter location="home" />
      </div>
      <Hero />
      <FeaturedProducts />
      <About onShowBrandStory={() => setShowBrandStory(true)} />
      {showBrandStory && (
        <BrandStory onClose={() => setShowBrandStory(false)} />
      )}
      <Contact />
    </main>
  );
}