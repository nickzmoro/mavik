import { Header } from "@/components/common/Header";
import { Hero } from "@/components/sections/Hero";
import { Studio } from "@/components/sections/Studio";
import { Rules } from "@/components/sections/Rules";
import { Connected } from "@/components/sections/Connected";
import { Journey } from "@/components/sections/Journey";
import { Results } from "@/components/sections/Results";
import { PricingFAQ } from "@/components/sections/PricingFAQ";
import { CtaFooter } from "@/components/common/CtaFooter";
import { Problem } from "@/components/sections/Problem";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#12092B] text-[#F4F0FF] flex flex-col justify-between overflow-x-clip">
      {/* Header Sticky com Adaptação Dinâmica de Contraste */}
      <Header />

      <main className="flex-1 flex flex-col">
        <Hero />
        <Problem />
        <Studio />
        <Rules />
        <Connected />
        <Journey />
        <Results />
        <PricingFAQ />
      </main>

      <CtaFooter />
    </div>
  );
}
