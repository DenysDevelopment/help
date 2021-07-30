@@include('../../node_modules/swiper/swiper-bundle.min.js')
// @@include('../../node_modules/choices.js/public/assets/scripts/choices.min.js')
@@include('tabs.js')
@@include('dynamic.js')
@@include('sliders.js')


  (function () {
    const choices = new Choices(document.querySelector('#form-cost__input--select'), {
      searchEnabled: false,
      placeholder: true,
    });
  })();


(function () {
  const header = document.querySelector('.header')
  const burger = document.querySelector('.menu__icon');
  const menu = document.querySelector('.menu');

  burger.addEventListener('click', () => {
    menu.classList.toggle('menu--active')
    menu.style.top = header.clientHeight + 'px'
    document.body.classList.toggle('lock')
  })

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.style.background = 'rgb(0 0 0 / 0.5)';
      header.style.backdropFilter = 'blur(20px)'
      header.style.padding = '5px 0'
    } else {
      header.style.background = '';
      header.style.backdropFilter = '';
      header.style.padding = ''
    }
  })
})();
(function ibg() {
  let ibg = document.querySelectorAll(".ibg");
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('img')) {
      ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
    }
  }
})();
