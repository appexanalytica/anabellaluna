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
          title="Agregar nueva propiedad"
          paths={[{ label: "Agregar nueva propiedad", active: true }]}
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
                          Información de la propiedad
                        </Link>
                      </li>
                      <li>
                        <Link to="#add-list-2">Detalles de la propiedad</Link>
                      </li>
                      <li>
                        <Link to="#add-list-3">Servicios</Link>
                      </li>
                      <li>
                        <Link to="#add-list-4">Documentos</Link>
                      </li>
                      <li>
                        <Link to="#add-list-5">Galería</Link>
                      </li>
                      <li>
                        <Link to="#add-list-6">Videos</Link>
                      </li>
                      <li>
                        <Link to="#add-list-7">Descripción</Link>
                      </li>
                      <li>
                        <Link to="#add-list-8">Planos</Link>
                      </li>
                      <li>
                        <Link to="#add-list-9">Ubicación</Link>
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
                            <h6 className="mb-1">Información de la propiedad</h6>
                            <p className="mb-0">
                              Explora detalles esenciales como tamaño, tipo,
                              precio y características destacadas, ideales para
                              una vida cómoda o una inversión inteligente.
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
                                      Nombre de la propiedad
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
                                      Tipo de propiedad
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
                                      Categoría de la propiedad
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
                                      Tipo de moneda
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
                                      Precio de venta
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
                                      Precio de oferta
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
                            <h6 className="mb-1">Detalles de la propiedad</h6>
                            <p className="mb-0">
                              Obtén especificaciones clave como distribución,
                              dimensiones y materiales que definen la calidad,
                              estructura y diseño general de la propiedad.
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
                                      ID de la propiedad
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
                                      Precio por m²
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
                                      Tipo de estructura
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
                                      Número de dormitorios
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
                                      Número de baños
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
                                    <label className="form-label">m²</label>
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
                                      Estacionamiento
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
                                      Balcón
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
                                    <label className="form-label">Piso</label>
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
                                      Armario
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
                                      Purificador de agua
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
                                      Microondas
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
                                    <label className="form-label">Aire acondicionado</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </div>{" "}
                                {/* end col */}
                                <div className="col-lg-4 col-sm-6">
                                  <div className="mb-3">
                                    <label className="form-label">Refrigerador</label>
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
                                      Tamaño del garaje
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
                                    Disponible desde
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
                                      Cortinas
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
                                    Año de construcción
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
                            <h6 className="mb-1">Servicios</h6>
                            <p className="mb-0">
                              Disfruta de características premium como piscina,
                              gimnasio, estacionamiento, seguridad y más, todo
                              diseñado para una vida moderna y confortable.
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
                                      Aire acondicionado
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
                                      TV por cable
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
                                      Refrigerador
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
                                      Césped
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
                                      Secadora
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
                                      Piscina
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
                                      Ducha exterior
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
                                      Lavandería
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
                                      Parrilla
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
                                      Lavadora
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
                                      Gimnasio
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
                                      Cortinas
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
                                      Espacios abiertos amplios
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
                                      Parques
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
                                      Terrazas ajardinadas
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
                                      Mesa de billar
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
                                      Casa club
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
                                      Recolección de basura
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
                                      Instalaciones deportivas
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
                            <h6 className="mb-1">Documentos de la propiedad</h6>
                            <p className="mb-0">
                              Visualiza y carga todos los documentos legales
                              esenciales, incluyendo título, aprobaciones y
                              recibos, organizados para mayor transparencia y
                              comodidad.
                            </p>
                          </div>
                        </div>{" "}
                        {/* end col */}
                        <div className="col-lg-8">
                          <div className="card border-0">
                            <div className="card-body">
                              <div className="mb-3">
                                <label className="form-label">
                                  Subir documentos
                                </label>
                                <div className="file-uploader">
                                  <input type="file" className="form-control" />
                                  <Link to="#" className="input-file">
                                    <span className="browse-btn">
                                      Buscar archivos
                                    </span>
                                    <span className="browse-text">
                                      Ningún archivo seleccionado
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <ul className="ducument-info mb-3">
                                <li>El tamaño máximo es de 8 MB. Formato: PDF.</li>
                                <li>
                                  El número máximo de archivos a subir es de 5.
                                </li>
                              </ul>
                              <p className="text-primary d-inline-flex align-items-center mb-0">
                                <i className="material-icons-outlined me-1">
                                  done_all
                                </i>
                                Documento subido correctamente
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
                            <h6 className="mb-1">Galería de la propiedad</h6>
                            <p className="mb-0">
                              Recorre imágenes en alta resolución de interiores
                              y exteriores para obtener una verdadera sensación
                              del diseño y la atmósfera.
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
                                <label className="form-label">Foto</label>
                                <div className="file-uploader">
                                  <input type="file" className="form-control" />
                                  <Link to="#" className="input-file">
                                    <span className="browse-btn">
                                      Buscar archivos
                                    </span>
                                    <span className="browse-text">
                                      3 fotos seleccionadas
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <ul className="ducument-info mb-3">
                                <li>
                                  El tamaño máximo de cada foto es de 8 MB.
                                  Formatos: jpeg, jpg. Pon primero la imagen
                                  principal.
                                </li>
                                <li>
                                  El número máximo de fotos a subir es de 10.
                                </li>
                              </ul>
                              <p className="text-primary d-inline-flex align-items-center mb-0">
                                <i className="material-icons-outlined me-1">
                                  done_all
                                </i>
                                Fotos subidas correctamente
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
                            <h6 className="mb-1">Video de la propiedad</h6>
                            <p className="mb-0">
                              Mira videos inmersivos de la propiedad que
                              ofrecen una vista en tiempo real del espacio,
                              distribución, iluminación y ambiente desde todos
                              los ángulos.
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
                                      Insertar video
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
                                      Enlace del video
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
                            <h6 className="mb-1">Descripción</h6>
                            <p className="mb-0">
                              Una casa bellamente diseñada que combina estilo y
                              funcionalidad, ideal para estilos de vida
                              modernos y una vida tranquila a largo plazo.
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
                                      Descripción de la propiedad
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
                            <h6 className="mb-1">Planos</h6>
                            <p className="mb-0">
                              Consulta planos detallados con tamaños de
                              habitaciones, distribución y estructura para
                              ayudarte a visualizar el mobiliario o futuras
                              modificaciones.
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
                                        Nombre de la propiedad
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
                                        Tipo de propiedad
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
                                        Categoría de la propiedad
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
                                        Tipo de moneda
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
                                        Precio de venta
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
                                        Precio de oferta
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
                                        Descripción de la propiedad
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
                                        Foto
                                      </label>
                                      <div className="file-uploader">
                                        <input
                                          type="file"
                                          className="form-control"
                                        />
                                        <Link to="#" className="input-file">
                                          <span className="browse-btn">
                                            Buscar archivos
                                          </span>
                                          <span className="browse-text">
                                            3 fotos seleccionadas
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
                                  Agregar más
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
                            <h6 className="mb-1">Ubicación de la propiedad</h6>
                            <p className="mb-0">
                              Ubicación céntrica cerca de escuelas, comercios y
                              transporte, ofreciendo comodidad diaria y un alto
                              valor a largo plazo.
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
                                      Dirección
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
                                      País
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
                                    <label className="form-label">Estado</label>
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
                                    <label className="form-label">Ciudad</label>
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
                                      Punto de referencia
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
                                      Código postal
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
                      Restablecer
                    </button>
                    <button className="btn btn-dark btn-lg" type="submit">
                      Agregar propiedad
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
                    <h5>¿Qué estás buscando?</h5>
                    <Link to="#" className="close" data-bs-dismiss="modal">
                      <i className="material-icons-outlined">close</i>
                    </Link>
                  </div>
                  <div className="input-group input-group-flat">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Escribe una palabra clave..."
                    />
                    <span className="input-group-text">
                      <i className="material-icons-outlined">search</i>
                    </span>
                  </div>
                  <h6>Propiedades populares</h6>
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
