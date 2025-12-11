import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { Country } from "../../../../core/common/selectOption";
import CommonSelect from "../../../../core/common/common-select/commonSelect";
import { all_routes } from "../../../routes/all_routes";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const ContactUs = () => {
  const [phone, setPhone] = useState<string | undefined>();
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Contactanos"
          paths={[{ label: "Contactanos", active: true }]}
        />
        {/* End Breadscrumb */}
        <div className="contact-us-wrap-01">
          <div className="container">
            {/* start row */}
            <div className="row align-items-center row-gap-3">
              <div className="col-lg-6">
                <div className="card border-0">
                  <div className="card-body p-4">
                    <h4 className="mb-2">Hablá con un miembro del equipo de ventas</h4>
                    <p className="mb-3">
                      Conectate con nuestro equipo experto de ventas para recibir
                      guía personalizada, insights sobre propiedades y soporte
                      adaptado a tus necesidades inmobiliarias.
                    </p>
                    <p className="fw-semibold mb-0">Llamada gratuita: 888 634-5891</p>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
                <div className="card border-0 mb-0">
                  <div className="card-body p-4">
                    <h4 className="mb-2">Soporte de Producto y Cuenta</h4>
                    <p className="mb-3">
                      Recibí ayuda dedicada con tu cuenta, características y
                      servicios a través de nuestro equipo experto de Soporte de
                      Producto y Cuenta.
                    </p>
                    <Link to={all_routes.faq} className="btn btn-dark">
                      Ir a FAQ
                    </Link>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-lg-6">
                <div className="ms-0 ms-lg-4">
                  <ImageWithBasePath
                    src="assets/img/contact-us/contact-us-img-01.jpg"
                    alt="img"
                    className="img-fluid"
                  />
                </div>
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
        </div>
        <div className="contact-us-wrap-02">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-12 mx-auto">
                {/* start row */}
                <div className="row align-items-center justify-content-center mb-3">
                  <div className="col-md-6 col-lg-4">
                    <div className="contact-us-item-01">
                      <div className="d-flex align-items-center">
                        <span className="material-icons-outlined">mail</span>
                        <div>
                          <h6 className="mb-2">Dirección de Email</h6>
                          <p className="mb-0">info@example.com</p>
                          <p className="mb-0">corporate@example.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-4">
                    <div className="contact-us-item-01">
                      <div className="d-flex align-items-center">
                        <span className="material-icons-outlined">call</span>
                        <div>
                          <h6 className="mb-2">Número de Teléfono</h6>
                          <p className="mb-0">+81649 48103</p>
                          <p className="mb-0">+78301 71940</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-4">
                    <div className="contact-us-item-01">
                      <div className="d-flex align-items-center">
                        <span className="material-icons-outlined">
                          location_on
                        </span>
                        <div>
                          <h6 className="mb-2">Dirección</h6>
                          <p className="mb-0">
                            Av. Del Mar 1500, Pinamar, Buenos Aires, Argentina
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
              </div>
              {/* end col */}
            </div>
            {/* end row */}
            {/* start row */}
            <div className="row align-items-center row-gap-3">
              <div className="col-lg-6">
                <ImageWithBasePath
                  src="assets/img/contact-us/contact-us-img-02.jpg"
                  alt="img"
                  className="img-fluid"
                />
              </div>
              {/* end col */}
              <div className="col-lg-6">
                <div className="contact-us-item-02">
                  <h2>Contactanos</h2>
                  {/* start row */}
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Tu Nombre</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Número de Teléfono</label>
                        <PhoneInput
                          defaultCountry="AR"
                          value={phone}
                          onChange={setPhone}
                        />
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">País</label>
                        <CommonSelect
                          options={Country}
                          className="select"
                          defaultValue={Country[0]}
                        />
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Asunto</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Comentarios"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-md-12">
                      <Link
                        to="#"
                        className="btn btn-lg btn-dark"
                      >
                        Enviar Consulta
                      </Link>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                </div>
              </div>
            </div>
            {/* end row */}
          </div>
        </div>
        <div className="google-map">
          <iframe
            className="rounded-0"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.8862835683544!2d-73.98256668525309!3d41.93829486962529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd0ee3286615b7%3A0x42bfa96cc2ce4381!2s132%20Kingston%20St%2C%20Kingston%2C%20NY%2012401%2C%20USA!5e0!3m2!1sen!2sin!4v1670922579281!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default ContactUs;
