'use strict';

//general
const gameArea = document.querySelector('.game-area');
const mainPage = document.querySelector('.main-menu');
const levelsPage = document.querySelector('.levels');
const rulesPage = document.querySelector('.rules');
const leaderboardPage = document.querySelector('.leaderboard');
const backToMainPageButton = document.querySelectorAll('.arrow-back_absolute');
const backToMainPageFromGameBtn = document.querySelector('.game-area__arrow-back');

const openPopup = (popup) => {
  popup.classList.add('popup_active');
};

const closePopup = (popup) => {
  popup.classList.remove('popup_active');
};

const enableGameArea = () => {
  gameArea.classList.remove('game-area_inactive');
};

const disableGameArea = () => {
  gameArea.classList.add('game-area_inactive');
};

const backToMainPage = (evt) => {
  evt.preventDefault();
  evt.target.getAttribute('href').replace('');
  const popup = evt.target.closest('.popup');
  closePopup(popup);
  openPopup(mainPage);
};

const backToMainPageFromGame = (evt) => {
  evt.preventDefault();
  evt.target.getAttribute('href').replace('');
  disableGameArea();
  openPopup(mainPage);
};

backToMainPageFromGameBtn.addEventListener('click', backToMainPageFromGame);
backToMainPageButton.forEach(link => link.addEventListener('click', backToMainPage));

//main menu
const usernameForm = document.forms.usernameForm;
const howToPlayButton = document.querySelector('.main-menu__link_how-to-play');
const leaderboardButton = document.querySelector('.main-menu__link_leaderboard');

const openLevelsPage = (evt) => {
  evt.preventDefault();
  closePopup(mainPage);
  openPopup(levelsPage);
};

const openHowToPlayPage = (evt) => {
  evt.preventDefault();
  howToPlayButton.getAttribute('href').replace('');
  closePopup(mainPage);
  openPopup(rulesPage);
};

const openLeaderboardPage = (evt) => {
  evt.preventDefault();
  leaderboardButton.getAttribute('href').replace('');
  closePopup(mainPage);
  openPopup(leaderboardPage);
};

usernameForm.addEventListener('submit', openLevelsPage)
howToPlayButton.addEventListener('click', openHowToPlayPage);
leaderboardButton.addEventListener('click', openLeaderboardPage);

//validation
const usernameInput = document.querySelector('.form__input');
const submitNameButton = document.querySelector('.form__submit-btn');

const handleValidation = () => {
    if (usernameInput.validity.valid) {
      submitNameButton.classList.add('form__submit-btn_active');
      submitNameButton.classList.remove('form__submit-btn_inactive');
      submitNameButton.disabled = false;
    } else {
      submitNameButton.classList.add('form__submit-btn_inactive');
      submitNameButton.classList.remove('form__submit-btn_active');
      submitNameButton.disabled = true;
    }
};

usernameInput.addEventListener('input', handleValidation);


//levels menu
const levelButtons = document.querySelectorAll('.levels__button');
const lowLevelButton = document.querySelector('.levels__button_low');
const middleLevelButton = document.querySelector('.levels__button_middle');
const hardLevelButton = document.querySelector('.levels__button_hard');

const getLevel = (button) => {
  if (button === lowLevelButton) return 'low';
  else if (button === middleLevelButton) return 'middle';
  else return 'hard';
};

const startGame = (evt) => {
  const button = evt.target;
  let level = getLevel(button);
  closePopup(levelsPage);
  enableGameArea();
  gameHadler(level);  //общая функция для игры
};

levelButtons.forEach(button => button.addEventListener('click', startGame));


