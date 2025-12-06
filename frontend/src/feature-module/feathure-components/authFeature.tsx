
import { Outlet, useLocation } from "react-router-dom";

const AuthFeature = () => {
  const location = useLocation();
  return (
   <div className={`main-wrapper ${location.pathname === '/error-404' || '/error-500' || '/maintance' || '/coming-soon' ? '' : ' auth-cover'}`}>
     <Outlet />
   </div>
  );
};

export default AuthFeature;
