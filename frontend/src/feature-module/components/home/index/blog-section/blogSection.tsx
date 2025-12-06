import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import { useTranslation } from "react-i18next";

const BlogSection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* start blog section */}
      <section className="home-blog-section section-padding ">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">{t("home.blog.title")}</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">
              {t("home.blog.subtitle")}
            </p>
          </div>
          {/* end title */}
          {/* start row */}
          <div className="row row-gap-4 justify-content-center">
            <div
              className="col-md-6 col-lg-4 d-flex aos"
              data-aos="fade-down"
              data-aos-duration={1500}
            >
              <div className="blog-item-01 flex-fill">
                <div className="blog-img">
                  <Link to={all_routes.blogDetails}>
                    <ImageWithBasePath
                      src="assets/img/blogs/blog-img-01.jpg"
                      alt="img"
                      className="img-fluid"
                    />
                  </Link>
                </div>
                <div className="blog-content">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                    <span className="badge badge-sm bg-secondary fw-semibold">
                      {t("home.blog.categories.property")}
                    </span>
                    <div className="d-flex align-items-center author-details">
                      <div className="d-flex align-items-center me-3">
                        <Link to={all_routes.agentDetails}>
                          <ImageWithBasePath
                            src="assets/img/agents/agent-01.jpg"
                            alt="image"
                            className="avatar avatar-sm rounded-circle me-2"
                          />
                        </Link>
                        <Link to={all_routes.agentDetails}>Susan Culli</Link>
                      </div>
                      <span className="d-inline-flex align-items-center">
                        <i className="material-icons-outlined me-1">events</i>10
                        Apr 2025
                      </span>
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-1">
                      <Link to={all_routes.blogDetails}>
                        Location is Everything
                      </Link>
                    </h5>
                    <p className="mb-0">
                      The value of a property largely depends on where it’s
                      located.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-md-6 col-lg-4 d-flex aos"
              data-aos="fade-down"
              data-aos-duration={1500}
            >
              <div className="blog-item-01 flex-fill">
                <div className="blog-img">
                  <Link to={all_routes.blogDetails}>
                    <ImageWithBasePath
                      src="assets/img/blogs/blog-img-02.jpg"
                      alt="img"
                      className="img-fluid"
                    />
                  </Link>
                </div>
                <div className="blog-content">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                    <span className="badge badge-sm bg-secondary fw-semibold">
                      {t("home.blog.categories.villa")}
                    </span>
                    <div className="d-flex align-items-center author-details">
                      <div className="d-flex align-items-center me-3">
                        <Link to={all_routes.agentDetails}>
                          <ImageWithBasePath
                            src="assets/img/agents/agent-04.jpg"
                            alt="image"
                            className="avatar avatar-sm rounded-circle me-2"
                          />
                        </Link>
                        <Link to={all_routes.agentDetails}>Shelly Cox</Link>
                      </div>
                      <span className="d-inline-flex align-items-center">
                        <i className="material-icons-outlined me-1">events</i>24
                        Apr 2025
                      </span>
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-1">
                      <Link to={all_routes.blogDetails}>
                        Real Estate is a Investment
                      </Link>
                    </h5>
                    <p className="mb-0">
                      Unlike stocks, real estate usually grows in value over
                      time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-md-6 col-lg-4 d-flex aos"
              data-aos="fade-down"
              data-aos-duration={1500}
            >
              <div className="blog-item-01 flex-fill">
                <div className="blog-img">
                  <Link to={all_routes.blogDetails}>
                    <ImageWithBasePath
                      src="assets/img/blogs/blog-img-03.jpg"
                      alt="img"
                      className="img-fluid"
                    />
                  </Link>
                </div>
                <div className="blog-content">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                    <span className="badge badge-sm bg-secondary fw-semibold">
                      {t("home.blog.categories.godown")}
                    </span>
                    <div className="d-flex align-items-center author-details">
                      <div className="d-flex align-items-center me-3">
                        <Link to={all_routes.agentDetails}>
                          <ImageWithBasePath
                            src="assets/img/agents/agent-02.jpg"
                            alt="image"
                            className="avatar avatar-sm rounded-circle me-2"
                          />
                        </Link>
                        <Link to={all_routes.agentDetails}>Eva Jones</Link>
                      </div>
                      <span className="d-inline-flex align-items-center">
                        <i className="material-icons-outlined me-1">events</i>27
                        Sep 2025
                      </span>
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-1">
                      <Link to={all_routes.blogDetails}>
                        Market Trends Matter
                      </Link>
                    </h5>
                    <p className="mb-0">
                      Staying informed about housing market trends helps you
                      make smarter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          <div className="text-center d-flex align-items-center justify-content-center m-auto">
            <Link
              to={all_routes.blogGrid}
              className="btn btn-lg btn-dark d-flex align-items-center gap-1"
            >
              {t("home.blog.exploreAll")}{" "}
              <i className="material-icons-outlined">arrow_forward</i>
            </Link>
          </div>
        </div>
      </section>
      {/* end blog section */}
    </>
  );
};

export default BlogSection;
