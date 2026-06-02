import { useEffect, useState } from "react";
import { useParams } from "react-router";
import publicService, { type VirtualTour } from "../../../services/publicService";
import VirtualTourViewer from "./VirtualTourViewer";

const VirtualTourEmbed = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<VirtualTour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!slug) {
        setTour(null);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError("");
        const data = await publicService.getVirtualTour(slug);
        if (!mounted) return;
        setTour(data);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "No se pudo cargar el recorrido virtual");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="al-vtour-shell al-vtour-embedded">
        <div className="al-vtour-loading">Cargando recorrido 360°...</div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="al-vtour-shell al-vtour-embedded">
        <div className="al-vtour-loading">{error || "Recorrido no disponible"}</div>
      </div>
    );
  }

  return <VirtualTourViewer tour={tour} height="100vh" embedded />;
};

export default VirtualTourEmbed;
