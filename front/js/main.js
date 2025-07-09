(function () {

    const apiURL = 'https://fav-prom.com/api_your_promo'


    let loader = document.querySelector(".spinner-overlay")
    let mainPage = document.querySelector(".fav-page")
    const promoStartDate = new Date("2025-05-05T00:00:00")
    const weekDuration = 10;


    const ukLeng = document.querySelector('#ukLeng');
    const enLeng = document.querySelector('#enLeng');

    const toggleClasses = (elements, className) => elements.forEach(el => el.classList.toggle(`${className}`));
    const toggleTranslates = (elements, dataAttr) => elements.forEach(el => {
        el.setAttribute('data-translate', `${dataAttr}`)
        el.innerHTML = i18nData[dataAttr] || '*----NEED TO BE TRANSLATED----*   key:  ' + dataAttr;
        el.removeAttribute('data-translate');
    });

    let loaderBtn = false

    let locale = "en"

    if (ukLeng) locale = 'uk';
    if (enLeng) locale = 'en';

    let debug = true

    if (debug) hideLoader()

    let i18nData = {};
    const translateState = true;
    let userId = null;

    const request = function (link, extraOptions) {
        return fetch(apiURL + link, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...(extraOptions || {})
        })
            .then(res => {
                if (!res.ok) throw new Error('API error');
                return res.json();
            })
            .catch(err => {
                console.error('API request failed:', err);

                reportError(err);

                document.querySelector('.fav-page').style.display = 'none';
                if (window.location.href.startsWith("https://www.favbet.hr/")) {
                    window.location.href = '/promocije/promocija/stub/';
                } else {
                    window.location.href = '/promos/promo/stub/';
                }

                return Promise.reject(err);
            });

    }

    function hideLoader(){
        loader.classList.add("hide")
        document.body.style.overflow = "auto"
        mainPage.classList.remove("loading")
    }

    function loadTranslations() {
        return request(`/new-translates/${locale}`)
            .then(json => {
                i18nData = json;
                translate();
                const targetNode = document.getElementById("goals-or-zeros-leage");
                const mutationObserver = new MutationObserver(function (mutations) {
                    mutationObserver.disconnect();
                    translate();
                    mutationObserver.observe(targetNode, { childList: true, subtree: true });
                });
                mutationObserver.observe(targetNode, {
                    childList: true,
                    subtree: true
                });

            });
    }


    function reportError(err) {
        const reportData = {
            origin: window.location.href,
            userid: userId,
            errorText: err?.error || err?.text || err?.message || 'Unknown error',
            type: err?.name || 'UnknownError',
            stack: err?.stack || ''
        };

        fetch('https://fav-prom.com/api-cms/reports/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        }).catch(console.warn);
    }

    function translate() {
        const elems = document.querySelectorAll('[data-translate]')
        if (elems && elems.length) {
            if(translateState){
                elems.forEach(elem => {
                    const key = elem.getAttribute('data-translate');
                    elem.innerHTML = i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
                    if (i18nData[key]) {
                        elem.removeAttribute('data-translate');
                    }
                })
            }else{
                console.log("translation works!")
            }
        }
        refreshLocalizedClass(mainPage);
    }

    function refreshLocalizedClass(element) {
        if (!element) {
            return;
        }
        for (const lang of ['uk', 'en']) {
            element.classList.remove(lang);
        }
        element.classList.add(locale);
    }


    function translateKey(key, defaultValue) {
        if (!key) {
            return;
        }
        let needKey = debug ? key : `*----NEED TO BE TRANSLATED----* key: ${key}`

        defaultValue =  needKey || key;
        return i18nData[key] || defaultValue;
    }


    // loadTranslations().then(init) запуск ініту сторінки

    //popups
    function setPopup(singleTriggerButton, popupClass) {
        const popupsContainer = document.querySelector('.popups');
        const popup = document.querySelector(`.popups__item.${popupClass}`);
        const popupBtn = popupsContainer.querySelector('.popups__item-btn');

        if (!singleTriggerButton || !popup || !popupsContainer) return;

        singleTriggerButton.addEventListener('click', () => {
            popupsContainer.classList.remove('_opacity');
            popupsContainer.classList.add(popupClass);
            document.body.style.overflow = 'hidden';
        });

        const btnClose = document.querySelector('.popups__item-closeBtn');

        popupsContainer.addEventListener('click', (e) => {
            if (e.target === popupsContainer || e.target === btnClose) {
                closePopup();
            }
        });

        popupBtn?.addEventListener('click', closePopup);

        function closePopup() {
            popupsContainer.classList.add('_opacity');
            popupsContainer.classList.remove(popupClass);
            document.body.style.overflow = '';
        }
    }

// Виклик функції:
    setPopup(document.querySelector('.rulesBtn'), 'rules');

    //Timer
    let timer;
    let compareDate = new Date('2025-07-15T00:00:00');

    timeBetweenDates(compareDate);

    timer = setInterval(function () {
        timeBetweenDates(compareDate);
    }, 1000);

    function timeBetweenDates(toDate) {
        let dateEntered = toDate;
        let now = new Date();
        let difference = dateEntered.getTime() - now.getTime();

        if (difference <= 0) {
            clearInterval(timer);
        } else {
            let minutes = Math.floor(difference / 60000);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);

            hours = hours - (days * 24);

            minutes %= 60;

            days = days.toString().padStart(2, '0');
            hours = hours.toString().padStart(2, '0');
            minutes = minutes.toString().padStart(2, '0');

            document.querySelector(".days").textContent = days;
            document.querySelector(".hours").textContent = hours;
            document.querySelector(".minutes").textContent = minutes;
        }
    }

    // TEST

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector(".menu-btn")?.addEventListener("click", () => {
            document.querySelector(".menu-test")?.classList.toggle("hide");
        });
    });

    document.querySelector('.dark-btn').addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

})();