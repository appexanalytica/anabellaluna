import { Link } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

const ListingSliderCondos = () => {
  return (
    <div className="swiper listing-slider">
      <Swiper
        modules={[Navigation, Pagination, Keyboard]}
        slidesPerView={1}
        spaceBetween={24}
        keyboard={{ enabled: true }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        loop={true}
        breakpoints={{
          768: { slidesPerView: 2 },
          992: { slidesPerView: 1 },
          1300: { slidesPerView: 2 },
        }}
        className="swiper-wrapper"
      >
        <SwiperSlide>
          <div className="property-listing-item swiper-slide">
            <div className="buy-grid-img">
              <Link to={all_routes.buyDetails} className="position-relative">
                <ImageWithBasePath
                  className="img-fluid rounded"
                  src="assets/img/buy/buy-grid-img-03.jpg"
                  alt="buy-grid-img-01"
                />
              </Link>
              <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="badge badge-sm bg-danger d-flex align-items-center">
                    <i className="material-icons-outlined">offline_bolt</i>
                    Trending
                  </div>
                  <div className="badge badge-sm bg-orange d-flex align-items-center">
                    <i className="material-icons-outlined">loyalty</i>
                    Featured
                  </div>
                </div>
                <Link to="javascript:void(0)" className="favourite">
                  <i className="material-icons-outlined">favorite_border</i>
                </Link>
              </div>
              <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                <span className="badge bg-light text-dark">For Rent</span>
                <div className="user-avatar avatar avatar-md">
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
                <div>
                  <h6 className="title">
                    <Link to={all_routes.buyDetails}>Grand Villa House</Link>
                  </h6>
                  <p className="d-flex align-items-center gap-1 mb-0">
                    <i className="material-icons-outlined ms-0">location_on</i>{" "}
                    17, Grove Towers, New York, USA
                  </p>
                </div>
                <span className="badge bg-secondary">Condo</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons text-warning">star_border</i>
                  <i className="material-icons text-warning">star_border</i>
                  <span className="ms-1 fs-14">4.8</span>
                </div>
                <div className="d-flex align-items-center">
                  <span>Starts From</span>
                  <h6 className="text-primary mb-0 ms-1">$1596</h6>
                </div>
              </div>
              <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    bed
                  </i>
                  4 Beds
                </li>
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    bathtub
                  </i>
                  4 Baths
                </li>
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    straighten
                  </i>
                  35000 Sqft
                </li>
              </ul>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="property-listing-item swiper-slide">
            <div className="buy-grid-img">
              <Link to={all_routes.buyDetails} className="position-relative">
                <ImageWithBasePath
                  className="img-fluid rounded"
                  src="assets/img/buy/buy-grid-img-01.jpg"
                  alt="buy-grid-img-01"
                />
              </Link>
              <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="badge badge-sm bg-danger d-flex align-items-center">
                    <i className="material-icons-outlined">offline_bolt</i>
                    Trending
                  </div>
                  <div className="badge badge-sm bg-orange d-flex align-items-center">
                    <i className="material-icons-outlined">loyalty</i>
                    Featured
                  </div>
                </div>
                <Link to="javascript:void(0)" className="favourite">
                  <i className="material-icons-outlined">favorite_border</i>
                </Link>
              </div>
              <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                <span className="badge bg-light text-dark">For Rent</span>
                <div className="user-avatar avatar avatar-md">
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
                <div>
                  <h6 className="title">
                    <Link to={all_routes.buyDetails}>Serenity Condo Suite</Link>
                  </h6>
                  <p className="d-flex align-items-center gap-1 mb-0">
                    <i className="material-icons-outlined ms-0">location_on</i>{" "}
                    17, Grove Towers, New York, USA
                  </p>
                </div>
                <span className="badge bg-secondary">Condo</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons text-warning">star_border</i>
                  <i className="material-icons text-warning">star_border</i>
                  <span className="ms-1 fs-14">4.8</span>
                </div>
                <div className="d-flex align-items-center">
                  <span>Starts From</span>
                  <h6 className="text-primary mb-0 ms-1">$1596</h6>
                </div>
              </div>
              <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    bed
                  </i>
                  4 Beds
                </li>
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    bathtub
                  </i>
                  4 Baths
                </li>
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    straighten
                  </i>
                  35000 Sqft
                </li>
              </ul>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="property-listing-item swiper-slide">
            <div className="buy-grid-img">
              <Link to={all_routes.buyDetails} className="position-relative">
                <ImageWithBasePath
                  className="img-fluid rounded"
                  src="assets/img/buy/buy-grid-img-07.jpg"
                  alt="buy-grid-img-01"
                />
              </Link>
              <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="badge badge-sm bg-danger d-flex align-items-center">
                    <i className="material-icons-outlined">offline_bolt</i>
                    Trending
                  </div>
                  <div className="badge badge-sm bg-orange d-flex align-items-center">
                    <i className="material-icons-outlined">loyalty</i>
                    Featured
                  </div>
                </div>
                <Link to="javascript:void(0)" className="favourite">
                  <i className="material-icons-outlined">favorite_border</i>
                </Link>
              </div>
              <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                <span className="badge bg-light text-dark">For Rent</span>
                <div className="user-avatar avatar avatar-md">
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
                <div>
                  <h6 className="title">
                    <Link to={all_routes.buyDetails}>Elite Suite Room</Link>
                  </h6>
                  <p className="d-flex align-items-center gap-1 mb-0">
                    <i className="material-icons-outlined ms-0">location_on</i>{" "}
                    17, Grove Towers, New York, USA
                  </p>
                </div>
                <span className="badge bg-secondary">Condo</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons text-warning">star_border</i>
                  <i className="material-icons text-warning">star_border</i>
                  <span className="ms-1 fs-14">4.8</span>
                </div>
                <div className="d-flex align-items-center">
                  <span>Starts From</span>
                  <h6 className="text-primary mb-0 ms-1">$1596</h6>
                </div>
              </div>
              <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    bed
                  </i>
                  4 Beds
                </li>
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    bathtub
                  </i>
                  4 Baths
                </li>
                <li className="d-flex align-items-center gap-1">
                  <i className="material-icons-outlined bg-light text-dark">
                    straighten
                  </i>
                  35000 Sqft
                </li>
              </ul>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="swiper-button-next" />
      <div className="swiper-button-prev" />
      <div className="swiper-pagination" />
    </div>
  );
};

export default ListingSliderCondos;
