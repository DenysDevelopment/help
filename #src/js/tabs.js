(function () {
  function tab() {
    const parent = this.closest('[data-tabs]');
    const contents = parent.querySelectorAll('.tabs__item');
    const buttons = parent.querySelectorAll('.tabs__btn');
    const tabList = parent.querySelector('.tabs__nav')

    removeClassAndAria('tabs__btn--active', buttons)
    this.classList.add('tabs__btn--active')
    this.setAttribute('aria-selected', true)
    contentSettings(this.dataset.tabName)

    buttons.forEach(btn => btn.addEventListener('click', tabSettings))

    function tabSettings() {
      removeClassAndAria('tabs__btn--active', buttons)
      this.classList.add('tabs__btn--active')
      this.setAttribute('aria-selected', true)
      contentSettings(this.dataset.tabName)
    }

    function contentSettings(tabName) {
      removeClassAndAria('tabs__item--active', contents)
      parent.querySelector(`.${tabName}`).classList.add('tabs__item--active')
    }

    function removeClassAndAria(className, el) {
      el.forEach(elem => {
        elem.setAttribute('aria-selected', false)
        elem.classList.remove(`${className}`)
      })
    }

    let tabFocus = 0;

    tabList.addEventListener("keydown", e => {
      if (e.keyCode === 39 || e.keyCode === 37) {
        buttons[tabFocus].setAttribute("tabindex", -1);
        if (e.keyCode === 39) {
          tabFocus++;
          if (tabFocus >= buttons.length) {
            tabFocus = 0;
          }
        } else if (e.keyCode === 37) {
          tabFocus--;
          if (tabFocus < 0) {
            tabFocus = buttons.length - 1;
          }
        }

        buttons[tabFocus].setAttribute("tabindex", 0);
        buttons[tabFocus].focus();
      }
    });
  };

  document.querySelectorAll('.tabs__btn')
    .forEach(tabEl => tabEl.addEventListener('click', tab))
})()
