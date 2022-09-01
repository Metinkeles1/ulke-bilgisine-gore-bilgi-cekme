const panels = document.querySelectorAll(".panel");

panels.forEach((panel) => {
    panel.addEventListener("click", () => {
        removeActiveClasses();
        panel.classList.add("active");
    });
});

const removeActiveClasses = () => {
    panels.forEach((panel) => {
        panel.classList.remove("active");
    });
};

//* country data

function getRegion() {
    const btnCountries = document.querySelector('.btnCountriesAll');
    btnCountries.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-countries')) {
            document.querySelector(".loading-center").style.display = "block";
            let region = e.target.textContent.split("/");
            listCountry(region[1])
            e.target.href = "#countriesAll";
        }
    })
}

getRegion();

async function listCountry(region) {
    try {
        const response = await fetch('https://restcountries.com/v3.1/region/' + region);
        if (!response.ok) {
            document.querySelector(".loading-center").style.display = "none";
        }
        const data = await response.json();
        renderCountries(data);
    } catch (error) {
        console.log(error)
    }
}

function renderCountries(allCountries) {
    let click = 1;
    const detailsCountryBtn = document.querySelector('#detailsCountry');
    detailsCountryBtn.parentElement.style.display = "flex";
    let firstDisplayCountry = [];
    let detailsCountry = [];
    for (let i = 0; i < 12; i++) firstDisplayCountry.push(allCountries[i]);
    detailsCountryBtn.addEventListener('click', () => {
        click++;
        detailsCountryBtn.textContent = "Hidden";
        if (click % 2 === 0) {
            for (let i = 12; i < allCountries.length; i++) detailsCountry.push(allCountries[i]);
            displayCountry(firstDisplayCountry.concat(detailsCountry))
        } else {
            displayCountry(firstDisplayCountry);
            detailsCountryBtn.textContent = "Show";
        }
    })
    displayCountry(firstDisplayCountry);
}


function displayCountry(allCountries) {
    document.querySelector(".loading-center").style.display = "none";
    let html = "";

    for (let country of allCountries) {
        html += `
        <div class="card-country col-3 my-4 mx-4">
                <img src="${country.flags.png}" id="countryImg" class="img-fluid">
                <div class="card card-country-body">
                    <div id="countryTitle" class="card-title card-country-header">
                        <h3 class="my-2">${country.name.common}</h3>
                    </div>
                    <div id="countyrText" class="card-text card-country-text mx-2">
                        <div class="my-2">
                            <div class="d-inline">Başkent: </div>
                            <div class="d-inline">${country.capital}</div>
                        </div>
                        <div class="my-2">
                            <div class="d-inline">Bölge: </div>
                            <div class="d-inline">${country.region}</div>
                        </div>
                        <div class="my-2">
                            <div class="d-inline">Popülasyon: </div>
                            <div class="d-inline">${(country.population / 1000000).toFixed(1)} milyon</div>
                        </div>
                        <div class="my-2">
                            <div class="d-inline">Para Birimi: </div>
                            <div class="d-inline">${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol})</div>
                        </div>
                    </div>
                </div>
        </div>
        `;
    }
    document.querySelector('#countriesAll').innerHTML = html;
}