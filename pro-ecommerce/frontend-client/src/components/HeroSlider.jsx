import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Latest Electronics",
    subtitle: "Find the best gadgets for work & play",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
  {
    title: "Premium Audio",
    subtitle: "Experience crystal clear sound",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167",
  },
  {
    title: "Smart Devices",
    subtitle: "Make your home smarter today",
    image:
      "https://images.unsplash.com/photo-1555617981-dac3880eac6c",
  },
];

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000 }}
      pagination={{ clickable: true }}
      loop
      className="mb-10 rounded-xl"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="relative h-[280px] md:h-[420px]"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative flex flex-col items-center justify-center h-full px-6 text-center text-white">
              <h2 className="mb-3 text-2xl font-bold md:text-5xl">
                {slide.title}
              </h2>
              <p className="mb-6 text-sm md:text-xl text-slate-200">
                {slide.subtitle}
              </p>
              <Link
                to="/"
                className="px-8 py-3 font-bold transition rounded-full bg-amber-500 text-slate-900 hover:bg-amber-400"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;
