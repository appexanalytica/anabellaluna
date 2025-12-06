import { Link } from "react-router"
import { all_routes } from "../../../routes/all_routes"
import ImageWithBasePath from "../../../../core/imageWithBasePath"

const Error404 = () => {
  return (
    <>
  {/* Start Content */}
  <div className="container-fuild">
    <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100 z-1">
      <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
        <div className="col-lg-6">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="error-images mb-4">
              <ImageWithBasePath
                src="assets/img/error/error-404.svg"
                alt="image"
                className="img-fluid"
              />
            </div>
            <div className="text-center">
              <h4 className="mb-2">Oops! Page Not Found!</h4>
              <p className="text-center">
                The page you requested was not found.
              </p>
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

export default Error404