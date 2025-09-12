import Navbar from "@/components/custom/Navigation";
import HeroSection from "@/components/custom/HeroSection";
import BentoSection from "@/components/custom/BentoSection";
import Image from "next/image";
import ProjectsSection from "@/components/custom/ProjectsSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <BentoSection />
      <ProjectsSection />
    </main>
  );
}
