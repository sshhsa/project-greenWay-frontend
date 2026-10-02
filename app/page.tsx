import Hero from '@/components/Hero/Hero';
import Advantages from '@/components/Advantages/Advantages';
import PopularLocations from '@/components/PopularLocations/PopularLocations';
import LatestFeedbacks from '@/components/LatestFeedbacks/LatestFeedbacks';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Advantages />
      <PopularLocations />
      <LatestFeedbacks />
    </>
  );
}
