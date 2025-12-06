import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";

const TermsCondition = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Terms & Conditions"
          paths={[{ label: "Terms & Conditions", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-12">
                <h6 className="mb-3">Introduction</h6>
                <p className="mb-3">
                  Welcome to Dreams Estate. By accessing or using our
                  platform—whether via web, mobile, or any other interface—you
                  acknowledge that you have read, understood, and agree to be
                  bound by these terms and conditions (“Terms”), our Privacy
                  Policy, and any other policies or guidelines that we publish.
                </p>
                <h6 className="mb-3">Acceptance of Terms</h6>
                <p className="mb-3">
                  By accessing or using the estate property located at [Estate
                  Address], you agree to comply with and be bound by these Terms
                  and Conditions. If you do not agree to these terms, you may
                  not use the estate.
                </p>
                <h6 className="mb-3">Booking and Payment</h6>
                <ul className="list-styled mb-3">
                  <li className="mb-2">
                    Reservations must be confirmed with a signed agreement and a
                    non-refundable deposit of [percentage]% of the total cost.
                  </li>
                  <li className="mb-2">
                    The balance must be paid in full by [number] days before the
                    event or stay.
                  </li>
                  <li className="mb-0">
                    Payment methods accepted: [e.g., bank transfer, credit card,
                    PayPal].
                  </li>
                </ul>
                <h6 className="mb-3">Use of Property</h6>
                <ul className="list-styled mb-3">
                  <li className="mb-2">
                    The estate is to be used for [type of use, e.g., private
                    events, short-term stays, residential lease] only.
                  </li>
                  <li className="mb-2">
                    Maximum occupancy is [number of guests/residents] unless
                    otherwise agreed in writing.
                  </li>
                  <li className="mb-0">
                    No commercial activity may take place on the property
                    without prior written approval.
                  </li>
                </ul>
                <h6 className="mb-3">Rules and Conduct</h6>
                <ul className="list-styled mb-3">
                  <li className="mb-2">No smoking inside the buildings.</li>
                  <li className="mb-2">
                    No pets allowed unless prior permission is granted.
                  </li>
                  <li className="mb-0">
                    The client is responsible for the conduct of all guests and
                    any damage caused.
                  </li>
                </ul>
                <h6 className="mb-3">Damages and Liability</h6>
                <ul className="list-styled mb-3">
                  <li className="mb-2">
                    Any damages to the property or its contents will be charged
                    to the client.
                  </li>
                  <li className="mb-0">
                    The estate owner is not liable for injury, loss, or damage
                    to personal property during your stay or event.
                  </li>
                </ul>
                <h6 className="mb-3">Cancellations and Refunds</h6>
                <ul className="list-styled mb-3">
                  <li className="mb-2">
                    Cancellations made 02 days before the reservation date will
                    receive a [percentage]% refund, excluding the deposit.
                  </li>
                  <li className="mb-0">
                    No refunds will be issued for cancellations within [number]
                    days of the reservation date.
                  </li>
                </ul>
                <h6 className="mb-3">Force Majeure</h6>
                <p className="mb-3">
                  The estate shall not be liable for any failure to perform due
                  to causes beyond its reasonable control, including natural
                  disasters, government restrictions, or pandemics.
                </p>
                <h6 className="mb-3">Insurance</h6>
                <p className="mb-3">
                  It is recommended that clients obtain event or rental
                  insurance to cover unexpected incidents.
                </p>
                <h6 className="mb-3">Governing Law</h6>
                <p className="mb-0">
                  These terms and conditions shall be governed by and
                  interpreted according to the laws of London.
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

export default TermsCondition;
