import { Link } from "react-router";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { all_routes } from "../../../routes/all_routes";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import Slider from "react-slick";

const PrevArrow = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => (
  <div className="blog-carousel-prev" onClick={onClick}>
    <i className="fa fa-chevron-left" />
  </div>
);

const NextArrow = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => (
  <div className="blog-carousel-next" onClick={onClick}>
    <i className="fa fa-chevron-right" />
  </div>
);

const BlogDetails = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Blog Details"
          paths={[{ label: "Blog Details", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row blog-details-cover">
              <div className="col-lg-10 mx-auto">
                <Link
                  to={all_routes.blogGrid}
                  className="d-flex align-items-center mb-4"
                >
                  <i className="material-icons-outlined me-1">arrow_back</i>Back
                  to Blog
                </Link>
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="blog-details-item-01">
                      <div className="blog-details-img-01">
                        <ImageWithBasePath
                          src="assets/img/blogs/blog-img-17.jpg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                      <div className="blog-details-content-01">
                        <span className="badge badge-sm bg-secondary fw-semibold">
                          Vila
                        </span>
                        <h5>Top 10 Tips for First-Time Homebuyers</h5>
                        <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 author-details">
                          <div className="d-flex align-items-center me-3">
                            <Link to={all_routes.agentDetails}>
                              <ImageWithBasePath
                                src="assets/img/agents/agent-02.jpg"
                                alt="image"
                                className="avatar avatar-sm rounded-circle me-2"
                              />
                            </Link>
                            <Link to={all_routes.agentDetails}>
                              Cecilia New
                            </Link>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="d-inline-flex align-items-center">
                              <i className="material-icons-outlined me-1">
                                event
                              </i>
                              15 Nov 2025
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p>
                        If you’re living alone or mostly by yourself and seeking
                        ways to enrich your daily life, community living could
                        be the answer. Especially for elderly people, residing
                        among peers offers the perfect balance of independence
                        and support—close enough to friends and family to feel
                        connected, yet private enough to maintain personal
                        space. Let’s explore why community living is so
                        important for seniors:
                      </p>
                    </div>
                    <div>
                      <h5 className="mb-4">There’s no place like home:</h5>
                      {/* start row */}
                      <div className="row row-gap-3 mb-3">
                        <div className="col-md-6 col-lg-3">
                          <ImageWithBasePath
                            src="assets/img/blogs/blog-img-18.jpg"
                            alt="img"
                            className="img-fluid w-100 rounded"
                          />
                        </div>
                        {/* end col */}
                        <div className="col-md-6 col-lg-3">
                          <ImageWithBasePath
                            src="assets/img/blogs/blog-img-19.jpg"
                            alt="img"
                            className="img-fluid w-100 rounded"
                          />
                        </div>
                        {/* end col */}
                        <div className="col-md-6 col-lg-3">
                          <ImageWithBasePath
                            src="assets/img/blogs/blog-img-20.jpg"
                            alt="img"
                            className="img-fluid w-100 rounded"
                          />
                        </div>
                        {/* end col */}
                        <div className="col-md-6 col-lg-3">
                          <ImageWithBasePath
                            src="assets/img/blogs/blog-img-21.jpg"
                            alt="img"
                            className="img-fluid w-100 rounded"
                          />
                        </div>
                        {/* end col */}
                      </div>
                      {/* end row */}
                      <div className="p-2">
                        <p>
                          “Home is where comfort and connection come together—a
                          sanctuary filled with the laughter of friends, the
                          warmth of family, and the peace of knowing you’re
                          cared for. For seniors, that sense of belonging is
                          more than sentimental; it’s essential. As
                          responsibilities shift with age, having a supportive
                          network at home becomes critical. Community living
                          extends the concept of “home” beyond four walls:
                        </p>
                        <p>
                          it weaves a safety net of neighbors who look out for
                          one another, offers shared activities that spark joy,
                          and creates spontaneous moments of
                          companionship—morning coffee chats, group walks in the
                          garden, or an impromptu card game in the common room.
                          These daily interactions nourish mental and emotional
                          health just as much as the physical assistance
                          available on-site.
                        </p>
                        <p>
                          In a community setting, help is never far away,
                          whether it’s a friendly face bringing in the mail, a
                          neighbor reminding you of your afternoon appointment,
                          or staff responding promptly in an emergency. This
                          blend of independence and interdependence ensures that
                          seniors can continue making memories—confident that
                          support, care, and camaraderie are always within
                          reach.”
                        </p>
                      </div>
                      <div className="card border-0 border-start border-3 border-primary bg-light mb-4">
                        <div className="card-body">
                          <div className="row align-items-center row-gap-2">
                            <div className="col-lg-2">
                              <ImageWithBasePath
                                src="assets/img/users/user-03.jpg"
                                alt="img"
                                className="img-fluid avatar avatar-xxxl rounded-circle"
                              />
                            </div>
                            <div className="col-lg-10">
                              <p className="fw-medium mb-1 text-primary">
                                Author
                              </p>
                              <h5>Robert Hollenbeck</h5>
                              <p className="mb-0">
                                At Dreams Estate, we believe a true dream home
                                goes beyond beautiful walls — it nurtures your
                                mind, heart, and spirit.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card shadow-none mb-0">
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <h6 className="mb-0">Was this article helpful?</h6>
                            <p className="mb-0">
                              18 out of 93 found this helpful
                            </p>
                            <div className="d-flex align-items-center">
                              <Link
                                to="#"
                                className="btn btn-sm btn-white d-inline-flex align-items-center me-2"
                              >
                                <i className="material-icons-outlined me-1">
                                  thumb_up
                                </i>
                                Yes
                              </Link>
                              <Link
                                to="#"
                                className="btn btn-sm btn-white d-inline-flex align-items-center"
                              >
                                <i className="material-icons-outlined me-1">
                                  thumb_down
                                </i>
                                No
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
            </div>
            {/* end row */}
            <div className="blog-details-item-02">
              <h5>Related Post</h5>
              <div className="blog-carousel-wrapper">
                <Slider {...settings} className="blog-carousel">
                  <div>
                    <div className="blog-item-01">
                      <div className="blog-img">
                        <Link to={all_routes.blogDetails}>
                          <ImageWithBasePath
                            src="assets/img/blogs/blog-img-08.jpg"
                            alt="img"
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="blog-content">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                          <span className="badge badge-sm bg-secondary fw-semibold">
                            Property
                          </span>
                          <div className="d-flex align-items-center flex-wrap gap-3 author-details">
                            <div className="d-flex align-items-center me-3">
                              <Link to={all_routes.agentDetails}>
                                <ImageWithBasePath
                                  src="assets/img/agents/agent-02.jpg"
                                  alt="image"
                                  className="avatar avatar-sm rounded-circle me-2"
                                />
                              </Link>
                              <Link to={all_routes.agentDetails}>Richard</Link>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="d-inline-flex align-items-center">
                                <i className="material-icons-outlined me-1">
                                  event
                                </i>
                                12 Jun 2025
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.blogDetails}>
                              Maintenance Affects ROI
                            </Link>
                          </h5>
                          <p className="mb-0">
                            Regular upkeep not only preserves property value but
                            also attracts better tenants or buyers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="blog-item-01">
                      <div className="blog-img">
                        <Link to={all_routes.blogDetails}>
                          <ImageWithBasePath
                            src="assets/img/blogs/blog-img-09.jpg"
                            alt="img"
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="blog-content">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                          <span className="badge badge-sm bg-secondary fw-semibold">
                            House
                          </span>
                          <div className="d-flex align-items-center flex-wrap gap-3 author-details">
                            <div className="d-flex align-items-center me-3">
                              <Link to={all_routes.agentDetails}>
                                <ImageWithBasePath
                                  src="assets/img/agents/agent-04.jpg"
                                  alt="image"
                                  className="avatar avatar-sm rounded-circle me-2"
                                />
                              </Link>
                              <Link to={all_routes.agentDetails}>
                                Sara Porter
                              </Link>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="d-inline-flex align-items-center">
                                <i className="material-icons-outlined me-1">
                                  event
                                </i>
                                01 Jun 2025
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.blogDetails}>
                              Real Estate is Local
                            </Link>
                          </h5>
                          <p className="mb-0">
                            Every market is different. What works in one city
                            might not in another, so do local research.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="blog-item-01">
                      <div className="blog-img">
                        <Link to={all_routes.blogDetails}>
                          <ImageWithBasePath
                            src="assets/img/blogs/blog-img-07.jpg"
                            alt="img"
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="blog-content">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                          <span className="badge badge-sm bg-secondary fw-semibold">
                            Duplex
                          </span>
                          <div className="d-flex align-items-center flex-wrap gap-3 author-details">
                            <div className="d-flex align-items-center me-3">
                              <Link to={all_routes.agentDetails}>
                                <ImageWithBasePath
                                  src="assets/img/agents/agent-05.jpg"
                                  alt="image"
                                  className="avatar avatar-sm rounded-circle me-2"
                                />
                              </Link>
                              <Link to={all_routes.agentDetails}>
                                Jason Rose
                              </Link>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="d-inline-flex align-items-center">
                                <i className="material-icons-outlined me-1">
                                  event
                                </i>
                                28 Jun 2025
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.blogDetails}>
                              {" "}
                              Legal Due Diligence is a Must
                            </Link>
                          </h5>
                          <p className="mb-0">
                            Before buying, always check the legal title, land
                            use approvals, and potential disputes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="blog-item-01">
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
                            Property
                          </span>
                          <div className="d-flex align-items-center flex-wrap gap-3 author-details">
                            <div className="d-flex align-items-center me-3">
                              <Link to={all_routes.agentDetails}>
                                <ImageWithBasePath
                                  src="assets/img/agents/agent-01.jpg"
                                  alt="image"
                                  className="avatar avatar-sm rounded-circle me-2"
                                />
                              </Link>
                              <Link to={all_routes.agentDetails}>
                                Susan Cul
                              </Link>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="d-inline-flex align-items-center">
                                <i className="material-icons-outlined me-1">
                                  event
                                </i>
                                10 Apr 2025
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.blogDetails}>
                              Location is Everything
                            </Link>
                          </h5>
                          <p className="mb-0">
                            The value of a property largely depends on where
                            it’s located.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="blog-item-01">
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
                            Vila
                          </span>
                          <div className="d-flex align-items-center flex-wrap gap-3 author-details">
                            <div className="d-flex align-items-center me-3">
                              <Link to={all_routes.agentDetails}>
                                <ImageWithBasePath
                                  src="assets/img/agents/agent-04.jpg"
                                  alt="image"
                                  className="avatar avatar-sm rounded-circle me-2"
                                />
                              </Link>
                              <Link to={all_routes.agentDetails}>
                                Shelly Cox
                              </Link>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="d-inline-flex align-items-center">
                                <i className="material-icons-outlined me-1">
                                  event
                                </i>
                                24 Apr 2025
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.blogDetails}>
                              Real Estate is a Long-Term Investment
                            </Link>
                          </h5>
                          <p className="mb-0">
                            Unlike stocks, real estate usually grows in value
                            over time.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>
        {/* End Content */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default BlogDetails;
