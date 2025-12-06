import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import { useTranslation } from "react-i18next";

const ForgorPassword = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Start Content */}
      <div className="container-fuild position-relative z-1">
        <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100 sign-">
          {/* start row */}
          <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap py-3">
            <div className="col-md-8 col-lg-6 col-xl-4 mx-auto">
              <div className="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill">
                <div className=" mx-auto mb-4 text-center">
                  <ImageWithBasePath
                    src="assets/img/logo.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </div>
                <div>
                  <div className="login-item-01">
                    <h4>{t("Forgot Password")}</h4>
                    <div className="mb-4">
                      <label className="form-label">
                        {t("Email")}<span className="text-danger ms-1">*</span>
                      </label>
                      <div className="form-cover">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("Enter your email")}
                        />
                        <i className="material-icons-outlined">mail</i>
                      </div>
                    </div>
                    <div className="mb-3">
                      <Link
                        to={all_routes.resetPassword}
                        className="btn btn-lg bg-primary text-white w-100"
                      >
                        {t("Reset Password")}
                      </Link>
                    </div>
                    <div className="text-center">
                      <h6 className="fw-normal fs-14 text-dark mb-0">
                        {t("Return to")} {" "}
                        <Link to={all_routes.signin} className="register-btn">
                          {" "}
                          {t("Sign In")} {" "}
                        </Link>
                      </h6>
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
    </>
  );
};

export default ForgorPassword;
