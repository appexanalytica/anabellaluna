import { Link } from "react-router";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const center: [number, number] = [-34.6037, -58.3816];

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

const BuyRightMap = () => {
  return (
    <div id="map" className="map-listing">
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <CircleMarker
            key={location.id}
            center={[location.lat, location.lng]}
            radius={10}
            pathOptions={{ fillColor: "#6366f1", fillOpacity: 1, color: "#fff", weight: 2 }}
          >
            <Popup>
              <div className="card" style={{ minWidth: 200 }}>
                <div className="card-img">
                  <div className="buy-grid-img mb-0 rounded-0 position-relative">
                    <Link to="#" className="property-img">
                      <img className="img-fluid w-100" alt="img" src={location.image} />
                    </Link>
                    <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                      <h6 className="text-white mb-0">{location.rent_prize}</h6>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="title mb-2">
                    <Link to="#" tabIndex={-1}>{location.rent_name}</Link>
                  </h5>
                  <p className="mb-3">
                    <i className="isax isax-location"></i>
                    {location.rent_address}
                  </p>
                  <div className="mt-2 d-flex align-items-center justify-content-between flex-wrap gap-1">
                    <p className="text-dark fs-14 fw-medium">
                      Listed on: <span className="fw-medium text-body">{location.rent_listedon}</span>
                    </p>
                    <span className="ms-2 badge bg-secondary">{location.rent_Category}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BuyRightMap;
