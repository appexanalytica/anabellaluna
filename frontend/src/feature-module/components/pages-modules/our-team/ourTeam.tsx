import { Link } from "react-router";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../core/imageWithBasePath";

const OurTeam = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb title="Team" paths={[{ label: "Team", active: true }]} />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row row-gap-4">
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-01.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Seth Franklin
                      </Link>
                      <p className="mb-4">CEO</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-02.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Carol Currie
                      </Link>
                      <p className="mb-4">Marketing Head</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-04.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Daniel Moreno
                      </Link>
                      <p className="mb-4">Marketing Head</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-03.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Linda Martin
                      </Link>
                      <p className="mb-4">Developer</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-05.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Bonnie Scott
                      </Link>
                      <p className="mb-4">CEO</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-07.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Jacquelin Maldonado
                      </Link>
                      <p className="mb-4">Marketing Head</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-13.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Peggy Smith
                      </Link>
                      <p className="mb-4">Marketing Head</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-15.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Mary Oliver
                      </Link>
                      <p className="mb-4">Developer</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-14.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Nicholas Massey
                      </Link>
                      <p className="mb-4">CEO</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-17.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Katherine Marker
                      </Link>
                      <p className="mb-4">Marketing Head</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-18.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Kevin kent
                      </Link>
                      <p className="mb-4">Marketing Head</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="text-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-12.jpg"
                          alt="img"
                          className="avatar avatar-xl rounded-circle mb-4"
                        />
                      </Link>
                      <Link
                        to="#"
                        className="fw-semibold d-block"
                      >
                        Richard Pearson
                      </Link>
                      <p className="mb-4">Developer</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-light rounded-2 p-2 d-inline-flex align-items-center justify-content-end border-0"
                        >
                          <i className="fa-brands fa-pinterest" />
                        </Link>
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

export default OurTeam;
