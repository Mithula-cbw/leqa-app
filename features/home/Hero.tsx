// Leqa © 2025 Mithula Chanthuka

import { HeroCardOne, HeroCardTwo, HeroScroll } from "@/components/home";

const HomeHero = () => {
  return (
    <HeroScroll>
      <HeroCardOne leftAmount={12} />
      <HeroCardTwo leftAmount={0}/>
    </HeroScroll>
  );
};

export default HomeHero;
