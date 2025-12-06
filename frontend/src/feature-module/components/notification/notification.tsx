import { Link } from "react-router";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/imageWithBasePath";

const Notification = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Notifications"
          paths={[{ label: "Notifications", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-12 mx-auto">
                <div className="notification-header">
                  <div className="notication-title">
                    <h2 className="mb-0">Notifications</h2>
                    <p className="mb-0">
                      Improve the way your work, discover a brand new tool and
                      drop the hassle once and for all.
                    </p>
                  </div>
                  <ul>
                    <li className="mb-0">
                      <Link to="#" className="btn mark-all-btn">
                        <span className="material-icons-outlined">
                          check_box
                        </span>
                        Mark All as Read
                      </Link>
                    </li>
                    <li className="mb-0">
                      <Link to="#" className="btn delete-all-btn">
                        <span className="material-icons-outlined">delete</span>
                        Delete all
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="notication-list">
                  <div className="mb-4">
                    <h6 className="mb-3">Today</h6>
                    <div className="notication-item">
                      <div className="row align-items-center">
                        <div className="col-lg-9">
                          <div className="notication-content">
                            <span>
                              <ImageWithBasePath
                                src="assets/img/users/user-01.jpg"
                                className="img-fluid"
                                alt="img"
                              />
                            </span>
                            <div className="notication-info">
                              <div>
                                <p className="me-0">
                                  <span className="text-dark fw-semibold me-1">
                                    Thompson Hicks
                                  </span>
                                  your current lease will expire in 30 days.
                                  Renew early to secure your stay.
                                </p>
                                <p className="notify-time">05 mins ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="d-lg-flex align-items-center justify-content-end">
                            <div className="notification-btn me-3">
                              <Link to="#" className="btn delete-btn">
                                <span className="material-icons-outlined">
                                  delete
                                </span>
                                Delete
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="notication-item">
                      <div className="row align-items-center">
                        <div className="col-lg-9">
                          <div className="notication-content">
                            <span>
                              <ImageWithBasePath
                                src="assets/img/users/user-02.jpg"
                                className="img-fluid"
                                alt="img"
                              />
                            </span>
                            <div className="notication-info">
                              <div>
                                <p className="me-0">
                                  <span className="text-dark fw-semibold me-1">
                                    Jennifer Tovar
                                  </span>
                                  notifications alert you to new messages in
                                  your estates inbox.
                                </p>
                                <p className="notify-time">10 mins ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="d-lg-flex align-items-center justify-content-end">
                            <div className="notification-btn me-3">
                              <Link to="#" className="btn delete-btn">
                                <span className="material-icons-outlined">
                                  delete
                                </span>
                                Delete
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-0">
                    <h6 className="mb-3">Yesterday</h6>
                    <div className="notication-item">
                      <div className="row align-items-center">
                        <div className="col-lg-9">
                          <div className="notication-content">
                            <span>
                              <ImageWithBasePath
                                src="assets/img/users/user-06.jpg"
                                className="img-fluid"
                                alt="img"
                              />
                            </span>
                            <div className="notication-info">
                              <div>
                                <p className="me-0">
                                  <span className="text-dark fw-semibold me-1">
                                    James Schulte
                                  </span>
                                  Your profile information has been updated
                                  successfully.
                                </p>
                                <p className="notify-time">20 Dec 2024</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="d-lg-flex align-items-center justify-content-end">
                            <div className="notification-btn me-3">
                              <Link to="#" className="btn delete-btn">
                                <span className="material-icons-outlined">
                                  delete
                                </span>
                                Delete
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="notication-item">
                      <div className="row align-items-center">
                        <div className="col-lg-9">
                          <div className="notication-content">
                            <span>
                              <ImageWithBasePath
                                src="assets/img/users/user-04.jpg"
                                className="img-fluid"
                                alt="img"
                              />
                            </span>
                            <div className="notication-info">
                              <div>
                                <p className="me-0">
                                  You have a new message from{" "}
                                  <span className="text-dark fw-semibold me-1">
                                    William Aragon
                                  </span>
                                  regarding payment issue
                                </p>
                                <p className="notify-time">20 Dec 2024</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="d-lg-flex align-items-center justify-content-end">
                            <div className="notification-btn me-3">
                              <Link to="#" className="btn delete-btn">
                                <span className="material-icons-outlined">
                                  delete
                                </span>
                                Delete
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="notication-item">
                      <div className="row align-items-center">
                        <div className="col-lg-9">
                          <div className="notication-content">
                            <span>
                              <ImageWithBasePath
                                src="assets/img/users/user-05.jpg"
                                className="img-fluid"
                                alt="img"
                              />
                            </span>
                            <div className="notication-info">
                              <div>
                                <p className="me-0">
                                  <span className="text-dark fw-semibold me-1">
                                    Shirley Lis
                                  </span>
                                  Payment attempt failed. Please verify your
                                  details and try again.
                                </p>
                                <p className="notify-time">20 Dec 2024</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="d-lg-flex align-items-center justify-content-end">
                            <div className="notification-btn me-3">
                              <Link to="#" className="btn delete-btn">
                                <span className="material-icons-outlined">
                                  delete
                                </span>
                                Delete
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

export default Notification;
