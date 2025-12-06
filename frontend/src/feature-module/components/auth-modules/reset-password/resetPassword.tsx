import { Link } from "react-router";
import { all_routes } from "../../../routes/all_routes";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type PasswordField = "password" | "confirmPassword";
const ResetPassword = () => {
  const { t } = useTranslation();
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
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
                  <img
                    src="assets/img/logo.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </div>
                <div>
                  <div className="login-item-01">
                    <h4>{t("Reset Password")}</h4>
                    <div className="mb-3">
                      <label className="form-label">
                        {t("Password")}<span className="text-danger ms-1">*</span>
                      </label>
                      <div className="position-relative form-cover password">
                        <input
                          type={
                            passwordVisibility.password ? "text" : "password"
                          }
                          className="pass-input form-control"
                        />
                        <i className="material-icons-outlined">lock</i>
                        <span
                          className={`fas toggle-password text-dark fs-12 ${
                            passwordVisibility.password
                              ? "fa-eye"
                              : "fa-eye-slash"
                          }`}
                          onClick={() => togglePasswordVisibility("password")}
                        ></span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        {t("Confirm Password")} 
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <div className="position-relative form-cover password">
                        <input
                          type={
                            passwordVisibility.confirmPassword
                              ? "text"
                              : "Password"
                          }
                          className="pass-input form-control"
                        />
                        <i className="material-icons-outlined">lock</i>
                        <span
                          className={`fas toggle-password text-dark fs-12 ${
                            passwordVisibility.confirmPassword
                              ? "fa-eye"
                              : "fa-eye-slash"
                          }`}
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                        ></span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-4">
                      <div className="d-flex align-items-center">
                        <div className="form-check form-check-md mb-0">
                          <input
                            className="form-check-input"
                            id="remember_me"
                            type="checkbox"
                          />
                          <label htmlFor="remember_me" className="mt-0">
                            {t("Remember Me")}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <Link
                        to={all_routes.signin}
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

export default ResetPassword;
