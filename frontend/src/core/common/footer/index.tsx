import { Link, useLocation } from "react-router";
import { all_routes } from "../../../feature-module/routes/all_routes";
import ImageWithBasePath from "../../imageWithBasePath";
import publicService from "../../../services/publicService";
import { useEffect, useState } from "react";

type SiteConfig = {
  name: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  socialMedia: Record<string, string>;
  logo: string;
};

// Mapa de red social -> icono de Font Awesome usado en el footer.
const SOCIAL_ICONS: Record<string, string> = {
  facebook: "fa-brands fa-facebook",
  instagram: "fa-brands fa-instagram",
  twitter: "fa-brands fa-x-twitter",
  x: "fa-brands fa-x-twitter",
  linkedin: "fa-brands fa-linkedin",
  youtube: "fa-brands fa-youtube",
  tiktok: "fa-brands fa-tiktok",
  whatsapp: "fa-brands fa-whatsapp",
};

const Footer = () => {
  const location = useLocation();

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [config, setConfig] = useState<SiteConfig>({
    name: "Anabella Luna Propiedades",
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    socialMedia: {},
    logo: "",
  });

  useEffect(() => {
    const checkYear = () => {
      const currentYear = new Date().getFullYear();
      setYear(currentYear);
    };

    // Check once per hour
    const interval = setInterval(checkYear, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await publicService.getSiteConfig();
        if (mounted) setConfig((prev) => ({ ...prev, ...res }));
      } catch {
        /* mantener valores por defecto */
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Solo renderiza las redes que estén configuradas en el panel de administración.
  const socialEntries = Object.entries(config.socialMedia || {}).filter(
    ([key, url]) => url && SOCIAL_ICONS[key.toLowerCase()]
  );

  const SocialIcons = () =>
    socialEntries.length > 0 ? (
      <div className="social-icon">
        {socialEntries.map(([key, url]) => (
          <Link key={key} to={url} target="_blank" rel="noopener noreferrer">
            <i className={SOCIAL_ICONS[key.toLowerCase()]} />
          </Link>
        ))}
      </div>
    ) : null;

  return (
    <>
      {location.pathname === "/index" ? (
        <div>
          {/* Start Footer */}
          <footer className="footer footer-dark">
            <div className="footer-bg">
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-01.png"
                className="bg-1"
                alt="image"
              />
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-02.png"
                className="bg-2"
                alt="image"
              />
            </div>
            {/* Footer Top */}
            <div className="footer-top">
              <div className="container">
                <div className="row row-gap-4">
                  <div className="col-lg-4 col-md-6 col-sm-8">
                    <div className="footer-widget footer-about">
                      <Link to={all_routes.index} className="footer-logo">
                        <ImageWithBasePath
                          src="assets/img/logo-white.svg"
                          alt="Anabella Luna Propiedades"
                        />
                      </Link>
                      <p className="footer-tagline">
                        Conectamos espacios con personas. Te acompañamos en la
                        compra, venta y alquiler de tu propiedad con
                        asesoramiento profesional y tecnología de vanguardia.
                      </p>
                      <div className="social-links">
                        <h5>Conectate con nosotros</h5>
                        <SocialIcons />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6 col-sm-4">
                    <div className="footer-widget">
                      <h5 className="footer-title">Servicios</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.buyPropertyList}>Comprar</Link>
                        </li>
                        <li>
                          <Link to={all_routes.rentPropertyList}>Alquilar</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Vender</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Tasaciones</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6 col-sm-4">
                    <div className="footer-widget">
                      <h5 className="footer-title">Empresa</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.aboutUs}>Sobre Nosotros</Link>
                        </li>
                        <li>
                          <Link to={all_routes.ourTeam}>Nuestro Equipo</Link>
                        </li>
                        <li>
                          <Link to={all_routes.blogGrid}>Blog</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Contacto</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-8">
                    <div className="footer-widget footer-contacts">
                      <h5 className="footer-title">Contacto</h5>
                      {config.address && (
                        <div className="contact-info">
                          <h6>Dirección</h6>
                          <p>{config.address}</p>
                        </div>
                      )}
                      {config.phone && (
                        <div className="contact-info">
                          <h6>Teléfono</h6>
                          <p>
                            <a href={`tel:${config.phone}`}>{config.phone}</a>
                          </p>
                        </div>
                      )}
                      {config.email && (
                        <div className="contact-info">
                          <h6>Email</h6>
                          <p>
                            <a href={`mailto:${config.email}`}>
                              {config.email}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Footer Top */}
            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="container">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="copyright">
                    <p className="copy-right">
                      Copyright &copy; {year}. Todos los derechos reservados,{" "}
                      {config.name}
                    </p>
                  </div>
                  <div className="policy-link">
                    <Link to={all_routes.privacyPolicy}>
                      Política de Privacidad
                    </Link>
                    <Link to={all_routes.termsCondition}>
                      Términos y Condiciones
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* /Footer Bottom */}
          </footer>
          {/* End Footer */}
        </div>
      ) : location.pathname == "/index-2" ? (
        <>
          {/* Start Footer */}
          <footer className="footer-two">
            <div className="container">
              <div className="join-sec">
                <div>
                  <h2>Encontrá tu próxima propiedad con nosotros</h2>
                  <p>
                    Asesoramiento profesional para comprar, vender y alquilar.
                  </p>
                </div>
              </div>
              {/* Footer Top */}
              <div className="footer-top">
                <div className="row gy-4">
                  <div className="col-lg-2 col-md-6 col-sm-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Empresa</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.aboutUs}>Sobre Nosotros</Link>
                        </li>
                        <li>
                          <Link to={all_routes.ourTeam}>Nuestro Equipo</Link>
                        </li>
                        <li>
                          <Link to={all_routes.blogGrid}>Blog</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Contacto</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6 col-sm-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Servicios</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.buyPropertyList}>Comprar</Link>
                        </li>
                        <li>
                          <Link to={all_routes.rentPropertyList}>Alquilar</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Vender</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Tasaciones</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="footer-widget footer-contacts">
                      <h5 className="footer-title">Contacto</h5>
                      {config.address && (
                        <div className="contact-info">
                          <h6>Dirección</h6>
                          <p>{config.address}</p>
                        </div>
                      )}
                      {config.phone && (
                        <div className="contact-info">
                          <h6>Teléfono</h6>
                          <p>
                            <a href={`tel:${config.phone}`}>{config.phone}</a>
                          </p>
                        </div>
                      )}
                      {config.email && (
                        <div className="contact-info">
                          <h6>Email</h6>
                          <p>
                            <a href={`mailto:${config.email}`}>
                              {config.email}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="footer-widget footer-subscribe">
                      <h5 className="footer-title">Newsletter</h5>
                      <div className="email-info">
                        <h6>Suscribite a nuestro newsletter</h6>
                        <p>
                          Recibí las nuevas propiedades y novedades directamente
                          en tu correo.
                        </p>
                      </div>
                      <div className="d-flex align-items-center subscribe-wrap">
                        <div className="input-group input-group-flat">
                          <span className="input-group-text">
                            <i className="material-icons-outlined">email</i>
                          </span>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Ingresá tu email"
                          />
                        </div>
                        <button type="submit" className="btn btn-primary">
                          <i className="material-icons-outlined">send</i>
                        </button>
                      </div>
                      <SocialIcons />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Footer Top */}
            </div>
            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="container">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <p className="copy-right">
                    Copyright © {year}. Todos los derechos reservados,{" "}
                    {config.name}
                  </p>
                  <div className="policy-link">
                    <Link to={all_routes.privacyPolicy}>
                      Política de Privacidad
                    </Link>
                    <Link to={all_routes.termsCondition}>
                      Términos y Condiciones
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* /Footer Bottom */}
          </footer>
          {/* End Footer */}
        </>
      ) : (
        <>
          {/* Start Footer */}
          <footer className="footer-three footer-dark">
            <div className="footer-bg">
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-01.png"
                className="bg-1"
                alt="image"
              />
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-02.png"
                className="bg-2"
                alt="image"
              />
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-03.png"
                className="bg-3"
                alt="image"
              />
            </div>
            <div className="container">
              {/* Footer Top */}
              <div className="footer-top">
                {/* start row */}
                <div className="row gy-4">
                  <div className="col-lg-3 col-md-6">
                    <div className="footer-widget footer-about">
                      <Link to={all_routes.index} className="footer-logo">
                        <ImageWithBasePath
                          src="assets/img/logo-white.svg"
                          alt="Anabella Luna Propiedades"
                        />
                      </Link>
                      <p className="footer-tagline">
                        Conectamos espacios con personas. Asesoramiento
                        profesional para comprar, vender y alquilar tu
                        propiedad.
                      </p>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-lg-3 col-md-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Servicios</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.buyPropertyList}>Comprar</Link>
                        </li>
                        <li>
                          <Link to={all_routes.rentPropertyList}>Alquilar</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Vender</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Tasaciones</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-lg-3 col-md-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Empresa</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.aboutUs}>Sobre Nosotros</Link>
                        </li>
                        <li>
                          <Link to={all_routes.ourTeam}>Nuestro Equipo</Link>
                        </li>
                        <li>
                          <Link to={all_routes.blogGrid}>Blog</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Contacto</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-lg-3 col-md-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Enlaces Útiles</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.privacyPolicy}>
                            Política de Privacidad
                          </Link>
                        </li>
                        <li>
                          <Link to={all_routes.termsCondition}>
                            Términos y Condiciones
                          </Link>
                        </li>
                        <li>
                          <Link to={all_routes.faq}>Preguntas Frecuentes</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Contactanos</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
              </div>
              {/* /Footer Top */}
              <div className="footer-middle">
                {/* start row */}
                <div className="row justify-content-xl-between align-items-center gy-4">
                  <div className="col-xl-4">
                    <SocialIcons />
                  </div>
                  {/* end col */}
                  <div className="col-xl-7">
                    {/* start row */}
                    <div className="row justify-content-center gy-4">
                      {config.phone && (
                        <div className="col-md-4 col-sm-6">
                          <div className="contact-info">
                            <span className="bg-primary">
                              <i className="material-icons-outlined">
                                headphones
                              </i>
                            </span>
                            <div>
                              <p>Atención al cliente</p>
                              <h6>
                                <a href={`tel:${config.phone}`}>
                                  {config.phone}
                                </a>
                              </h6>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* end col */}
                      {config.email && (
                        <div className="col-md-4 col-sm-6">
                          <div className="contact-info">
                            <span className="bg-secondary">
                              <i className="material-icons-outlined">message</i>
                            </span>
                            <div>
                              <p>Escribinos</p>
                              <h6>
                                <a href={`mailto:${config.email}`}>
                                  {config.email}
                                </a>
                              </h6>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* end col */}
                      {config.address && (
                        <div className="col-md-4 col-sm-6">
                          <div className="contact-info">
                            <span className="bg-danger">
                              <i className="material-icons-outlined">
                                location_on
                              </i>
                            </span>
                            <div>
                              <p>Visitanos</p>
                              <h6>{config.address}</h6>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* end col */}
                    </div>
                    {/* end row */}
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
              </div>
            </div>
            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="text-center">
                <p className="copy-right">
                  Copyright &copy; {year}. Todos los derechos reservados,{" "}
                  {config.name}
                </p>
              </div>
            </div>
            {/* /Footer Bottom */}
          </footer>
          {/* End Footer */}
        </>
      )}
    </>
  );
};

export default Footer;
