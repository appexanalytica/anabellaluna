import AgentSection from "./agent-section/agentSection";
import BannerSections from "./banner-section/bannerSections";
import BlogSection from "./blog-section/blogSection";
import BuySection from "./buy-section/buySection";
import CitiesSection from "./cities-section/citiesSection";
import FaqSection from "./faq-section/faqSection";
import FeaturesSection from "./features-section/featuresSection";
import FeaturesTwoSection from "./features2-section/featuresTwoSection";
import PartnersSection from "./partners-section/partnersSection";
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
      <WorkSection />
      <PropertySection />
      <FeaturesSection />
      <CitiesSection />
      <FeaturesTwoSection />
      <StatSection />
      <BuySection />
      <PartnersSection />
      <TestimonialsSection />
      <PlanSection />
      <FaqSection />
      <AgentSection />
      <BlogSection />
      <SupportSection />
    </div>
  );
};

export default Index;
