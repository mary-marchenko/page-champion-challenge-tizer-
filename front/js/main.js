(function () {

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

    setPopup(document.querySelector('.rulesBtn'), 'rules');

    //Timer
    let timer;
    let compareDate = new Date('2025-07-15T12:00:00');

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