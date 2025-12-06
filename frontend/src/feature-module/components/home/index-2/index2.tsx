import AboutUsSection from "./aboutus-section/aboutUsSection";
import BannerSection from "./banner-section/bannerSection";
import BlogSection from "./blog-section/blogSection";
import ExclusiveSection from "./exclusive-section/exclusiveSection";
import FaqSection from "./faq-section/faqSection";
import LocationSection from "./location-section/locationSection";
import PopularListingSection from "./popular-lisitng-section/popularListingSection";
import PropertySection from "./property-section/propertySection";
import ReviewSection from "./review-section/reviewSection";
import SearchSection from "./search-section/searchSection";
import SupportSection from "./support-section/supportSection";
import WorkSection from "./work-section/workSection";

const Index2 = () => {
  return (
    <div>
      <BannerSection />
      <SearchSection />
      <AboutUsSection />
      <PropertySection />
      <SupportSection />
      <PopularListingSection />
      <ExclusiveSection />
      <LocationSection />
      <WorkSection />
      <ReviewSection />
      <FaqSection />
      <BlogSection />
    </div>
  );
};

export default Index2;
