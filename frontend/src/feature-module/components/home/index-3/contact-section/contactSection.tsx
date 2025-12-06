import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const ContactSection = () => {
  return (
    <>
      {/* Contact Field Start */}
      <div className="contact-field-section">
        <div className="container">
          <div className="contact-field">
            <div>
              <ImageWithBasePath
                src="assets/img/home-3/bg/sec-bg-08.png"
                className="bg-1"
                alt="image"
              />
            </div>
            {/* start row */}
            <div className="row align-items-center justify-content-lg-between gy-4">
              <div className="col-lg-5">
                <div>
                  <h2 className="text-white mb-2">Let's Stay in Touch</h2>
                  <p className="text-white">
                    Receive news, stay updated, and special offers
                  </p>
                </div>
              </div>
              {/* end col */}
              <div className="col-lg-5">
                <form action="#">
                  <div className="d-flex align-items-center email-forms">
                    <div className="contact-box align-items-center justify-content-center flex-fill">
                      <span className="input-icon d-inline-flex align-items-center">
                        <i className="material-icons-outlined">email</i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email Address"
                      />
                    </div>
                    <button type="submit">
                      <i className="material-icons-outlined">send</i>
                    </button>
                  </div>
                </form>
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
        </div>
      </div>
      {/* Contact Field End */}
    </>
  );
};

export default ContactSection;
