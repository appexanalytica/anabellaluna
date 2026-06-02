import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import type { PropertyCard } from "../../../../services/publicService";

interface Props {
  property: PropertyCard;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  detailPathFn?: (slug: string) => string;
}

const formatPrice = (price?: { amount?: number; currency?: string; unit?: string }) => {
  if (!price || !price.amount) return "";
  const formatted = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: price.currency || "ARS",
    maximumFractionDigits: 0,
  }).format(price.amount);
  return price.unit ? `${formatted} / ${price.unit}` : formatted;
};

const buildFeatureItems = (p: PropertyCard) => [
  { icon: "straighten", label: `${p.features?.areaSqFt || p.features?.coveredAreaSqFt || 0} m²`, show: !!(p.features?.areaSqFt || p.features?.coveredAreaSqFt) },
  { icon: "meeting_room", label: `${p.features?.rooms} amb.`, show: !!p.features?.rooms },
  { icon: "bed", label: `${p.features?.beds} hab.`, show: !!p.features?.beds },
  { icon: "bathtub", label: `${p.features?.baths} baño${p.features?.baths === 1 ? "" : "s"}`, show: !!p.features?.baths },
  { icon: "directions_car", label: `${p.features?.parking} coch.`, show: !!p.features?.parking },
  { icon: "apartment", label: `Piso ${p.extraFeatures?.floor}`, show: !!p.extraFeatures?.floor },
  { icon: "balcony", label: "Balcón", show: !!p.extraFeatures?.balcony },
].filter((item) => item.show).slice(0, 7);

const PropertyListCard = ({ property, isFavorite, onToggleFavorite, detailPathFn }: Props) => {
  const p = property;
  const detailPath = detailPathFn
    ? detailPathFn(p.slug)
    : p.operation === "rent"
    ? all_routes.rentDetailsPath(p.slug)
    : all_routes.buyDetailsPath(p.slug);

  const coverSrc = p.media?.coverUrl || "assets/img/buy/buy-grid-img-01.jpg";
  const features = buildFeatureItems(p);
  const location = [p.location?.neighborhood, p.location?.city, p.location?.province]
    .filter(Boolean)
    .join(", ") || p.location?.addressLine || "";

  return (
    <div className="property-card property-card-modern property-card-modern--list mb-4">
      <div className="property-listing-item p-0 mb-0 border-0 shadow-sm">
        <div className="row g-0">
          <div className="col-12 col-lg-5">
            <div className="buy-grid-img property-card-modern__media property-card-modern__media--list mb-0">
              <Link to={detailPath}>
                <ImageWithBasePath
                  className="w-100 h-100"
                  src={coverSrc}
                  alt={p.title || "property"}
                />
              </Link>
              <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3 z-1">
                <div className="d-flex align-items-center gap-2">
                  {p.featured && (
                    <div className="badge badge-sm bg-orange d-flex align-items-center property-card-modern__badge">
                      <i className="material-icons-outlined">loyalty</i>
                      Destacada
                    </div>
                  )}
                  {p.category && (
                    <div className="badge badge-sm bg-secondary d-flex align-items-center property-card-modern__badge">
                      {p.category}
                    </div>
                  )}
                </div>
                {onToggleFavorite && (
                  <Link
                    to="#"
                    className={`favourite ${isFavorite ? "selected" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleFavorite();
                    }}
                  >
                    <i className={`material-icons-outlined ${isFavorite ? "filled" : ""}`}>
                      {isFavorite ? "favorite" : "favorite_border"}
                    </i>
                  </Link>
                )}
              </div>
              <div className="position-absolute bottom-0 start-0 end-0 p-3 property-card-modern__image-footer">
                <h6 className="text-white mb-0 fw-bold">{formatPrice(p.price)}</h6>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7">
            <div className="buy-grid-content property-card-modern__content property-card-modern__content--list">
              <div className="d-flex align-items-start justify-content-between gap-3 mb-3 flex-wrap">
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <h6 className="title property-card-modern__title mb-1">
                    <Link to={detailPath}>{p.title || "Sin título"}</Link>
                  </h6>
                    {p.operation && (
                      <span className="property-card-modern__operation">
                        {p.operation === "rent" ? "Alquiler" : "Venta"}
                      </span>
                    )}
                  </div>
                  {location && (
                    <p className="d-flex align-items-center fs-14 mb-2 property-card-modern__location">
                      <i className="material-icons-outlined me-1 ms-0">location_on</i>
                      {location}
                    </p>
                  )}
                  {p.description && (
                    <p className="property-card-modern__description property-card-modern__description--list mb-0">
                      {p.description}
                    </p>
                  )}
                </div>
                <h5 className="property-card-modern__price mb-0 text-nowrap">
                  {formatPrice(p.price)}
                </h5>
              </div>
              {features.length > 0 && (
                <ul className="buy-grid-details property-card-modern__features property-card-modern__features--list mb-3">
                  {features.map((item) => (
                    <li key={`${item.icon}-${item.label}`}>
                      <i className="material-icons-outlined">{item.icon}</i>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 property-card-modern__meta">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {p.type && (
                    <span className="property-card-modern__pill">{p.type}</span>
                  )}
                  {p.structureType && (
                    <span className="property-card-modern__pill">{p.structureType}</span>
                  )}
                  {p.pricePerM2 ? (
                    <span className="property-card-modern__pill">${p.pricePerM2.toLocaleString()} / m²</span>
                  ) : null}
                  {p.propertyCode && (
                    <span className="property-card-modern__pill">ID {p.propertyCode}</span>
                  )}
                </div>
                {p.agent && (
                  <div className="d-flex align-items-center gap-2">
                    {p.agent.avatarUrl && (
                      <div className="avatar avatar-sm border rounded-circle">
                        <ImageWithBasePath
                          src={p.agent.avatarUrl}
                          alt={p.agent.name || "Agent"}
                          className="rounded-circle"
                        />
                      </div>
                    )}
                    <span className="fs-14 text-muted">{p.agent.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListCard;
