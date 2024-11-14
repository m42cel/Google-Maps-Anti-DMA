// ==UserScript==
// @name         Google Maps Anti-DMA
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Make Google Maps preview clickable again
// @author       m42cel
// @source       https://github.com/m42cel/Google-Maps-Anti-DMA
// @match        https://www.google.com/search*
// @match        https://www.google.de/search*
// @icon         https://www.google.com/images/branding/product/ico/maps_32dp.ico
// @icon64       https://www.google.com/images/branding/product/ico/maps_64dp.ico
// @updateURL    https://github.com/m42cel/Google-Maps-Anti-DMA/raw/master/Google%20Maps%20Anti-DMA.user.js
// @downloadURL  https://github.com/m42cel/Google-Maps-Anti-DMA/raw/master/Google%20Maps%20Anti-DMA.user.js
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    function findMapsPreview() {
        // Select all parent divs with a jsname attribute
        const parentDivs = document.querySelectorAll('div[jsname]');

        const searchPatterns = [
            'g-img[id="lu_map"]',
            'img[src^="/maps/vt/data"]',
            'img[id^="dimg_"][src^="data:image/png;base64"][data-csiid][data-atf="1"]',
        ];

        for (const parentDiv of parentDivs) {
            // Find the img element within the parent div that matches the pattern
            for (const pattern of searchPatterns) {
                let imgElement = parentDiv.querySelector(pattern);

                if (imgElement) {
                    console.debug('Found Google Maps preview image by element pattern:', imgElement);
                    return imgElement;
                }
            }
        }

        console.debug('Google Maps preview image not found');
        return null;
    }

    function getGoogleMapsLink() {
        // Get the search query from the URL
        const searchQuery = new URLSearchParams(window.location.search).get('q');
        // Construct the Google Maps link with the query
        return `http://maps.google.com/maps?q=${searchQuery}`;
    }

    function addLinkToImage(imgElement, linkUrl) {
        const anchor = document.createElement('a');
        anchor.href = linkUrl;

        // Insert the anchor before the img element
        imgElement.parentNode.insertBefore(anchor, imgElement);

        // Move the img element inside the anchor
        anchor.appendChild(imgElement);
    }

    let tries = 0;
    function fixMapLink() {
        tries++;

        let mapsPreview = findMapsPreview();

        if (mapsPreview) {
            let mapsLink = getGoogleMapsLink();
            addLinkToImage(mapsPreview, mapsLink);
        }

        // If the method is scheduled (timerId is defined) and we found the preview or reached the max tries stop the schedule
        if (timerId && (mapsPreview || tries >= MAX_TRIES)) {
            clearInterval(timerId);
        }

        return mapsPreview != null;
    }

    // --- Main --- ///
    const MAX_TRIES = 5;

    let found = fixMapLink();

    if (!found) {
        var timerId = setInterval(fixMapLink, 500);
    }

})();
