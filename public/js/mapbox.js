export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoicnVuLXplbiIsImEiOiJja3JmdWUwdDExMWd3MzFvZTI2cTVxOHg1In0.nzVLIz_O2B8UhNg1MT52bQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/run-zen/ckrfv4p4i0cib18qj6eqwsar3',
        maxZoom: 15,
        // center: [-118, 34],
        // zoom: 4,
        // interactive: false,
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc, index) => {
        // creating marker
        const el = document.createElement('div');
        el.className = 'marker';
        let day = '';
        if (locations[index + 1]) {
            day = `${loc.day}-${locations[index + 1].day - 1}`;
        } else {
            day = `${loc.day}`;
        }
        // adding marker to map
        var marker = new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .setPopup(
                new mapboxgl.Popup({
                    offset: 40,
                    closeOnClick: false,
                }).setHTML(`<p>
            Day ${day} : ${loc.description}
          </p>`)
            )
            .addTo(map);
        marker.togglePopup();

        // bounding the map to the locations
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: { top: 200, bottom: 150, left: 100, right: 100 },
    });
    window.scroll(0, 0);
};
