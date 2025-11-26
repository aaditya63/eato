import Hero from "@/components/landingpage/Hero";
import CTA from "@/components/landingpage/CTA";
import PopularDish from "@/components/landingpage/PopularDish";
import CategorySection from "@/components/landingpage/FoodCategory";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero/>
      <CategorySection/>
      <PopularDish/>
      <CTA/>
    </div>
  );
}
