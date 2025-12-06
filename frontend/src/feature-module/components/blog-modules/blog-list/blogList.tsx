import { Link } from "react-router";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { all_routes } from "../../../routes/all_routes";
import ImageWithBasePath from "../../../../core/imageWithBasePath";

const BlogList = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Blog List"
          paths={[{ label: "Blog List", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row row-gap-4">
              <div className="col-md-12 col-lg-8">
                <div className="blog-item-01 mb-4">
                  <div className="blog-img">
                    <Link to={all_routes.blogDetails}>
                      <ImageWithBasePath
                        src="assets/img/blogs/blog-img-10.jpg"
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
                            Maria Ramirez
                          </Link>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              events
                            </i>
                            27 Sep 2025
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        <Link to={all_routes.blogDetails}>
                          The most popular cities for homebuyers
                        </Link>
                      </h5>
                      <p className="mb-0">
                        The majority have, although there are many other lorem
                        ipsum passages available.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="blog-item-01 mb-4">
                  <div className="blog-img">
                    <Link to={all_routes.blogDetails}>
                      <ImageWithBasePath
                        src="assets/img/blogs/blog-img-11.jpg"
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
                          <Link to={all_routes.agentDetails}>Laura Mincey</Link>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              events
                            </i>
                            20 Oct 2025
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        <Link to={all_routes.blogDetails}>
                          How to become financially independent
                        </Link>
                      </h5>
                      <p className="mb-0">
                        Quia omnis velit. Cupiditate et perspiciatis. Asperiores
                        dolor magnam fuga voluptatum beatae.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="blog-item-01">
                  <div className="blog-img">
                    <Link to={all_routes.blogDetails}>
                      <ImageWithBasePath
                        src="assets/img/blogs/blog-img-12.jpg"
                        alt="img"
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                      <span className="badge badge-sm bg-secondary fw-semibold">
                        Guest House
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
                          <Link to={all_routes.agentDetails}>
                            Cecilia Newsome
                          </Link>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              events
                            </i>
                            15 Nov 2025
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        <Link to={all_routes.blogDetails}>
                          Discover how our future is actually shaped by real
                          estate.
                        </Link>
                      </h5>
                      <p className="mb-0">
                        Although there are numerous types of lorem ipsum
                        passages accessible, most of them contain...
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-dark d-inline-flex align-items-center load-more-btn"
                  >
                    <i className="material-icons-outlined me-1">autorenew</i>
                    Load More
                  </Link>
                </div>
              </div>
              {/* end col */}
              <div className="col-lg-4 theiaStickySidebar">
                <div className="card">
                  <div className="card-header">
                    <h4 className="mb-0">Filter</h4>
                  </div>
                  <div className="card-body">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
                <div className="card">
                  <div className="card-header">
                    <h4 className="mb-0">Categories</h4>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                      <Link to="#" className="link-body">
                        Property
                      </Link>
                      <p>15</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                      <Link to="#" className="link-body">
                        Vila
                      </Link>
                      <p>22</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                      <Link to="#" className="link-body">
                        House
                      </Link>
                      <p>14</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                      <Link to="#" className="link-body">
                        Guest House
                      </Link>
                      <p>14</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                      <Link to="#" className="link-body">
                        Factory
                      </Link>
                      <p>74</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-0">
                      <Link to="#" className="mb-0 link-body">
                        Godown
                      </Link>
                      <p className="mb-0">75</p>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
                <div className="card mb-0">
                  <div className="card-header">
                    <h4 className="mb-0">Top Article</h4>
                  </div>
                  <div className="card-body">
                    <div className="blog-item-02 mb-3">
                      <div className="blog-img-img">
                        <ImageWithBasePath
                          src="assets/img/blogs/blog-img-13.jpg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                      <div className="blog-content-02">
                        <h5>
                          <Link to={all_routes.blogDetails}>
                            Great Business Tips in 2025
                          </Link>
                        </h5>
                        <p>27 Sep 2025</p>
                      </div>
                    </div>
                    <div className="blog-item-02 mb-3">
                      <div className="blog-img-img">
                        <ImageWithBasePath
                          src="assets/img/blogs/blog-img-14.jpg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                      <div className="blog-content-02">
                        <h5>
                          <Link to={all_routes.blogDetails}>
                            8 Amazing Tricks About Build...
                          </Link>
                        </h5>
                        <p>05 Oct 2025</p>
                      </div>
                    </div>
                    <div className="blog-item-02 mb-3">
                      <div className="blog-img-img">
                        <ImageWithBasePath
                          src="assets/img/blogs/blog-img-15.jpg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                      <div className="blog-content-02">
                        <h5>
                          <Link to={all_routes.blogDetails}>
                            Excited News About Buildings.
                          </Link>{" "}
                        </h5>
                        <p>27 Sep 2025</p>
                      </div>
                    </div>
                    <div className="blog-item-02">
                      <div className="blog-img-img">
                        <ImageWithBasePath
                          src="assets/img/blogs/blog-img-16.jpg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                      <div className="blog-content-02">
                        <h5>
                          <Link to={all_routes.blogDetails}>
                            City for homebuyers.
                          </Link>
                        </h5>
                        <p>10 Dec 2025</p>
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

export default BlogList;
