import { Link } from "react-router";
import Slider from "react-slick";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import media15 from "../../../../../../public/assets/img/buy/buy-details-img-1.jpg";
import media16 from "../../../../../../public/assets/img/buy/buy-details-img-2.jpg";
import media17 from "../../../../../../public/assets/img/buy/buy-details-img-3.jpg";
import media18 from "../../../../../../public/assets/img/buy/buy-details-img-4.jpg";
import media19 from "../../../../../../public/assets/img/buy/buy-details-img-5.jpg";
import media20 from "../../../../../../public/assets/img/buy/buy-details-img-6.jpg";
import media21 from "../../../../../../public/assets/img/buy/buy-details-img-2.jpg";

const BuyGalleryItem = () => {
  const gallery = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [open6, setOpen6] = React.useState(false);
  const [open7, setOpen7] = React.useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-header">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#accordion-6"
          aria-expanded="true"
        >
          Gallery
        </button>
      </div>
      <div id="accordion-6" className="accordion-collapse collapse show">
        <div className="accordion-body gallery-body">
          <Slider {...gallery} className="gallery-slider">
            <div className="gallery-card">
              <Link
                to="#"
                onClick={() => setOpen1(true)}
                className="gallery-item rounded"
              >
                <ImageWithBasePath
                  src="assets/img/buy/buy-details-img-1.jpg"
                  alt="image"
                  className="rounded img-fluid"
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
                  ]}
                />
              </Link>
            </div>
            <div className="gallery-card">
              <Link
                to="#"
                onClick={() => setOpen2(true)}
                className="gallery-item rounded"
              >
                <ImageWithBasePath
                  src="assets/img/buy/buy-details-img-2.jpg"
                  alt="image"
                  className="rounded img-fluid"
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
                  ]}
                />
              </Link>
            </div>
            <div className="gallery-card">
              <Link
                to="#"
                onClick={() => setOpen3(true)}
                className="gallery-item rounded"
              >
                <ImageWithBasePath
                  src="assets/img/buy/buy-details-img-3.jpg"
                  alt="image"
                  className="rounded img-fluid"
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
                  ]}
                />
              </Link>
            </div>
            <div className="gallery-card">
              <Link
                to="#"
                onClick={() => setOpen4(true)}
                className="gallery-item rounded"
              >
                <ImageWithBasePath
                  src="assets/img/buy/buy-details-img-4.jpg"
                  alt="image"
                  className="rounded img-fluid"
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
                  ]}
                />
              </Link>
            </div>
            <div className="gallery-card">
              <Link
                to="#"
                onClick={() => setOpen5(true)}
                className="gallery-item rounded"
              >
                <ImageWithBasePath
                  src="assets/img/buy/buy-details-img-5.jpg"
                  alt="image"
                  className="rounded img-fluid"
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
                  ]}
                />
              </Link>
            </div>
            <div className="gallery-card">
              <Link
                to="#"
                onClick={() => setOpen6(true)}
                className="gallery-item rounded"
              >
                <ImageWithBasePath
                  src="assets/img/buy/buy-details-img-6.jpg"
                  alt="image"
                  className="rounded img-fluid"
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
                  ]}
                />
              </Link>
            </div>
            <div className="gallery-card">
              <Link
                to="#"
                onClick={() => setOpen7(true)}
                className="gallery-item rounded"
              >
                <ImageWithBasePath
                  src="assets/img/buy/buy-details-img-2.jpg"
                  alt="image"
                  className="rounded img-fluid"
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
                  ]}
                />
              </Link>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default BuyGalleryItem;
