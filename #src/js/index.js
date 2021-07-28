@@include('tabs.js')
@@include('dynamic.js')


  (function () {
    const header = document.querySelector('.header')

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
  })()

function ibg() {
  let ibg = document.querySelectorAll(".ibg");
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('img')) {
      ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
    }
  }
}

ibg();
