import Hero from "@/components/landingpage/Hero";
import TestLoginData from "./components/test";
import Footer from "@/components/landingpage/Footer";
import CTA from "@/components/landingpage/CTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero/>
      <CTA/>
      <Footer/>


      {/* <TestLoginData /> */}

    </div>
  );
}
