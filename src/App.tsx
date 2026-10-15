import { useCallback, useState } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SpecsStrip } from "@/components/SpecsStrip";
import { DetailCards, type DetailFlash } from "@/components/DetailCards";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { CartDrawer } from "@/components/CartDrawer";
import { Lightbox } from "@/components/Lightbox";
import { Toasts } from "@/components/Toasts";
import type { HotspotRequest } from "@/components/JacketViewer";
import { hotspots } from "@/data/product";
import { usePurchase } from "@/hooks/usePurchase";

export default function App() {
  const purchase = usePurchase();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [hotspotRequest, setHotspotRequest] = useState<HotspotRequest | null>(null);
  const [detailFlash, setDetailFlash] = useState<DetailFlash | null>(null);

  /* Hotspot del visor → tarjeta de detalle (scroll + resalte) */
  const goToDetail = useCallback((id: string) => {
    setDetailFlash({ id, n: Date.now() });
    document.getElementById(`detail-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  /* Lightbox → hotspot correspondiente en el visor */
  const locateInPiece = useCallback((detailId: string) => {
    setLightbox(null);
    const spot = hotspots.find((h) => h.detail === detailId);
    setHotspotRequest({ id: spot?.id ?? hotspots[0].id, n: Date.now() });
    window.setTimeout(() => {
      document.getElementById("viewer")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <div className="min-h-screen bg-asphalt text-chalk">
      <Nav bagCount={purchase.bagCount} onOpenCart={purchase.openCart} />
      <main>
        <Hero purchase={purchase} hotspotRequest={hotspotRequest} onGoToDetail={goToDetail} />
        <SpecsStrip />
        <DetailCards onOpen={setLightbox} flash={detailFlash} />
      </main>
      <Footer />
      <MobileBar purchase={purchase} />
      <CartDrawer purchase={purchase} />
      <Lightbox index={lightbox} onClose={closeLightbox} onNav={setLightbox} onLocate={locateInPiece} />
      <Toasts toasts={purchase.toasts} onDismiss={purchase.dismissToast} />
    </div>
  );
}
