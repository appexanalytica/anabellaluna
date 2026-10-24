import { useEffect, useRef } from "react";
import Header from "../../core/common/header";
import Footer from "../../core/common/footer";
import { Outlet, useLocation } from "react-router";
import CommonModal from "../../core/common/Common-modal/CommonModal";
import InstallPrompt from "../../components/pwa/InstallPrompt";
import NotificationPrompt from "../../components/pwa/NotificationPrompt";
import PageCurtain from "../../components/motion/PageCurtain";
import SmoothScroll from "../../components/motion/SmoothScroll";
import { useCardHover, useContentKey, useReveals } from "../../components/motion/hooks";

const Feature = () => {
  const location = useLocation();

  // Al navegar a otra página (p. ej. del listado al detalle de una propiedad)
  // arrancamos siempre desde el inicio en lugar de mantener el scroll anterior.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Entradas de scroll y hover de las tarjetas para todo el sitio público. El contador de
  // contenido vuelve a enganchar las piezas que llegan de la API después del primer render.
  const wrapper = useRef<HTMLDivElement>(null);
  const contentKey = useContentKey(wrapper);
  useReveals(wrapper, `${location.pathname}:${contentKey}`);
  useCardHover(wrapper, `${location.pathname}:${contentKey}`);

  const isDetailsHeader =
    location.pathname.startsWith("/buy/") ||
    location.pathname.startsWith("/rent/") ||
    location.pathname === "/buy-details-schedule";

  return (
    <>
      <PageCurtain />
      <SmoothScroll />
      <div className="main-wrapper" ref={wrapper}>
        <div
          className={`${
            location.pathname === "/index-2"
              ? "main-header-two"
              : location.pathname === "/index-3"
              ? "main-header-two"
              : isDetailsHeader
              ? "buy-details-header-item"
              : ""
          }`}
        >
          <Header />
        </div>
        <Outlet />
        <Footer />
        <CommonModal/>
        <InstallPrompt />
        <NotificationPrompt />
      </div>
    </>
  );
};

export default Feature;
