import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard } from "swiper/modules";
import "../../../../../../node_modules/swiper/swiper.css";
import "../../../../../../node_modules/swiper/modules/pagination.css";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const PartnersLogos = () => {
  return (
    <>
      {/* Logos Section Start */}
      <div className="partners-logos">
        <div className="container">
          {/* start row */}
          <div className="row">
            <div className="col-md-12">
              <Swiper
                slidesPerView={1}
                spaceBetween={24}
                loop={true}
                keyboard={{ enabled: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  768: {
                    slidesPerView: 3,
                  },
                  992: {
                    slidesPerView: 5,
                  },
                  1300: {
                    slidesPerView: 6,
                  },
                }}
                modules={[Autoplay, Keyboard]}
                className="partner-slider swiper"
              >
                <div className="swiper-wrapper">
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-07.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-08.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-09.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-10.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-11.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-12.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-13.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-08.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide text-center">
                      <ImageWithBasePath
                        src="assets/img/icons/partner-07.svg"
                        alt="image"
                      />
                    </div>
                  </SwiperSlide>
                </div>
              </Swiper>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </div>
      {/* Logos Section End */}
    </>
  );
};

export default PartnersLogos;
