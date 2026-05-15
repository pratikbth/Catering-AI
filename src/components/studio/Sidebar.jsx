import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Monitor, LayoutTemplate, ChevronDown, Crown, Landmark, Zap, TrendingDown, Minus, TrendingUp } from "lucide-react";

const ATMOSPHERE_OPTIONS = [
  { name: "Royal", desc: "Opulent grandeur with rich fabrics, gold accents & chandeliers", icon: Crown },
  { name: "Traditional", desc: "Timeless elegance with classic motifs & cultural elements", icon: Landmark },
  { name: "Modern", desc: "Sleek minimalism with contemporary aesthetics & clean lines", icon: Zap },
];

const BUDGET_OPTIONS = [
  { name: "Low", desc: "Elegant essentials — beautiful decor within a smart budget", icon: TrendingDown },
  { name: "Medium", desc: "Premium finish — refined details with balanced investment", icon: Minus },
  { name: "High", desc: "No-limit luxury — the finest materials & bespoke design", icon: TrendingUp },
];

export { ATMOSPHERE_OPTIONS, BUDGET_OPTIONS };

export default function Sidebar({
  filters,
  setFilters,
  referenceImage,
  setReferenceImage,
  venueImage,
  setVenueImage,
  onOpenTemplateRef,
}) {
  const fileInputRef = useRef(null);
  const venueFileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [venueDragOver, setVenueDragOver] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      setReferenceImage({ data: base64, preview: e.target.result, name: file.name });
    };
    reader.readAsDataURL(file);
    setShowUploadMenu(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleVenueFileSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      setVenueImage({ data: base64, preview: e.target.result, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleVenueDrop = (e) => {
    e.preventDefault();
    setVenueDragOver(false);
    const file = e.dataTransfer.files[0];
    handleVenueFileSelect(file);
  };



  return (
    <div
      className="glass-panel rounded-2xl h-full flex flex-col p-5 overflow-y-auto glass-scroll relative"
      data-testid="studio-sidebar"
    >
      {/* Upload Catering Reference */}
      <div className="mb-6">
        <h3
          className="text-white/80 text-xs uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
        >
          Catering Reference
        </h3>

        {referenceImage ? (
          <div className="relative rounded-xl overflow-hidden border border-white/20">
            <img src={referenceImage.preview} alt="Reference" className="w-full h-32 object-cover" />
            <button
              onClick={() => setReferenceImage(null)}
              className="absolute top-2 right-2 glass-button rounded-full p-1.5"
              data-testid="remove-reference"
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-3 py-1.5">
              <p className="text-white/70 text-xs truncate" style={{ fontFamily: "var(--font-body)" }}>
                {referenceImage.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Upload button — click shows dropdown */}
            <button
              onClick={() => setShowUploadMenu((v) => !v)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-white/50 bg-white/10"
                  : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
              }`}
              data-testid="upload-design-reference"
            >
              <Upload className="w-5 h-5 text-white/50" strokeWidth={1.5} />
              <span className="text-white/60 text-xs tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                Upload Catering Reference
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${showUploadMenu ? "rotate-180" : ""}`} strokeWidth={1.5} />
            </button>

            {/* Dropdown menu */}
            {showUploadMenu && (
              <div
                className="mt-2 rounded-xl overflow-hidden"
                style={{
                  backdropFilter: "blur(24px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
                }}
                data-testid="upload-menu"
              >
                <button
                  onClick={() => { fileInputRef.current?.click(); setShowUploadMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200"
                  data-testid="upload-from-computer"
                >
                  <Monitor className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <div>
                    <span className="block text-white/90 text-xs font-medium" style={{ fontFamily: "var(--font-body)" }}>Upload from Computer</span>
                    <span className="block text-white/40 text-[10px]" style={{ fontFamily: "var(--font-body)" }}>Buffet, counter, plating, or table styling</span>
                  </div>
                </button>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                <button
                  onClick={() => { onOpenTemplateRef(); setShowUploadMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200"
                  data-testid="take-template-reference"
                >
                  <LayoutTemplate className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                  <div>
                    <span className="block text-white/90 text-xs font-medium" style={{ fontFamily: "var(--font-body)" }}>Take Template Reference</span>
                    <span className="block text-white/40 text-[10px]" style={{ fontFamily: "var(--font-body)" }}>Select from catering style templates</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          data-testid="file-input"
        />
      </div>

      {/* Separator */}
      <div className="border-t border-white/10 mb-5" />

      {/* Upload Venue Image */}
      <div className="mb-6">
        <h3
          className="text-white/80 text-xs uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
        >
          Venue Image
        </h3>

        {venueImage ? (
          <div className="relative rounded-xl overflow-hidden border border-white/20">
            <img src={venueImage.preview} alt="Venue" className="w-full h-32 object-cover" />
            <button
              onClick={() => setVenueImage(null)}
              className="absolute top-2 right-2 glass-button rounded-full p-1.5"
              data-testid="remove-venue"
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-3 py-1.5">
              <p className="text-white/70 text-xs truncate" style={{ fontFamily: "var(--font-body)" }}>
                {venueImage.name}
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => venueFileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setVenueDragOver(true); }}
            onDragLeave={() => setVenueDragOver(false)}
            onDrop={handleVenueDrop}
            className={`w-full border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              venueDragOver
                ? "border-white/50 bg-white/10"
                : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
            }`}
            data-testid="upload-venue-image"
          >
            <Upload className="w-5 h-5 text-white/50" strokeWidth={1.5} />
            <span className="text-white/60 text-xs tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
              Upload Venue Photo
            </span>
            <span className="text-white/35 text-[10px]" style={{ fontFamily: "var(--font-body)" }}>
              AI will keep this venue unchanged
            </span>
          </button>
        )}

        <input
          ref={venueFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleVenueFileSelect(e.target.files[0])}
          data-testid="venue-file-input"
        />
      </div>

      {/* Atmosphere */}
      <div className="mb-5">
        <h3 className="text-white/80 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
          Atmosphere
        </h3>
        <p className="text-white/40 text-xs mb-3" style={{ fontFamily: "var(--font-body)" }}>
          Set the mood for your venue
        </p>
        <div className="flex flex-col gap-2">
          {ATMOSPHERE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.name}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    atmosphere: prev.atmosphere === opt.name ? null : opt.name,
                  }))
                }
                className={`text-left rounded-xl px-4 py-3 transition-all duration-300 flex items-start gap-3 ${
                  filters.atmosphere === opt.name ? "glass-pill-active border-white/40" : "glass-pill"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
                data-testid={`filter-atmosphere-${opt.name.toLowerCase()}`}
              >
                <Icon className="w-4 h-4 text-white/60 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="block text-xs font-medium text-white/90">{opt.name}</span>
                  <span className="block text-[10px] text-white/35 mt-0.5 leading-relaxed">{opt.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-white/10 mb-5" />

      {/* Budget */}
      <div className="mb-5">
        <h3 className="text-white/80 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
          Budget
        </h3>
        <p className="text-white/40 text-xs mb-3" style={{ fontFamily: "var(--font-body)" }}>
          Set your investment level
        </p>
        <div className="flex flex-col gap-2">
          {BUDGET_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.name}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    budget: prev.budget === opt.name ? null : opt.name,
                  }))
                }
                className={`text-left rounded-xl px-4 py-3 transition-all duration-300 flex items-start gap-3 ${
                  filters.budget === opt.name ? "glass-pill-active border-white/40" : "glass-pill"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
                data-testid={`filter-budget-${opt.name.toLowerCase()}`}
              >
                <Icon className="w-4 h-4 text-white/60 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="block text-xs font-medium text-white/90">{opt.name}</span>
                  <span className="block text-[10px] text-white/35 mt-0.5 leading-relaxed">{opt.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />

      {(referenceImage || venueImage) && (
        <div className="mt-4 flex items-center gap-2 text-white/40 text-xs">
          <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-body)" }}>
            {referenceImage && venueImage ? "Catering reference + venue loaded" : referenceImage ? "Catering reference loaded" : "Venue loaded"}
          </span>
        </div>
      )}
    </div>
  );
}
