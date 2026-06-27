(function () {
    function cleanPhoneNumber(href) {
        return href.replace('tel:', '').trim();
    }

    function sendPhoneClickEvent(link) {
        const href = link.getAttribute('href') || '';
        const phoneNumber = cleanPhoneNumber(href);
        const clickLocation = link.getAttribute('data-phone-location') || 'Unknown';
        const linkText = link.textContent.trim() || 'Phone Link';

        if (typeof gtag !== 'function') {
            return;
        }

        gtag('event', 'phone_click', {
            phone_number: phoneNumber,
            click_location: clickLocation,
            link_text: linkText,
            page_location: window.location.href,
            page_title: document.title
        });
    }

    document.addEventListener('click', function (event) {
        const phoneLink = event.target.closest('a[href^="tel:"]');

        if (!phoneLink) {
            return;
        }

        sendPhoneClickEvent(phoneLink);
    });
})();