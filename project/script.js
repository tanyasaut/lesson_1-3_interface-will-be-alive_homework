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
const resetButton = document.querySelector("#reset-button");

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

function resetInterface() {
  cards.forEach((card) => {
    card.classList.remove("collection-card--hidden");
    card.classList.remove("collection-card--selected");
    card.setAttribute("aria-pressed", "false");
  });

  filterButtons.forEach((button) => {
    const isAll = button.dataset.filter === "all";

    button.classList.toggle("filter-button--active", isAll);
    button.setAttribute("aria-pressed", String(isAll));
  });

  visibleCount.textContent = cards.length;

  detailsTitle.textContent = "Выберите город";
  detailsDescription.textContent =
    "Здесь появится описание выбранного города. Выберите карточку, чтобы узнать о нём подробнее.";

  detailsPanel.classList.remove("details-panel--pulse");
}

resetButton.addEventListener("click", resetInterface);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    resetInterface();
    return;
  }

  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
    return;
  }

  const visibleCards = Array.from(cards).filter(
    (card) => !card.classList.contains("collection-card--hidden")
  );

  if (visibleCards.length === 0) {
    return;
  }

  const selectedCard = visibleCards.find(
    (card) => card.classList.contains("collection-card--selected")
  );

  let nextIndex;

  if (!selectedCard) {
    nextIndex = event.key === "ArrowRight"
      ? 0
      : visibleCards.length - 1;
  } else {
    const currentIndex = visibleCards.indexOf(selectedCard);

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % visibleCards.length;
    } else {
      nextIndex =
        (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    }
  }

  event.preventDefault();

  const nextCard = visibleCards[nextIndex];

  selectCard(nextCard);
  nextCard.focus();
});