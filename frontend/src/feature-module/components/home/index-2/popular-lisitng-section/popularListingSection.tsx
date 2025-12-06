import { Link } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { useState } from "react";

const PopularListingSection = () => {
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
      {/* Popular Listing Section Start */}
      <section className="popular-listing-section">
        <div className="container">
          {/* Section Title Start */}
          <div
            className="section-title-2"
            data-aos="fade-up"
            data-aos-duration={500}
          >
            <div className="d-flex align-items-center justify-content-center">
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
              <h2>
                Discover <span> Popular</span> Listing
              </h2>
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
            </div>
            <p>Ready to buy your dream home? find it here</p>
          </div>
          {/* Section Title End */}
          <ul className="nav nav-pills listing-nav-2" role="tablist">
            <li className="nav-item" role="presentation">
              <Link
                className="nav-link active"
                data-bs-toggle="tab"
                to="#listing-1"
                role="tab"
                aria-controls="listing-1"
                aria-selected="true"
              >
                For Rent
              </Link>
            </li>
            <li className="nav-item" role="presentation">
              <Link
                className="nav-link"
                data-bs-toggle="tab"
                to="#listing-2"
                role="tab"
                aria-controls="listing-2"
                aria-selected="false"
                tabIndex={-1}
              >
                For Sale
              </Link>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className="tab-pane fade active show"
              id="listing-1"
              role="tabpanel"
            >
              {/* start row */}
              <div className="row">
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/buy/buy-grid-img-01.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="badge badge-sm bg-danger d-flex align-items-center">
                            <i className="material-icons-outlined">
                              offline_bolt
                            </i>
                            Trending
                          </div>
                          <div className="badge badge-sm bg-orange d-flex align-items-center">
                            <i className="material-icons-outlined">loyalty</i>
                            Featured
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Rent
                        </span>
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
                            <Link to={all_routes.rentDetails}>
                              Serenity Condo Suite
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            17, Grove Towers, New York, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Condo</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                          <span className="ms-1 fs-14">5.0</span>
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
                          2 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          1 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          400 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/buy/buy-grid-img-02.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="badge badge-sm bg-danger d-flex align-items-center">
                            <i className="material-icons-outlined">
                              offline_bolt
                            </i>
                            Trending
                          </div>
                        </div>
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Rent
                        </span>
                        <div className="user-avatar avatar avatar-md">
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
                        <div>
                          <h6 className="title">
                            <Link to={all_routes.rentDetails}>
                              Loyal Apartment
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            25, Willow Crest Apartment, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Apartment</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                            star_half
                          </i>
                          <span className="ms-1 fs-14">4.5</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$1940</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          2 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          2 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          350 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/buy/buy-grid-img-03.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="badge badge-sm bg-orange d-flex align-items-center">
                          <i className="material-icons-outlined">loyalty</i>
                          Featured
                        </div>
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Rent
                        </span>
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
                            <Link to={all_routes.rentDetails}>
                              Grand Villa House
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            10, Oak Ridge Villa, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Villa</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                          <span className="ms-1 fs-14">4.9</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$1370</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          4 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          3 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          520 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/buy/buy-grid-img-04.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="badge badge-sm bg-orange d-flex align-items-center">
                          <i className="material-icons-outlined">loyalty</i>
                          Featured
                        </div>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[4] ? "selected" : ""
                          }`}
                          key={4}
                          onClick={() => handleItemClick(4)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[4] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[4] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Rent
                        </span>
                        <div className="user-avatar avatar avatar-md">
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
                        <div>
                          <h6 className="title">
                            <Link to={all_routes.rentDetails}>
                              Palm Cove Bungalows
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            42, Pine Residency, Miami, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Bungalow</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                            star_half
                          </i>
                          <span className="ms-1 fs-14">4.5</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$1560</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          5 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          3 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          700 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/buy/buy-grid-img-05.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="badge badge-sm bg-danger d-flex align-items-center">
                          <i className="material-icons-outlined">
                            offline_bolt
                          </i>
                          Trending
                        </div>
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Rent
                        </span>
                        <div className="user-avatar avatar avatar-md">
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
                        <div>
                          <h6 className="title">
                            <Link to={all_routes.rentDetails}>
                              Blue Horizon Villa
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            76, Golden Oaks, Dallas, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Villa</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                          <span className="ms-1 fs-14">5.0</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$2000</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          2 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          1 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          400 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.rentDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/buy/buy-grid-img-06.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="badge badge-sm bg-danger d-flex align-items-center">
                          <i className="material-icons-outlined">
                            offline_bolt
                          </i>
                          Trending
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Rent
                        </span>
                        <div className="user-avatar avatar avatar-md">
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
                        <div>
                          <h6 className="title">
                            <Link to={all_routes.rentDetails}>
                              Wanderlust Lodge
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            91, Birch Residences, Boston, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Lodge</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                            star_border
                          </i>
                          <span className="ms-1 fs-14">4.0</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$1950</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          3 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          2 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          550 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div className="col-md-12">
                  <div className="text-center pt-3">
                    <Link
                      to={all_routes.rentPropertyGrid}
                      className="btn btn-dark d-inline-flex align-items-center"
                    >
                      Explore all Listings
                      <i className="material-icons-outlined ms-1">north_east</i>
                    </Link>
                  </div>
                </div>
                {/* end col */}
              </div>
              {/* end row */}
            </div>
            <div className="tab-pane fade" id="listing-2" role="tabpanel">
              {/* start row */}
              <div className="row">
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/rent/rent-grid-img-01.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="badge badge-sm bg-danger d-flex align-items-center">
                            <i className="material-icons-outlined">
                              offline_bolt
                            </i>
                            Trending
                          </div>
                          <div className="badge badge-sm bg-orange d-flex align-items-center">
                            <i className="material-icons-outlined">loyalty</i>
                            Featured
                          </div>
                        </div>
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Sale
                        </span>
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
                            <Link to={all_routes.buyDetails}>
                              Stylish Skyline Room
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            17, Grove Towers, New York, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Condo</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                          <span className="ms-1 fs-14">5.0</span>
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
                          2 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          1 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          400 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/rent/rent-grid-img-02.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="badge badge-sm bg-danger d-flex align-items-center">
                            <i className="material-icons-outlined">
                              offline_bolt
                            </i>
                            Trending
                          </div>
                        </div>
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Sale
                        </span>
                        <div className="user-avatar avatar avatar-md">
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
                        <div>
                          <h6 className="title">
                            <Link to={all_routes.buyDetails}>
                              Getaway Apartment
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            25, Willow Crest Apartment, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Apartment</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                            star_half
                          </i>
                          <span className="ms-1 fs-14">4.5</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$1940</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          2 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          2 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          350 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/rent/rent-grid-img-03.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="badge badge-sm bg-orange d-flex align-items-center">
                          <i className="material-icons-outlined">loyalty</i>
                          Featured
                        </div>
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
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Sale
                        </span>
                        <div className="user-avatar avatar avatar-md">
                          <ImageWithBasePath
                            src="assets/img/users/user-09.jpg"
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
                            <Link to={all_routes.buyDetails}>
                              Cozy Urban Condo
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            10, Oak Ridge Villa, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Villa</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                          <span className="ms-1 fs-14">4.9</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$1370</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          4 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          3 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          520 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/rent/rent-grid-img-04.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="badge badge-sm bg-orange d-flex align-items-center">
                          <i className="material-icons-outlined">loyalty</i>
                          Featured
                        </div>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[10] ? "selected" : ""
                          }`}
                          key={10}
                          onClick={() => handleItemClick(10)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[10] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[10] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Sale
                        </span>
                        <div className="user-avatar avatar avatar-md">
                          <ImageWithBasePath
                            src="assets/img/users/user-10.jpg"
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
                            <Link to={all_routes.buyDetails}>
                              Coral Bay Cabins
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            42, Pine Residency, Miami, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Bungalow</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                            star_half
                          </i>
                          <span className="ms-1 fs-14">4.5</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$1560</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          5 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          3 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          700 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/rent/rent-grid-img-05.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="badge badge-sm bg-danger d-flex align-items-center">
                          <i className="material-icons-outlined">
                            offline_bolt
                          </i>
                          Trending
                        </div>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[11] ? "selected" : ""
                          }`}
                          key={11}
                          onClick={() => handleItemClick(11)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[11] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[11] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Sale
                        </span>
                        <div className="user-avatar avatar avatar-md">
                          <ImageWithBasePath
                            src="assets/img/users/user-11.jpg"
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
                            <Link to={all_routes.buyDetails}>
                              Majestic Stay
                            </Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            76, Golden Oaks, Dallas, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Villa</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                          <span className="ms-1 fs-14">5.0</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$2000</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          2 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          1 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          400 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                >
                  <div className="property-listing-item">
                    <div className="buy-grid-img">
                      <Link to={all_routes.buyDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded"
                          src="assets/img/rent/rent-grid-img-06.jpg"
                          alt="image"
                        />
                      </Link>
                      <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3">
                        <div className="badge badge-sm bg-danger d-flex align-items-center">
                          <i className="material-icons-outlined">
                            offline_bolt
                          </i>
                          Trending
                        </div>
                        <Link
                          to="#"
                          className={`favourite ${
                            selectedItems[12] ? "selected" : ""
                          }`}
                          key={12}
                          onClick={() => handleItemClick(12)}
                        >
                          <i
                            className={`material-icons-outlined ${
                              selectedItems[12] ? "filled" : ""
                            }`}
                          >
                            {selectedItems[12] ? "favorite" : "favorite_border"}
                          </i>
                        </Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3">
                        <span className="badge bg-light text-dark">
                          For Sale
                        </span>
                        <div className="user-avatar avatar avatar-md">
                          <ImageWithBasePath
                            src="assets/img/users/user-12.jpg"
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
                            <Link to={all_routes.buyDetails}>Noble Nest</Link>
                          </h6>
                          <p className="d-flex align-items-center fs-14 mb-0">
                            <i className="material-icons-outlined me-1">
                              location_on
                            </i>
                            91, Birch Residences, Boston, USA
                          </p>
                        </div>
                        <span className="badge bg-secondary">Lodge</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
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
                            star_border
                          </i>
                          <span className="ms-1 fs-14">4.0</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>Starts From</span>
                          <h6 className="text-primary mb-0 ms-1">$1950</h6>
                        </div>
                      </div>
                      <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1">
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bed
                          </i>
                          3 Bedroom
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            bathtub
                          </i>
                          2 Bath
                        </li>
                        <li className="d-flex align-items-center gap-1">
                          <i className="material-icons-outlined bg-light text-dark">
                            straighten
                          </i>
                          550 Sq Ft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div className="col-md-12">
                  <div className="text-center pt-3">
                    <Link
                      to={all_routes.buyPropertyGrid}
                      className="btn btn-dark d-inline-flex align-items-center"
                    >
                      Explore all Listings
                      <i className="material-icons-outlined ms-1">north_east</i>
                    </Link>
                  </div>
                </div>
                {/* end col */}
              </div>
              {/* end row */}
            </div>
          </div>
        </div>
      </section>
      {/* Popular Listing Section End */}
    </>
  );
};

export default PopularListingSection;
