import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const { t } = useTranslation();
  const features_slider = {
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
      {/* start features section */}
      <section className="features-section section-padding bg-light position-relative">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">{t("home.featuresSection.title")}</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">{t("home.featuresSection.subtitle")}</p>
          </div>
          {/* end title */}
          <Slider
            {...features_slider}
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
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/buy/buy-grid-img-01.jpg"
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">$21000</h6>
                        <div className="user-avatar avatar avatar-md border rounded-circle">
                          <ImageWithBasePath
                            src="assets/img/users/user-01.jpg"
                            alt="User"
                            className="rounded-circle"
                          />
                        </div>
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
                          <span className="ms-1 fs-14">
                            {t("common.reviewSummary", { rating: "5.0", total: "20" })}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              {t("home.featuresSection.property1.title")}
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            {t("home.featuresSection.property1.location")}
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {t(
                            4 === 1
                              ? "common.features.bedroom_one"
                              : "common.features.bedroom_other",
                            { count: 4 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {t(
                            4 === 1
                              ? "common.features.bathroom_one"
                              : "common.features.bathroom_other",
                            { count: 4 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 350 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.listedOn")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property1.listedOn")}
                          </span>
                        </p>
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.category")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property1.category")}
                          </span>
                        </p>
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
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/buy/buy-grid-img-04.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-end position-absolute top-0 start-0 end-0 p-3 z-1">
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">$1370</h6>
                        <div className="user-avatar avatar avatar-md border rounded-circle">
                          <ImageWithBasePath
                            src="assets/img/users/user-04.jpg"
                            alt="User"
                            className="rounded-circle"
                          />
                        </div>
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
                          <span className="ms-1 fs-14">
                            {t("common.reviewSummary", { rating: "4.8", total: "26" })}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              {t("home.featuresSection.property2.title")}
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            {t("home.featuresSection.property2.location")}
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {t(
                            5 === 1
                              ? "common.features.bedroom_one"
                              : "common.features.bedroom_other",
                            { count: 5 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {t(
                            3 === 1
                              ? "common.features.bathroom_one"
                              : "common.features.bathroom_other",
                            { count: 3 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 700 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.listedOn")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property2.listedOn")}
                          </span>
                        </p>
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.category")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property2.category")}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end card */}
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
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/buy/buy-grid-img-02.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-end position-absolute top-0 start-0 end-0 p-3 z-1">
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">$1940</h6>
                        <div className="user-avatar avatar avatar-md border rounded-circle">
                          <ImageWithBasePath
                            src="assets/img/users/user-02.jpg"
                            alt="User"
                            className="rounded-circle"
                          />
                        </div>
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
                          <span className="ms-1 fs-14">
                            {t("common.reviewSummary", { rating: "4.6", total: "36" })}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              {t("home.featuresSection.property3.title")}
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            {t("home.featuresSection.property3.location")}
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {t(
                            (() => {
                              const count = 2;
                              return count === 1
                                ? "common.features.bedroom_one"
                                : "common.features.bedroom_other";
                            })(),
                            { count: 2 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {t(
                            (() => {
                              const count = 2;
                              return count === 1
                                ? "common.features.bathroom_one"
                                : "common.features.bathroom_other";
                            })(),
                            { count: 2 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 350 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.listedOn")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property3.listedOn")}
                          </span>
                        </p>
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.category")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property3.category")}
                          </span>
                        </p>
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
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/buy/buy-grid-img-05.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-end position-absolute top-0 start-0 end-0 p-3 z-1">
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">$2000</h6>
                        <div className="user-avatar avatar avatar-md border rounded-circle">
                          <ImageWithBasePath
                            src="assets/img/users/user-05.jpg"
                            alt="User"
                            className="rounded-circle"
                          />
                        </div>
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
                          <span className="ms-1 fs-14">
                            {t("common.reviewSummary", { rating: "4.9", total: "19" })}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              {t("home.featuresSection.property4.title")}
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            {t("home.featuresSection.property4.location")}
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {t("common.features.bedroom_other", { count: 2 })}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {t(
                            1 === 1
                              ? "common.features.bathroom_one"
                              : "common.features.bathroom_other",
                            { count: 1 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 400 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.listedOn")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property4.listedOn")}
                          </span>
                        </p>
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.category")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property4.category")}
                          </span>
                        </p>
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
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/buy/buy-grid-img-03.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3 z-1">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge badge-sm bg-orange d-flex align-items-center">
                            <i className="material-icons-outlined">loyalty</i>
                            {t("common.badges.featured")}
                          </span>
                        </div>
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">$1370</h6>
                        <div className="user-avatar avatar avatar-md border rounded-circle">
                          <ImageWithBasePath
                            src="assets/img/users/user-03.jpg"
                            alt="User"
                            className="rounded-circle"
                          />
                        </div>
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
                          <span className="ms-1 fs-14">
                            {t("common.reviewSummary", { rating: "4.9", total: "25" })}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              {t("home.featuresSection.property5.title")}
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            {t("home.featuresSection.property5.location")}
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {t(
                            4 === 1
                              ? "common.features.bedroom_one"
                              : "common.features.bedroom_other",
                            { count: 4 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {t(
                            3 === 1
                              ? "common.features.bathroom_one"
                              : "common.features.bathroom_other",
                            { count: 3 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 520 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.listedOn")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property5.listedOn")}
                          </span>
                        </p>
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.category")} :
                          <span className="fw-medium text-body">
                            {t("home.featuresSection.property5.category")}
                          </span>
                        </p>
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
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/buy/buy-grid-img-06.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-end position-absolute top-0 start-0 end-0 p-3 z-1">
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">$1950</h6>
                        <div className="user-avatar avatar avatar-md border rounded-circle">
                          <ImageWithBasePath
                            src="assets/img/users/user-06.jpg"
                            alt="User"
                            className="rounded-circle"
                          />
                        </div>
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
                          <span className="ms-1 fs-14">
                          {t("common.reviewSummary", { rating: "4.7", total: "45" })}
                        </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Wanderlust Lodge
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            91, Birch Residences, Boston, USA
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {t(
                            (() => {
                              const count = 3;
                              return count === 1
                                ? "common.features.bedroom_one"
                                : "common.features.bedroom_other";
                            })(),
                            { count: 3 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {t(
                            (() => {
                              const count = 2;
                              return count === 1
                                ? "common.features.bathroom_one"
                                : "common.features.bathroom_other";
                            })(),
                            { count: 2 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 550 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.listedOn")} :
                          <span className="fw-medium text-body">
                            25 Feb 2025
                          </span>
                        </p>
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.category")} :
                          <span className="fw-medium text-body">
                            {t("common.badges.lodge")}
                          </span>
                        </p>
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
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/buy/buy-grid-img-07.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-end position-absolute top-0 start-0 end-0 p-3 z-1">
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">$2470</h6>
                        <div className="user-avatar avatar avatar-md border rounded-circle">
                          <ImageWithBasePath
                            src="assets/img/users/user-07.jpg"
                            alt="User"
                            className="rounded-circle"
                          />
                        </div>
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
                          <span className="ms-1 fs-14">
                          {t("common.reviewSummary", { rating: "4.4", total: "79" })}
                        </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Elite Suite Room
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            42, Maple Grove Residences, USA
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {t(
                            (() => {
                              const count = 2;
                              return count === 1
                                ? "common.features.bedroom_one"
                                : "common.features.bedroom_other";
                            })(),
                            { count: 2 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {t(
                            1 === 1
                              ? "common.features.bathroom_one"
                              : "common.features.bathroom_other",
                            { count: 1 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 480 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <p className="fs-14 fw-medium text-dark mb-0">
                          Listed on :
                          <span className="fw-medium text-body">
                            14 Apr 2025
                          </span>
                        </p>
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.category")} :
                          <span className="fw-medium text-body"> Suite </span>
                        </p>
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
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/buy/buy-grid-img-08.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-end position-absolute top-0 start-0 end-0 p-3 z-1">
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                        <h6 className="text-white mb-0">$1900</h6>
                        <div className="user-avatar avatar avatar-md border rounded-circle">
                          <ImageWithBasePath
                            src="assets/img/users/user-08.jpg"
                            alt="User"
                            className="rounded-circle"
                          />
                        </div>
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
                          <span className="ms-1 fs-14">
                          {t("common.reviewSummary", { rating: "4.6", total: "47" })}
                        </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h6 className="title mb-1">
                            <Link to={all_routes.buyDetails}>
                              Celestial Residency
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1 ms-0">
                              location_on
                            </i>
                            28, Hilltop Gardens, San Francisco, USA
                          </p>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bed
                          </i>
                          {t(
                            (() => {
                              const count = 2;
                              return count === 1
                                ? "common.features.bedroom_one"
                                : "common.features.bedroom_other";
                            })(),
                            { count: 2 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            bathtub
                          </i>
                          {t(
                            (() => {
                              const count = 2;
                              return count === 1
                                ? "common.features.bathroom_one"
                                : "common.features.bathroom_other";
                            })(),
                            { count: 2 }
                          )}
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-white text-secondary">
                            straighten
                          </i>
                          {t("common.features.squareFeet", { value: 354 })}
                        </li>
                      </ul>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.listedOn")} :
                          <span className="fw-medium text-body">
                            06 Apr 2025
                          </span>
                        </p>
                        <p className="fs-14 fw-medium text-dark mb-0">
                          {t("common.labels.category")} :
                          <span className="fw-medium text-body"> Villa </span>
                        </p>
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
              to={all_routes.buyPropertyGrid}
              className="btn btn-lg btn-dark d-flex align-items-center gap-1"
            >
              {t("home.blog.exploreAll")}
              <i className="material-icons-outlined">arrow_forward</i>
            </Link>
          </div>
        </div>
      </section>
      {/* end features section */}
    </>
  );
};

export default FeaturesSection;
