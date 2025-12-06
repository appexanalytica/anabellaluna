import { Link } from "react-router";
import StickyBox from "react-sticky-box";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import { Apartment } from "../../../../../core/common/selectOption";
import { useTranslation } from "react-i18next";

const AgentSidebar = () => {
  const { t } = useTranslation();
  return (
    <StickyBox offsetTop={80} offsetBottom={20}>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">{t("agentDetails.sidebar.enquiryTitle")}</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={t("agentDetails.sidebar.namePlaceholder")}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={t("agentDetails.sidebar.emailPlaceholder")}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={t("agentDetails.sidebar.phonePlaceholder")}
            />
          </div>
          <div className="mb-3">
            <CommonSelect
              options={Apartment}
              className="select"
              defaultValue={Apartment[0]}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={3}
              placeholder={t("agentDetails.sidebar.messagePlaceholder")}
              defaultValue={""}
            />
          </div>
          <div>
            <Link to="#" className="btn btn-dark w-100">
              {t("agentDetails.sidebar.sendEmail")}
            </Link>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">{t("agentDetails.sidebar.contactTitle")}</h5>
        </div>
        <div className="card-body">
          <ul className="contacts-list">
            <li>
              <span>
                <i className="material-icons-outlined">phone</i>
              </span>
              {t("agentDetails.sidebar.callUs")}: +1 12545 45548
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">phone_android</i>
              </span>
              {t("agentDetails.sidebar.mobile")}: +1 52874 15879
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">phone</i>
              </span>
              {t("agentDetails.sidebar.fax")}: 4587921057
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">language</i>
              </span>
              {t("agentDetails.sidebar.website")}: example.com
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">alternate_email</i>
              </span>
              {t("agentDetails.sidebar.address")}: 7698 Creekwood Blvd
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">email</i>
              </span>
              {t("agentDetails.sidebar.email")}: info@example.com
            </li>
          </ul>
        </div>
      </div>
      <div className="card mb-0">
        <div className="card-header">
          <h5 className="mb-0">{t("agentDetails.sidebar.shareProperty")}</h5>
        </div>
        <div className="card-body">
          <div className="social-icons">
            <Link to="#">
              <i className="fa-brands fa-x-twitter" />
            </Link>
            <Link to="#">
              <i className="fa-brands fa-facebook" />
            </Link>
            <Link to="#">
              <i className="fa-brands fa-instagram" />
            </Link>
            <Link to="#">
              <i className="fa-brands fa-linkedin" />
            </Link>
            <Link to="#">
              <i className="fa-brands fa-pinterest" />
            </Link>
          </div>
        </div>
      </div>
    </StickyBox>
  );
};

export default AgentSidebar;
