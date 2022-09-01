//* input
document.querySelectorAll(".text-input").forEach((element) => {
    element.addEventListener("blur", (event) => {
        if (event.target.value != "") {
            event.target.nextElementSibling.classList.add("filled");
        } else {
            event.target.nextElementSibling.classList.remove("filled");
        }
    });
});

//* country
// let text = document.querySelector("#txtSearch").value = "türk";

document.querySelector("#btnSearch").addEventListener("click", () => {
    let text = document.querySelector('#txtSearch').value;
    document.querySelector("#details").style.opacity = 0;
    document.querySelector("#loading").style.display = "block";
    clearInterval(interval);
    getCountry(text);
});

document.querySelector("#btnLocation").addEventListener("click", () => {
    if (navigator.geolocation) {
        document.querySelector("#loading").style.display = "block";
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
});

function onError(err) {
    console.log(err);
    document.querySelector("#loading").style.display = "none";
}

async function onSuccess(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    // api, google, opencagedata
    const api_key = "da8f45ea6d7244c9b1a92a063cdab1c4";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;

    const response = await fetch(url);
    const data = await response.json();

    const country = data.results[0].components.country;

    document.querySelector("#txtSearch").value = country;
    document.querySelector("#btnSearch").click();
}

async function getCountry(country) {
    try {
        const response = await fetch('https://restcountries.com/v3.1/name/' + country);
        if (!response.ok) {
            document.querySelector("#details").style.display = "none";
            document.querySelector(".carousel").style.display = "block";
            throw new Error("ülke bulunamadı");
        }
        const data = await response.json();
        renderCountry(data[0]);
        // document.querySelector(".carousel").style.display = "block";

        const countries = data[0].borders;
        if (!countries)
            throw new Error("komşu ülke bulunamadı.");

        const response2 = await fetch('https://restcountries.com/v3.1/alpha?codes=' + countries.toString());
        const neighbors = await response2.json();

        renderNeighbors(neighbors);
    } catch (err) {
        renderError(err);
    }
}

function renderCountry(data) {
    document.querySelector("#details").style.display = "block";
    document.querySelector("#loading").style.display = "none";
    document.querySelector("#country-details").innerHTML = "";
    document.querySelector("#neighbors").innerHTML = "";
    document.querySelector(".carousel").style.display = "none";

    let html = `                   
        <div class="col-12 col-md-4 d-flex justify-content-center">
            <img src="${data.flags.png}" alt="" class="img-fluid">
        </div>
        <div class="col-12 col-md-8">
            <h3 class="card-title d-flex justify-content-center mt-2">${data.name.common}</h3>
            <hr>
            <div class="row">
                <div class="col-4">Nufüs: </div>
                <div class="col-8">${(data.population / 1000000).toFixed(1)} milyon</div>
            </div>
            <div class="row">
                <div class="col-4">Resmi Dil: </div>
                <div class="col-8">${Object.values(data.languages)}</div>
            </div>
            <div class="row">
                <div class="col-4">Başkent: </div>
                <div class="col-8">${data.capital[0]}</div>
            </div>
            <div class="row">
                <div class="col-4">Para Birimi: </div>
                <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
            </div>
        </div>
`;

    document.querySelector("#details").style.opacity = 1;
    document.querySelector("#country-details").innerHTML = html;
}

function renderNeighbors(data) {
    console.log(data);
    let html = "";
    for (let country of data) {
        html += `
        <div class="col-6 col-md-4 col-lg-2 mt-2">
            <div class="card card-neighbors-bg">                    
                <img src="${country.flags.png}" class="card-image-top img-fluid">  
                <div class="card-body">
                    <h6 class="card-text">${country.name.common}</h6>
                </div>
            </div>
        </div>
    `;

    }
    document.querySelector("#neighbors").innerHTML = html;
}

function renderError(err) {
    document.querySelector("#loading").style.display = "none";
    const html = `
    <div class="alert alert-danger">
        ${err.message}
    </div>
`;
    setTimeout(function() {
        document.querySelector("#errors").innerHTML = "";
    }, 3000);
    document.querySelector("#errors").innerHTML = html;
}


//* carousel-js
const models = [{
        name: 'Türkiye',
        image: 'img/1.jpg',
        link: 'https://goturkiye.com/'
    },
    {
        name: 'America',
        image: 'img/2.jpg',
        link: 'https://www.visittheusa.com/'
    },
    {
        name: 'Almanya',
        image: 'img/3.jpg',
        link: 'https://www.germany.travel/en/home.html'
    }
];

let index = 0;
let slaytCount = models.length;
let interval;

let settings = {
    duration: '2000',
    random: false
};

init(settings);

document.querySelector('.carousel-control-prev-icon').addEventListener('click', () => {
    index--;
    showSlide(index);
});

document.querySelector('.carousel-control-next-icon').addEventListener('click', () => {
    index++;
    showSlide(index);
});

document.querySelectorAll('.arrow').forEach((item) => {
    item.addEventListener('mouseenter', () => {
        clearInterval(interval);
    })
});

document.querySelectorAll('.arrow').forEach((item) => {
    item.addEventListener('mouseleave', () => {
        init(settings);
    })
});


function init(settings) {

    let prev;
    interval = setInterval(() => {

        if (settings.random) {
            do {
                index = Math.floor(Math.random() * slaytCount);
            } while (index == prev)
            prev = index;
        } else {
            if (slaytCount == index + 1) {
                index = -1;
            }
            showSlide(index);
            index++;
        }
        showSlide(index);

    }, settings.duration)

}

showSlide = (i) => {

    index = i;

    if (i < 0) {
        index = slaytCount - 1;
    }
    if (i >= slaytCount) {
        index = 0;
    }

    document.querySelector('.card-title').textContent = models[index].name;

    document.querySelector('.card-img-top').setAttribute('src', models[index].image);

}