import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useState } from "react";
import { Link } from "react-router";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 53.470692,
  lng: -2.220328,
};

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
    lat: 53.470692,
    lng: -2.220328,
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
    lat: 53.469189,
    lng: -2.199262,
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
    lat: 53.468665,
    lng: -2.189269,
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
  // ... Continue with the rest (IDs 4 to 9)
];

const BuyRightMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD6adZVdzTvBpE2yBRK8cDfsss8QXChK0I", // Replace with your API key
  });

  const [selectedMarker, setSelectedMarker] = useState<Location | null>(
    locations[0]
  );

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div id="map" className="map-listing">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{
          scrollwheel: false,
          mapTypeId: "roadmap",
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => setSelectedMarker(location)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <div className="card">
                <div className="card-img">
                  <div className="buy-grid-img mb-0 rounded-0 position-relative">
                    <Link to="#" className="property-img">
                      <img
                        className="img-fluid w-100"
                        alt="img"
                        src={selectedMarker.image}
                      />
                    </Link>
                    <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                      <h6 className="text-white mb-0">{selectedMarker.rent_prize}</h6>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="title mb-2">
                    <Link to="#" tabIndex={-1}>
                      {selectedMarker.rent_name}
                    </Link>
                  </h5>
                  <p className="mb-3">
                    <i className="isax isax-location"></i>
                    {selectedMarker.rent_address}
                  </p>

                  <div className="mt-2 d-flex align-items-center justify-content-between flex-wrap gap-1">
                    <p className="text-dark fs-14 fw-medium">
                      Listed on:{" "}
                      <span className="fw-medium text-body">
                        {selectedMarker.rent_listedon}
                      </span>{" "}
                    </p>
                    <span className="ms-2 badge bg-secondary">
                      {selectedMarker.rent_Category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default BuyRightMap;
