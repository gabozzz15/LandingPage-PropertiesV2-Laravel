document.addEventListener('DOMContentLoaded', function() {
    const sliderItems = document.querySelectorAll('.hero-slider .list .item');
    const nextBtn = document.getElementById('hero-next');
    const prevBtn = document.getElementById('hero-prev');
    const thumbnails = document.querySelectorAll('.thumbnail .item');

    let currentSlide = 0;
    const totalSlides = sliderItems.length;

    function showSlide(index) {
        // Remover clase active de todos los elementos
        sliderItems.forEach(item => item.classList.remove('active'));
        thumbnails.forEach(item => item.classList.remove('active'));

        // Añadir clase active al slide actual
        sliderItems[index].classList.add('active');
        thumbnails[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Botones de navegación
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Thumbnails
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Autoplay
    let autoplayInterval = setInterval(nextSlide, 5000);

    // Pausar autoplay al pasar el mouse
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    slider.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    // Mostrar el primer slide al cargar
    showSlide(0);
});