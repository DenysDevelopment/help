new Swiper('.benefits__slider', {
  slidesPerView: 3,
  autoplay: {
    delay: 2000,
  },
  loop: true,
  slidesPerGroup: 3,
  // spaceBetween: 10,
  // parallax: true,
  // effect: 'fade',
  // fadeEffect: {
  //   crossFade: true
  // },
  // speed: 500,
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev',
  // },
  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      slidesPerGroup: 1,
    },
    480: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },

    // when window width is >= 640px
    640: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    }
  },
  // a11y: {
  //   prevSlideMessage: 'Previous slide',
  //   nextSlideMessage: 'Next slide',
  // },
});
