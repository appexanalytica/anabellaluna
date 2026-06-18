import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getMapboxToken } from "../../../../../lib/mapbox";

const center: [number, number] = [-58.3816, -34.6037]; // [lng, lat]

interface Location {
  id: number;
  lat: number;
  lng: number;
  rent_prize: string;
  rent_bed: string;
  rent_baths: string;
  rent_sqft: string;
  rent_listedon: string;
  rent_Category: string;
  rent_name: string;
  total_review: string;
  rent_address: string;
  image: string;
  profile_image: string;
}

const locations: Location[] = [
  {
    id: 1,
    lat: -34.6037,
    lng: -58.3816,
    rent_prize: "$1,100 ",
    rent_bed: "4",
    rent_baths: "4",
    rent_sqft: "1500",
    rent_listedon: "17 Jan 2023",
    rent_Category: "Condos",
    rent_name: "Place perfect for nature",
    total_review: "17",
    rent_address: "122-140 N Morgan St, Chicago, IL 60607, USA",
    image: "assets/img/buy/buy-grid-img-01.jpg",
    profile_image: "assets/img/profiles/avatar-01.jpg",
  },
  {
    id: 2,
    lat: -34.615,
    lng: -58.370,
    rent_prize: "$1,400 ",
    rent_bed: "4",
    rent_baths: "4",
    rent_sqft: "1000",
    rent_listedon: "17 Jan 2023",
    rent_Category: "Condos",
    rent_name: "Place perfect for nature",
    total_review: "17",
    rent_address: "470 Park Ave S, New York, NY 10016",
    image: "assets/img/buy/buy-grid-img-02.jpg",
    profile_image: "assets/img/profiles/avatar-02.jpg",
  },
  {
    id: 3,
    lat: -34.590,
    lng: -58.395,
    rent_prize: "$1,700 ",
    rent_bed: "4",
    rent_baths: "4",
    rent_sqft: "5000",
    rent_listedon: "17 Jan 2023",
    rent_Category: "Condos",
    rent_name: "Place perfect for nature",
    total_review: "17",
    rent_address: "122-140 N Morgan St, Chicago, IL 60607, USA",
    image: "assets/img/buy/buy-grid-img-03.jpg",
    profile_image: "assets/img/profiles/avatar-03.jpg",
  },
];

const buildPopupHtml = (location: Location) => `
  <div class="card" style="min-width:200px;border:0">
    <div class="card-img">
      <div class="buy-grid-img mb-0 rounded-0 position-relative">
        <img class="img-fluid w-100" alt="img" src="${location.image}" />
        <div class="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
          <h6 class="text-white mb-0">${location.rent_prize}</h6>
        </div>
      </div>
    </div>
    <div class="card-body">
      <h5 class="title mb-2">${location.rent_name}</h5>
      <p class="mb-3"><i class="isax isax-location"></i> ${location.rent_address}</p>
      <div class="mt-2 d-flex align-items-center justify-content-between flex-wrap gap-1">
        <p class="text-dark fs-14 fw-medium">
          Listed on: <span class="fw-medium text-body">${location.rent_listedon}</span>
        </p>
        <span class="ms-2 badge bg-secondary">${location.rent_Category}</span>
      </div>
    </div>
  </div>`;

const BuyRightMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getMapboxToken();
      if (cancelled || !token || !containerRef.current || mapRef.current) return;
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom: 13,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      map.scrollZoom.disable();

      locations.forEach((location) => {
        const el = document.createElement("div");
        el.style.cssText =
          "width:20px;height:20px;border-radius:50%;background:#6366f1;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer";
        new mapboxgl.Marker({ element: el })
          .setLngLat([location.lng, location.lat])
          .setPopup(new mapboxgl.Popup({ offset: 16, maxWidth: "260px" }).setHTML(buildPopupHtml(location)))
          .addTo(map);
      });

      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div id="map" className="map-listing">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default BuyRightMap;
