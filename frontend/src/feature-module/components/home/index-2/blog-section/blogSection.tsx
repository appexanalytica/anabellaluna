import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";

const BlogSection = () => {
  return (
    <>
      {/* Blog Section Start */}
      <section className="blogs-section">
        <div className="container">
          {/* Section Title Start */}
          <div
            className="section-title-2"
            data-aos="fade-up"
            data-aos-duration={1000}
          >
            <div className="d-flex align-items-center justify-content-center">
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
              <h2>
                Latest <span> Blogs</span>
              </h2>
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
            </div>
            <p>
              Explore our featured blog posts on premium properties for sales
              &amp; rents
            </p>
          </div>
          {/* Section Title End */}
          {/* end col */}
          <div className="row justify-content-center">
            <div
              className="col-lg-4 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={1000}
            >
              <div className="blog-item-two">
                <div className="blog-content">
                  <div className="blog-img">
                    <Link to={all_routes.blogDetails}>
                      <ImageWithBasePath
                        src="assets/img/blogs/blog-img-22.jpg"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                  </div>
                  <div className="position-absolute top-0 start-0 p-3 z-1">
                    <div className="blog-date">
                      <h6 className="mb-0">10</h6>
                      <span>Jul</span>
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 start-0 end-0 p-3 text-center z-1">
                    <span className="badge bg-danger mb-2">Bookings</span>
                    <h5 className="mb-0">
                      <Link to={all_routes.blogDetails}>
                        Top 10 Tips for First-Time Homebuyers in 2025
                      </Link>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={1500}
            >
              <div className="blog-item-two">
                <div className="blog-content">
                  <div className="blog-img">
                    <Link to={all_routes.blogDetails}>
                      <ImageWithBasePath
                        src="assets/img/blogs/blog-img-23.jpg"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                  </div>
                  <div className="position-absolute top-0 start-0 p-3 z-1">
                    <div className="blog-date">
                      <h6 className="mb-0">10</h6>
                      <span>Jul</span>
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 start-0 end-0 p-3 text-center z-1">
                    <span className="badge bg-danger mb-2">Rental</span>
                    <h5 className="mb-0">
                      <Link to={all_routes.blogDetails}>
                        First-Time Buyer’s Guide: What to Expect in 2025
                      </Link>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={2000}
            >
              <div className="blog-item-two">
                <div className="blog-content">
                  <div className="blog-img">
                    <Link to={all_routes.blogDetails}>
                      <ImageWithBasePath
                        src="assets/img/blogs/blog-img-24.jpg"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                  </div>
                  <div className="position-absolute top-0 start-0 p-3 z-1">
                    <div className="blog-date">
                      <h6 className="mb-0">10</h6>
                      <span>Jul</span>
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 start-0 end-0 p-3 text-center z-1">
                    <span className="badge bg-danger mb-2">Tips</span>
                    <h5 className="mb-0">
                      <Link to={all_routes.blogDetails}>
                        Top Property Investment Trends in 2025
                      </Link>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
        </div>
      </section>
      {/* Blog Section Start */}
    </>
  );
};

export default BlogSection;
