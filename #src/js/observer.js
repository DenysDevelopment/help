(function () {
  const getId = elem => elem.getAttribute('href').replace('#', '')
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (document.querySelectorAll('.menu__link')) {
          document.querySelectorAll('.menu__link').forEach(link => {
            link.classList.toggle('.menu__link--active', getId(link) === entry.target.id)
          })
        }
      }
    })
  }, {
    threshold: 0.7,
  })

  if (document.querySelectorAll('.section')) {
    document.querySelectorAll('.section').forEach(section => observer.observe(section));
  }

  if (document.querySelector('.menu__list')) {
    document.querySelector('.menu__list').addEventListener('click', (e) => {
      e.preventDefault()
      window.scrollTo({
        top: document.getElementById(getId(e.target)).offsetTop - document.querySelector('.header').offsetHeight,
        behavior: 'smooth'
      })
    })
  }


})()
