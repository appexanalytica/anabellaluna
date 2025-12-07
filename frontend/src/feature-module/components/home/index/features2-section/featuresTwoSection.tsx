import Slider from "react-slick";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { Link } from "react-router";
import { useState } from "react";
import { all_routes } from "../../../../routes/all_routes";
import { useTranslation } from "react-i18next";

const FeaturesTwoSection = () => {
  const { t } = useTranslation();
  const bedroomLabel = (count: number) =>
    t(count === 1 ? "common.features.bedroom_one" : "common.features.bedroom_other", { count });
  const bathroomLabel = (count: number) =>
    t(count === 1 ? "common.features.bathroom_one" : "common.features.bathroom_other", { count });
  const Features_Two_Section = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  return (
    <>
      {/* start features rent section */}
      <section className="features-section section-padding bg-light position-relative">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">{t("home.featuresTwoSection.title")}</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">
              {t("home.featuresTwoSection.subtitle")}
            </p>
          </div>
          {/* end title */}
          <Slider
            {...Features_Two_Section}
            className="feature-slider-item features-slider position-none"
          >
            {/* slide item-1 */}
            <div className="features-slide-card">
              {/* inner item */}
              <div
                className="d-flex aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="property-card flex-fill">
                  <div className="property-listing-item p-0 mb-0 shadow-none">
                    <div className="buy-grid-img mb-0 rounded-0">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/rent/rent-grid-img-01.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3 z-1">
                        <div className="d-flex align-items-center gap-2">
                          <div className="badge badge-sm bg-danger d-flex align-items-center">
                            <i className="material-icons-outlined">
                              offline_bolt
                            </i>
                            {t("common.badges.new")}
                          </div>
                          <div className="badge badge-sm bg-orange d-flex align-items-center">
                            <i className="material-icons-outlined">loyalty</i>
                            {t("common.badges.featured")}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">
                          $21000
                          <span className="fs-14 fw-normal"> {t("home.featuresTwoSection.perNight")} </span>
                          </h6>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[1] ? "selected" : ""
                          }`}
                          key={1}
                          onClick={() => handleItemClick(1)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[1] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[1] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                    </div>
                    <div className="buy-grid-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <span className="ms-1 fs-14">{t("common.rating.excellent")}</span>
                        </div>
                        <span className="badge bg-secondary"> {t("common.badges.lodge")}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Serenity Condo Suite
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            17, Grove Towers, New York, USA
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {bedroomLabel(4)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {bathroomLabel(4)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 350 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3 gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-lg user-avatar">
                            <ImageWithBasePath
                              src="assets/img/users/user-10.jpg"
                              alt="image"
                              className="rounded-circle"
                            />
                          </div>
                          <Link
                            to="#"
                            className="mb-0 fs-16 fw-medium text-dark"
                          >
                            Ethan Brooks
                            <span className="d-block fs-14 text-body pt-1">
                              United States
                            </span>
                          </Link>
                        </div>
                        <Link
                          to={all_routes.rentDetails}
                          className="btn btn-dark"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end card */}
              </div>
              {/* inner item */}
              <div
                className="d-flex aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="property-card flex-fill property-card mb-0">
                  <div className="property-listing-item p-0 mb-0 shadow-none">
                    <div className="buy-grid-img mb-0 rounded-0">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/rent/rent-grid-img-04.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">
                          $1580
                                                  </h6>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[2] ? "selected" : ""
                          }`}
                          key={2}
                          onClick={() => handleItemClick(2)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[2] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[2] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                    </div>
                    <div className="buy-grid-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <span className="ms-1 fs-14">{t("common.rating.excellent")}</span>
                        </div>
                        <span className="badge bg-secondary"> {t("common.badges.residency")}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Coral Bay Cabins
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            7, Rosewood Court, Brighton, UK
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          5 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          3 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          700 Sq Ft
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3 gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-lg user-avatar">
                            <ImageWithBasePath
                              src="assets/img/users/user-13.jpg"
                              alt="image"
                              className="rounded-circle"
                            />
                          </div>
                          <Link
                            to="#"
                            className="mb-0 fs-16 fw-medium text-dark"
                          >
                            Sophia Mitchell
                            <span className="d-block fs-14 text-body pt-1">
                              United Kingdom
                            </span>
                          </Link>
                        </div>
                        <Link
                          to={all_routes.rentDetails}
                          className="btn btn-dark"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* slide Item-2 */}
            <div className="features-slide-card">
              {/* inner item */}
              <div
                className="d-flex aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="property-card flex-fill">
                  <div className="property-listing-item p-0 mb-0 shadow-none">
                    <div className="buy-grid-img mb-0 rounded-0">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/rent/rent-grid-img-02.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">
                          $1130
                                                  </h6>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[3] ? "selected" : ""
                          }`}
                          key={3}
                          onClick={() => handleItemClick(3)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[3] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[3] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                    </div>
                    <div className="buy-grid-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <span className="ms-1 fs-14">{t("common.rating.excellent")}</span>
                        </div>
                        <span className="badge bg-secondary"> {t("common.badges.apartment")}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Gateway Apartment
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            54, Coral Sands Apartments, Australia
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {bedroomLabel(2)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {bathroomLabel(4)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 350 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3 gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-lg user-avatar">
                            <ImageWithBasePath
                              src="assets/img/users/user-11.jpg"
                              alt="image"
                              className="rounded-circle"
                            />
                          </div>
                          <Link
                            to="#"
                            className="mb-0 fs-16 fw-medium text-dark"
                          >
                            Olivia Hayes
                            <span className="d-block fs-14 text-body pt-1">
                              Australia
                            </span>
                          </Link>
                        </div>
                        <Link
                          to={all_routes.rentDetails}
                          className="btn btn-dark"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* inner item */}
              <div
                className="d-flex aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="property-card flex-fill mb-0">
                  <div className="property-listing-item p-0 mb-0 shadow-none">
                    <div className="buy-grid-img mb-0 rounded-0">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/rent/rent-grid-img-05.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">
                          $4500
                                                  </h6>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[5] ? "selected" : ""
                          }`}
                          key={5}
                          onClick={() => handleItemClick(5)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[5] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[5] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                    </div>
                    <div className="buy-grid-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <span className="ms-1 fs-14">{t("common.rating.excellent")}</span>
                        </div>
                        <span className="badge bg-secondary"> {t("common.badges.residency")}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Majestic Stay
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            10, Bella Vista Villas, Rome, Italy
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {bedroomLabel(2)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {bathroomLabel(1)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 400 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3 gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-lg user-avatar">
                            <ImageWithBasePath
                              src="assets/img/users/user-14.jpg"
                              alt="image"
                              className="rounded-circle"
                            />
                          </div>
                          <Link
                            to="#"
                            className="mb-0 fs-16 fw-medium text-dark"
                          >
                            Leo Ramirez
                            <span className="d-block fs-14 text-body pt-1">
                              Italy
                            </span>
                          </Link>
                        </div>
                        <Link
                          to={all_routes.rentDetails}
                          className="btn btn-dark"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end card */}
              </div>
            </div>
            {/* slide Item-3 */}
            <div className="features-slide-card">
              {/* inner item */}
              <div
                className="d-flex aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="property-card flex-fill">
                  <div className="property-listing-item p-0 mb-0 shadow-none">
                    <div className="buy-grid-img mb-0 rounded-0">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/rent/rent-grid-img-03.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">
                          $2450
                                                  </h6>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[6] ? "selected" : ""
                          }`}
                          key={6}
                          onClick={() => handleItemClick(6)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[6] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[6] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                    </div>
                    <div className="buy-grid-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <span className="ms-1 fs-14">{t("common.rating.excellent")}</span>
                        </div>
                        <span className="badge bg-secondary"> {t("common.badges.condo")}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Cozy Urban Condo
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            130, Elmstone Flats, Manchester, UK
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {bedroomLabel(4)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          3 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          520 Sq Ft
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3 gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-lg user-avatar">
                            <ImageWithBasePath
                              src="assets/img/users/user-12.jpg"
                              alt="image"
                              className="rounded-circle"
                            />
                          </div>
                          <Link
                            to="#"
                            className="mb-0 fs-16 fw-medium text-dark"
                          >
                            Daniel Carter
                            <span className="d-block fs-14 text-body pt-1">
                              United Kingdom
                            </span>
                          </Link>
                        </div>
                        <Link
                          to={all_routes.rentDetails}
                          className="btn btn-dark"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end card */}
              </div>
              {/* inner item */}
              <div
                className="d-flex aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="property-card flex-fill mb-0">
                  <div className="property-listing-item p-0 mb-0 shadow-none">
                    <div className="buy-grid-img mb-0 rounded-0">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/rent/rent-grid-img-06.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">
                          $3000
                                                  </h6>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[7] ? "selected" : ""
                          }`}
                          key={7}
                          onClick={() => handleItemClick(7)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[7] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[7] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                    </div>
                    <div className="buy-grid-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <span className="ms-1 fs-14">{t("common.rating.excellent")}</span>
                        </div>
                        <span className="badge bg-secondary"> {t("common.badges.lodge")}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>Noble Nest</Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            76, Sakura Heights, Kyoto, Japan
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {bedroomLabel(4)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {bathroomLabel(1)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 550 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3 gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-lg user-avatar">
                            <ImageWithBasePath
                              src="assets/img/users/user-15.jpg"
                              alt="image"
                              className="rounded-circle"
                            />
                          </div>
                          <Link
                            to="#"
                            className="mb-0 fs-16 fw-medium text-dark"
                          >
                            Maya Rivera
                            <span className="d-block fs-14 text-body pt-1">
                              Japan
                            </span>
                          </Link>
                        </div>
                        <Link
                          to={all_routes.rentDetails}
                          className="btn btn-dark"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end card */}
              </div>
            </div>
            {/* slide Item-4 */}
            <div className="features-slide-card">
              {/* inner item */}
              <div
                className="d-flex aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="property-card flex-fill">
                  <div className="property-listing-item p-0 mb-0 shadow-none">
                    <div className="buy-grid-img mb-0 rounded-0">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/rent/rent-grid-img-07.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">
                          $1800
                                                  </h6>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[8] ? "selected" : ""
                          }`}
                          key={8}
                          onClick={() => handleItemClick(8)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[8] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[8] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                    </div>
                    <div className="buy-grid-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <span className="ms-1 fs-14">{t("common.rating.excellent")}</span>
                        </div>
                        <span className="badge bg-secondary"> {t("common.badges.villa")}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Holiday Haven Homes
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            88, Eucalypt Lane Suites, Sydney, Australia
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {bedroomLabel(2)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {bathroomLabel(1)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 480 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3 gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-lg user-avatar">
                            <ImageWithBasePath
                              src="assets/img/users/user-16.jpg"
                              alt="image"
                              className="rounded-circle"
                            />
                          </div>
                          <Link
                            to="#"
                            className="mb-0 fs-16 fw-medium text-dark"
                          >
                            Marcus Bennett
                            <span className="d-block fs-14 text-body pt-1">
                              Australia
                            </span>
                          </Link>
                        </div>
                        <Link
                          to={all_routes.rentDetails}
                          className="btn btn-dark"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end card */}
              </div>
              {/* inner item */}
              <div
                className="d-flex aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="property-card mb-0 flex-fill">
                  <div className="property-listing-item p-0 mb-0 shadow-none">
                    <div className="buy-grid-img mb-0 rounded-0">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/rent/rent-grid-img-08.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">
                          $2680
                                                  </h6>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[9] ? "selected" : ""
                          }`}
                          key={9}
                          onClick={() => handleItemClick(9)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[9] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[9] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                    </div>
                    <div className="buy-grid-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <i className="material-icons-outlined text-warning">
                            star
                          </i>
                          <span className="ms-1 fs-14">{t("common.rating.excellent")}</span>
                        </div>
                        <span className="badge bg-secondary"> {t("common.badges.apartment")}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Rentora Apartment
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            305, Palm View Towers, Dubai, UAE
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {bedroomLabel(2)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {bathroomLabel(2)}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 350 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3 gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-lg user-avatar">
                            <ImageWithBasePath
                              src="assets/img/users/user-17.jpg"
                              alt="image"
                              className="rounded-circle"
                            />
                          </div>
                          <Link
                            to="#"
                            className="mb-0 fs-16 fw-medium text-dark"
                          >
                            Zara Collins
                            <span className="d-block fs-14 text-body pt-1">
                              United Arab Emirates
                            </span>
                          </Link>
                        </div>
                        <Link
                          to={all_routes.rentDetails}
                          className="btn btn-dark"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end card */}
              </div>
            </div>
          </Slider>
          <div className="text-center d-flex align-items-center justify-content-center m-auto">
            <Link
              to={all_routes.rentPropertyGrid}
              className="btn btn-lg btn-dark d-flex align-items-center gap-1"
            >
              Explore All
              <i className="material-icons-outlined">arrow_forward</i>
            </Link>
          </div>
        </div>
      </section>
      {/* end features rent section */}
    </>
  );
};

export default FeaturesTwoSection;
