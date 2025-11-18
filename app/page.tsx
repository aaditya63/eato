import Hero from "@/components/landingpage/Hero";
import CTA from "@/components/landingpage/CTA";
import PopularDish from "@/components/landingpage/PopularDish";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero/>
      <PopularDish/>
      <CTA/>
    </div>
  );
}
