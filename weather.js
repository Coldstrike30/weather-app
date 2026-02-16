const search = document.getElementById('searchInput');
const searchBtn = document.getElementById('SearchBtn');
const realtemp = document.getElementById('TodayTemp');
const card = document.querySelector('.card');
const forecast = document.getElementById('forecastsection')
const container = document.getElementById('ForecastContainer');
const empty = document.getElementById('emptyState');
const daily = document.getElementById('dailyForecast');
const hourly = document.getElementById('timeTempContainer');
const filter = document.getElementById('forecastFilter');
renderPage();


searchBtn.addEventListener("click", onSubmit);
filter.addEventListener("click", filterSelect);




let weekdayName =[];

async function fetchData(query) {
    try{
       
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=3ece03829e6540d6a27101023260602&q=${query}&days=7&aqi=no&alerts=no`);
        const data = await response.json();

        return data;
        
        
    }catch(error){
        console.error(error);
    }
};

async function onSubmit(e) {
    e.preventDefault();

    card.innerHTML = "";
    forecast.innerHTML = "";
    daily.innerHTML = "";
    hourly.innerHTML = "";

    const query = search.value;
    
    const result = await fetchData(query);
    weekdayName = DateTransform(result.forecast.forecastday);
    
    weekdayName.map(day => {
        weekdayName[0].weekday = "Today";
        weekdayName[1].weekday = "Tomorrow";
        return weekdayName;
    });

    weekdayName.forEach((day) => {
        day.formattedhours = day.hour.map(hourObj => {
        const time = new Date(hourObj.time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                hour12: true });

                return {
                    time,
                    temp: hourObj.temp_c,
                };
                
        });
    });

   

    
    

    

    if (!query) return alert("please fill out the form");

    const country = document.createElement('div');
    country.classList.add('country-date');
    country.innerHTML = `<h1 id="countryLocation" class = "Country">${result.location.country}, 
    ${result.location.region}</h1>
        <p id = "DateTime" class = "Date">${result.location.localtime}</p>
        </div> `;
    const current = document.createElement('div');
    current.classList.add('emoji-temp');
    current.innerHTML = `<P class = "Emoji">☀️</P>
        <p id = "TodayTemp" class = "Temp"> ${Math.round(result.current.temp_c)}&deg; </p>
        </div>`;
    const foreTemp = document.createElement('div');
    foreTemp.classList.add('forecast-card');
    foreTemp.innerHTML = `<span>Feels like....</span>
                    <p>${Math.round(result.current.temp_c)} &deg;C</p>


                </div>`;
    const foreHumi = document.createElement('div');
    foreHumi.classList.add('forecast-card');
    foreHumi.innerHTML = `<span>Humidity</span>
                    <p>${Math.round(result.current.humidity)}% </p>


                </div>`;
    const foreWind = document.createElement('div');
    foreWind.classList.add('forecast-card');
    foreWind.innerHTML = `<span>Wind</span>
                    <p>${Math.round(result.current.wind_kph)}&nbsp;km/h</p>


                </div>`;
    const forePrec = document.createElement('div');
    forePrec.classList.add('forecast-card');
    forePrec.innerHTML = `<span>Precipitation</span>
                    <p>${Math.round(result.current.precip_mm)}&nbsp;mm</p>


                </div>`;
    weekdayName.forEach((cards) => {
    const dailyCard = document.createElement('button');
    dailyCard.classList.add('daily-card');
    dailyCard.innerHTML = `<p>${cards.weekday}</p>
                    <span id="dailyEmoji">☀️</span>
                    <span class="highLow">
                      <span id="tueHigh" class="High">${Math.round(cards.day.maxtemp_c)}&deg;</span>
                      <span id="tuelOW" class="Low">${Math.round(cards.day.mintemp_c)}&deg;</span>

                    </span>
                    
                  </button>`;
                  daily.appendChild(dailyCard);
    });
    
        
        card.appendChild(country);
        card.appendChild(current);
        forecast.appendChild(foreTemp);
        forecast.appendChild(foreHumi);
        forecast.appendChild(foreWind);
        forecast.appendChild(forePrec);
        
        renderPage();
        filterSelect();

};

function renderPage() {
  const x = document.querySelectorAll('.country-date').length;

  if (x > 0) {
    empty.style.display = "none";
    container.style.display = "flex"
  }else {
    container.style.display = "none";
    empty.style.display = "block";
  };
};

function DateTransform (trans) {

return trans.map(day =>  {
    const dateObj = new Date(day.date);
    
    const weekday = dateObj.toLocaleDateString('en-US', {weekday: 'long'});
    const dateday = dateObj.toLocaleDateString('en-US', {weekday: 'long'});
   
    return {
    weekday,
    dateday,
    
    hour : day.hour,
    day : day.day,
    date : day.date,
   

    };
    
});


};

function filterSelect() {
    hourly.innerHTML = "";
    const selectDay =  weekdayName.find(day => day.dateday === filter.value);
    console.log(selectDay);

            selectDay.formattedhours.forEach((hour) => {
            const timeTemp = document.createElement('button');;
            timeTemp.classList.add('time-temp');
            timeTemp.innerHTML = `<div class="hourly-emoji">
            <span id="hourlyEmoji">☀️</span>
            <p id="hourlyTime">${hour.time}</p>

            </div>
            <div class="hourly-temp">
            <span id="hourlyTemp">${Math.round(hour.temp)}</span>

            </div>
            </button>`;
            hourly.appendChild(timeTemp);
            });

};





