import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import media15 from "../../../../../public/assets/img/gallery/gallery-01.jpg";
import media16 from "../../../../../public/assets/img/gallery/gallery-02.jpg";
import media17 from "../../../../../public/assets/img/gallery/gallery-03.jpg";
import media18 from "../../../../../public/assets/img/gallery/gallery-04.jpg";
import media19 from "../../../../../public/assets/img/gallery/gallery-05.jpg";
import media20 from "../../../../../public/assets/img/gallery/gallery-06.jpg";
import media21 from "../../../../../public/assets/img/gallery/gallery-07.jpg";
import media22 from "../../../../../public/assets/img/gallery/gallery-08.jpg";
import media23 from "../../../../../public/assets/img/gallery/gallery-09.jpg";
import media24 from "../../../../../public/assets/img/gallery/gallery-10.jpg";
import media25 from "../../../../../public/assets/img/gallery/gallery-11.jpg";
import media26 from "../../../../../public/assets/img/gallery/gallery-12.jpg";
import media27 from "../../../../../public/assets/img/gallery/gallery-13.jpg";
import media28 from "../../../../../public/assets/img/gallery/gallery-14.jpg";
import media29 from "../../../../../public/assets/img/gallery/gallery-15.jpg";

const Gallery = () => {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [open6, setOpen6] = React.useState(false);
  const [open7, setOpen7] = React.useState(false);
  const [open8, setOpen8] = React.useState(false);
  const [open9, setOpen9] = React.useState(false);
  const [open10, setOpen10] = React.useState(false);
  const [open11, setOpen11] = React.useState(false);
  const [open12, setOpen12] = React.useState(false);
  const [open13, setOpen13] = React.useState(false);
  const [open14, setOpen14] = React.useState(false);
  const [open15, setOpen15] = React.useState(false);
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Gallery"
          paths={[{ label: "Gallery", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row row-gap-4">
              <div className="col-lg-4">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen1(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-01.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open1}
                    close={() => setOpen1(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-8">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen2(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-02.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open2}
                    close={() => setOpen2(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-3">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen3(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-03.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open3}
                    close={() => setOpen3(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-6">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen4(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-04.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open4}
                    close={() => setOpen4(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-3">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen5(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-05.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open5}
                    close={() => setOpen5(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-8">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen6(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-06.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open6}
                    close={() => setOpen6(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-4">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen7(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-07.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open7}
                    close={() => setOpen7(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-3">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen8(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-08.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open8}
                    close={() => setOpen8(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-6">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen9(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-09.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open9}
                    close={() => setOpen9(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-3">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen10(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-10.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open10}
                    close={() => setOpen10(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-4">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen11(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-11.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open11}
                    close={() => setOpen11(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-8">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen12(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-12.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open12}
                    close={() => setOpen12(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-3">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen13(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-13.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open13}
                    close={() => setOpen13(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-6">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen14(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-14.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open14}
                    close={() => setOpen14(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
              </div>
              {/* end col */}
              <div className="col-lg-3">
                <Link
                  to="#"
                  className="image-popup"
                  onClick={() => setOpen15(true)}
                >
                  <ImageWithBasePath
                    src="assets/img/gallery/gallery-15.jpg"
                    alt="img"
                    className="img-fluid rounded-3"
                  />
                  <Lightbox
                    open={open15}
                    close={() => setOpen15(false)}
                    slides={[
                      { src: media15 },
                      { src: media16 },
                      { src: media17 },
                      { src: media18 },
                      { src: media19 },
                      { src: media20 },
                      { src: media21 },
                      { src: media22 },
                      { src: media23 },
                      { src: media24 },
                      { src: media25 },
                      { src: media26 },
                      { src: media27 },
                      { src: media28 },
                      { src: media29 },
                    ]}
                  />
                </Link>
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

export default Gallery;
