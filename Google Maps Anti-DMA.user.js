// ==UserScript==
// @name         Google Maps Anti-DMA
// @namespace    http://tampermonkey.net/
// @version      2024-06-01
// @description  Make Google Maps preview clickable again
// @author       m42cel
// @source       https://github.com/m42cel/Google-Maps-Anti-DMA
// @match        https://www.google.com/search*
// @match        https://www.google.de/search*
// @icon         https://www.google.com/images/branding/product/ico/maps_32dp.ico
// @icon64       https://www.google.com/images/branding/product/ico/maps_64dp.ico
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    function findMapsPreview() {
        // First try to find the image by id "lu_map"
        let imgElement = document.querySelector('img[id="lu_map"]')

        if (imgElement) {
            console.debug('Found Google Maps preview image by id:', imgElement);
            return imgElement
        }

        // If not found by id try to find by element pattern
        // Select all parent divs with a jsname attribute
        const parentDivs = document.querySelectorAll('div[jsname]');

        for (const parentDiv of parentDivs) {
            // Find the img element within the parent div that matches the conditions
            imgElement = parentDiv.querySelector('img[id^="dimg_"][src^="data:image/png;base64"][data-csiid][data-atf="1"]');

            if (imgElement) {
                console.debug('Found Google Maps preview image by element pattern:', imgElement);
                return imgElement
            }
        }

        console.debug('Google Maps preview image not found');
        return null
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


    // --- Main --- ///
    var mapsPreview = findMapsPreview();

    if (mapsPreview) {
        var mapsLink = getGoogleMapsLink();
        addLinkToImage(mapsPreview, mapsLink);
    }

})();
