(function () {
    const carousels = document.querySelectorAll('[data-projects-carousel]');

    if (!carousels.length) {
        return;
    }

    carousels.forEach((carousel) => {
        const track = carousel.querySelector('[data-carousel-track]');
        const items = Array.from(track ? track.children : []);
        const prevButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');
        const pagination = carousel.querySelector('[data-carousel-pagination]');

        if (!track || !items.length || !pagination) {
            return;
        }

        let currentPage = 0;
        let pageCount = 1;
        let slidesPerView = 1;

        function getSlidesPerView() {
            if (window.matchMedia('(min-width: 64rem)').matches) {
                return 3;
            }

            if (window.matchMedia('(min-width: 48rem)').matches) {
                return 2;
            }

            return 1;
        }

        function getGap() {
            const styles = window.getComputedStyle(track);
            const gap = styles.columnGap || styles.gap || '0px';
            return parseFloat(gap) || 0;
        }

        function buildPagination() {
            pagination.innerHTML = '';

            for (let index = 0; index < pageCount; index += 1) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'cs-dot';
                dot.setAttribute('aria-label', `Go to project slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentPage = index;
                    updateCarousel();
                });

                pagination.appendChild(dot);
            }
        }

        function updateButtons() {
            if (prevButton) {
                prevButton.disabled = currentPage === 0;
            }

            if (nextButton) {
                nextButton.disabled = currentPage >= pageCount - 1;
            }
        }

        function updateDots() {
            const dots = Array.from(pagination.querySelectorAll('.cs-dot'));

            dots.forEach((dot, index) => {
                const isActive = index === currentPage;
                dot.classList.toggle('cs-active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        }

        function updateCarousel() {
            const itemWidth = items[0].getBoundingClientRect().width;
            const gap = getGap();
            const offset = currentPage * slidesPerView * (itemWidth + gap);

            track.style.transform = `translate3d(-${offset}px, 0, 0)`;

            updateButtons();
            updateDots();
        }

        function refreshCarousel() {
            slidesPerView = getSlidesPerView();
            pageCount = Math.max(1, Math.ceil(items.length / slidesPerView));

            if (currentPage > pageCount - 1) {
                currentPage = pageCount - 1;
            }

            buildPagination();
            updateCarousel();
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentPage = Math.max(0, currentPage - 1);
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentPage = Math.min(pageCount - 1, currentPage + 1);
                updateCarousel();
            });
        }

        let resizeTimer;

        window.addEventListener('resize', () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(refreshCarousel, 150);
        });

        refreshCarousel();
    });
})();