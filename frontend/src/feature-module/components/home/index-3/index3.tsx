import AboutSection from "./about-section/aboutSection";
import BannerSection from "./banner-section/bannerSection";
import BlogSection from "./blog-section/blogSection";
import ContactSection from "./contact-section/contactSection";
import FeatureSection from "./feature-section/featureSection";
import FeatureTwoSection from "./feature-two-section/featureTwoSection";
import HowWorkSection from "./how-work-section/howWorkSection";
import PartnersLogos from "./partners-logos/partnersLogos";
import PostSection from "./post-section/postSection";
import PropertySection from "./property-section/propertySection";
import RentProperySection from "./rent-propery-section/rentProperySection";
import SearchModal from "./search-modal/searchModal";
import SuccessStoriesSection from "./success-stories-section/successStoriesSection";
import WorkSection from "./work-section/workSection";

const Index3 = () => {
  return (
    <div>
      <BannerSection />
      <WorkSection />
      <PropertySection />
      <AboutSection />
      <FeatureSection />
      <PostSection />
      <FeatureTwoSection />
      <HowWorkSection />
      <RentProperySection />
      <SuccessStoriesSection />
      <PartnersLogos />
      <BlogSection />
      <ContactSection />
      <SearchModal />
    </div>
  );
};

export default Index3;
