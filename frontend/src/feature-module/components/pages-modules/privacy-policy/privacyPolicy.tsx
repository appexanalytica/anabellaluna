import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";

const PrivacyPolicy = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Privacy Policy"
          paths={[{ label: "Privacy Policy", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-12">
                <p className="mb-3">
                  At Dreams Estate, we are committed to protecting your privacy.
                  This policy outlines how we handle your information:
                </p>
                <h6 className="mb-3">Introduction</h6>
                <p>
                  Dreams Estate our operates the Dreams Estate platform the
                  Service, which enables users to browse, book, and manage
                  estate properties. We’re committed to protecting your privacy
                  and handling your personal information with care.
                </p>
                <h6 className="mb-3">Acceptance of Terms</h6>
                <p>
                  By accessing or using the Dreams Estate platform—including our
                  website, mobile applications, APIs, and any other services we
                  provide—you (“you,” “User,” or “Guest”) acknowledge and agree
                  that you have read, understood, and accept these Terms and
                  Conditions (“Terms”), our Privacy Policy, and any other
                  policies or guidelines that we may post from time to time.
                </p>
                <h6 className="mb-3">How We Use Your Information</h6>
                <ul className="list-styled mb-3">
                  <li className="mb-2">
                    Provide &amp; Improve Service: To operate, maintain, and
                    enhance the Dreams Estate platform.
                  </li>
                  <li className="mb-2">
                    Communications: To send booking confirmations, updates,
                    security alerts, and support messages.
                  </li>
                  <li className="mb-2">
                    Personalization: To tailor search results, recommendations,
                    and marketing communications.
                  </li>
                  <li className="mb-2">
                    Payments &amp; Fraud Prevention: To process payments, verify
                    identities, and detect or prevent fraud.
                  </li>
                  <li>
                    Legal Compliance: To comply with applicable laws,
                    regulations, or legal processes.
                  </li>
                </ul>
                <h6 className="mb-1">Sharing Your Information</h6>
                <p className="mb-3">
                  We do not sell your personal data. We may share information
                  with:
                </p>
                <ul className="list-styled mb-3">
                  <li className="mb-2">
                    Hosts and Property Managers: Booking details necessary to
                    complete a reservation.
                  </li>
                  <li className="mb-2">
                    Service Providers: Payment processors, identity
                    verification, customer support, analytics.
                  </li>
                  <li className="mb-2">
                    Legal Authorities: When required by law or to protect
                    rights, property, or safety.
                  </li>
                  <li>
                    Business Transfers: In connection with a merger,
                    acquisition, or sale of assets, with notice to you.
                  </li>
                </ul>
                <h6 className="mb-3">Your Choices</h6>
                <ul className="list-styled mb-3">
                  <li className="mb-2">
                    Access &amp; Correction: You can access or update your
                    account information at any time via your profile settings.
                  </li>
                  <li className="mb-2">
                    Cookies: You may set your browser to refuse cookies or alert
                    you when cookies are being sent.
                  </li>
                  <li className="mb-2">
                    Promotional Communications: You can opt out of marketing
                    emails by following the unsubscribe link or contacting us.
                  </li>
                </ul>
                <h6 className="mb-3">Data Security</h6>
                <p className="mb-3">
                  We implement reasonable technical and organizational
                  measures—encryption, access controls, and secure servers—to
                  protect your information. However, no method of transmission
                  over the Internet is 100% secure.
                </p>
                <h6 className="mb-3">Data Retention</h6>
                <p className="mb-3">
                  We retain personal information as long as necessary to provide
                  the Service, comply with legal obligations, resolve disputes,
                  and enforce our agreements.
                </p>
                <h6 className="mb-3">International Transfers</h6>
                <p className="mb-3">
                  Your information may be transferred to and maintained on
                  servers located outside your jurisdiction. By using the
                  Service, you consent to such transfers under applicable
                  data-transfer mechanisms.
                </p>
                <h6 className="mb-3">Changes to This Policy</h6>
                <p className="mb-0">
                  We may update this Privacy Policy from time to time. We’ll
                  notify you of material changes by posting the new policy on
                  this page with a new “Last Updated” date.
                </p>
              </div>
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

export default PrivacyPolicy;
