var destiSwiper = new Swiper(".destiSwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
});

var heroSwiper = new Swiper(".heroSwiper", {
    slidesPerView: 1,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".hero-btn-next",
        prevEl: ".hero-btn-prev",
    },
});