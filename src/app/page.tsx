import Hero from "@/components/landing/Hero";
import SiteGallery from "@/components/landing/SiteGallery";
import AiDemo from "@/components/landing/AiDemo";
import PlanComparison from "@/components/landing/PlanComparison";
import Testimonials from "@/components/landing/Testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <SiteGallery />
      <AiDemo />
      <PlanComparison />
      <Testimonials />
    </div>
  );
}
