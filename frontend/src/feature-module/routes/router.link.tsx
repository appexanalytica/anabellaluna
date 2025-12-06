import Index2 from "../components/home/index-2/index2";
import Index3 from "../components/home/index-3/index3";
import Index from "../components/home/index";
import { all_routes } from "./all_routes";
import { Navigate, Route } from "react-router";
import BuyGrid from "../components/listing-modules/buy-property/buy-grid/buyGrid";
import BuyDetails from "../components/listing-modules/buy-property/buy-details/buyDetails";
import BuyList from "../components/listing-modules/buy-property/buy-list/buyList";
import BuyGridSidebar from "../components/listing-modules/buy-property/buy-grid-sidebar/buyGridSidebar";
import BuyListSidebar from "../components/listing-modules/buy-property/buy-list-sidebar/buyListSidebar";
import BuyGridMap from "../components/listing-modules/buy-property/buy-grid-map/buyGridMap";
import BuyListMap from "../components/listing-modules/buy-property/buy-list-map/buyListMap";
import RentGrid from "../components/listing-modules/rent-property/rent-grid/rentGrid";
import RentList from "../components/listing-modules/rent-property/rent-list/rentList";
import RentGridMap from "../components/listing-modules/rent-property/rent-grid-map/rentGridMap";
import RentGridSidebar from "../components/listing-modules/rent-property/rent-grid-sidebar/rentGridSidebar";
import RentListSidebar from "../components/listing-modules/rent-property/rent-list-sidebar/rentListSidebar";
import RentListMap from "../components/listing-modules/rent-property/rent-list-map/rentListMap";
import Rentdetails from "../components/listing-modules/rent-property/rent-details/rentdetails";
import RentalBooking from "../components/listing-modules/rent-property/rent-booking/rentalBooking";
import RentOrderDetails from "../components/listing-modules/rent-property/rent-order-details/rentOrderDetails";
import RentalOrderConfirmation from "../components/listing-modules/rent-property/rental-order-confirmation/rentalOrderConfirmation";
import RentalPayment from "../components/listing-modules/rent-property/rental-payment/rentalPayment";
import AgentGrid from "../components/listing-modules/agent-module/agent-grid/agentGrid";
import AgentList from "../components/listing-modules/agent-module/agent-list/agentList";
import AgentGridSidebar from "../components/listing-modules/agent-module/agent-grid-sidebar/agentGridSidebar";
import AgentListSidebar from "../components/listing-modules/agent-module/agent-list-sidebar/agentListSidebar";
import AgentDetails from "../components/listing-modules/agent-module/agent-details/agentDetails";
import AgencyGrid from "../components/listing-modules/agency-module/agency-grid/agencyGrid";
import AgencyList from "../components/listing-modules/agency-module/agency-list/agencyList";
import AgencyGridSidebar from "../components/listing-modules/agency-module/agency-grid-sidebar/agencyGridSidebar";
import AgencyListSidebar from "../components/listing-modules/agency-module/agency-list-sidebar/agencyListSidebar";
import AgencyDetails from "../components/listing-modules/agency-module/agency-details/agencyDetails";
import AddProperyBuy from "../components/add-property-buy/addProperyBuy";
import Cart from "../components/cart/cart";
import Notification from "../components/notification/notification";
import BlogList from "../components/blog-modules/blog-list/blogList";
import BlogGrid from "../components/blog-modules/blog-grid/blogGrid";
import BlogDetails from "../components/blog-modules/blog-details/blogDetails";
import AboutUs from "../components/pages-modules/about-us/aboutUs";
import SignUp from "../components/auth-modules/sign-up/signUp";
import SignIn from "../components/auth-modules/sign-in/signIn";
import ForgorPassword from "../components/auth-modules/forgort-password/forgorPassword";
import ResetPassword from "../components/auth-modules/reset-password/resetPassword";
import InvoiceDetails from "../components/pages-modules/invoice-details/invoiceDetails";
import ContactUs from "../components/pages-modules/contact-us/contactUs";
import Wishlist from "../components/pages-modules/wishlist/wishlist";
import Error404 from "../components/pages-modules/error-404/error404";
import Error500 from "../components/pages-modules/error-500/error500";
import Pricing from "../components/pages-modules/pricing/pricing";
import Faq from "../components/pages-modules/faq/faq";
import Gallery from "../components/pages-modules/gallery/gallery";
import OurTeam from "../components/pages-modules/our-team/ourTeam";
import Testimonial from "../components/pages-modules/testimonial/testimonial";
import TermsCondition from "../components/pages-modules/terms-condition/termsCondition";
import PrivacyPolicy from "../components/pages-modules/privacy-policy/privacyPolicy";
import Maintenance from "../components/pages-modules/maintenance/maintenance";
import ComingSoon from "../components/pages-modules/coming-soon/comingSoon";
import Checkout from "../components/pages-modules/checkout/checkout";

const routes = all_routes;

export const publicRoutes = [
  {
    path: "/react/",
    name: "Root",
    element: <Navigate to={routes.index} />,
    route: Route,
  },
  {
    path: "*", // ✅ Catch-all route for 404s
    element: <Navigate to={routes.index} />,
    route: Route,
  },
  {
    path: routes.index,
    element: <Index />,
    meta_title:"Home",
    route: Route,
  },
  {
    path: routes.index2,
    element: <Index2 />,
        meta_title:"Home",
    route: Route,
  },
  {
    path: routes.index3,
    element: <Index3 />,
        meta_title:"Home",
    route: Route,
  },
  {
    path: routes.buyPropertyGrid,
    element: <BuyGrid />,
            meta_title:"Buy Grid | Dreams Estate",
    route: Route,
  },
  {
    path: routes.buyDetails,
    element: <BuyDetails />,
            meta_title:"Buy Details | Dreams Estate",
    route: Route,
  },
  {
    path: routes.buyPropertyList,
    element: <BuyList />,
      meta_title:"Buy List | Dreams Estate",
    route: Route,
  },
  {
    path: routes.buyPropertyGridSidebar,
    element: <BuyGridSidebar />,
          meta_title:"Buy Grid With Sidebar | Dreams Estate",
    route: Route,
  },
  {
    path: routes.buyPropertyListSidebar,
    element: <BuyListSidebar />,
    meta_title:"Buy List With Sidebar | Dreams Estate",
    route: Route,
  },
  {
    path: routes.buyGridMap,
    element: <BuyGridMap />,
      meta_title:"Buy Grid Map | Dreams Estate",
    route: Route,
  },
  {
    path: routes.buyListMap,
    element: <BuyListMap />,
      meta_title:"Buy List Map | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentPropertyGrid,
    element: <RentGrid />,
     meta_title:"Rent Grid | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentPropertyList,
    element: <RentList />,
        meta_title:"Rent List | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentGridMap,
    element: <RentGridMap />,
           meta_title:"Rent Grid Map | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentPropertyGridSidebar,
    element: <RentGridSidebar />,
       meta_title:"Rent Grid With Sidebar | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentPropertyListSidebar,
    element: <RentListSidebar />,
         meta_title:"Rent List With Sidebar | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentListMap,
    element: <RentListMap />,
       meta_title:"Rent List Map | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentDetails,
    element: <Rentdetails />,
    meta_title:"Rent Details | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentBooking,
    element: <RentalBooking />,
        meta_title:"Rental Booking | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentalOrderDetails,
    element: <RentOrderDetails />,
      meta_title:"Rental Order Details | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentalOrderConfirmation,
    element: <RentalOrderConfirmation />,
     meta_title:"Rental Order Details | Dreams Estate",
    route: Route,
  },
  {
    path: routes.rentalPayment,
    element: <RentalPayment />,
       meta_title:"Rental Payment | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agentGrid,
    element: <AgentGrid />,
         meta_title:"Agent Grid | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agentList,
    element: <AgentList />,
     meta_title:"Agent List | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agentGridSidebar,
    element: <AgentGridSidebar />,
         meta_title:"Agent Grid With Sidebar | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agentListSidebar,
    element: <AgentListSidebar />,
      meta_title:"Agent List With Sidebar | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agentDetails,
    element: <AgentDetails />,
     meta_title:"Agent Details | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agencyGrid,
    element: <AgencyGrid />,
       meta_title:"Agency Grid | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agencyList,
    element: <AgencyList />,
         meta_title:"Agency List | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agencyGridSidebar,
    element: <AgencyGridSidebar />,
        meta_title:"Agency Grid With Sidebar | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agencyListSidebar,
    element: <AgencyListSidebar />,
          meta_title:"Agency List With Sidebar | Dreams Estate",
    route: Route,
  },
  {
    path: routes.agencyDetails,
    element: <AgencyDetails />,
          meta_title:"Agency Details| Dreams Estate",
    route: Route,
  },
  {
    path: routes.addpropertybuy,
    element: <AddProperyBuy />,
     meta_title:"Add Property Buy | Dreams Estate",
    route: Route,
  },
  {
    path: routes.cart,
    element: <Cart />,
       meta_title:"Cart | Dreams Estate",
    route: Route,
  },
  {
    path: routes.notification,
    element: <Notification />,
     meta_title:"Notification | Dreams Estate",
    route: Route,
  },
  {
    path: routes.blogList,
    element: <BlogList />,
     meta_title:"Blog List | Dreams Estate",
    route: Route,
  },
  {
    path: routes.blogGrid,
    element: <BlogGrid />,
         meta_title:"Blog Grid | Dreams Estate",
    route: Route,
  },
  {
    path: routes.blogDetails,
    element: <BlogDetails />,
         meta_title:"Blog Details | Dreams Estate",
    route: Route,
  },
  {
    path: routes.aboutUs,
    element: <AboutUs />,
         meta_title:"About Us | Dreams Estate",
    route: Route,
  },
  {
    path: routes.invoiceDetails,
    element: <InvoiceDetails />,
     meta_title:"Invoice | Dreams Estate",
    route: Route,
  },
  {
    path: routes.contactUs,
    element: <ContactUs />,
     meta_title:"Contact Us | Dreams Estate",
    route: Route,
  },
  {
    path: routes.wishlist,
    element: <Wishlist />,
      meta_title:"Wishlist | Dreams Estate",
    route: Route,
  },
  {
    path: routes.pricing,
    element: <Pricing />,
      meta_title:"Pricing | Dreams Estate",
    route: Route,
  },
  {
    path: routes.faq,
    element: <Faq />,
     meta_title:"Faq | Dreams Estate",
    route: Route,
  },
  {
    path: routes.gallery,
    element: <Gallery />,
     meta_title:"Gallery | Dreams Estate",
    route: Route,
  },
  {
    path: routes.ourTeam,
    element: <OurTeam />,
       meta_title:"Team | Dreams Estate",
    route: Route,
  },
  {
    path: routes.testimonial,
    element: <Testimonial />,
      meta_title:"Testimonial | Dreams Estate",
    route: Route,
  },
  {
    path: routes.termsCondition,
    element: <TermsCondition />,
       meta_title:"Terms & Condition | Dreams Estate",
    route: Route,
  },
  {
    path: routes.privacyPolicy,
    element: <PrivacyPolicy />,
      meta_title:"Privacy Policy | Dreams Estate",
    route: Route,
  },
  {
    path: routes.checkout,
    element: <Checkout />,
       meta_title:"Checkout | Dreams Estate",
    route: Route,
  },
];
export const authRoutes = [
  {
    path: routes.signup,
    element: <SignUp />,
     meta_title:"Sign Up | Dreams Estate",
    route: Route,
  },
  {
    path: routes.signin,
    element: <SignIn />,
      meta_title:"Sign In | Dreams Estate",
    route: Route,
  },
  {
    path: routes.forgotPassword,
    element: <ForgorPassword />,
          meta_title:"Forgot Password | Dreams Estate",
    route: Route,
  },
  {
    path: routes.resetPassword,
    element: <ResetPassword />,
     meta_title:"Reset Password | Dreams Estate",
    route: Route,
  },
  {
    path: routes.error404,
    element: <Error404 />,
         meta_title:"Error 404 | Dreams Estate",
    route: Route,
  },
  {
    path: routes.error500,
    element: <Error500 />,
          meta_title:"Error 500 | Dreams Estate",
    route: Route,
  },
  {
    path: routes.maintenance,
    element: <Maintenance />,
            meta_title:"Maintenance | Dreams Estate",
    route: Route,
  },
  {
    path: routes.comingSoon,
    element: <ComingSoon />,
    meta_title:"Coming Soon | Dreams Estate",
    route: Route,
  },
];
