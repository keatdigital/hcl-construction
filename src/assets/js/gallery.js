(function () {
    const galleries = document.querySelectorAll('[data-gallery-filter]');
    const modal = document.querySelector('[data-gallery-modal]');
    const modalImage = modal ? modal.querySelector('.cs-modal-img') : null;
    const modalClose = modal ? modal.querySelector('[data-gallery-modal-close]') : null;

    const patternClasses = [
        'cs-pattern-1',
        'cs-pattern-2',
        'cs-pattern-3',
        'cs-pattern-4',
        'cs-pattern-5',
        'cs-pattern-6',
        'cs-pattern-7',
        'cs-pattern-8',
        'cs-pattern-9',
    ];

    let lastFocusedElement = null;

    function applyGridPattern(gallery) {
        const items = Array.from(gallery.querySelectorAll('[data-category]'));
        const visibleItems = items.filter((item) => !item.classList.contains('cs-hidden'));

        items.forEach((item) => {
            item.classList.remove(...patternClasses);
        });

        visibleItems.forEach((item, index) => {
            const patternClass = patternClasses[index % patternClasses.length];
            item.classList.add(patternClass);
        });
    }

    function animateVisibleItems(gallery) {
        const items = Array.from(gallery.querySelectorAll('[data-category]'));
        const visibleItems = items.filter((item) => !item.classList.contains('cs-hidden'));

        visibleItems.forEach((item, index) => {
            item.classList.remove('cs-filter-in');
            item.style.animationDelay = `${Math.min(index * 45, 225)}ms`;

            // Restarts the animation each time a filter is clicked.
            void item.offsetWidth;

            item.classList.add('cs-filter-in');

            item.addEventListener(
                'animationend',
                () => {
                    item.classList.remove('cs-filter-in');
                    item.style.animationDelay = '';
                },
                { once: true }
            );
        });
    }

    function openModal(picture) {
        if (!modal || !modalImage) {
            return;
        }

        const image = picture.querySelector('img');

        if (!image) {
            return;
        }

        lastFocusedElement = document.activeElement;

        modalImage.src = image.currentSrc || image.src;
        modalImage.alt = image.alt || 'Expanded project image';

        modal.classList.add('cs-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('cs-modal-open');

        if (modalClose) {
            modalClose.focus();
        }
    }

    function closeModal() {
        if (!modal || !modalImage) {
            return;
        }

        modal.classList.remove('cs-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('cs-modal-open');

        modalImage.src = '';
        modalImage.alt = '';

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && modal.classList.contains('cs-open')) {
            closeModal();
        }
    });

    if (!galleries.length) {
        return;
    }

    galleries.forEach((gallery) => {
        const buttons = Array.from(gallery.querySelectorAll('[data-filter]'));
        const items = Array.from(gallery.querySelectorAll('[data-category]'));

        applyGridPattern(gallery);

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');

                buttons.forEach((item) => {
                    item.classList.remove('cs-active');
                });

                button.classList.add('cs-active');

                items.forEach((item) => {
                    const categories = item.getAttribute('data-category').split(' ');

                    if (categories.includes(filter)) {
                        item.classList.remove('cs-hidden');
                    } else {
                        item.classList.add('cs-hidden');
                    }
                });

                applyGridPattern(gallery);
                animateVisibleItems(gallery);
            });
        });

        items.forEach((item) => {
            const image = item.querySelector('img');

            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');

            if (image && image.alt) {
                item.setAttribute('aria-label', `Open image: ${image.alt}`);
            } else {
                item.setAttribute('aria-label', 'Open project image');
            }

            item.addEventListener('click', () => {
                openModal(item);
            });

            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openModal(item);
                }
            });
        });
    });
})();