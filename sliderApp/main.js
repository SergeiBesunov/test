const SLIDER = document.querySelector('.slider');
const TRACKER = SLIDER.querySelector('.tracker');
let DOTSContainer
let ALLDots

const allItems = TRACKER.children;
let totalItems = allItems.length;
let copyNode = [];

// -- Удаляем из разметки все слайды, предварительно скопировав их в массив copyNode -- 
copyNodsAndDeleteHtmlElements()

// -- Добавляем в трекер елементы: предыдущий слайд, актуальный, следующий -- 
generateTrackerStructure(TRACKER)

//-- Создаем дотсы исходя из количества слайдов --
createDots(); 

let widthSlider = SLIDER.offsetWidth;
let currentSlide = 0; // текущий слайд
let pos = 0; // брекпоинт для анимации

TRACKER.style.transform = `translateX(-${widthSlider + `px`})`;

let prevDOMElem = document.querySelector('#prevElem');
let currentDOMElem = document.querySelector('#currentElem');
let nextDOMElem = document.querySelector('#nextElem');

// -- Закидываем скопированные елементы в трекер, по необходимости перед этим дополняем copyNode,
// для корректной работы с любым количеством слайдов --
if (totalItems >= 3) {
   prevDOMElem.append(copyNode[copyNode.length - 1]);
   currentDOMElem.append(copyNode[0]);
   nextDOMElem.append(copyNode[1]);
}
if (totalItems === 2) {
   for (let i = 0; i < totalItems; i++) {
      let copyElem = copyNode[i].cloneNode(true);
      copyElem.id = i + 3;
      copyNode.push(copyElem);
   }

   prevDOMElem.append(copyNode[copyNode.length - 1]);
   currentDOMElem.append(copyNode[0]);
   nextDOMElem.append(copyNode[1]);
}
if (totalItems === 1) {
   for (let i = 0; i < 2; i++) {
      let copyElem = copyNode[0].cloneNode(true);
      copyElem.id = i + 2;
      copyNode.push(copyElem);
   }
   prevDOMElem.append(copyNode[2]);
   currentDOMElem.append(copyNode[0]);
   nextDOMElem.append(copyNode[1]);
}

switchСlassOnDots(currentSlide)

// -- Отлавливаем клик на стрелки prev/next --
document.addEventListener('click', handleaClickOnTheArrows);










function copyNodsAndDeleteHtmlElements(){
   for (let i = 0; i < totalItems; i++) {
      let copyElem = allItems[i].cloneNode(true);
      copyElem.id = i + 1;
      copyNode.push(copyElem);
   }
   for (let i = 0; i < totalItems; i++) {
      allItems[0].remove();
   }
}

function generateTrackerStructure(TRACKER){
   let newElements = ['prevElem', 'currentElem', 'nextElem'];

   newElements.forEach((elem) => {
      let TRACKERInnerElem = document.createElement('div');
      TRACKERInnerElem.classList = 'items-cont';
      TRACKERInnerElem.id = elem;
      TRACKER.append(TRACKERInnerElem);
   });
}

function handleaClickOnTheArrows(e) {
   e.preventDefault();
   let { target } = e;

   if (target.id === 'prev' || target.id === 'next') {
      let action = target.id;
      determineWhereToMove(action);
   }
}

function createDots() {
   DOTSContainer = document.createElement('div');
   DOTSContainer.className = 'dots';

   for (let i = 0; i < totalItems; i++) {
      let dotElem = document.createElement('button');
      dotElem.dataset.id = i + 1;

      DOTSContainer.append(dotElem);
   }
   ALLDots = DOTSContainer.querySelectorAll('button')
   DOTSContainer.addEventListener('click', handleaClickOnTheDots);
   SLIDER.after(DOTSContainer);
}

function switchСlassOnDots(current){
   ALLDots.forEach((dot)=>{
      dot.classList.remove('active')
      if(Number(dot.dataset.id) === current+1){
         dot.classList.add('active')
      }
   })
}

function resumeEventListeners(){
   document.addEventListener('click', handleaClickOnTheArrows);
   DOTSContainer.addEventListener('click', handleaClickOnTheDots);
}


// -- ФУНКЦИИ ОСНОВНОЙ ЛОГИКИ -- 

// -- При удалении DOM элемента из трекера, мы больше не можем к нему обратиться для обновления трекера в будующем,
// поэтому предварительно делаем его копию и заменяем ею предыдущую копию этого элемента в массиве copyNode -- 
function changeNode(element, index) {
   let copyElement = copyNode[index].cloneNode(true);
   copyElement.style.transform = `translateX(-${0 + `px`})`;
   element.innerHTML = '';
   element.append(copyElement);
   copyNode[Number(copyElement.id) - 1] = copyElement;
}

// -- Логика анимации слайдов, обернута в Promise для ожидания завершения анимации --
function moveSlides(elem, elem2, distance, action) {
   pos = 0;

   return new Promise((resolve, reject) => {
      let intervalId = setInterval(() => {
         if (action === 'next') {
            pos += 3;
            elem.style.transform = `translateX(-${pos + `px`})`;
            elem2.style.transform = `translateX(-${pos + `px`})`;
         } else if (action === 'prev') {
            pos += 3;
            elem.style.transform = `translateX(${pos + `px`})`;
            elem2.style.transform = `translateX(${pos + `px`})`;
         }
         if (pos >= distance) {
            clearInterval(intervalId);
            resolve();
         }
      }, 1);
   });
}

// -- Определяем событие prev или next, и запускаем анимацию, просчитавая при этом
// какие должны быть подставленны из copyNode в трекер елементы после завершения анимации
function determineWhereToMove(action) {
   if (action === 'next') {
      document.removeEventListener('click', handleaClickOnTheArrows);
      DOTSContainer.removeEventListener('click', handleaClickOnTheDots);

      if (currentSlide === copyNode.length - 2) {
         moveSlides(copyNode[currentSlide], copyNode[currentSlide + 1], widthSlider, action).then(
            () => {
               changeNodesWhenIncrement(true);
               resumeEventListeners()
            },
         );
      } else if (currentSlide === copyNode.length - 1) {
         moveSlides(copyNode[currentSlide], copyNode[0], widthSlider, action).then(() => {
            changeNodesWhenIncrement(null);
            resumeEventListeners()
         });
      } else {
         moveSlides(copyNode[currentSlide], copyNode[currentSlide + 1], widthSlider, action).then(
            () => {
               changeNodesWhenIncrement();
               resumeEventListeners()
            },
         );
      }
   } else if (action === 'prev') {
      document.removeEventListener('click', handleaClickOnTheArrows);
      if (currentSlide === 1) {
         moveSlides(copyNode[currentSlide], copyNode[currentSlide - 1], widthSlider, action).then(
            () => {
               changeNodesWhenDecrement(true);
               resumeEventListeners()
            },
         );
      } else if (currentSlide === 0) {
         moveSlides(
            copyNode[currentSlide],
            copyNode[copyNode.length - 1],
            widthSlider,
            action,
         ).then(() => {
            changeNodesWhenDecrement(null);
            resumeEventListeners()
         });
      } else {
         moveSlides(copyNode[currentSlide], copyNode[currentSlide - 1], widthSlider, action).then(
            () => {
               changeNodesWhenDecrement();
               resumeEventListeners()
            },
         );
      }
   }
}

// -- Функция обновляющая трекер, при событии ( следующий слайд ) --
function changeNodesWhenIncrement(arg) {
   if (arg === null) {
      currentSlide = 0;
      changeNode(prevDOMElem, copyNode.length - 1);
      changeNode(currentDOMElem, 0);
      changeNode(nextDOMElem, 1);
   } else {
      currentSlide++;
      changeNode(prevDOMElem, currentSlide - 1);
      changeNode(currentDOMElem, currentSlide);

      if (!arg) {
         changeNode(nextDOMElem, currentSlide + 1);
      } else {
         changeNode(nextDOMElem, 0);
      }
   }
   switchСlassOnDots(currentSlide)
}

// -- Функция обновляющая трекер, при событии ( предыдущий слайд ) --
function changeNodesWhenDecrement(arg) {
   if (arg === null) {
      currentSlide = copyNode.length - 1;
      changeNode(prevDOMElem, currentSlide - 1);
      changeNode(currentDOMElem, currentSlide);
      changeNode(nextDOMElem, 0);
   } else {
      currentSlide--;

      if (!arg) {
         changeNode(prevDOMElem, currentSlide - 1);
      } else {
         changeNode(prevDOMElem, copyNode.length - 1);
      }

      changeNode(currentDOMElem, currentSlide);
      changeNode(nextDOMElem, currentSlide + 1);
   }
   switchСlassOnDots(currentSlide)
}

// -- Функция обновляющая трекер, при событии ( предыдущий слайд ) --
function handleaClickOnTheDots(e) {
   let prevCurrent = currentSlide;
   currentSlide = e.target.dataset.id - 1;
   switchСlassOnDots(currentSlide)

   if (e.target.dataset.id - 1 > prevCurrent) {
      changeNode(prevDOMElem, currentSlide - 1);
      changeNode(currentDOMElem, currentSlide);
      if (currentSlide === copyNode.length - 1) {
         changeNode(nextDOMElem, 0);
      } else {
         changeNode(nextDOMElem, currentSlide + 1);
      }
   } else if (e.target.dataset.id - 1 < prevCurrent) {
      if (currentSlide === 0) {
         changeNode(prevDOMElem, copyNode.length - 1);
      } else {
         changeNode(prevDOMElem, currentSlide - 1);
      }

      changeNode(currentDOMElem, currentSlide);
      changeNode(nextDOMElem, currentSlide + 1);
   }
}