/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
	return new Promise((resolve) => {
		let xhr = new XMLHttpRequest();

		xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', false);
		xhr.send();

		let xhrResponse = xhr.responseText;
		let cities = JSON.parse(xhrResponse);

		cities.sort((city1, city2) => {
			if (city1.name > city2.name) {
				return 1
			} else if (city1.name < city2.name) {
				return -1
			}

			return 0
		});

		resolve(cities);
	})
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return (full.toUpperCase().indexOf(chunk.toUpperCase()) >= 0);
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let promise = loadTowns();
let cityGlobal = [];

promise.then(cities => {
	loadingBlock.style.display = 'none';
	filterBlock.style.display = 'block';
    cityGlobal = cities;
});

filterInput.addEventListener('keyup', function() {
    // это обработчик нажатия кливиш в текстовом поле

    filterResult.innerHTML = null;

	let filterValue = filterInput.value;

	if (!filterValue) {
	    return
    }

    let filteredCities = cityGlobal.filter(city => {
        return isMatching(city.name, filterValue);
    });
    let fragment = document.createDocumentFragment();

    filteredCities.map(city => {
        let cityListItem = document.createElement('li');

        cityListItem.textContent = city.name;
		fragment.appendChild(cityListItem);
    });

	filterResult.appendChild(fragment);
});

export {
    loadTowns,
    isMatching
};
