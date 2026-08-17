import Business from "../components/Business";
import Technology from "../components/Technology";
import Politics from "../components/Politics";
import SubscribeBanner from "../components/SubscribeBanner";
import TrendingNews from "../components/TrendingNews";

export default function Home() {
  return (
    <main className="w-full bg-white">
      <Business />
      <Technology />
      <Politics />
      <SubscribeBanner />
      <TrendingNews />
    </main>
  );
}