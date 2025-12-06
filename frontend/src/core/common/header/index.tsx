import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { header } from "./headerData";
import { useDispatch, useSelector } from "react-redux";
import ImageWithBasePath from "../../imageWithBasePath";
import { setDataTheme } from "../../redux/themeSettingSlice";
import { all_routes } from "../../../feature-module/routes/all_routes";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");
  const [subsidebar2, setSubsidebar2] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const [isFixed, setIsFixed] = useState(false);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const { t } = useTranslation();
  const handleDataThemeChange = (theme: string) => {
    dispatch(setDataTheme(theme));
  };
  const onHandleMobileMenu = () => {
    const root = document.getElementsByTagName("html")[0];
    root.classList.add("menu-opened");
  };
  const onhandleCloseMenu = () => {
    const root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
  };

  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };
  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };
  const toggleSubsidebar2 = (subitem: any) => {
    if (subitem === subsidebar2) {
      setSubsidebar2("");
    } else {
      setSubsidebar2(subitem);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };
    // Listen for scroll on every page
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dataTheme);
  }, [dataTheme]);
  return (
    <>
      {/* Header Start */}
      <header
        className={
          // Always add fixed class if isFixed is true, regardless of page
          `header${
            location.pathname === "/index-2"
              ? " header-two"
              : location.pathname === "/index-3"
              ? " header-three"
              : ""
          }${isFixed ? " fixed" : ""}`
        }
      >
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <Link to={all_routes.index} className="navbar-brand logo">
                <ImageWithBasePath
                  src={
                    location.pathname === "/index-3"
                      ? "assets/img/logo-white.svg"
                      : "assets/img/logo.svg"
                  }
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
              <Link to={all_routes.index} className="navbar-brand logo-dark">
                <ImageWithBasePath
                  src={
                    location.pathname === "/index-3"
                      ? `assets/img/logo.svg`
                      : `assets/img/logo-white.svg`
                  }
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
              <Link id="mobile_btn" to="#" onClick={() => onHandleMobileMenu()}>
                <i className="material-icons-outlined">menu</i>
              </Link>
            </div>
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link to={all_routes.index} className="menu-logo">
                  <ImageWithBasePath
                    src="assets/img/logo.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
                <Link
                  to={all_routes.index}
                  className="menu-logo menu-logo-dark"
                >
                  <ImageWithBasePath
                    src="assets/img/logo-white.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
                <Link
                  id="menu_close"
                  className="menu-close"
                  to="#"
                  onClick={() => onhandleCloseMenu()}
                >
                  <i className="material-icons-outlined">close</i>
                </Link>
              </div>
              <div className="mobile-search">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder={t("Search")}
                />
              </div>
              <ul className={`main-nav  navbar-nav`}>
                {header.map((mainMenus: any, mainIndex) => (
                  <React.Fragment key={mainIndex}>
                    {mainMenus.separateRoute ? (
                      <li
                        key={mainIndex}
                        className={`has-submenu megamenu ${
                          location.pathname === "/index" ||
                          location.pathname === "/index-2" ||
                          location.pathname === "/index-3"
                            ? "active"
                            : ""
                        }`}
                        onClick={() => toggleSidebar(mainMenus.tittle)}
                      >
                        <Link to="#">
                          {t(mainMenus.tittle)}
                          <i className="material-icons-outlined">
                            {mainMenus.icon}
                          </i>
                        </Link>
                        <ul
                          className={`submenu mega-submenu ${
                            subOpen === mainMenus.tittle ? "d-block" : ""
                          }`}
                        >
                          <li>
                            <div className="megamenu-wrapper">
                              <div className="row">
                                {mainMenus.menu.map((menu: any, idx: any) => (
                                  <div className="col-lg-3" key={idx}>
                                    <div
                                      className={`single-demo ${
                                        location.pathname === menu.route
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <div className="demo-img">
                                        <Link to={menu.route}>
                                          <ImageWithBasePath
                                            src={menu.img}
                                            className="img-fluid "
                                            alt="img"
                                          />
                                        </Link>
                                      </div>
                                      <div className="demo-info">
                                        <Link
                                          to={menu.route}
                                          className={`inner-demo-img`}
                                        >
                                          {t(menu.menuValue)}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <li
                        className={`has-submenu ${
                          mainMenus?.menu?.some(
                            (item: any) =>
                              item?.route === location.pathname ||
                              item?.subMenus?.some(
                                (subItem: any) =>
                                  subItem?.route === location.pathname
                              )
                          )
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link
                          to="#"
                          onClick={() => toggleSidebar(mainMenus.tittle)}
                        >
                          {t(mainMenus.tittle)}
                          <i className="material-icons-outlined">
                            {mainMenus.icon}
                          </i>
                        </Link>
                        <ul
                          className={`submenu ${
                            subOpen === mainMenus.tittle ? "d-block" : ""
                          }`}
                        >
                          {mainMenus.menu?.map((menu: any, menuIndex: any) => (
                            <React.Fragment key={`${mainIndex}-${menuIndex}`}>
                              {menu.hasSubRoute ? (
                                <li
                                  key={`${mainIndex}-${menuIndex}`}
                                  className={`${
                                    menu.hasSubRoute ? "has-submenu" : ""
                                  } ${
                                    menu?.subMenus?.some(
                                      (item: any) =>
                                        location.pathname === item?.route
                                    )
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <Link
                                    to="#"
                                    className={`hideonmob`}
                                    onClick={() => {
                                      toggleSubsidebar(menu.menuValue);
                                    }}
                                  >
                                    {t(menu.menuValue)}
                                  </Link>
                                  <ul
                                    className={`submenu showonmob ${
                                      subsidebar === menu.menuValue
                                        ? "d-block"
                                        : ""
                                    }`}
                                  >
                                    {menu.subMenus?.map(
                                      (subMenu: any, subMenuIndex: any) => (
                                        <React.Fragment
                                          key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}
                                        >
                                          {subMenu.hasSubRoute ? (
                                            <li
                                              className={`${
                                                subMenu?.subMenus?.some(
                                                  (item: any) =>
                                                    location.pathname ===
                                                    item?.route
                                                )
                                                  ? "active"
                                                  : ""
                                              }`}
                                            >
                                              <Link
                                                to="#"
                                                onClick={() => {
                                                  toggleSubsidebar2(
                                                    subMenu.menuValue
                                                  );
                                                }}
                                              >
                                                {t(subMenu.menuValue)}
                                              </Link>
                                              <ul
                                                className={`submenu ${
                                                  subsidebar2 ===
                                                  subMenu.menuValue
                                                    ? "d-block"
                                                    : ""
                                                }`}
                                              >
                                                {subMenu.subMenus?.map(
                                                  (
                                                    menu: any,
                                                    menuIndex2: any
                                                  ) => (
                                                    <li
                                                      key={menuIndex2}
                                                      className={
                                                        location.pathname ===
                                                        menu.route
                                                          ? "active"
                                                          : ""
                                                      }
                                                    >
                                                      <Link to={menu.route}>
                                                        {t(menu.menuValue)}
                                                      </Link>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </li>
                                          ) : (
                                            <li
                                              className={
                                                location.pathname ===
                                                subMenu.route
                                                  ? "active"
                                                  : ""
                                              }
                                              key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}
                                            >
                                              <Link
                                                to={subMenu.route}
                                                target={`${
                                                  subMenu.admin
                                                    ? "_blank"
                                                    : "_self"
                                                }`}
                                              >
                                                {t(subMenu.menuValue)}
                                              </Link>
                                            </li>
                                          )}
                                        </React.Fragment>
                                      )
                                    )}
                                  </ul>
                                </li>
                              ) : (
                                <li
                                  key={`${mainIndex}-${menuIndex}`}
                                  className={
                                    location.pathname === menu.route
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <Link to={menu.route}>{t(menu.menuValue)}</Link>
                                </li>
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
              <div className="menu-dropdown">
                <div className="dropdown mb-2">
                  <Link
                    to="#"
                    className="dropdown-toggle d-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <ImageWithBasePath
                      src="assets/img/flags/us.svg"
                      alt="Language"
                      className="me-1"
                      height={16}
                    />
                    {t("English")}
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/us.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("English")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/de.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("German")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/fr.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("French")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/ae.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("Arabic")}</span>
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {t("Light")}
                  </Link>
                  <ul className="dropdown-menu mt-2">
                    <li>
                      <Link className="dropdown-item light-mode" to="#">
                        {t("Light")}
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item dark-mode" to="#">
                        {t("Dark")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="menu-login">
                <Link
                  to={all_routes.signup}
                  className="btn btn-primary w-100 mb-2"
                >
                  {t("Sign In")}
                </Link>
                <Link
                  to={all_routes.signin}
                  className="btn btn-secondary w-100"
                >
                  {t("Register")}
                </Link>
              </div>
            </div>
            {location.pathname === "/index" ||
            location.pathname === "/index-2" ||
            location.pathname === "/index-3" ? (
              <div className="nav header-items">
                <Link
                  to="#"
                  className="topbar-link btn btn-light topbar-search"
                  data-bs-toggle="modal"
                  data-bs-target="#search-modal"
                >
                  <i className="material-icons-outlined">search</i>
                </Link>
                <div className="dropdown topbar-lang">
                  <Link
                    to="#"
                    className="topbar-link btn btn-light"
                    data-bs-toggle="dropdown"
                  >
                    <ImageWithBasePath
                      src="assets/img/flags/us.svg"
                      alt="Language"
                      height={16}
                    />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/us.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("English")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/de.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("German")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/fr.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("French")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/ae.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("Arabic")}</span>
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="topbar-link btn btn-light"
                    data-bs-toggle="dropdown"
                  >
                    <i className="material-icons-outlined">wb_sunny</i>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className={`dropdown-item d-flex align-items-center ${
                        dataTheme === "light" && "active"
                      }`}
                      id="light-mode-toggle"
                      onClick={() => handleDataThemeChange("light")}
                    >
                      <i className="material-icons-outlined me-2">wb_sunny</i>
                      <span className="align-middle">{t("Light Mode")}</span>
                    </Link>
                    <Link
                      to="#"
                      className={`dropdown-item d-flex align-items-center ${
                        dataTheme === "dark" && "active"
                      }`}
                      id="dark-mode-toggle"
                      onClick={() => handleDataThemeChange("dark")}
                    >
                      <i className="material-icons-outlined me-2">dark_mode</i>
                      <span className="align-middle">{t("Dark Mode")}</span>
                    </Link>
                  </div>
                </div>
                <Link
                  to={all_routes.signin}
                  className="btn btn-lg btn-primary d-inline-flex align-items-center"
                >
                  <i className="material-icons-outlined me-1">lock</i>
                  {t("Sign In")}
                </Link>
                <Link
                  to={all_routes.signup}
                  className="btn btn-lg btn-dark d-inline-flex align-items-center"
                >
                  <i className="material-icons-outlined me-1">perm_identity</i>
                  {t("Register")}
                </Link>
              </div>
            ) : (
              <div className="nav header-items">
                <Link
                  to="#"
                  className={`topbar-link btn btn-light topbar-search ${
                    [
                      "/buy-details",
                      "/rent-details",
                      "/buy-details-schedule",
                    ].includes(location.pathname)
                      ? "custom-btn-light"
                      : ""
                  }`}
                  data-bs-toggle="modal"
                  data-bs-target="#search-modal"
                >
                  <i className="material-icons-outlined">search</i>
                </Link>
                <div className="dropdown topbar-lang">
                  <Link
                    to="#"
                    className={`topbar-link btn btn-light  ${
                      [
                        "/buy-details",
                        "/rent-details",
                        "/buy-details-schedule",
                      ].includes(location.pathname)
                        ? "custom-btn-light"
                        : ""
                    }`}
                    data-bs-toggle="dropdown"
                  >
                    <ImageWithBasePath
                      src="assets/img/flags/us.svg"
                      alt="Language"
                      height={16}
                    />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/us.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("English")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/de.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("German")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/fr.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("French")}</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/ae.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">{t("Arabic")}</span>
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="topbar-link btn btn-light"
                    data-bs-toggle="dropdown"
                  >
                    <i className="material-icons-outlined">wb_sunny</i>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className={`dropdown-item d-flex align-items-center ${
                        dataTheme === "light" && "active"
                      }`}
                      id="light-mode-toggle"
                      onClick={() => handleDataThemeChange("light")}
                    >
                      <i className="material-icons-outlined me-2">wb_sunny</i>
                      <span className="align-middle">{t("Light Mode")}</span>
                    </Link>
                    <Link
                      to="#"
                      className={`dropdown-item d-flex align-items-center ${
                        dataTheme === "dark" && "active"
                      }`}
                      id="dark-mode-toggle"
                      onClick={() => handleDataThemeChange("dark")}
                    >
                      <i className="material-icons-outlined me-2">dark_mode</i>
                      <span className="align-middle">{t("Dark Mode")}</span>
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className={`topbar-link btn btn-light ${
                      [
                        "/buy-details",
                        "/rent-details",
                        "/buy-details-schedule",
                      ].includes(location.pathname)
                        ? "custom-btn-light"
                        : ""
                    }`}
                    data-bs-toggle="dropdown"
                  >
                    <i className="material-icons-outlined animate-ring">
                      notifications_none
                    </i>
                    <span className="badge-icon bg-orange">4</span>
                  </Link>
                  <div
                    className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg"
                    style={{ minHeight: 300 }}
                  >
                    <div className="notification-head">
                      <div className="row align-items-center">
                        <div className="col">
                          <h6 className="m-0">{t("Notifications")}</h6>
                        </div>
                        <div className="col-auto">
                          <div className="dropdown">
                            <Link
                              to="#"
                              className="text-body"
                              data-bs-toggle="dropdown"
                              data-bs-offset="0,15"
                              aria-expanded="false"
                            >
                              <i className="material-icons-outlined">
                                settings
                              </i>
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end">
                              {/* item*/}
                              <Link to="#" className="dropdown-item">
                                {t("Mark as Read")}
                              </Link>
                              {/* item*/}
                              <Link to="#" className="dropdown-item">
                                {t("Delete All")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Notification Body */}
                    <div
                      className="notification-body position-relative z-2 rounded-0"
                      data-simplebar=""
                    >
                      {/* Item*/}
                      <div
                        className="dropdown-item notification-item text-wrap border-bottom"
                        id="notification-1"
                      >
                        <div className="d-flex">
                          <div className="avatar avatar-md avatar-rounded bg-teal text-white flex-shrink-0">
                            MH
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1">
                              <span className="fw-medium text-dark">
                                Maria Hill
                              </span>
                              notifications inform you when someone likes
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fs-13 d-flex align-items-center">
                                <i className="material-icons-outlined text-body fs-13 me-1">
                                  schedule
                                </i>
                                45 mins ago
                              </span>
                              <div className="notification-action d-flex align-items-center float-end gap-2">
                                <Link
                                  to="#"
                                  className="notification-read rounded-circle bg-danger"
                                  data-bs-toggle="tooltip"
                                  title=""
                                  data-bs-original-title="Make as Read"
                                  aria-label="Make as Read"
                                />
                                <button
                                  className="btn rounded-circle p-0"
                                  data-dismissible="#notification-1"
                                >
                                  <i className="material-icons-outlined me-1">
                                    close
                                  </i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Item*/}
                      <div
                        className="dropdown-item notification-item text-wrap border-bottom"
                        id="notification-2"
                      >
                        <div className="d-flex">
                          <div className="avatar avatar-md flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/users/user-03.jpg"
                              alt="img"
                              className="img-fluid rounded-circle"
                            />
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1">
                              <span className="fw-medium text-dark">
                                Edward Curr
                              </span>
                              notifications alert you to new messages in your
                              estates inbox.
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fs-13 d-flex align-items-center">
                                <i className="material-icons-outlined text-body fs-13 me-1">
                                  schedule
                                </i>
                                17 mins ago
                              </span>
                              <div className="notification-action d-flex align-items-center float-end gap-2">
                                <Link
                                  to="#"
                                  className="notification-read rounded-circle bg-danger"
                                  data-bs-toggle="tooltip"
                                  title=""
                                  data-bs-original-title="Make as Read"
                                  aria-label="Make as Read"
                                />
                                <button
                                  className="btn rounded-circle p-0"
                                  data-dismissible="#notification-2"
                                >
                                  <i className="material-icons-outlined me-1">
                                    close
                                  </i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Item*/}
                      <div
                        className="dropdown-item notification-item text-wrap border-bottom"
                        id="notification-3"
                      >
                        <div className="d-flex">
                          <div className="avatar avatar-md flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/users/user-06.jpg"
                              alt="img"
                              className="img-fluid rounded-circle"
                            />
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1">
                              <span className="fw-medium text-dark">
                                Alex Carter
                              </span>
                              added a comment to Alex Carter
                              <span className="fw-medium text-dark">
                                “Oh, I finished de-bugging the phones”
                              </span>
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fs-13 d-flex align-items-center">
                                <i className="material-icons-outlined text-body fs-13 me-1">
                                  schedule
                                </i>
                                1 Day Ago
                              </span>
                              <div className="notification-action d-flex align-items-center float-end gap-2">
                                <Link
                                  to="#"
                                  className="notification-read rounded-circle bg-danger"
                                  data-bs-toggle="tooltip"
                                  title=""
                                  data-bs-original-title="Make as Read"
                                  aria-label="Make as Read"
                                />
                                <button
                                  className="btn rounded-circle p-0"
                                  data-dismissible="#notification-3"
                                >
                                  <i className="material-icons-outlined me-1">
                                    close
                                  </i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Item*/}
                      <div
                        className="dropdown-item notification-item text-wrap border-bottom"
                        id="notification-4"
                      >
                        <div className="d-flex">
                          <div className="avatar avatar-md avatar-rounded bg-teal text-white flex-shrink-0">
                            AN
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1">
                              <span className="fw-medium text-dark">
                                Annie Nirain
                              </span>
                              payment attempt failed. Please verify your details
                              and try again.
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fs-13 d-flex align-items-center">
                                <i className="material-icons-outlined text-body fs-13 me-1">
                                  schedule
                                </i>
                                45 mins ago
                              </span>
                              <div className="notification-action d-flex align-items-center float-end gap-2">
                                <Link
                                  to="#"
                                  className="notification-read rounded-circle bg-danger"
                                  data-bs-toggle="tooltip"
                                  title=""
                                  data-bs-original-title="Make as Read"
                                  aria-label="Make as Read"
                                />
                                <button
                                  className="btn rounded-circle text-danger p-0"
                                  data-dismissible="#notification-4"
                                >
                                  <i className="material-icons-outlined me-1">
                                    close
                                  </i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* View All*/}
                    <div className="notification-footer text-center">
                      <Link
                        to={all_routes.notification}
                        className="text-center mb-0"
                      >
                        {t("View All")}
                      </Link>
                    </div>
                  </div>
                </div>
                <Link
                  to={all_routes.cart}
                  className={`topbar-link btn btn-light topbar-cart ${
                    [
                      "/buy-details",
                      "/rent-details",
                      "/buy-details-schedule",
                    ].includes(location.pathname)
                      ? "custom-btn-light"
                      : ""
                  }`}
                >
                  <i className="material-icons-outlined">shopping_cart</i>
                  <span className="badge-icon bg-danger">3</span>
                </Link>
                <Link
                  to={all_routes.addpropertybuy}
                  className="btn btn-lg btn-dark d-inline-flex align-items-center topbar-add"
                >
                  <i className="material-icons-outlined me-1">home</i>
                  {t("Post Property")}
                </Link>
                <div className="dropdown topbar-profile d-flex">
                  <Link to="#" className="avatar" data-bs-toggle="dropdown">
                    <ImageWithBasePath
                      src="assets/img/users/user-06.jpg"
                      alt="img"
                      className="img-fluid rounded-circle"
                    />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="d-flex align-items-center user-profile">
                      <ImageWithBasePath
                        src="assets/img/users/user-06.jpg"
                        className="rounded-circle"
                        width={42}
                        height={42}
                        alt="image"
                      />
                      <div className="ms-2">
                        <h6 className="mb-1">{t("Jafna Cremson")}</h6>
                        <span className="d-block">{t("Administrator")}</span>
                      </div>
                    </div>
                    {/* Item*/}
                    <Link
                      to="#"
                      className="dropdown-item d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-2">
                        person_outline
                      </i>
                      {t("Profile Settings")}
                    </Link>
                    {/* Item*/}
                    <Link
                      to={all_routes.notification}
                      className="dropdown-item d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-2">
                        notifications_none
                      </i>
                      {t("Notifications")}
                    </Link>
                    {/* Item*/}
                    <Link
                      to="#"
                      className="dropdown-item d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-2">
                        help_outline
                      </i>
                      {t("Help & Support")}
                    </Link>
                    {/* Item*/}
                    <Link
                      to="#"
                      className="dropdown-item d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-2">settings</i>
                      {t("Settings")}
                    </Link>
                    <hr className="dropdown-divider" />
                    <Link
                      to={all_routes.signin}
                      className="dropdown-item d-inline-flex align-items-center link-danger"
                    >
                      <i className="material-icons-outlined me-2">logout</i>
                      {t("Sign Out")}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>
      {/* Header End */}
    </>
  );
};

export default Header;
