
import React from 'react';
import { img_path } from '../../environment';
import { API_BASE_URL } from '../../config/api';


interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?: string;
  style?: React.CSSProperties;
  /** Requests a downscaled rendition from the backend media endpoint (e.g. for card thumbnails). Ignored for non-backend sources. */
  resizeWidth?: number;
  loading?: "lazy" | "eager";
}

const ImageWithBasePath = (props: Image) => {
  // Combine the base path and the provided src to create the full image source URL
  const src = String(props.src || "");
  const isBackendPublicPath = src.startsWith("/public/");
  const isAbsolute =
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("//");

  const isBackendMedia = isBackendPublicPath && src.includes("/public/media/");
  const srcWithResize =
    isBackendMedia && props.resizeWidth
      ? `${src}${src.includes("?") ? "&" : "?"}w=${props.resizeWidth}`
      : src;

  const fullSrc = isAbsolute
    ? srcWithResize
    : isBackendPublicPath
    ? `${API_BASE_URL}${srcWithResize}`
    : src.startsWith("/")
    ? src
    : `${img_path}${src}`;
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
      style={props.style}
      loading={props.loading}
      decoding="async"
    />
  );
};

export default ImageWithBasePath;
