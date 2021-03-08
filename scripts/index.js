'use strict';

//глобальные переменные
let currentPlayer = ''; //должна хранить имя игрока в текущей сессии

//игровая страница
const gameArea = document.querySelector('.game-area');
const backToMainPageFromGameBtn = gameArea.querySelector('.game-area__arrow-back');
const gameTimer = gameArea.querySelector('.game-area__timer');
const hintButton = gameArea.querySelector('.game-area__hint');
const score = gameArea.querySelector('.game-area__counter_score');
const lives = gameArea.querySelector('.game-area__counter_lives');
const wordContainer = gameArea.querySelector('.game-area__word');
const letterTemplate = gameArea.querySelector('.game-area__template');
const keyboardButtons = document.querySelectorAll('.keyboard__button');

//главное меню
const mainPage = document.querySelector('.main-menu');
const usernameForm = document.forms.usernameForm;
const usernameInput = document.querySelector('.form__input');
const submitNameButton = document.querySelector('.form__submit-btn');
const howToPlayButton = mainPage.querySelector('.main-menu__button_how-to-play');
const leaderboardButton = mainPage.querySelector('.main-menu__button_leaderboard');

//режим игры
const levelsPage = document.querySelector('.levels');
const levelButtons = document.querySelectorAll('.levels__button');
const easyLevelButton = levelsPage.querySelector('.levels__button_easy');
const defaultLevelButton = levelsPage.querySelector('.levels__button_default');
const hardLevelButton = levelsPage.querySelector('.levels__button_hard');
const loadingPopup = levelsPage.querySelector('.levels__loading');

//правила
const rulesPage = document.querySelector('.rules');

//лидерборд
const leaderboardPage = document.querySelector('.leaderboard');
const leaderboardSubheading = leaderboardPage.querySelector('.leaderboard__subheading');
const leaderboardBtnPlayAgain = leaderboardPage.querySelector('.leaderboard__button');
const leaderboardTemplate = leaderboardPage.querySelector('.leaderboard__template');

//попапы завершения игры
const popupEndgameDefeat = document.querySelector('.endgame_defeat');
const correctWordText = popupEndgameDefeat.querySelector('.endgame__word');
const buttonEndgameDefeat = popupEndgameDefeat.querySelector('.endgame__button_defeat');
const audioDefeat = popupEndgameDefeat.querySelector('.audio_defeat');
const volumeButtonDefeat = popupEndgameDefeat.querySelector('.volume-button_defeat');

const popupEndgameVictory = document.querySelector('.endgame_victory');
const earnedPointsText = popupEndgameVictory.querySelector('.endgame__score');
const buttonEndgameVictory = popupEndgameVictory.querySelector('.endgame__button_victory');
const audioVictory = popupEndgameVictory.querySelector('.audio_victory');
const volumeButtonVictory = popupEndgameVictory.querySelector('.volume-button_victory');

//попап подсказки
const popupHint = document.querySelector('.hint');
const hintElementYear = popupHint.querySelector('.hint__element_year');
const hintTextYear = popupHint.querySelector('.hint__text_year');
const hintElementCountry = popupHint.querySelector('.hint__element_country');
const hintHeaderCountry = popupHint.querySelector('.hint__country');
const hintTextCountry = popupHint.querySelector('.hint__text_country');
const hintElementGenre = popupHint.querySelector('.hint__element_genre');
const hintHeaderGenre = popupHint.querySelector('.hint__genre');
const hintTextGenre = popupHint.querySelector('.hint__text_genre');
const hintGotItButton = popupHint.querySelector('.hint__button');

//общие кнопки и ссылки
const backToMainPageButton = document.querySelectorAll('.arrow-back_absolute');

//функционал
//общее
const openPopup = (popup) => popup.classList.add('popup_active');

const closePopup = (popup) => popup.classList.remove('popup_active');

const enableGameArea = () => gameArea.classList.remove('game-area_inactive');

const disableGameArea = () => {
  gameArea.classList.add('game-area_inactive');
  hideTimerAfterGame();
  clearWord();
  //возвращаем меню подсказки к дефолтному состоянию
  hintElementYear.classList.remove('hint__element_active');
  hintElementCountry.classList.remove('hint__element_active');
  hintElementGenre.classList.remove('hint__element_active');
};

const backToMainPage = (evt) => {
  const popup = evt.target.closest('.popup');
  popup.classList.add('window-animation_hide');
  setTimeout(() => {
    closePopup(popup);
    openPopup(mainPage);
    popup.classList.remove('window-animation_hide');
    if (popup === leaderboardPage && !leaderboardBtnPlayAgain.classList.contains('leaderboard__button_hidden')) {
      leaderboardBtnPlayAgain.classList.add('leaderboard__button_hidden');
    }
  }, 300);
};

//функция запоминает последнего игрока даже после закрытия вкладки,
const showLastPlayer = () => {
  if ((Object.entries(localStorage).length > 1)) {
    usernameInput.value = getlocalStorageData('LastPlayerDONTDELETETHIS');
    submitNameButton.disabled = false;
    submitNameButton.classList.add('form__submit-btn_active');
    submitNameButton.classList.remove('form__submit-btn_inactive');
  }
};

backToMainPageButton.forEach((link) => link.addEventListener('click', backToMainPage));

//main menu
//валидация инпута ввода имени игрока
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
// две универсальные функции для работы с localStorage, key - это имя игрока, value - это очки
const setlocalStorageJSONData = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

const getlocalStorageData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

//переходы по страницам
const openLevelsPage = (evt) => {
  evt.preventDefault();
  currentPlayer = usernameInput.value;
  if (getlocalStorageData(currentPlayer) === null) {
    setlocalStorageJSONData(currentPlayer, 0);
    setlocalStorageJSONData('LastPlayerDONTDELETETHIS', currentPlayer);
  }
  closePopup(mainPage);
  openPopup(levelsPage);
};

const openHowToPlayPage = () => {
  closePopup(mainPage);
  openPopup(rulesPage);
};

const openLeaderboardPage = () => {
  clearLeaderboard();
  leaderboardHandler();
  closePopup(mainPage);
  openPopup(leaderboardPage);
};

usernameForm.addEventListener('submit', openLevelsPage);
howToPlayButton.addEventListener('click', openHowToPlayPage);
leaderboardButton.addEventListener('click', openLeaderboardPage);

//levels menu
const getDifficulty = (button) => {
  if (button === easyLevelButton) return 'easy';
  if (button === defaultLevelButton) return 'default';
  else return 'hard';
};

const startGame = (evt) => {
  const difficulty = getDifficulty(evt.target);
  easyLevelButton.disabled = true;
  defaultLevelButton.disabled = true;
  hardLevelButton.disabled = true;
  loadingPopup.classList.add('window-animation_show');
  loadingPopup.classList.add('levels__loading_active');
  fetchFilm(difficulty);
  setTimeout(() => {
    hideHangman();
    makeKeyboardActive();
    loadingPopup.classList.remove('window-animation_show');
    loadingPopup.classList.remove('levels__loading_active');
    closePopup(levelsPage);
    enableGameArea();
    gameHandler(currentPlayer, difficulty); //основная игровая функция
  }, 5000); //загрузка фильма зависит от соединения
};

levelButtons.forEach((button) => button.addEventListener('click', startGame));

//leaderboard section
const leaderboardHandler = () => {
  //проверка на наличие записей в localStorage
  if (Object.entries(localStorage).length > 0) {
    //собираем данные
    leaderboardSubheading.classList.add('leaderboard__subheading_hidden');

    let leaderboardArr = [];

    function arrangeLeaderboardData() {
      let leaderboardData = Array.from(Object.entries(localStorage));
      //исключаем запоминальщик последнего игрока
      leaderboardData = leaderboardData.filter(el => el[0] !== 'LastPlayerDONTDELETETHIS');
      //сортировка в порядке убывания очков
      return (leaderboardArr = leaderboardData.sort((a, b) => {
        if (Number(a[1]) < Number(b[1])) return 1;
        if (Number(a[1]) > Number(b[1])) return -1;
        return 0;
      }));
    }

    arrangeLeaderboardData();

    //пишем игроков на страницу
    leaderboardArr.forEach((entry) => {
      const leaderboardEntry = leaderboardTemplate.content.cloneNode(true);
      leaderboardEntry.querySelector('.leaderboard__username').textContent = entry[0];
      leaderboardEntry.querySelector('.leaderboard__score').textContent = Number(entry[1]);
      leaderboardPage.append(leaderboardEntry);
    });
        
//у нас есть лидер? проверяем, очков у него должно быть больше 0
    const leader = document.querySelector('.leaderboard__container');
    if (Number(leader.querySelector('.leaderboard__score').textContent) > 0) {
      leader.classList.add('leaderboard__container_leader');
      leader.querySelector('.leaderboard__username').classList.add('leaderboard__username_leader');
    }
  }
};

const clearLeaderboard = () => {
  const leaderbordEntries = document.querySelectorAll('.leaderboard__container');
  leaderbordEntries.forEach((entry) => entry.remove());
  leaderboardSubheading.classList.remove('leaderboard__subheading_hidden');
};

const playAgainFromLeaderboard = () => {
  leaderboardPage.classList.add('window-animation_hide');
  setTimeout(() => {
    closePopup(leaderboardPage);
    openPopup(levelsPage);
    leaderboardPage.classList.remove('window-animation_hide');
  }, 300);
  leaderboardBtnPlayAgain.classList.add('leaderboard__button_hidden');
};

leaderboardBtnPlayAgain.addEventListener('click', playAgainFromLeaderboard);

//game
//идём на кинопоиск и выбираем фильм. какой жанр предпочитаете? впрочем, тут как повезёт :)
async function fetchFilm(difficulty) {
  if (difficulty === 'easy') {
    //easy-peasy
    //с этой апишки приходит массив, в котором 20 фильмов из категории топ-100, поэтому страниц 5
    let randomPage = Math.floor(1 + Math.random() * 5);
    let randomfilm = Math.floor(1 + Math.random() * 20);
    let response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=${randomPage}`, 
                   { headers: {'X-API-KEY': '66d13bb0-94cd-485d-aee2-5932b4961127'} });
      
    if (response.status === 200) {
      let filmDataPage = await response.json();
      checkFilmValidity(filmDataPage['films'][randomfilm], difficulty);
    } else {
      console.clear();
      return fetchFilm(difficulty);
    } 
    
  } else {
    //default and hard
    let randomID = Math.floor(1000 + Math.random() * 1000998);
    let response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/${randomID}`, 
                   { headers: {'X-API-KEY': '66d13bb0-94cd-485d-aee2-5932b4961127'} });
      
    if (response.status === 200) {
      let filmData = await response.json();
      checkFilmValidity(filmData['data'], difficulty);
    } else {
      console.clear();
      return fetchFilm(difficulty);
    } 
  }
}

//мы не поддерживаем фильмы с такими символами в имени, сорри
const notAllowedLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890()[]{}«»\'"|.,?!:;+—-/*%$#№@`~';

const checkFilmValidity = (filmData, difficulty) => {
  if(filmData.nameRu.length > 18) {
    return fetchFilm(difficulty);
  } else {
    for (let i = 0; i < notAllowedLetters.length; i++) {
        if (filmData.nameRu.includes(notAllowedLetters[i])) return fetchFilm(difficulty);
    }
    return renderWord(filmData);
  }
};
  
let selectedWordLetters = []; //буквы угадываемого слова
  
const renderWord = (film) => {
  selectedWordLetters = [];
  const selectedWord = film['nameRu'];

  for (let i = 0; i < selectedWord.length; i++) {
    selectedWordLetters.push(selectedWord[i].toUpperCase());
  }

  selectedWordLetters.forEach(letter => {
  const letterElement = letterTemplate.content.cloneNode(true);
  letterElement.querySelector('.game-area__letter').textContent = letter;
  if (letter === ' ') {
    letterElement.querySelector('.game-area__letter-container').style.borderBottom = 'none';
    letterElement.querySelector('.game-area__letter').classList.add('game-area__letter_opened');
  }
  wordContainer.append(letterElement);
  });

  //для попапа поражения
  correctWordText.textContent = selectedWord;

  //для попапа подсказки
  //тут всё очень запутанно, куча проверок :)
  hintTextYear.textContent = '';
  hintHeaderCountry.textContent = 'Страна';
  hintTextCountry.textContent = '';
  hintHeaderGenre.textContent = 'Жанр';
  hintTextGenre.textContent = '';

  const filmKeys = Object.keys(film);

  filmKeys.forEach(key => {
    if (key === 'year') {
      if (film['year'] !== '') {
        hintElementYear.classList.add('hint__element_active');
        hintTextYear.textContent = film['year'];
      }
    }

    if (key === 'countries') {
      if (film['countries'][0]['country'] !== '') {
        hintElementCountry.classList.add('hint__element_active');
        const countriesArr = film['countries'];
        if (countriesArr.length === 1) {
          hintTextCountry.textContent = film['countries'][0]['country'];
        }
        if ((countriesArr.length > 1)) {
          hintHeaderCountry.textContent = 'Страны';
          for (let i = 0; i < countriesArr.length; i++) {
            if (i === countriesArr.length - 1) {
              hintTextCountry.textContent += `${countriesArr[i]['country']}`;
            } else hintTextCountry.textContent += `${countriesArr[i]['country']}, `;
          }
        }
      }
    }

    if (key === 'genres') {
      if (film['genres'][0]['genre'] !== '') {
        hintElementGenre.classList.add('hint__element_active');
        const genresArr = film['genres'];
        if (genresArr.length === 1) {
          hintTextGenre.textContent = film['genres'][0]['genre'];
        }
        if ((genresArr.length > 1)) {
          hintHeaderGenre.textContent = 'Жанры';
          for (let i = 0; i < genresArr.length; i++) {
            if (i === genresArr.length - 1) {
              hintTextGenre.textContent += `${genresArr[i]['genre']}`;
            } else hintTextGenre.textContent += `${genresArr[i]['genre']}, `;
          }
        }
      }
    }
  });
};

const makeKeyboardActive = () => {
  keyboardButtons.forEach(button => button.classList.remove('keyboard__button_hidden'));
};

const hideHangman = () => {
  const hangmanParts = document.querySelectorAll('.game-area__path');
hangmanParts.forEach(part => part.classList.remove('hangman-animation'));
};

//основная игровая функция
const gameHandler = (currentPlayer, difficulty) => {
  let scorePointsBase = 0;
  let scorePoints = 0; //определяет очки за каждую букву ниже
  let livesCounter = 10;
  let isHardLevel = false;
  let timeOut = false;
  score.textContent = scorePointsBase;
  lives.textContent = livesCounter;

  if (difficulty === 'easy') { 
    scorePoints = 5;
  }
  if (difficulty === 'default') { 
    scorePoints = 8;
  } 
  if (difficulty === 'hard') {
    isHardLevel = true;
    gameTimer.textContent = '02 : 00';
    gameTimer.classList.add('game-area__timer_active');
    scorePoints = 14;
    startHardGameTimer();
  }

  //функция таймера
  function startHardGameTimer() {
    let duration = 120;
    let minutes = 0;
    let seconds = 0;
    let timer = setInterval(function () {
      if (gameArea.classList.contains('game-area_inactive')) {
        clearInterval(timer);
      }

      if (popupEndgameDefeat.classList.contains('popup_active')) {
        clearInterval(timer);
      }

      if (popupEndgameVictory.classList.contains('popup_active')) {
        clearInterval(timer);
      }

      minutes = parseInt(duration / 60, 10);
      seconds = parseInt(duration % 60, 10);
      
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      
      gameTimer.textContent = `${minutes} : ${seconds}`;
      
      if (--duration < 0) {
        timeOut = true; //для функции проверки isGameOver
        clearInterval(timer);
        isGameOver();
      }
    }, 1000);
  }

  function showLetterOnClick(evt) {
    checkLetter(evt.target.textContent);
    evt.target.classList.add('keyboard__button_hidden');
  }

  let allowedLetters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

  function showLetterOnKeyboard(evt) {
    const pressedLetter = evt.key.toUpperCase();
    //проверка на посторонние клавиши
    if (allowedLetters.includes(pressedLetter)) {
      checkLetter(pressedLetter);
      const currentButton = Array.from(keyboardButtons).find((button) => button.textContent === evt.key.toUpperCase());
      currentButton.classList.add('keyboard__button_hidden');
      allowedLetters = allowedLetters.replace(pressedLetter, '');
    }
  }

  function checkLetter(pressedLetter) {
    let hasLetter = selectedWordLetters.some((letter) => letter == pressedLetter);
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
    } else {
      livesCounter--;
      lives.textContent = livesCounter;
      //анимация виселицы
      const path = document.querySelector(`#hangman${livesCounter + 1}`);
      path.classList.add('hangman-animation');
    }
    isGameOver();
    isWordDone();
  }

  //функция проверки на окончание жизней или таймера
  function isGameOver() {
    if (livesCounter === 0 || timeOut) {
      if (popupHint.classList.contains('popup_active')) {
        popupHint.classList.remove('popup_active');
        popupHint.classList.remove('window-animation_show');
      }
      playDefeatAnimation();
      audioDefeat.volume = 0.3;
      audioDefeat.play();
      openPopup(popupEndgameDefeat);
      document.removeEventListener('keydown', showLetterOnKeyboard);
      keyboardButtons.forEach((button) => button.removeEventListener('click', showLetterOnClick));
    }
  }

  //функция проверки на отгаданное слово
  function isWordDone() {
    let openedLetters = Array.from(document.querySelectorAll('.game-area__letter_opened'));
    if (openedLetters.length === selectedWordLetters.length) {
      earnedPointsText.textContent = scorePointsBase;
      audioVictory.volume = 0.2;
      audioVictory.play();
      openPopup(popupEndgameVictory);
      document.removeEventListener('keydown', showLetterOnKeyboard);
      keyboardButtons.forEach((button) => button.removeEventListener('click', showLetterOnClick));
      setlocalStorageJSONData(currentPlayer, (getlocalStorageData(currentPlayer) + scorePointsBase));
    }
  }

  const backToMainPageFromGame = () => {
    gameArea.classList.add('window-animation_hide');
    setTimeout(() => {
      if (isHardLevel) hideTimerAfterGame();
      disableGameArea();
      openPopup(mainPage);
      backToMainPageFromGameBtn.removeEventListener('click', backToMainPageFromGame);
      document.removeEventListener('keydown', showLetterOnKeyboard);
      keyboardButtons.forEach((button) => button.removeEventListener('click', showLetterOnClick));
      gameArea.classList.remove('window-animation_hide');
    }, 300);
  };

  document.addEventListener('keydown', showLetterOnKeyboard);
  keyboardButtons.forEach((button) => button.addEventListener('click', showLetterOnClick));
  backToMainPageFromGameBtn.addEventListener('click', backToMainPageFromGame);
  easyLevelButton.disabled = false;
  defaultLevelButton.disabled = false;
  hardLevelButton.disabled = false;
};

const clearWord = () => {
  const letters = wordContainer.querySelectorAll('.game-area__letter-container');
  letters.forEach((letter) => letter.remove());
};

const hideTimerAfterGame = () => gameTimer.classList.remove('game-area__timer_active');

const showHintPopup = () => {
  popupHint.classList.add('window-animation_show');
  openPopup(popupHint);
};

const closeHintPopup = () => {
  popupHint.classList.remove('window-animation_show');
  popupHint.classList.add('window-animation_hide-round');
  setTimeout(() => {
    closePopup(popupHint);
    popupHint.classList.remove('window-animation_hide-round');
  }, 500);
};

const closeDefeatPage = () => {
  location.reload();
};

const closeVictoryPage = () => {
  clearLeaderboard();
  leaderboardHandler();
  audioVictory.pause();
  audioVictory.currentTime = 0;
  leaderboardBtnPlayAgain.classList.remove('leaderboard__button_hidden');
  closePopup(popupEndgameVictory);
  disableGameArea();
  openPopup(leaderboardPage);
};

const toggleVolumeDefeat = () => {
  if (volumeButtonDefeat.classList.contains('volume-button_inactive')) {
    volumeButtonDefeat.classList.remove('volume-button_inactive');
    audioDefeat.play();
  } else {
    volumeButtonDefeat.classList.add('volume-button_inactive');
    audioDefeat.pause();
  }
};

const toggleVolumeVictory = () => {
  if (volumeButtonVictory.classList.contains('volume-button_inactive')) {
    volumeButtonVictory.classList.remove('volume-button_inactive');
    audioVictory.play();
  } else {
    volumeButtonVictory.classList.add('volume-button_inactive');
    audioVictory.pause();
  }
};

volumeButtonDefeat.addEventListener('click', toggleVolumeDefeat);
volumeButtonVictory.addEventListener('click', toggleVolumeVictory);
hintButton.addEventListener('click', showHintPopup);
hintGotItButton.addEventListener('click', closeHintPopup);
buttonEndgameDefeat.addEventListener('click', closeDefeatPage);
buttonEndgameVictory.addEventListener('click', closeVictoryPage);
showLastPlayer();

//анимация поражения, пусть будет всегда внизу  
const tl = new TimelineMax({ repeat: -1 });
  
const playDefeatAnimation = () => {

  noise();

  for (let i = 50; i--;) {
    tl.to(gameArea, R(0.03, 0.17), { opacity: R(0, 1), y: R(-1.5, 1.5) });
  }

  function R(max, min) {
    return Math.random() * (max - min) + min;
  };

  function noise () {
    let canvas, ctx;
    let wWidth, wHeight;
    let noiseData = [];
    let frame = 0;
    let loopTimeout;
      
    const createNoise = () => {
    const idata = ctx.createImageData(wWidth, wHeight);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;
      
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.5) {
        buffer32[i] = 0xff000000;
      }
    }
    noiseData.push(idata);
    };
      
    const paintNoise = () => {
      if (frame === 9) {
        frame = 0;
      } else {
        frame++;
      }
      ctx.putImageData(noiseData[frame], 0, 0);
    };
      
    const loop = () => {
      paintNoise(frame);
      
      loopTimeout = window.setTimeout(() => {
        window.requestAnimationFrame(loop);
      }, (1000 / 25));
    };
      
    const setup = () => {
      wWidth = window.innerWidth;
      wHeight = window.innerHeight;
      
      canvas.width = wWidth;
      canvas.height = wHeight;
      
      for (let i = 0; i < 10; i++) {
        createNoise();
      }
      
      loop();
    };
      
    const init = (() => {
      canvas = document.querySelector('.noise');
      ctx = canvas.getContext('2d');
      
      setup();
    })();
  };
};
