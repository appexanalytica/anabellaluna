
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../core/imageWithBasePath";

const InvoiceDetails = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Factura"
          paths={[{ label: "Factura", active: true }]}
        />
        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-xl-8 mx-auto">
                <div className="invoice-item-wrap">
                  <div className="border-bottom pb-4 mb-4">
                    {/* start row */}
                    <div className="row align-items-center row-gap-4">
                      <div className="col-md-6">
                        <h5>FACTURA</h5>
                        <p className="mb-1">
                          Número de Factura :{" "}
                          <span className="text-dark">INV-0002</span>
                        </p>
                        <p className="mb-1">
                          Fecha de Factura :{" "}
                          <span className="text-dark">02 Jan 2025</span>
                        </p>
                        <p className="mb-0">
                          Fecha de Vencimiento :{" "}
                          <span className="text-dark">15 Jan 2025</span>
                        </p>
                      </div>
                      {/* end col */}
                      <div className="col-md-6">
                        <div className="text-end invoice-logo">
                          <ImageWithBasePath
                            src="assets/img/logo.svg"
                            alt="image"
                            className="img-fluid logo mb-1"
                          />
                          <ImageWithBasePath
                            src="assets/img/logo-white.svg"
                            alt="image"
                            className="img-fluid logo-dark mb-1"
                          />
                          <p className="mb-0">Solo para el Receptor</p>
                        </div>
                      </div>
                      {/* end col */}
                    </div>
                    {/* end row */}
                  </div>
                  {/* start row */}
                  <div className="row row-gap-3 justify-content-between mb-4">
                    <div className="col-md-6 col-lg-4">
                      <div className="invoice-item-01">
                        <h6>De</h6>
                        <p>Cartin Joseph</p>
                        <p>45, 5th Street Newyork, USA</p>
                        <p>LX6457</p>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-md-6 col-lg-4">
                      <div className="invoice-item-01">
                        <h6>Para</h6>
                        <p>Fazel Yaseer</p>
                        <p>778 Mittal Street, Germany </p>
                        <p>454787</p>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-md-6 col-lg-4">
                      <div className="invoice-item-02">
                        <h6>Dreams Estate</h6>
                        <p>
                          Reg : <span>123000123000</span>
                        </p>
                        <p>
                          Email : <span>info@example.com</span>
                        </p>
                        <p>
                          Móvil : <span>+1 56984 39210</span>
                        </p>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="bg-light">#</th>
                          <th className="bg-light">Descripción</th>
                          <th className="bg-light text-center">Cant</th>
                          <th className="bg-light text-center">Precio</th>
                          <th className="bg-light text-center">IVA</th>
                          <th className="bg-light text-end">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Nombre del Producto</td>
                          <td className="text-center">2</td>
                          <td className="text-center">650</td>
                          <td className="text-center">0.00</td>
                          <td className="text-end">650.00</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Nombre del Producto</td>
                          <td className="text-center">2</td>
                          <td className="text-center">600</td>
                          <td className="text-center">0.00</td>
                          <td className="text-end">600.00</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Nombre del Producto</td>
                          <td className="text-center">3</td>
                          <td className="text-center">200</td>
                          <td className="text-center">0.00</td>
                          <td className="text-end">400.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-3 pb-3 border-bottom">
                    {/* start row */}
                    <div className="row justify-content-end">
                      <div className="col-lg-6">
                        {/* start row */}
                        <div className="row row-gap-2 mb-2">
                          <div className="col-sm-7 text-end">
                            <p className="mb-0">Subtotal (sin IVA)</p>
                          </div>
                          {/* end col */}
                          <div className="col-sm-5 text-end">
                            <h6 className="mb-0">$1650.00</h6>
                          </div>
                          {/* end col */}
                        </div>
                        {/* end row */}
                        {/* start row */}
                        <div className="row row-gap-2 mb-2">
                          <div className="col-sm-7 text-end">
                            <p className="mb-0">Total IVA</p>
                          </div>
                          {/* end col */}
                          <div className="col-sm-5 text-end">
                            <h6 className="mb-0">$0.00</h6>
                          </div>
                          {/* end col */}
                        </div>
                        {/* end row */}
                        {/* start row */}
                        <div className="row row-gap-2">
                          <div className="col-sm-7 text-end">
                            <p className="mb-0">Tarjeta de Crédito (si se usa)</p>
                          </div>
                          {/* end col */}
                          <div className="col-sm-5 text-end">
                            <h6 className="mb-0">$165.00</h6>
                          </div>
                          {/* end col */}
                        </div>
                        {/* end row */}
                      </div>
                      {/* end col */}
                    </div>
                    {/* end row */}
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-3 border-bottom">
                    <p className="mb-0">Total de Artículos / Cant : 4 / 4.00</p>
                    <h5 className="mb-0">$1,815.00</h5>
                  </div>
                  <div className="mb-4 pb-3 border-bottom">
                    <p className="mb-0">
                      Monto total (en palabras) : One Thousand Eight Hundred Fifteen Dollars Only.
                    </p>
                  </div>
                  {/* start row */}
                  <div className="row align-items-center row-gap-3">
                    <div className="col-md-6">
                      <h6 className="mb-3">INSTRUCCIONES DE PAGO</h6>
                      <p className="fw-semibold text-dark mb-1">
                        Dreams Estate
                      </p>
                      <p className="mb-1">
                        Nombre del Banco :<span className="text-dark">ABC Bank</span>
                      </p>
                      <p className="mb-1">
                        SWIFT/IBAN :
                        <span className="text-dark">NZ0201230012</span>
                      </p>
                      <p className="mb-0">
                        Número de Cuenta :
                        <span className="text-dark">936442792418</span>
                      </p>
                    </div>
                    {/* end col */}
                    <div className="col-md-6 text-end">
                      <p className="fw-semibold text-dark mb-3">Pagar Online</p>
                      <ImageWithBasePath
                        src="assets/img/about-us/qr-code.svg"
                        alt="image"
                        className="img-fluid"
                      />
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                </div>
              </div>
              {/* end col */}
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

export default InvoiceDetails;
