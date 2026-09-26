"use strict";

// ДЗ 3. Интерактивная коллекция.
// Выполняйте практические этапы из docs/HOME_WORK.md по порядку.
// Не пытайтесь написать весь файл за один раз: после каждого этапа проверяйте
// связанный сценарий в браузере и фиксируйте рабочее состояние коммитом.

// Этап 3. Найдите карточки и элементы панели подробностей.
// Реализуйте одну общую функцию выбора карточки.

// Этап 4. Найдите кнопки фильтров.
// Показывайте подходящие карточки, обновляйте активную кнопку и счетчик.
// Учтите случай, когда новый фильтр скрывает выбранную карточку.

// Этап 5. Реализуйте случайный выбор среди видимых карточек.
// Затем реализуйте полный сброс интерфейса.

// Этап 6. Запускайте подготовленную CSS-анимацию через класс.
// Не дублируйте оформление в script.js.

const cards = document.querySelectorAll(".collection-card");

const detailsTitle = document.querySelector("#details-title");
const detailsDescription = document.querySelector("#details-description");
const detailsPanel = document.querySelector("#details-panel");

const filterButtons = document.querySelectorAll(".filter-button");
const visibleCount = document.querySelector("#visible-count");

const randomButton = document.querySelector("#random-button");

function selectCard(card) {
  cards.forEach((item) => {
    item.classList.remove("collection-card--selected");
    item.setAttribute("aria-pressed", "false");
  });

  card.classList.add("collection-card--selected");
  card.setAttribute("aria-pressed", "true");

  detailsTitle.textContent = card.dataset.title;
  detailsDescription.textContent = card.dataset.description;

  detailsPanel.classList.remove("details-panel--pulse");

  requestAnimationFrame(() => {
    detailsPanel.classList.add("details-panel--pulse");
  });
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    selectCard(card);
  });
});


function filterCards(category) {
  let count = 0;

  cards.forEach((card) => {
    const isVisible =
      category === "all" || card.dataset.category === category;

    if (isVisible) {
      card.classList.remove("collection-card--hidden");
      count++;
    } else {
      card.classList.add("collection-card--hidden");
    }
  });

  visibleCount.textContent = count;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;

    button.classList.toggle("filter-button--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

   const selectedCard = document.querySelector(
    ".collection-card--selected"
  );

  if (
    selectedCard &&
    selectedCard.classList.contains("collection-card--hidden")
  ) {
    selectedCard.classList.remove("collection-card--selected");
    selectedCard.setAttribute("aria-pressed", "false");

    detailsTitle.textContent = "Выберите город";
    detailsDescription.textContent =
      "Здесь появится описание выбранного города. Выберите карточку, чтобы узнать о нём подробнее.";
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterCards(button.dataset.filter);
  });
});

randomButton.addEventListener("click", () => {
  const visibleCards = Array.from(cards).filter(
    (card) => !card.classList.contains("collection-card--hidden")
  );

  const selectedCard = document.querySelector(
    ".collection-card--selected"
  );

  let availableCards = visibleCards;

  if (selectedCard && visibleCards.length > 1) {
    availableCards = visibleCards.filter(
      (card) => card !== selectedCard
    );
  }

  const randomIndex = Math.floor(
    Math.random() * availableCards.length
  );

  const randomCard = availableCards[randomIndex];

  selectCard(randomCard);
});