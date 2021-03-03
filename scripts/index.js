'use strict';

//общее
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
  hideTimerAfterGame();
  clearWord();
};

const backToMainPage = (evt) => {
  evt.preventDefault(); //отмена стандартного события для ссылки
  evt.target.getAttribute('href').replace(''); //ссылки оставляют # в адресе, поэтому это исправляем
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

//валидация
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

//main menu сохранение в localStorage
let currentPlayer = '';  //должна хранить имя игрока в текущей сессии


// две универсальные функции для работы с localStorage, key - это имя игрока, value - это очки
const setlocalStorageJSONData = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
}

const getlocalStorageData = (key) => {
  return JSON.parse(localStorage.getItem(key));
}

//переходы по страницам
const openLevelsPage = (evt) => {
  evt.preventDefault();
  currentPlayer = usernameInput.value;
  if (getlocalStorageData(currentPlayer) === null) {
    setlocalStorageJSONData(currentPlayer, 0);
  }
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
  clearLeaderboard();
  leaderboardHandler();
  closePopup(mainPage);
  openPopup(leaderboardPage);
};

usernameForm.addEventListener('submit', openLevelsPage)
howToPlayButton.addEventListener('click', openHowToPlayPage);
leaderboardButton.addEventListener('click', openLeaderboardPage);


//levels menu
const levelButtons = document.querySelectorAll('.levels__button');
const lowLevelButton = document.querySelector('.levels__button_low');
const middleLevelButton = document.querySelector('.levels__button_middle');
const hardLevelButton = document.querySelector('.levels__button_hard');

const getDifficulty = (button) => {
  if (button === lowLevelButton) return 'low';
  else if (button === middleLevelButton) return 'middle';
  else return 'hard';
};

const startGame = (evt) => {
  const button = evt.target;
  const difficulty = getDifficulty(button);
  closePopup(levelsPage);
  enableGameArea();
  gameHadler(currentPlayer, difficulty);  //основная игровая функция
};

levelButtons.forEach(button => button.addEventListener('click', startGame));

//leaderboard section
let leaderboardSubheading = leaderboardPage.querySelector('.leaderboard__subheading');

const leaderboardHandler = () => {
  if (Object.entries(localStorage).length > 0) {  //проверка на наличие записей в localStorage
    leaderboardSubheading.classList.add('leaderboard__subheading_hidden');

    let leaderboardArr = [];

    function arrangeLeaderboardData() { //хммм...она работает? (≖_≖ )
      const leaderboardData = Array.from(Object.entries(localStorage));
      return leaderboardArr = leaderboardData.sort((a, b) => {
        //это полный кошмар, но пока так
        if (Number(a[1].slice(1, -1)) < Number(b[1].slice(1, -1))) return 1;
        if (Number(a[1].slice(1, -1)) > Number(b[1].slice(1, -1))) return -1;
        return 0;
      });
    }

    arrangeLeaderboardData();

    //TODO кусок кода ниже разбить на функции
    const leaderboardTemplate = document.querySelector('.leaderboard__template');
    leaderboardArr.forEach(entry => {
      const leaderboardEntry = leaderboardTemplate.content.cloneNode(true);
      leaderboardEntry.querySelector('.leaderboard__username').textContent = entry[0];
      if (Number(entry[1].slice(1)) > 0) {
        leaderboardEntry.querySelector('.leaderboard__score').textContent = Number(entry[1].slice(1));
      }
      leaderboardEntry.querySelector('.leaderboard__score').textContent = Number(entry[1].slice(1, -1)); //иначе NaN!
      leaderboardPage.append(leaderboardEntry);
    });

    const leader = document.querySelector('.leaderboard__container');
    leader.classList.add('leaderboard__container_leader');
    leader.querySelector('.leaderboard__username').classList.add('leaderboard__username_leader');
  }
};

const clearLeaderboard = () => {
  const leaderbordEntries = document.querySelectorAll('.leaderboard__container');
  leaderbordEntries.forEach(entry => entry.remove());
  leaderboardSubheading.classList.remove('leaderboard__subheading_hidden');
};

//game
const letterTemplate = document.querySelector('.game-area__template');
const wordContainer = document.querySelector('.game-area__word');
const gameTimer = document.querySelector('.game-area__timer');
const score = document.querySelector('.game-area__counter_score');
const lives = document.querySelector('.game-area__counter_lives');
const keyboardButtons = document.querySelectorAll('.keyboard__button');
//тестовый массив TODO удалить в релизе
const testingWords = ['лёгкийй', 'лёгйй', 'лйй', 'среднийй', 'среднийййй', 'тяжёлыйййййййййй', 'тяжёлыййййййййййвввв']


const gameHadler = (currentPlayer, difficulty) => {
  let letters = [];
  let scorePointsBase = 0;
  let scorePoints = 0;
  let livesCounter = 10;
  let minWordLength = 0;
  let maxWordLength = 0;

  if (difficulty === 'low') {
    maxWordLength = 7;
    scorePoints = 2;
  } else if (difficulty === 'middle') {
    minWordLength = 8;
    maxWordLength = 15;
    scorePoints = 5;
  } else {
    gameTimer.classList.add('game-area__timer_active');
    minWordLength = 16;
    maxWordLength = 20;
    scorePoints = 10;
  }

  function renderWord() {
    //заменить на парсер
    const words = testingWords.filter(word => word.length <= maxWordLength && word.length >= minWordLength);
    const word = words[Math.floor(Math.random() * 2)];
    //
    //letters - это массив букв из выбранного слова, клонируем темплейт и рендерим
    letters = word.toUpperCase().split('');
    
    letters.forEach(letter => {
      const letterElement = letterTemplate.content.cloneNode(true);
      letterElement.querySelector('.game-area__letter').textContent = letter;
      wordContainer.append(letterElement);
    });
  }

  renderWord();

  //TODO функция таймера - рекурсия с setTimeout и new Data, в дате взять минуты и сек, 
  //периодичность 1 сек
  //разделить в разметке таймер на 2 спана в обертке таймера для минут и сек соответственно

  function showLetterOnClick(evt) {
    checkLetter(evt.target.textContent);
  }

  function showLetterOnKeyboard(evt) {
    const pressedLetter = evt.key.toUpperCase();
    //TODO добавить проверку на посторонние клавиши - регулярка?
    checkLetter(pressedLetter);
  }

  function checkLetter(pressedLetter) {
    //TODO вызвать функцию проверки на окончание жизней или таймера
    //функцию проверки на отгаданное слово
    let hasLetter = letters.some(letter => letter == pressedLetter);
    if (hasLetter) {
      const currentWord = document.querySelectorAll('.game-area__letter');
      let counterMod = 0; //модификатор для очков, если букв больше 1
      for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i].textContent === pressedLetter) {
          currentWord[i].classList.add('game-area__letter_opened');
          counterMod++;
        }
      }
      //обновляем очки
      scorePointsBase += scorePoints * counterMod;
      score.textContent = scorePointsBase;
      //TODO сделать нективной нажатую правильную кнопку (класс keyboard__button_hidden)
    } else {
      livesCounter--;
      lives.textContent = livesCounter;
      //TODO рисуем виселицу, нужна анимация
    }
  }

  //TODO функция проверки на окончание жизней или таймера
  //в ней показать попап (готов)
  
  //TODO функция проверки на отгаданное слово
  //показать попап (готов)

  //TODO функция показать подсказку (готов)

  keyboardButtons.forEach(button => button.addEventListener('click', showLetterOnClick));
  document.addEventListener('keydown', showLetterOnKeyboard);
}

const clearWord = () => {
  const letters = wordContainer.querySelectorAll('.game-area__letter-container');
  letters.forEach(letter => letter.remove());
}

const hideTimerAfterGame = () => {
  gameTimer.classList.remove('game-area__timer_active');
  //остановить таймер
}