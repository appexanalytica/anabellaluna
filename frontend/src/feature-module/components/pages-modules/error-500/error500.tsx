import { Link } from "react-router";
import { all_routes } from "../../../routes/all_routes";
import ImageWithBasePath from "../../../../core/imageWithBasePath";

const Error500 = () => {
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
                    src="assets/img/error/error-500.svg"
                    alt="image"
                    className="img-fluid"
                  />
                </div>
                <div className="text-center">
                  <h4 className="mb-2">500 Unexpected Error</h4>
                  <p className="text-center">
                    We’re having some issues at the moment. we’ll have it fixed
                    in no time.
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
  );
};

export default Error500;
