// Leqa © 2025 Mithula Chanthuka

import { HeroCardOne, HeroCardTwo, HeroScroll } from "@/components/home";
import { useTransactions } from "@/contexts/TransactionContext";

const HomeHero = () => {
  const { transactions } = useTransactions();
  return (
    <HeroScroll>
      <HeroCardOne />
      <HeroCardTwo transactions={transactions} />
    </HeroScroll>
  );
};

export default HomeHero;
