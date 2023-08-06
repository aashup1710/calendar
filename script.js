const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};

const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

let clicked = null;
let events = JSON.parse(localStorage.getItem('events')) || [];

let calendar = document.querySelector('.calendar');
const month_names = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
let month_picker = document.querySelector('#month-picker');
const dayTextFormate = document.querySelector('.day-text-formate');
const timeFormate = document.querySelector('.time-formate');
const dateFormate = document.querySelector('.date-formate');

month_picker.onclick = () => {
  month_list.classList.remove('hideonce');
  month_list.classList.remove('hide');
  month_list.classList.add('show');
  dayTextFormate.classList.remove('showtime');
  dayTextFormate.classList.add('hidetime');
  timeFormate.classList.remove('showtime');
  timeFormate.classList.add('hideTime');
  dateFormate.classList.remove('showtime');
  dateFormate.classList.add('hideTime');
};

const generateCalendar = (month, year) => {
  let calendar_days = document.querySelector('.calendar-days');
  calendar_days.innerHTML = '';
  let calendar_header_year = document.querySelector('#year');
  let days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let currentDate = new Date();

  month_picker.innerHTML = month_names[month];

  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement('div');

    if (i >= first_day.getDay()) {
      day.innerHTML = i - first_day.getDay() + 1;
      const currentDateText = `${year}-${month + 1}-${i - first_day.getDay() + 1}`;
      
      const eventOfTheDay = events.find((e) => e.date === currentDateText);
      if (eventOfTheDay) {
        day.classList.add('has-event'); 
      }

      if (
        i - first_day.getDay() + 1 === currentDate.getDate() &&
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth()
      ) {
        day.classList.add('current-date');
      }
    }

    day.addEventListener("click", function() {
      showModal(year + "-" + (month + 1) + "-" + (i - first_day.getDay() + 1));
    });

    calendar_days.appendChild(day);
  }
};

const month_list = calendar.querySelector('.month-list');
month_names.forEach((e, index) => {
  const month = document.createElement('div');
  month.innerHTML = `<div>${e}</div>`;

  month_list.append(month);
  month.onclick = () => {
    currentMonth.value = index;
    generateCalendar(currentMonth.value, currentYear.value);
    month_list.classList.replace('show', 'hide');
    dayTextFormate.classList.remove('hideTime');
    dayTextFormate.classList.add('showtime');
    timeFormate.classList.remove('hideTime');
    timeFormate.classList.add('showtime');
    dateFormate.classList.remove('hideTime');
    dateFormate.classList.add('showtime');
  };
});

(function () {
  month_list.classList.add('hideonce');
})();

document.querySelector('#pre-year').onclick = () => {
  --currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

document.querySelector('#next-year').onclick = () => {
  ++currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
generateCalendar(currentMonth.value, currentYear.value);

const todayShowTime = document.querySelector('.time-formate');
const todayShowDate = document.querySelector('.date-formate');

const currshowDate = new Date();
const showCurrentDateOption = {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
};
const currentDateFormate = new Intl.DateTimeFormat(
  'en-US', showCurrentDateOption
).format(currshowDate);

todayShowDate.textContent = currentDateFormate;


setInterval(() => {
  const timer = new Date();
  const option = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const formateTimer = new Intl.DateTimeFormat('en-us', option).format(timer);

  let time = `${`${timer.getHours()}`.padStart(2, '0')}:${`${timer.getMinutes()}`.padStart(2, '0')}:${`${timer.getSeconds()}`.padStart(2, '0')}`;
  todayShowTime.textContent = formateTimer;
}, 1000);

function buttons() {
  const btnDelete = document.querySelector("#btnDelete");
  const btnSave = document.querySelector("#btnSave");
  const closeButtons = document.querySelectorAll("#btnClose");
  const txtTitle = document.querySelector("#txtTitle");

  modal.addEventListener("click", closeModal);
  
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  btnDelete.addEventListener("click", function () {
    events = events.filter((e) => e.date !== clicked);
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  });

  btnSave.addEventListener("click", function () {
    if (txtTitle.value) {
      txtTitle.classList.remove("error");
      events.push({
        date: clicked,
        title: txtTitle.value.trim(),
      });
      txtTitle.value = "";
      localStorage.setItem("events", JSON.stringify(events));
      
      const dateButton = document.querySelector(`.calendar-days div[data-date="${clicked}"]`);
      if (dateButton) {
        dateButton.classList.add("has-event"); 
      }
      
      closeModal();
      generateCalendar(currentMonth.value, currentYear.value);
    } else {
      txtTitle.classList.add("error");
    }
  });
  
}

const modal = document.querySelector("#modal");
const viewEventForm = document.querySelector("#viewEvent");
const addEventForm = document.querySelector("#addEvent");

function showModal(dateText) {
  clicked = dateText;
  const eventOfTheDay = events.find((e) => e.date === clicked);

  if (eventOfTheDay) {
    document.querySelector("#eventText").innerText = eventOfTheDay.title;
    viewEventForm.style.display = "block";
  } else {
    txtTitle.value = ""; 
    txtTitle.classList.remove("error");
    addEventForm.style.display = "block";
    viewEventForm.style.display = "none";
  }
  modal.style.display = "block";
}

function closeModal() {
  viewEventForm.style.display = "none";
  addEventForm.style.display = "none";
  modal.style.display = "none";
  clicked = null;
  generateCalendar(currentMonth.value, currentYear.value);
}

buttons();
generateCalendar(currentMonth.value, currentYear.value);