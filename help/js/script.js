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


// `data-da="куда,какой,когда,тип"`

// Название | Значение по - умолчанию | Описание
// ------------- | ------------- | -------------
// 	`куда (любой селектор)` | _\[обязательный\]_ | Класс блока, в который нужно будет "перебросить" текущий объект.Если класс не уникален, объек перебросится в первый элемент с этим классом.
// `какой` | last | Позиция на которую нужно переместить объект внутри родителя`куда`.Кроме цифр можно указать слова`first`(в начало блока) или`last`(в конец блока)
// 	`когда` | 767 | Брейкпоинт при котором перемещать объект.
// `тип` * | max | Тип срабатывания брейкпоинта.max - Desktop First, min - Mobile First. * При использовании`min` в некоторых(редких) ситуациях может возникнуть неточность порядка вывода элементов.

// e.x. data-da="item,2,992"
"use strict";

(function () {
  let originalPositions = [];
  let daElements = document.querySelectorAll('[data-da]');
  let daElementsArray = [];
  let daMatchMedia = [];
  //Заполняем массивы
  if (daElements.length > 0) {
    let number = 0;
    for (let index = 0; index < daElements.length; index++) {
      const daElement = daElements[index];
      const daMove = daElement.getAttribute('data-da');
      if (daMove != '') {
        const daArray = daMove.split(',');
        const daPlace = daArray[1] ? daArray[1].trim() : 'last';
        const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
        const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
        const daDestination = document.querySelector(daArray[0].trim())
        if (daArray.length > 0 && daDestination) {
          daElement.setAttribute('data-da-index', number);
          //Заполняем массив первоначальных позиций
          originalPositions[number] = {
            "parent": daElement.parentNode,
            "index": indexInParent(daElement)
          };
          //Заполняем массив элементов
          daElementsArray[number] = {
            "element": daElement,
            "destination": document.querySelector('.' + daArray[0].trim()),
            "place": daPlace,
            "breakpoint": daBreakpoint,
            "type": daType
          }
          number++;
        }
      }
    }
    dynamicAdaptSort(daElementsArray);

    //Создаем события в точке брейкпоинта
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daBreakpoint = el.breakpoint;
      const daType = el.type;

      daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
      daMatchMedia[index].addListener(dynamicAdapt);
    }
  }
  //Основная функция
  function dynamicAdapt(e) {
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daElement = el.element;
      const daDestination = el.destination;
      const daPlace = el.place;
      const daBreakpoint = el.breakpoint;
      const daClassname = "_dynamic_adapt_" + daBreakpoint;

      if (daMatchMedia[index].matches) {
        //Перебрасываем элементы
        if (!daElement.classList.contains(daClassname)) {
          let actualIndex = indexOfElements(daDestination)[daPlace];
          if (daPlace === 'first') {
            actualIndex = indexOfElements(daDestination)[0];
          } else if (daPlace === 'last') {
            actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
          }
          daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
          daElement.classList.add(daClassname);
        }
      } else {
        //Возвращаем на место
        if (daElement.classList.contains(daClassname)) {
          dynamicAdaptBack(daElement);
          daElement.classList.remove(daClassname);
        }
      }
    }
    customAdapt();
  }

  //Вызов основной функции
  dynamicAdapt();

  //Функция возврата на место
  function dynamicAdaptBack(el) {
    const daIndex = el.getAttribute('data-da-index');
    const originalPlace = originalPositions[daIndex];
    const parentPlace = originalPlace['parent'];
    const indexPlace = originalPlace['index'];
    const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
    parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
  }
  //Функция получения индекса внутри родителя
  function indexInParent(el) {
    var children = Array.prototype.slice.call(el.parentNode.children);
    return children.indexOf(el);
  }
  //Функция получения массива индексов элементов внутри родителя
  function indexOfElements(parent, back) {
    const children = parent.children;
    const childrenArray = [];
    for (let i = 0; i < children.length; i++) {
      const childrenElement = children[i];
      if (back) {
        childrenArray.push(i);
      } else {
        //Исключая перенесенный элемент
        if (childrenElement.getAttribute('data-da') == null) {
          childrenArray.push(i);
        }
      }
    }
    return childrenArray;
  }
  //Сортировка объекта
  function dynamicAdaptSort(arr) {
    arr.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
    });
    arr.sort(function (a, b) {
      if (a.place > b.place) { return 1 } else { return -1 }
    });
  }
  //Дополнительные сценарии адаптации
  function customAdapt() {
    //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }
}());



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
