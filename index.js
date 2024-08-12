const proxyURL = "https://e1n19tllva.execute-api.us-east-1.amazonaws.com/dev/";
const apiURL = "https://www.fotmob.com/api/";

var min = 0;
var sec = 0;

var statusElement;
var addedTimeIcon;
var addedTimeElement;
var homeNameElement;
var homeScoreElement;
var homeGradient1;
var homeGradient2;
var homeImage;
var awayNameElement;
var awayScoreElement;
var awayGradient1;
var awayGradient2;
var awayImage;

var homeColor1;
var homeColor2;
var homeColor3;
var awayColor1;
var awayColor2;
var awayColor3;

var updatedInterval;

var statusData = null;

function Init() {
    fetch(`${proxyURL}status`)
    .then(response => response.json())
    .then(data => {
        statusData = data; // 전역 변수에 저장
        initializeDocument();
        initializeContent(); // 데이터가 준비된 후 호출
        updatedInterval = setInterval(updatedContent, 1000);
    })
    .catch(error => {
        console.error('Error:', error)
    });
}

function teamBtn(isHome) {
    var element;
    var url;
    if (isHome) {
        element = document.getElementById("homeTeam");
        url = `${proxyURL}home?team=${element.value}`;
    }
    else {
        element = document.getElementById("awayTeam");
        url = `${proxyURL}away?team=${element.value}`;
    }
    jsonSetup(url);
    element.value = null;
}

function titleBtn() {
    var element;
    var url;
    element = document.getElementById("titleInput");
    url = `${proxyURL}game?title=${element.value}`;
    jsonSetup(url);
    element.value = null;
}

function colorBtn(isHome) {
    var url;
    if (isHome) {
        url = `${proxyURL}home?team=${homeNameElement.innerHTML}&baseColor1=${encodeURIComponent(homeColor1.value)}&baseColor2=${encodeURIComponent(homeColor2.value)}&textColor=${encodeURIComponent(homeColor3.value)}`;
    }
    else {
        url = `${proxyURL}away?team=${awayNameElement.innerHTML}&baseColor1=${encodeURIComponent(awayColor1.value)}&baseColor2=${encodeURIComponent(awayColor2.value)}&textColor=${encodeURIComponent(awayColor3.value)}`;
    }
    jsonSetup(url);
}

function addedTimeBtn() {
    var element = document.getElementById("addedTimeInput");
    var url = `${proxyURL}game?addedTime=${element.value}`;
    jsonSetup(url);
    element.value = null;
}

function setTimeBtn() {
    var element1 = document.getElementById("setMinInput");
    var element2 = document.getElementById("setSecInput");
    min = element1.value;
    sec = element2.value;
    // var url = `${proxyURL}game?min=${element1.value}&sec=${element2.value}`;
    // jsonSetup(url);
    element1.value = null;
    element2.value = null;
}

function timerStartBtn(m, s) {
    min = m;
    sec = s;
    var url = `${proxyURL}game?min=${min}&sec=${sec}&timer=true`;
    jsonSetup(url);
}

function BeginMatch() {
    min = 0;
    sec = 0;
    var url = `${proxyURL}game?timer=false&info=경기전&penalty=false&addedTime=0&home_score=0&home_ptScore=0&away_score=0&away_ptScore=0`;
    jsonSetup(url);
}

function halfTimeBtn() {
    var url = `${proxyURL}game?timer=false&info=하프타임&addedTime=0`;
    jsonSetup(url);
}

function fullTimeBtn() {
    var url = `${proxyURL}game?timer=false&info=풀타임&addedTime=0`;
    jsonSetup(url);
}

function penaltyBtn() {
    var url = `${proxyURL}game?timer=false&penalty=true&addedTime=0`;
    jsonSetup(url);
}

function scoreBtn(isHome, score) {
    var url;
    if (isHome) {
        url = `${proxyURL}game?home_score=${Number(homeScoreElement.innerHTML) + score}`;
    }
    else {
        url = `${proxyURL}game?away_score=${Number(awayScoreElement.innerHTML) + score}`;
    }
    jsonSetup(url);
}

function ptScoreBtn(isHome, score) {
    var url;
    const [currentHomeScore, currentAwayScore] = statusElement.innerHTML.split(' : ').map(score => parseInt(score, 10));
    if (isHome) {
        url = `${proxyURL}game?home_ptScore=${Number(currentHomeScore + score)}`;
    }
    else {
        url = `${proxyURL}game?away_ptScore=${Number(currentAwayScore + score)}`;
    }
    jsonSetup(url);
}

function ptScoreResetBtn() {
    var url = `${proxyURL}game?home_ptScore=0&away_ptScore=0`;
    jsonSetup(url);
}

function matchEndBtn() {
    var url = `${proxyURL}game?timer=false&info=경기종료&penalty=false&addedTime=0`;
    jsonSetup(url);
}

function jsonSetup(url) {
    fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
}

function initializeDocument() {
    statusElement = document.getElementById("n_633");
    addedTimeIcon = document.querySelector(".n_5");
    addedTimeElement = document.getElementById("n_0");
    homeNameElement = document.getElementById("home__q");
    homeScoreElement = document.getElementById("n_");
    homeGradient1 = document.getElementById("homeGradient1");
    homeGradient2 = document.getElementById("homeGradient2");
    homeImage = document.getElementById("homeTeam-image");
    awayNameElement = document.getElementById("away__q");
    awayScoreElement = document.getElementById("n__k");
    awayGradient1 = document.getElementById("awayGradient1");
    awayGradient2 = document.getElementById("awayGradient2");
    awayImage = document.getElementById("awayTeam-image");
    titleElement = document.getElementById("title");

    homeColor1 = document.getElementById("homeColor1");
    homeColor2 = document.getElementById("homeColor2");
    homeColor3 = document.getElementById("homeColor3");
    awayColor1 = document.getElementById("awayColor1");
    awayColor2 = document.getElementById("awayColor2");
    awayColor3 = document.getElementById("awayColor3");
}

function initializeContent() {
    if (statusData) {
        statusElement.innerHTML = statusData.gameInfo.info;
        addedTimeElement.innerHTML = "";
        addedTimeIcon.classList.add("disabled-svg");
        homeNameElement.innerHTML = statusData.homeTeam.home_display;
        homeGradient1.style.stopColor = statusData.homeTeam.home_baseColor1;
        homeGradient2.style.stopColor = statusData.homeTeam.home_baseColor2;
        homeImage.setAttribute('href', statusData.homeTeam.home_img);
        document.documentElement.style.setProperty('--homeTextColor', statusData.homeTeam.home_textColor);
        homeScoreElement.innerHTML = statusData.gameInfo.home_score;
        awayNameElement.innerHTML = statusData.awayTeam.away_display;
        awayGradient1.style.stopColor = statusData.awayTeam.away_baseColor1;
        awayGradient2.style.stopColor = statusData.awayTeam.away_baseColor2;
        awayImage.setAttribute('href', statusData.awayTeam.away_img);
        document.documentElement.style.setProperty('--awayTextColor', statusData.awayTeam.away_textColor);
        awayScoreElement.innerHTML = statusData.gameInfo.away_score;
        titleElement.innerHTML = statusData.gameInfo.title;

        min = statusData.gameInfo.min;
        sec = statusData.gameInfo.sec;

        homeColor1.value = statusData.homeTeam.home_baseColor1;
        homeColor2.value = statusData.homeTeam.home_baseColor2;
        homeColor3.value = statusData.homeTeam.home_textColor;
        awayColor1.value = statusData.awayTeam.away_baseColor1;
        awayColor2.value = statusData.awayTeam.away_baseColor2;
        awayColor3.value = statusData.awayTeam.away_textColor;
    }
}

function updatedContent() {
    fetch(`${proxyURL}status`)
    .then(response => response.json())
    .then(data => {
        const homeUpdate = new Promise(resolve => {
            homeNameElement.innerHTML = data.homeTeam.home_display;
            homeGradient1.style.stopColor = data.homeTeam.home_baseColor1;
            homeGradient2.style.stopColor = data.homeTeam.home_baseColor2;
            homeImage.setAttribute('href', data.homeTeam.home_img);
            document.documentElement.style.setProperty(`--homeTextColor`, data.homeTeam.home_textColor);
            homeScoreElement.innerHTML = data.gameInfo.home_score;
            resolve();
        });

        const awayUpdate = new Promise(resolve => {
            awayNameElement.innerHTML = data.awayTeam.away_display;
            awayGradient1.style.stopColor = data.awayTeam.away_baseColor1;
            awayGradient2.style.stopColor = data.awayTeam.away_baseColor2;
            awayImage.setAttribute('href', data.awayTeam.away_img);
            document.documentElement.style.setProperty(`--awayTextColor`, data.awayTeam.away_textColor);
            awayScoreElement.innerHTML = data.gameInfo.away_score;
            resolve();
        });

        return Promise.all([homeUpdate, awayUpdate]).then(() => {
            if (data.gameInfo.penalty) {
                statusElement.innerHTML = `${data.gameInfo.home_ptScore} : ${data.gameInfo.away_ptScore}`;
            } else if (data.gameInfo.timer) {
                sec++;
                if (sec >= 60) {
                    sec = 0;
                    min++;
                }
                statusElement.innerHTML = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
                jsonSetup(`${proxyURL}game?min=${min}&sec=${sec}`);
            } else {
                statusElement.innerHTML = data.gameInfo.info;
            }

            if (data.gameInfo.addedTime > 0) {
                addedTimeElement.innerHTML = `+${data.gameInfo.addedTime}`;
                addedTimeIcon.classList.remove("disabled-svg");
            } else {
                addedTimeElement.innerHTML = "";
                addedTimeIcon.classList.add("disabled-svg");
            }

            titleElement.innerHTML = data.gameInfo.title;

            // homeColor1.value = data.homeTeam.home_baseColor1;
            // homeColor2.value = data.homeTeam.home_baseColor2;
            // homeColor3.value = data.homeTeam.home_textColor;
            // awayColor1.value = data.awayTeam.away_baseColor1;
            // awayColor2.value = data.awayTeam.away_baseColor2;
            // awayColor3.value = data.awayTeam.away_textColor;
        });
    })
    .catch(error => {
        console.error('Error:', error)
    });
}

document.addEventListener('DOMContentLoaded', Init);
