function openFeatures() {
    var allElems = document.querySelectorAll('.elem')//home page mei jis section ke andar sare cards h

    var fullElemPage = document.querySelectorAll('.fullElem')//cards ke andar ke individual pages ka parent section

    var allFullElemsBackBtn = document.querySelectorAll('.fullElem .back') //sare back buttons jo individual cards ke andar h

    var nav=document.querySelector('.cover')
    var main=document.querySelector('#main')
    var allElementsDiv=document.querySelector('.allElems')

    var header = document.querySelector('.header')
    //sare card click one par unka perticular page open karna
    allElems.forEach((elem) => {
        elem.addEventListener('click', () => {
            fullElemPage[elem.id].style.display = 'block' //jis bhi card par click hoga uska display none se block ho jayega
            header.style.display = 'none'
            nav.style.display='none'
            main.style.padding='0px'

            allElementsDiv.style.display='none'
            allElems.forEach(elem => {
                elem.style.display = 'none'   //jab koi card open hoga to home page ke elements hide ho jayenge

            })
        })
    })

    allFullElemsBackBtn.forEach((back) => {
        back.addEventListener('click', () => {
            fullElemPage[back.id].style.display = 'none' //jo card open tha uska display none
            header.style.display = 'flex'
            nav.style.display = 'flex'
            allElementsDiv.style.display='flex'
            main.style.padding='20px'

            allElems.forEach(elem => {
                elem.style.display = 'block'  //jab close button pe click hoga to sare home page ke sare elements firse visible ho jayenge (done for mobile view)
            })
        })
    })
}

openFeatures()

function toDoList() {

    var currentTask = []

    // Check karte hain ki localStorage mei pehle se koi task list saved hai ya nahi
    if (localStorage.getItem('currentTask')) {
        // Agar hai, to use parse karke currentTask array mei store karo
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    }
    else {
        // Agar nahi hai, to console mei message print karo
        console.log("task list is empty")
    }

    // Ye function sare tasks ko HTML ke format mei convert karke page pe show karta hai
    function renderTask() {

        var sum = ''
        var allTask = document.querySelector('.allTask')

        currentTask.forEach((elem, idx) => {
            // Har task ke liye ek card banake sum mei jodte jao
            sum += `<div class="task">
                        <div class="text">
                            <h3>${elem.task}<span class=${elem.imp}>IMP</span></h3>
                            <h5>${elem.details}</h5>
                        </div>
                        <button id=${idx}>Completed</button>
                    </div>`
        })

        // Sare tasks ko .allTask wale container ke andar daal do
        allTask.innerHTML = sum

        // Delete button ka function call karo
        deleteBtn()
    }

    renderTask()  // Page load hote hi existing tasks show karo

    // Form ke elements ko access karo
    let form = document.querySelector('.addTask form')
    let taskInput = document.querySelector('.addTask form #task-input')
    let taskDetailsInput = document.querySelector('.addTask form textarea')
    let taskCheckBox = document.querySelector('.addTask form .importantCheckBox input')

    // Jab user form submit kare (i.e. naya task add kare)
    form.addEventListener('submit', (e) => {
        e.preventDefault()  // Page reload hone se roko

        // Naya task currentTask array mei add karo
        currentTask.push({
            task: taskInput.value,
            details: taskDetailsInput.value,
            imp: taskCheckBox.checked
        })

        localStorage.setItem('currentTask', JSON.stringify(currentTask)) // Task list ko localStorage mei dobara save kar do because abhi kuch add hua hai

        // Naya task dikhane ke liye renderTask() call karo
        renderTask()

        // Form ko clear kar do (inputs ko reset)
        taskInput.value = ''
        taskDetailsInput.value = ''
        taskCheckBox.checked = false
    })

    // Ye function har "Completed" button pe click hone par task delete karta hai
    function deleteBtn() {
        var markCompletedBtn = document.querySelectorAll('.task button')

        markCompletedBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                console.log(btn.id)// Button ke id (i.e. index) ko use karke currentTask array se task hata do

                currentTask.splice(btn.id, 1)
                // Updated list dikhane ke liye renderTask() firse call karo

                localStorage.setItem('currentTask', JSON.stringify(currentTask)) // Task list ko localStorage mei dobara save kar do because abhi kuch delete hua hai

                renderTask()
            })
        })
    }

}

toDoList()

function dalilyPlanner() {
    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    var dayPlanner = document.querySelector('.day-planner');

    var hours = Array.from({ length: 18 }, function (elem, idx) {
        return `${6 + idx}:00 - ${7 + idx}:00`
    })

    var wholeDaySum = ''

    hours.forEach((elem, idx) => {
        var savedData = dayPlanData[idx] || ''
        wholeDaySum += `<div class="day-planner-time">
                        <p>${elem}</p>
                        <input id=${idx} type="text" placeholder="..." value="${savedData}">
                    </div>`
    })

    // Set the inputs into DOM first
    dayPlanner.innerHTML = wholeDaySum;

    // Now query them AFTER they exist
    var dayPlannerInput = document.querySelectorAll('.day-planner input');

    // Now attach event listeners
    dayPlannerInput.forEach((elem) => {
        elem.addEventListener('input', () => {
            dayPlanData[elem.id] = elem.value
            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })

}

dalilyPlanner()

function motivationalQuote() {
    let allFullElemsBackBtn = document.querySelectorAll('.fullElem .back')
    let motivationQuote = document.querySelector('.motivation-2 h1')
    let motivationauthor = document.querySelector('.motivation-3 h1')
    async function fetchQuote() {
        let response = await fetch('https://api.quotable.io/random')
        let data = await response.json()
        motivationQuote.innerHTML = data.content
        motivationauthor.innerHTML = `~${data.author}`
    }

    fetchQuote()
    allFullElemsBackBtn[2].addEventListener('click', function () {
        fetchQuote()
    })
}

motivationalQuote()

function pomodoroTimer() {

    let timer = document.querySelector('.pomo-timer h2')
    let startBtn = document.querySelector('.start-timer')
    let pauseBtn = document.querySelector('.pause-timer')
    let resetBtn = document.querySelector('.reset-timer')
    let session = document.querySelector('.session-type')
    var isWorkSession = true

    let totalSeconds = 25 * 60;
    let timerInterval = null;
    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        timer.innerHTML = `${minutes} : ${seconds < 10 ? '0' + seconds : seconds}`
    }

    function startTimer() {
        clearInterval(timerInterval)

        if (isWorkSession) {
            session.innerHTML = "Time to Study"
            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTimer();
                    startBtn.disabled = true;
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    startBtn.disabled = false;
                    startBtn.innerHTML = "Rest"
                    totalSeconds = 5 * 60
                    session.innerHTML = "Time to Rest! , press 'Rest' to start the rest timer"
                    updateTimer();
                }
            }, 1000)

        }

        else {
            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTimer();
                    startBtn.disabled = true;
                } else {
                    startBtn.innerHTML = "Start"
                    session.innerHTML = "Rest time over! Press 'Start' to start Study timer"
                    isWorkSession = true
                    totalSeconds = 25 * 60;
                    updateTimer();
                    clearInterval(timerInterval)
                    startBtn.disabled = false;
                }
            }, 1000)

        }


    }


    function pauseTimer() {
        clearInterval(timerInterval)
        startBtn.disabled = false;
    }
    function resetTimer() {
        clearInterval(timerInterval)
        if (isWorkSession) {
            totalSeconds = 25 * 60
        }
        else {
            totalSeconds = 5 * 60
        }
        startBtn.disabled = false;
        updateTimer();
    }
    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)
}

pomodoroTimer();

async function weatherApiCall() {
    var response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=0c9592515fcd4837877165257252607&q=Bhopal')

    var data = await response.json()
    console.log(data)
    function loadStats(info) {
        let temperature = document.querySelector('.temperature')
        let precipitation = document.querySelector('.precipitation')
        let humidity = document.querySelector('.humidity')
        let windSpeed = document.querySelector('.windSpeed')
        let weatherIcon = document.querySelector('.weatherIcon')
        let condition = document.querySelector('.condition')

        temperature.innerHTML = "Temperature: " + info.current.temp_c + "℃"

        humidity.innerHTML = "Humidity: " + info.current.humidity + "%"

        windSpeed.innerHTML = "Wind Speed: " + info.current.wind_kph + " Km/h"

        weatherIcon.src = "https:" + info.current.condition.icon

        condition.innerHTML = info.current.condition.text

        precipitation.innerHTML = "Precipitation: " + info.forecast.forecastday[0].day.daily_chance_of_rain + "%"
    }

    loadStats(data)
    function updateDayTime() {
    let dayTime = document.querySelector('.day_time');
    let now = new Date();
    let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let day = dayNames[now.getDay()];
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    let time = `${hours}:${minutes} ${ampm}`;

    dayTime.innerHTML = `${day}, ${time}`;
}

updateDayTime();
setInterval(updateDayTime, 60000);
}
weatherApiCall()

function changeTheme() {

    var theme = document.querySelector('.theme')
    var rootElement = document.documentElement

    var flag = 0
    theme.addEventListener('click', function () {

        if (flag == 0) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#222831')
            rootElement.style.setProperty('--tri1', '#948979')
            rootElement.style.setProperty('--tri2', '#393E46')
            flag = 1
        } else if (flag == 1) {
            rootElement.style.setProperty('--pri', '#F1EFEC')
            rootElement.style.setProperty('--sec', '#030303')
            rootElement.style.setProperty('--tri1', '#D4C9BE')
            rootElement.style.setProperty('--tri2', '#123458')
            flag = 2
        } else if (flag == 2) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#381c0a')
            rootElement.style.setProperty('--tri1', '#FEBA17')
            rootElement.style.setProperty('--tri2', '#74512D')
            flag = 0
        }

    })


}

changeTheme()