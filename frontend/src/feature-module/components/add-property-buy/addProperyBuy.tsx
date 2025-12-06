import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import Scrollspy from "react-scrollspy";
import {
  Balcony,
  Categories,
  City,
  Country,
  Currency_Type,
  Curtains,
  Embed_Video,
  Property_Type,
  State,
  Structure_Type,
} from "../../../core/common/selectOption";
import CommonSelect from "../../../core/common/common-select/commonSelect";
import { DatePicker } from "antd";
import { all_routes } from "../../routes/all_routes";
import { Link } from "react-router";
import ImageWithBasePath from "../../../core/imageWithBasePath";

const AddProperyBuy = () => {
  return (
    <>
      {/* ========================
		Start Page Content
	========================= */}
      <div className="page-wrapper">
        <Breadcrumb
          title="Add New Property"
          paths={[{ label: "Add New Property", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-xxl-10 col-lg-11 mx-auto">
                <div className="card add-tab-sticky border-0">
                  <div className="card-body">
                    <Scrollspy
                      items={[
                        "add-list-1",
                        "add-list-2",
                        "add-list-3",
                        "add-list-4",
                        "add-list-5",
                        "add-list-6",
                        "add-list-7",
                        "add-list-8",
                        "add-list-9",
                      ]}
                      currentClassName="active"
                      offset={-100}
                      className="add-tab-list"
                    >
                      <li>
                        <Link to="#add-list-1" className="active">
                          Property Information
                        </Link>
                      </li>
                      <li>
                        <Link to="#add-list-2">Property Details</Link>
                      </li>
                      <li>
                        <Link to="#add-list-3">Amenities</Link>
                      </li>
                      <li>
                        <Link to="#add-list-4">Documents</Link>
                      </li>
                      <li>
                        <Link to="#add-list-5">Gallery</Link>
                      </li>
                      <li>
                        <Link to="#add-list-6">Videos</Link>
                      </li>
                      <li>
                        <Link to="#add-list-7">Description</Link>
                      </li>
                      <li>
                        <Link to="#add-list-8">Floor Plans</Link>
                      </li>
                      <li>
                        <Link to="#add-list-9">Location</Link>
                      </li>
                    </Scrollspy>
                  </div>
                </div>
                <form>
                  <div
                    data-bs-spy="scroll"
                    data-bs-target="#list-example"
                    data-bs-offset={0}
                  >
                    <div id="add-list-1">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Property Information</h6>
                            <p className="mb-0">
                              Explore essential details like size, type,
                              pricing, and standout features perfect for
                              comfortable living or smart investment.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body pb-1">
                              {/* start row */}
                              <div className="row">
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Property Name
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Property Type
                                    </label>
                                    <CommonSelect
                                      options={Property_Type}
                                      className="select"
                                      defaultValue={Property_Type[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Property Category
                                    </label>
                                    <CommonSelect
                                      options={Categories}
                                      className="select"
                                      defaultValue={Categories[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Currency Type
                                    </label>
                                    <CommonSelect
                                      options={Currency_Type}
                                      className="select"
                                      defaultValue={Currency_Type[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Sale Price
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Offer Price
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                    <div id="add-list-2">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Property Details</h6>
                            <p className="mb-0">
                              Get key specs including layout, dimensions, and
                              materials that define this property’s quality,
                              structure, and overall design.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body pb-1">
                              {/* start row */}
                              <div className="row">
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Property Id
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Price Per Sqft
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Structure Type
                                    </label>
                                    <CommonSelect
                                      options={Structure_Type}
                                      className="select"
                                      defaultValue={Structure_Type[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      No of Bedrooms
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      No of Bathrooms
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">Sqft</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Parking
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Balcony
                                    </label>
                                    <CommonSelect
                                      options={Balcony}
                                      className="select"
                                      defaultValue={Balcony[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">Floor</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Wardrobe
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">TV</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Water Purifier
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Microwave
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">AC</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">Fridge</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Wardrobe
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Garage Size
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <label className="form-label">
                                    Available From
                                  </label>
                                  <div className="input-group input-group-flat mb-3">
                                    <DatePicker
                                      className="form-control"
                                      suffixIcon={null}
                                    />
                                    <span className="input-group-text border-0">
                                      <i className="material-icons-outlined text-dark">
                                        calendar_today
                                      </i>
                                    </span>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Curtains
                                    </label>
                                    <CommonSelect
                                      options={Curtains}
                                      className="select"
                                      defaultValue={Curtains[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <label className="form-label">
                                    Year Constructed
                                  </label>
                                  <div className="input-group input-group-flat mb-3">
                                    <DatePicker
                                      className="form-control"
                                      suffixIcon={null}
                                    />
                                    <span className="input-group-text border-0">
                                      <i className="material-icons-outlined text-dark">
                                        calendar_today
                                      </i>
                                    </span>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                    <div id="add-list-3">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Amenities</h6>
                            <p className="mb-0">
                              Enjoy premium features like pool, gym, parking,
                              security, and more—all designed for modern,
                              comfortable everyday living.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body pb-1">
                              {/* start row */}
                              <div className="row">
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_1"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_1"
                                    >
                                      Air Conditioning
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_2"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_2"
                                    >
                                      TV Cable
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_3"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_3"
                                    >
                                      Refrigerator
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_4"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_4"
                                    >
                                      Lawn
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_5"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_5"
                                    >
                                      Dryer
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_6"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_6"
                                    >
                                      WiFi
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_7"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_7"
                                    >
                                      Swimming Pool
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_8"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_8"
                                    >
                                      Outdoor Shower
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_9"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_9"
                                    >
                                      Laundry
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_10"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_10"
                                    >
                                      Barbeque
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_11"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_11"
                                    >
                                      Washer
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_12"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_12"
                                    >
                                      Washer
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_13"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_13"
                                    >
                                      Microwave
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_14"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_14"
                                    >
                                      Gym
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_15"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_15"
                                    >
                                      Window Coverings
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_16"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_16"
                                    >
                                      Wide Open Spaces
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_17"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_17"
                                    >
                                      Parks
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_18"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_18"
                                    >
                                      Rooftop Gardens
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_19"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_19"
                                    >
                                      Billiards Table
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_20"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_20"
                                    >
                                      Clubhouse
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_21"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_21"
                                    >
                                      Spa
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_22"
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_22"
                                    >
                                      Walet Trash
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-md-4 col-sm-6">
                                  <div className="form-check d-flex align-items-center ps-0 mb-3">
                                    <input
                                      className="form-check-input ms-0 mt-0"
                                      name="amenities"
                                      type="checkbox"
                                      id="check_23"
                                      defaultChecked
                                    />
                                    <label
                                      className="form-check-label ms-2"
                                      htmlFor="check_23"
                                    >
                                      Sporting Facilities
                                    </label>
                                  </div>
                                </div>{" "}
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                    <div id="add-list-4">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Property Documents</h6>
                            <p className="mb-0">
                              View and Upload all essential legal documents,
                              including title, approvals, and receipts,
                              organized for transparency and convenience.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body">
                              <div className="mb-3">
                                <label className="form-label">
                                  Upload Documents
                                </label>
                                <div className="file-uploader">
                                  <input type="file" className="form-control" />
                                  <Link to="#" className="input-file">
                                    <span className="browse-btn">
                                      Browse Files
                                    </span>
                                    <span className="browse-text">
                                      No Files Selected
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <ul className="ducument-info mb-3">
                                <li>The maximum size is 8 MB. Format: PDF. </li>
                                <li>
                                  Maximum number of files upload will be 5
                                  files.
                                </li>
                              </ul>
                              <p className="text-primary d-inline-flex align-items-center mb-0">
                                <i className="material-icons-outlined me-1">
                                  done_all
                                </i>
                                Document Uploaded Successfully
                              </p>
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                    <div id="add-list-5">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Property Gallery</h6>
                            <p className="mb-0">
                              Browse high-resolution images of interiors and
                              exteriors to get a true feel of the design and
                              atmosphere.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="selected-imgs">
                                  <span className="img-file">
                                    <ImageWithBasePath
                                      src="assets/img/buy/buy-grid-img-05.jpg"
                                      alt="image"
                                    />
                                  </span>
                                  <Link to="#" className="delete-circle">
                                    <i className="material-icons-outlined">
                                      delete
                                    </i>
                                  </Link>
                                </div>
                                <div className="selected-imgs">
                                  <span className="img-file">
                                    <ImageWithBasePath
                                      src="assets/img/buy/buy-grid-img-06.jpg"
                                      alt="image"
                                    />
                                  </span>
                                  <Link to="#" className="delete-circle">
                                    <i className="material-icons-outlined">
                                      delete
                                    </i>
                                  </Link>
                                </div>
                                <div className="selected-imgs">
                                  <span className="img-file">
                                    <ImageWithBasePath
                                      src="assets/img/buy/buy-grid-img-09.jpg"
                                      alt="image"
                                    />
                                  </span>
                                  <Link to="#" className="delete-circle">
                                    <i className="material-icons-outlined">
                                      delete
                                    </i>
                                  </Link>
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Photo</label>
                                <div className="file-uploader">
                                  <input type="file" className="form-control" />
                                  <Link to="#" className="input-file">
                                    <span className="browse-btn">
                                      Browse Files
                                    </span>
                                    <span className="browse-text">
                                      3 Photos Selected
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <ul className="ducument-info mb-3">
                                <li>
                                  The maximum photo size is 8 MB. Formats: jpeg,
                                  jpg,. Put the main picture first
                                </li>
                                <li>
                                  Maximum number of files upload will be 10
                                  files.
                                </li>
                              </ul>
                              <p className="text-primary d-inline-flex align-items-center mb-0">
                                <i className="material-icons-outlined me-1">
                                  done_all
                                </i>
                                Photos Uploaded Successfully
                              </p>
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                    <div id="add-list-6">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Property Video</h6>
                            <p className="mb-0">
                              Watch immersive property videos offering a
                              real-time view of space, flow, lighting, and
                              ambiance from every angle.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body pb-1">
                              {/* start row */}
                              <div className="row">
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Embed Video
                                    </label>
                                    <CommonSelect
                                      options={Embed_Video}
                                      className="select"
                                      defaultValue={Embed_Video[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Video Link
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                    <div id="add-list-7">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Description</h6>
                            <p className="mb-0">
                              A beautifully designed home combining style and
                              function, ideal for modern lifestyles and
                              peaceful, long-term living.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body pb-1">
                              {/* start row */}
                              <div className="row">
                                <div className="col-sm-12">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Description of Property
                                    </label>
                                    <textarea
                                      className="form-control"
                                      rows={3}
                                      defaultValue={""}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                    <div id="add-list-8">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Floor Plans</h6>
                            <p className="mb-0">
                              See detailed floor layouts showing room sizes,
                              flow, and structure to help visualize furniture or
                              future changes.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body">
                              <div className="border-bottom add-floor-list">
                                {/* start row */}
                                <div className="row">
                                  <div className="col-sm-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Property Name
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                      />
                                    </div>
                                  </div>{" "}
                                  {/* end col */}
                                  <div className="col-sm-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Property Type
                                      </label>
                                      <CommonSelect
                                        options={Property_Type}
                                        className="select"
                                        defaultValue={Property_Type[0]}
                                      />
                                    </div>
                                  </div>{" "}
                                  {/* end col */}
                                  <div className="col-sm-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Property Category
                                      </label>
                                      <CommonSelect
                                        options={Categories}
                                        className="select"
                                        defaultValue={Categories[0]}
                                      />
                                    </div>
                                  </div>{" "}
                                  {/* end col */}
                                  <div className="col-sm-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Currency Type
                                      </label>
                                      <CommonSelect
                                        options={Currency_Type}
                                        className="select"
                                        defaultValue={Currency_Type[0]}
                                      />
                                    </div>
                                  </div>{" "}
                                  {/* end col */}
                                  <div className="col-sm-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Sale Price
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                      />
                                    </div>
                                  </div>{" "}
                                  {/* end col */}
                                  <div className="col-sm-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Offer Price
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                      />
                                    </div>
                                  </div>{" "}
                                  {/* end col */}
                                  <div className="col-sm-12">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Description of Property
                                      </label>
                                      <textarea
                                        className="form-control"
                                        rows={3}
                                        defaultValue={"Description"}
                                      />
                                    </div>
                                  </div>{" "}
                                  {/* end col */}
                                  <div className="col-sm-12">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Photo
                                      </label>
                                      <div className="file-uploader">
                                        <input
                                          type="file"
                                          className="form-control"
                                        />
                                        <Link to="#" className="input-file">
                                          <span className="browse-btn">
                                            Browse Files
                                          </span>
                                          <span className="browse-text">
                                            3 Photos Selected
                                          </span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>{" "}
                                  {/* end col */}
                                </div>
                                {/* end row */}
                              </div>
                              <div className="text-end mt-3">
                                <Link
                                  to="#"
                                  className="d-inline-flex align-items-center add-floor-plan-btn text-danger"
                                >
                                  <i className="material-icons-outlined me-2">
                                    add
                                  </i>
                                  Add More
                                </Link>
                              </div>
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                    <div id="add-list-9">
                      {/* start row */}
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-4">
                            <h6 className="mb-1">Property Location</h6>
                            <p className="mb-0">
                              Centrally located near schools, shops, and
                              transport—offering everyday convenience and strong
                              long-term property value.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body">
                              {/* start row */}
                              <div className="row">
                                <div className="col-sm-12">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Address
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Country
                                    </label>
                                    <CommonSelect
                                      options={Country}
                                      className="select"
                                      defaultValue={Country[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">State</label>
                                    <CommonSelect
                                      options={State}
                                      className="select"
                                      defaultValue={State[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">City</label>
                                    <CommonSelect
                                      options={City}
                                      className="select"
                                      defaultValue={City[0]}
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Landmark
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Zipcode
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-sm-12">
                                  <div className="google-map">
                                    <iframe
                                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.8862835683544!2d-73.98256668525309!3d41.93829486962529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd0ee3286615b7%3A0x42bfa96cc2ce4381!2s132%20Kingston%20St%2C%20Kingston%2C%20NY%2012401%2C%20USA!5e0!3m2!1sen!2sin!4v1670922579281!5m2!1sen!2sin"
                                      allowFullScreen
                                      loading="lazy"
                                      referrerPolicy="no-referrer-when-downgrade"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>{" "}
                            {/* end card body */}
                          </div>{" "}
                          {/* end card */}
                        </div>{" "}
                        {/* end col */}
                      </div>
                      {/* end row */}
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-end add-property-btn">
                    <button
                      type="button"
                      className="btn btn-danger btn-lg me-2"
                    >
                      Reset
                    </button>
                    <button className="btn btn-dark btn-lg" type="submit">
                      Add Property
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* End Content */}

        {/* Search Modal */}
        <div
          className="modal fade"
          id="search-modal"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body search-wrap">
                <form className="search-form" id="search-form">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5>What Are You Looking for?</h5>
                    <Link to="#" className="close" data-bs-dismiss="modal">
                      <i className="material-icons-outlined">close</i>
                    </Link>
                  </div>
                  <div className="input-group input-group-flat">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a Keyword...."
                    />
                    <span className="input-group-text">
                      <i className="material-icons-outlined">search</i>
                    </span>
                  </div>
                  <h6>Popular Properties</h6>
                  <div className="search-list">
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Beautiful Condo Room
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Royal Apartment
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Grand Villa House
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>Grand Mahaka</Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Lunaria Residence
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Stephen Alexander Homes
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* End Search Modal */}
      </div>
      {/* ========================
		End Page Content
	========================= */}
    </>
  );
};

export default AddProperyBuy;
