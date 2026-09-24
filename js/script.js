//[https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)
let dragged; //armazenar o objeto que está sendo arrastado
window['moment-range'].extendMoment(moment);
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const parkingRules = {
  ambulance: {
    days: allDays
  },
  suv: {
    days: ['Thursday'],
    times: createRange(moment().set('hour', 7), moment().set('hour', 12))
  },
  car: {
    days: ['Monday'],
    times: createRange(moment().set('hour', 7), moment().set('hour', 20))
  },
  motorcycle: {
    days: allDays,
    times: createRange(moment().set('hour', 7), moment().set('hour', 20))
  }
};
function createRange(start, end) {
  if (start && end) {
    return moment.range(start, end);
  }
}
function onDragStart(event) {
  let target = event.target;
  if (target && target.nodeName === 'IMG') { // Se o alvo for uma imagem
    dragged = target;
    event.dataTransfer.setData('text', target.id);
    event.dataTransfer.effectAllowed = 'move';
    // Torná-lo meio transparente
    event.target.style.opacity = .3;
  }
}
function onDragEnd(event) {
  if (event.target && event.target.nodeName === 'IMG') {
      // Redefinir a transparência
      event.target.style.opacity = '';
    dragged = null;
  }
}
function onDragOver(event) {
  // Impedir o padrão para permitir a queda
  event.preventDefault();
  event.dataTransfer.dropEffect = "move"
}
function onDragLeave(event) {
  event.target.style.background = '';
}
function getDay() {
  return moment().format('dddd'); // formatar como 'segunda-feira' não 1
}
function getHours() {
  return moment().hour();
}
function canPark(vehicle) {
  if (vehicle && parkingRules[vehicle]) {
    const rules = parkingRules[vehicle];
    const validDays = rules.days;
    const validTimes = rules.times;
    const curDay = getDay();
    if (vehicle === 'suv' && curDay === 'Thursday' && getHours() >= 7 && getHours() < 12) {
      return false;
    }
    if (validDays) {
      return validDays.includes(curDay) && (validTimes ? validTimes.contains(moment()) : true);
    }
  }
  return false;
}
function onDragEnter(event) {
  const target = event.target;
  if (dragged && target) {
    const vehicleType = dragged.alt;
    if (canPark(vehicleType)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      target.style.background = '#1f904e';
    } else {
      target.style.backgroundColor = '#d51c00';
    }
  }
}
function onDrop(event) {
  event.preventDefault();
  const target = event.currentTarget;
  if (dragged && target) {
    const vehicleType = dragged.alt;
    target.style.backgroundColor = '';
    target.style.background = '';
    if (canPark(vehicleType)) {
      dragged.style.opacity = '';
      target.appendChild(dragged);
    }
  }
}
const vehicles = document.querySelector('.vehicles');
const dropZone = document.querySelector('.drop-zone');
// Adicionando ouvintes de evento
vehicles.addEventListener('dragstart', onDragStart);
vehicles.addEventListener('dragend', onDragEnd);
dropZone.addEventListener('drop', onDrop);
dropZone.addEventListener('dragenter', onDragEnter);
dropZone.addEventListener('dragleave', onDragLeave);
dropZone.addEventListener('dragover', onDragOver);
