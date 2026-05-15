import { useNavigate } from "react-router-dom";
import { Instagram, Linkedin, Mail, ArrowDown, Sparkles } from "lucide-react";

const BG_IMAGE = "/Assets/ITCBG.jpg";

const LOVERSAI_LOGO = "https://customer-assets.emergentagent.com/job_luxe-design-studio-2/artifacts/pzzxqiqb_Gemini_Generated_Image_vf8wwvvf8wwvvf8w-removebg-preview.png";

// Replace these paths with your own images
const CAROUSEL_IMAGES = [
  { src: "/Assets/1cat.jpg", caption: "Catering 1" },
  { src: "/Assets/2cat.jpg", caption: "Catering 2" },
  { src: "/Assets/3cat.jpg", caption: "Catering 3" },
  { src: "/Assets/4cat.jpg", caption: "Catering 4" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white" data-testid="landing-page">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <div
              className="flex items-center justify-center mb-10"
              data-testid="hero-headline"
            >
              <img
                src={LOVERSAI_LOGO}
                alt="LoversAI"
                className="h-32 sm:h-40 md:h-52 lg:h-64 w-auto max-w-[400px] md:max-w-[520px] brightness-0 invert drop-shadow-[0_0_16px_rgba(255,255,255,0.25)]"
                style={{ objectFit: "contain" }}
                data-testid="loversai-logo"
              />
            </div>
          </div>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <p
              className="text-center text-white/70 text-base md:text-lg max-w-xl mx-auto mb-12 tracking-wide"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Where culinary artistry meets imagination. Design your dream food presentation.
            </p>
          </div>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            <button
              onClick={() => navigate("/studio")}
              className="glass-button rounded-full px-10 py-4 text-lg md:text-xl tracking-widest uppercase flex items-center gap-3"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
              data-testid="design-vision-cta"
            >
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              Design Your Vision
            </button>
          </div>

          <div className="opacity-0 animate-fade-in-up mt-20" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <ArrowDown className="w-6 h-6 text-white/40 animate-bounce" strokeWidth={1} />
          </div>
        </section>

        {/* Image Showcase — minimal auto-scroll */}
        <section className="px-6 py-12" data-testid="carousel-section">
          <div
            className="max-w-5xl mx-auto rounded-2xl overflow-hidden opacity-0 animate-fade-in-up"
            style={{
              animationDelay: "0.2s",
              animationFillMode: "forwards",
              backdropFilter: "blur(20px) saturate(1.3)",
              WebkitBackdropFilter: "blur(20px) saturate(1.3)",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
            data-testid="image-carousel"
          >
            <div className="overflow-hidden p-3">
              <div
                className="flex gap-3 carousel-scroll"
                style={{ width: "max-content" }}
              >
                {/* Duplicate images for seamless infinite loop */}
                {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((img, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-60 md:w-72 aspect-[4/3] rounded-xl overflow-hidden"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      data-testid={`carousel-image-${i % CAROUSEL_IMAGES.length}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-6 py-24 flex items-center justify-center">
          <div
            className="glass-panel rounded-2xl max-w-4xl w-full p-8 md:p-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            data-testid="about-section"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl mb-6 text-white"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
            >
              The Art of Culinary Design
            </h2>
            <p
              className="text-white/70 text-sm md:text-base leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              LoversAI empowers caterers, food stylists, and culinary designers to flawlessly
              design and visualize stunning food presentations. Our AI-powered platform transforms
              your creative vision into photorealistic catering layouts — from intimate plated dinners
              to grand buffet spreads and themed food stations.
            </p>
            <p
              className="text-white/70 text-sm md:text-base leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Upload your venue photos, select your style preferences, and let AI craft
              breathtaking food presentation moodboards for your most important events.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate("/templates")}
                className="glass-button rounded-full px-6 py-2.5 text-xs tracking-wider uppercase flex items-center gap-2"
                style={{ fontFamily: "var(--font-body)" }}
                data-testid="ai-powered-design-btn"
              >
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                AI-Powered Design
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="glass-panel border-t border-white/10 border-l-0 border-r-0 border-b-0 rounded-none py-8 px-6"
          data-testid="footer"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={LOVERSAI_LOGO} alt="LoversAI" className="h-8 brightness-0 invert opacity-70" style={{ objectFit: "contain" }} />
            </div>

            <p
              className="text-white/40 text-xs tracking-wide"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Crafting culinary experiences, one presentation at a time.
            </p>

            <div className="flex items-center gap-5">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors duration-300"
                data-testid="footer-linkedin"
              >
                <Linkedin className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors duration-300"
                data-testid="footer-instagram"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="mailto:hello@loversai.com"
                className="text-white/50 hover:text-white transition-colors duration-300"
                data-testid="footer-email"
              >
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
