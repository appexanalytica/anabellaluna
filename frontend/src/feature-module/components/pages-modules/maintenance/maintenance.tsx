import { Link } from "react-router"
import ImageWithBasePath from "../../../../core/imageWithBasePath"
import { all_routes } from "../../../routes/all_routes"


const Maintenance = () => {
  return (
   <>
  {/* Start Content */}
  <div className="container-fuild bg-light">
    <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100 z-1">
      <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
        <div className="col-lg-6">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="error-images mb-4">
              <ImageWithBasePath
                src="assets/img/error/under-maintenance.svg"
                alt="image"
                className="img-fluid"
              />
            </div>
            <div className="text-center">
              <h4 className="mb-2">
                The site is currently down for maintenance
              </h4>
              <p className="text-center mb-4">
                We apologize for any inconveniences caused. We've almost done.
              </p>
              <div className="d-flex align-items-center justify-content-center mb-4">
                <Link
                  to="#"
                  className="btn btn-white rounded-circle p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                >
                  <i className="fa-brands fa-facebook" />
                </Link>
                <Link
                  to="#"
                  className="btn btn-white rounded-circle p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                >
                  <i className="fa-brands fa-x-twitter" />
                </Link>
                <Link
                  to="#"
                  className="btn btn-white rounded-circle p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                >
                  <i className="fa-brands fa-instagram" />
                </Link>
                <Link
                  to="#"
                  className="btn btn-white rounded-circle p-2 d-inline-flex align-items-center justify-content-end border-0 me-2"
                >
                  <i className="fa-brands fa-linkedin" />
                </Link>
                <Link
                  to="#"
                  className="btn btn-white rounded-circle p-2 d-inline-flex align-items-center justify-content-end border-0"
                >
                  <i className="fa-brands fa-pinterest" />
                </Link>
              </div>
              <div className="d-flex justify-content-center">
                <Link
                  to={all_routes.index}
                  className="btn btn-dark d-flex align-items-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* End Content */}
</>

  )
}

export default Maintenance