import AgentSection from "./agent-section/agentSection";
import BannerSections from "./banner-section/bannerSections";
import BuySection from "./buy-section/buySection";
import CitiesSection from "./cities-section/citiesSection";
import FaqSection from "./faq-section/faqSection";
import FeaturesSection from "./features-section/featuresSection";
import FeaturesTwoSection from "./features2-section/featuresTwoSection";
import PlanSection from "./plan-section/planSection";
import PropertySection from "./property-section/propertySection";
import StatSection from "./stat-section/statSection";
import SupportSection from "./support-section/supportSection";
import TestimonialsSection from "./testimonials-section/testimonialsSection";
import WorkSection from "./work-section/workSection";

const Index = () => {
  return (
    <div>
      <BannerSections />
      <FeaturesSection />
      <WorkSection />
      <PropertySection />
      <CitiesSection />
      <FeaturesTwoSection />
      <StatSection />
      <BuySection />
      <TestimonialsSection />
      <PlanSection />
      <FaqSection />
      <AgentSection />
      <SupportSection />
    </div>
  );
};

export default Index;
