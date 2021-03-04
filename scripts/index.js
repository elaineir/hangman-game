"use strict";

//глобальные переменные
let currentPlayer = ""; //должна хранить имя игрока в текущей сессии

//игровая страница
const gameArea = document.querySelector(".game-area");
const backToMainPageFromGameBtn = gameArea.querySelector(".game-area__arrow-back");
const gameTimer = gameArea.querySelector(".game-area__timer");
const hintButton = gameArea.querySelector(".game-area__hint");
const score = gameArea.querySelector(".game-area__counter_score");
const lives = gameArea.querySelector(".game-area__counter_lives");
const wordContainer = gameArea.querySelector(".game-area__word");
const letterTemplate = gameArea.querySelector(".game-area__template");
const keyboardButtons = document.querySelectorAll(".keyboard__button");

//главное меню
const mainPage = document.querySelector(".main-menu");
const usernameForm = document.forms.usernameForm;
const usernameInput = document.querySelector(".form__input");
const submitNameButton = document.querySelector(".form__submit-btn");
const howToPlayButton = mainPage.querySelector(".main-menu__link_how-to-play");
const leaderboardButton = mainPage.querySelector(".main-menu__link_leaderboard");
const settingsButton = mainPage.querySelector('.main-menu__link_settings');

//режим игры
const levelsPage = document.querySelector(".levels");
const levelButtons = document.querySelectorAll(".levels__button");
const defaultLevelButton = levelsPage.querySelector(".levels__button_default");
const hardLevelButton = levelsPage.querySelector(".levels__button_hard");

//правила
const rulesPage = document.querySelector(".rules");

//лидерборд
const leaderboardPage = document.querySelector(".leaderboard");
const leaderboardSubheading = leaderboardPage.querySelector(".leaderboard__subheading");
const leaderboardTemplate = leaderboardPage.querySelector(".leaderboard__template");

//настройки
const settingsPage = document.querySelector(".settings");
const buttonSettingDark = document.getElementsByName("theme-dark");
const buttonSettingLight = document.getElementsByName("theme-light");
const buttonSettingCrazy = document.getElementsByName("theme-crazy");

//попапы завершения игры
const popupEndgameDefeat = document.querySelector(".endgame_defeat");
const correctWordText = popupEndgameDefeat.querySelector(".endgame__word");
const buttonEndgameDefeat = popupEndgameDefeat.querySelector(".endgame__button_defeat");

const popupEndgameVictory = document.querySelector(".endgame_victory");
const earnedPointsText = popupEndgameVictory.querySelector(".endgame__score");
const buttonEndgameVictory = popupEndgameVictory.querySelector(".endgame__button_victory");

//попап подсказки
const popupHint = document.querySelector(".hint");
const hintElementYear = popupHint.querySelector(".hint__element_year");
const hintTextYear = popupHint.querySelector(".hint__text_year");
const hintElementCountry = popupHint.querySelector(".hint__element_country");
const hintHeaderCountry = popupHint.querySelector(".hint__country");
const hintTextCountry = popupHint.querySelector(".hint__text_country");
const hintElementGenre = popupHint.querySelector(".hint__element_genre");
const hintHeaderGenre = popupHint.querySelector(".hint__genre");
const hintTextGenre = popupHint.querySelector(".hint__text_genre");
const hintGotItButton = popupHint.querySelector(".hint__button");

//общие кнопки и ссылки
const backToMainPageButton = document.querySelectorAll(".arrow-back_absolute");

//функционал
//общее
const openPopup = (popup) => popup.classList.add("popup_active");

const closePopup = (popup) => popup.classList.remove("popup_active");

const enableGameArea = () => gameArea.classList.remove("game-area_inactive");

const disableGameArea = () => {
    gameArea.classList.add("game-area_inactive");
    hideTimerAfterGame();
    clearWord();
    hintTextYear.textContent = "";
    hintHeaderCountry.textContent = "Страна";
    hintTextCountry.textContent = "";
    hintHeaderGenre.textContent = "Жанр";
    hintTextGenre.textContent = "";
    hintElementYear.classList.remove("hint__element_active");
    hintElementCountry.classList.remove("hint__element_active");
    hintElementGenre.classList.remove("hint__element_active");
};

const backToMainPage = (evt) => {
    evt.preventDefault(); //отмена стандартного события для ссылки
    evt.target.getAttribute("href").replace(""); //ссылки оставляют # в адресе, поэтому это исправляем
    const popup = evt.target.closest(".popup");
    closePopup(popup);
    openPopup(mainPage);
};

backToMainPageButton.forEach((link) => link.addEventListener("click", backToMainPage));

//main menu
//валидация
const handleValidation = () => {
    if (usernameInput.validity.valid) {
        submitNameButton.classList.add("form__submit-btn_active");
        submitNameButton.classList.remove("form__submit-btn_inactive");
        submitNameButton.disabled = false;
    } else {
        submitNameButton.classList.add("form__submit-btn_inactive");
        submitNameButton.classList.remove("form__submit-btn_active");
        submitNameButton.disabled = true;
    }
};

usernameInput.addEventListener("input", handleValidation);

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
    }
    closePopup(mainPage);
    openPopup(levelsPage);
};

const openHowToPlayPage = (evt) => {
    evt.preventDefault();
    howToPlayButton.getAttribute("href").replace("");
    closePopup(mainPage);
    openPopup(rulesPage);
};

const openLeaderboardPage = (evt) => {
    evt.preventDefault();
    leaderboardButton.getAttribute("href").replace("");
    clearLeaderboard();
    leaderboardHandler();
    closePopup(mainPage);
    openPopup(leaderboardPage);
};

const openSettingsPage = (evt) => {
    evt.preventDefault();
    settingsButton.getAttribute("href").replace("");
    closePopup(mainPage);
    openPopup(settingsPage);
}

usernameForm.addEventListener("submit", openLevelsPage);
howToPlayButton.addEventListener("click", openHowToPlayPage);
leaderboardButton.addEventListener("click", openLeaderboardPage);
settingsButton.addEventListener('click', openSettingsPage);

//levels menu
const getDifficulty = (button) => {
    if (button === defaultLevelButton) return "default";
    else return "hard";
};

const startGame = (evt) => {
    fetchFilm();
    hideHangman();
    makeKeyboardActive();
    const button = evt.target;
    const difficulty = getDifficulty(button);
    closePopup(levelsPage);
    enableGameArea();
    gameHandler(currentPlayer, difficulty); //основная игровая функция
};

levelButtons.forEach((button) => button.addEventListener("click", startGame));

//leaderboard section
const leaderboardHandler = () => {
    //проверка на наличие записей в localStorage
    if (Object.entries(localStorage).length > 0) {
        //собираем данные
        leaderboardSubheading.classList.add("leaderboard__subheading_hidden");

        let leaderboardArr = [];

        function arrangeLeaderboardData() {
            const leaderboardData = Array.from(Object.entries(localStorage));
            return (leaderboardArr = leaderboardData.sort((a, b) => {
                if (Number(a[1]) < Number(b[1])) return 1;
                if (Number(a[1]) > Number(b[1])) return -1;
                return 0;
            }));
        }

        arrangeLeaderboardData();
        console.log(leaderboardArr)
        //пишем на страницу
        leaderboardArr.forEach((entry) => {
            const leaderboardEntry = leaderboardTemplate.content.cloneNode(true);
            leaderboardEntry.querySelector(".leaderboard__username").textContent = entry[0];
            leaderboardEntry.querySelector(".leaderboard__score").textContent = Number(entry[1]);
            leaderboardPage.append(leaderboardEntry);
        });

        const leader = document.querySelector(".leaderboard__container");
        leader.classList.add("leaderboard__container_leader");
        leader.querySelector(".leaderboard__username").classList.add("leaderboard__username_leader");
    }
};

const clearLeaderboard = () => {
    const leaderbordEntries = document.querySelectorAll(".leaderboard__container");
    leaderbordEntries.forEach((entry) => entry.remove());
    leaderboardSubheading.classList.remove("leaderboard__subheading_hidden");
};

//game
//идём на кинопоиск и выбираем фильм. какой жанр предпочитаете? впрочем, тут как повезёт :)
async function fetchFilm() {
    let randomID = Math.floor(1000 + Math.random() * (999999 + 1 - 1000));
    let response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/${randomID}`, 
      { headers: {"X-API-KEY": "66d13bb0-94cd-485d-aee2-5932b4961127"} });
      
    if (response.status === 200) {
      let filmData = await response.json();
      checkFilmValidity(filmData);
    } else {
      console.clear();
      return fetchFilm();
    } 
}
  
const notAllowedLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.,?!:;+-/*%$#№@`~";
    function checkFilmValidity(filmData) {
        if(filmData.data.nameRu.length > 20) {
            return fetchFilm();
        } else {
            for (let i = 0; i < notAllowedLetters.length; i++) {
                if (filmData.data.nameRu.includes(notAllowedLetters[i])) return fetchFilm();
            }
        return renderWord(filmData);
    }
}
  
let selectedWordLetters = []; //буквы угадываемого слова
  
function renderWord(film) {
    selectedWordLetters = [];
    const selectedWord = film["data"]["nameRu"];

    for (let i = 0; i < selectedWord.length; i++) {
        selectedWordLetters.push(selectedWord[i].toUpperCase());
    }

    selectedWordLetters.forEach(letter => {
        const letterElement = letterTemplate.content.cloneNode(true);
        letterElement.querySelector(".game-area__letter").textContent = letter;
        if (letter === " ") {
            letterElement.querySelector(".game-area__letter-container").style.borderBottom = "none";
            letterElement.querySelector(".game-area__letter").classList.add("game-area__letter_opened");
        }
        wordContainer.append(letterElement);
    });

    //для попапа поражения
    correctWordText.textContent = selectedWord;

    //для попапа подсказки
    const filmKeys = Object.keys(film["data"]);
    console.log(film["data"]);
    filmKeys.forEach(key => {
        if (key === "year") {
            hintElementYear.classList.add("hint__element_active");
            hintTextYear.textContent = film["data"]["year"];
        }

        if (key === "countries") {
            hintElementCountry.classList.add("hint__element_active");
            const countriesArr = film["data"]["countries"];
            if (countriesArr.length === 1) {
                hintTextCountry.textContent = film["data"]["countries"][0]["country"];
            }
            if ((countriesArr.length > 1)) {
                hintHeaderCountry.textContent = "Страны";
                for (let i = 0; i < countriesArr.length; i++) {
                    if (i === countriesArr.length - 1) {
                        hintTextCountry.textContent += `${countriesArr[i]["country"]}`;
                    } else hintTextCountry.textContent += `${countriesArr[i]["country"]}, `;
                }
            }
        }

        if (key === "genres") {
            hintElementGenre.classList.add("hint__element_active");
            const genresArr = film["data"]["genres"];
            if (genresArr.length === 1) {
                hintTextGenre.textContent = film["data"]["genres"][0]["genre"];
            }
            if ((genresArr.length > 1)) {
                hintHeaderGenre.textContent = "Жанры";
                for (let i = 0; i < genresArr.length; i++) {
                    if (i === genresArr.length - 1) {
                        hintTextGenre.textContent += `${genresArr[i]["genre"]}`;
                    } else hintTextGenre.textContent += `${genresArr[i]["genre"]}, `;
                }
            }
        }
    });
}

const makeKeyboardActive = () => {
    keyboardButtons.forEach(button => button.classList.remove("keyboard__button_hidden"));
}

const hideHangman = () => {
    const hangmanParts = document.querySelectorAll(".game-area__path");
    hangmanParts.forEach(part => part.classList.remove("hangman-animation"));
}

const gameHandler = (currentPlayer, difficulty) => {
    let scorePointsBase = 0;
    let scorePoints = 0;
    let livesCounter = 10;
    let isHardLevel = false;
    let timeOut = false;

    if (difficulty === "default") {
        scorePoints = 5;
    } else {
        isHardLevel = true;
        gameTimer.textContent = "03 : 00";
        gameTimer.classList.add("game-area__timer_active");
        scorePoints = 10;
        startHardGameTimer();
    }

    //функция таймера
    function startHardGameTimer() {
        let duration = 180;
        let minutes = 0;
        let seconds = 0;
        let timer = setInterval(function () {
            if (gameArea.classList.contains("game-area_inactive")) {
                clearInterval(timer);
                isHardLevel - false;
            }

            if (popupEndgameDefeat.classList.contains("popup_active")) {
                clearInterval(timer);
                isHardLevel - false;
            }

            if (popupEndgameVictory.classList.contains("popup_active")) {
                clearInterval(timer);
                isHardLevel - false;
            }

            minutes = parseInt(duration / 60, 10);
            seconds = parseInt(duration % 60, 10);
      
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
      
            gameTimer.textContent = `${minutes} : ${seconds}`;
      
            if (--duration < 0) {
                timeOut = true; //для функции проверки GameOver
                clearInterval(timer);
                isHardLevel - false;
                disableGameArea();
                openPopup(popupEndgameDefeat);
            }
        }, 1000);
    }

    function showLetterOnClick(evt) {
        checkLetter(evt.target.textContent);
        evt.target.classList.add("keyboard__button_hidden");
    }

    let allowedLetters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ";

    function showLetterOnKeyboard(evt) {
        const pressedLetter = evt.key.toUpperCase();
        //проверка на посторонние клавиши
        if (allowedLetters.includes(pressedLetter)) {
            checkLetter(pressedLetter);
            const currentButton = Array.from(keyboardButtons).find((button) => button.textContent === evt.key.toUpperCase());
            currentButton.classList.add("keyboard__button_hidden");
            allowedLetters = allowedLetters.replace(pressedLetter, "");
        }
    }

    function checkLetter(pressedLetter) {
        let hasLetter = selectedWordLetters.some((letter) => letter == pressedLetter);
        if (hasLetter) {
            const currentWord = document.querySelectorAll(".game-area__letter");
            let counterMod = 0; //модификатор для очков, если букв больше 1
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i].textContent === pressedLetter) {
                    currentWord[i].classList.add("game-area__letter_opened");
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
            path.classList.add("hangman-animation");
        }
        isGameOver();
        isWordDone();
    }

    //функция проверки на окончание жизней или таймера
    function isGameOver() {
        if (livesCounter === 0 || timeOut) {
            openPopup(popupEndgameDefeat);
            document.removeEventListener("keydown", showLetterOnKeyboard);
            keyboardButtons.forEach((button) => button.removeEventListener("click", showLetterOnClick));
        }
    }

    //функция проверки на отгаданное слово
    function isWordDone() {
        let openedLetters = Array.from(document.querySelectorAll(".game-area__letter_opened"));
        if (openedLetters.length === selectedWordLetters.length) {
            earnedPointsText.textContent = scorePointsBase;
            openPopup(popupEndgameVictory);
            document.removeEventListener("keydown", showLetterOnKeyboard);
            keyboardButtons.forEach((button) => button.removeEventListener("click", showLetterOnClick));
            setlocalStorageJSONData(currentPlayer, (getlocalStorageData(currentPlayer) + scorePointsBase));
        }
    }

    const backToMainPageFromGame = (evt) => {
        evt.preventDefault();
        evt.target.getAttribute("href").replace("");
        if (isHardLevel) hideTimerAfterGame();
        disableGameArea();
        openPopup(mainPage);
        backToMainPageFromGameBtn.removeEventListener("click", backToMainPageFromGame);
        document.removeEventListener("keydown", showLetterOnKeyboard);
        keyboardButtons.forEach((button) => button.removeEventListener("click", showLetterOnClick));
    };

    document.addEventListener("keydown", showLetterOnKeyboard);
    keyboardButtons.forEach((button) => button.addEventListener("click", showLetterOnClick));
    backToMainPageFromGameBtn.addEventListener("click", backToMainPageFromGame);
};

const clearWord = () => {
    const letters = wordContainer.querySelectorAll(".game-area__letter-container");
    letters.forEach((letter) => letter.remove());
};

const hideTimerAfterGame = () => gameTimer.classList.remove("game-area__timer_active");

function showHintPopup() {
    openPopup(popupHint);
}

function closeHintPopup() {
    closePopup(popupHint);
}

const closeDefeatPage = () => {
    clearLeaderboard();
    leaderboardHandler();
    closePopup(popupEndgameDefeat);
    disableGameArea();
    openPopup(leaderboardPage);
}

const closeVictoryPage = () => {
    clearLeaderboard();
    leaderboardHandler();
    closePopup(popupEndgameVictory);
    disableGameArea();
    openPopup(leaderboardPage);
}

hintButton.addEventListener("click", showHintPopup);
hintGotItButton.addEventListener("click", closeHintPopup);
buttonEndgameDefeat.addEventListener("click", closeDefeatPage);
buttonEndgameVictory.addEventListener("click", closeVictoryPage);
