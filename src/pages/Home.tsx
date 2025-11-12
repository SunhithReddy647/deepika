import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Award, 
  Video, 
  Heart,
  Instagram,
  Mail,
  MessageSquare,
  Star,
  CheckCircle2,
  Zap,
  Target,
  Camera,
  Copy,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import Parallax from "@/components/Parallax";
import HeroBackground from "@/components/HeroBackground";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const slideIn = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brand: "",
    message: ""
  });

  const [scrolled, setScrolled] = useState(false);

  // Speed up animations on mobile: detect mobile and scale timings
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const d = (value: number) => (isMobile ? value * 0.5 : value); // faster delays on mobile
  const dur = (value: number) => (isMobile ? Math.max(0.2, value * 0.6) : value); // faster durations, min 0.2s

  // Add: shrink header on scroll and enable sticky header effect
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cloud background is now scoped to the hero section via inline styles; no global body mutation.

  const categories = ["All", "Beauty", "Fashion", "Lifestyle", "Tech", "Food"];
  
  const portfolioItems = [
    { id: 1, category: "Beauty", title: "Skincare Routine", thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400", views: "125K", reelUrl: "https://pin.it/4hvvX7O1c" },
    { id: 2, category: "Fashion", title: "Summer Collection", thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", views: "98K", reelUrl: "https://www.tiktok.com/@creator/video/9876543210" },
    { id: 3, category: "Lifestyle", title: "Morning Routine", thumbnail: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400", views: "156K", reelUrl: "https://www.tiktok.com/@creator/video/5555555555" },
    { id: 4, category: "Tech", title: "Gadget Review", thumbnail: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400", views: "89K", reelUrl: "https://www.tiktok.com/@creator/video/6666666666" },
    { id: 5, category: "Food", title: "Recipe Tutorial", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", views: "203K", reelUrl: "https://www.tiktok.com/@creator/video/7777777777" },
    { id: 6, category: "Beauty", title: "Makeup Tutorial", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", views: "178K", reelUrl: "https://www.tiktok.com/@creator/video/8888888888" },
    { id: 7, category: "Fashion", title: "Outfit Ideas", thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400", views: "142K", reelUrl: "https://www.tiktok.com/@creator/video/9999999999" },
    { id: 8, category: "Lifestyle", title: "Home Decor", thumbnail: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400", views: "95K", reelUrl: "https://www.tiktok.com/@creator/video/0000000000" },
    { id: 9, category: "Tech", title: "App Review", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400", views: "67K", reelUrl: "https://www.tiktok.com/@creator/video/1111111111" },
    { id: 10, category: "Food", title: "Cafe Vlog", thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", views: "112K", reelUrl: "https://www.tiktok.com/@creator/video/2222222222" },
    { id: 11, category: "Beauty", title: "Haircare Routine", thumbnail: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400", views: "134K", reelUrl: "https://www.tiktok.com/@creator/video/3333333333" },
    { id: 12, category: "Lifestyle", title: "Self Care Sunday", thumbnail: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400", views: "187K", reelUrl: "https://www.tiktok.com/@creator/video/4444444444" },
  ];

  const filteredPortfolio = selectedCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  // Local stub for contact submission now that Convex is removed
  const submitContact = async (payload: {
    name: string;
    email: string;
    brand: string;
    message: string;
  }) => {
    // Simulate network delay and success
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log("Contact submission:", payload);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        brand: formData.brand,
        message: formData.message,
      });
      toast.success("Message saved to your inbox!");
      setFormData({ name: "", email: "", brand: "", message: "" });
    } catch (err) {
      toast.error("Failed to save your message. Please try again.");
    }
  };

  const brandNames = [
    "Dot & Key", "Dr. Sheths", "Derma Co", "Naturali", "CosIQ", "BaylaSkin", "Nykaa", "Myntra",
    "H&M", "Zara", "Uniqlo", "Levi's", "Allen Solly", "Van Heusen", "FabIndia", "Biba", "Max Fashion", "Westside", "Raymond", "Peter England",
    "Plum", "Minimalist", "Kama Ayurveda", "Forest Essentials", "WOW Skin Science", "mCaffeine", "Biotique", "Himalaya", "Nivea", "L'Oreal", "Neutrogena", "Lakmé",
    "boAt", "Tata Cliq", "Flipkart", "Mamaearth", "Lenskart", "Amazon", "Adidas", "Nike", "Puma", "Reebok"
  ];
  // Add: distinct brand sequences per row so orders do not match
  const brandSequences: Array<Array<string>> = [
    brandNames,
    [...brandNames].reverse(),
    [...brandNames.slice(7), ...brandNames.slice(0, 7)],
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("justyouandskin.dee@gmail.com");
    toast.success("Email copied to clipboard!");
  };

  // Add dark text shades palette for section texts (rotate to keep uniform & minimal)
  const textShades: string[] = ["#2E2E2E", "#3F3A37", "#2F3B52", "#22303C"];

  // Add: fading config for the brand text tail
  const trailingFadeText = "AAAAAAAAAH"; // starts from the second 'A'
  const trailingStartOpacity = 0.8; // 80% opacity at the start of the fade (reversed)
  const trailingEndOpacity = 0.2;   // last 'H' now has 80% transparency (20% opacity)

  // Add: Only embed trusted, iframe-friendly providers; others open in a new tab
  const EMBED_ALLOWLIST: Array<string> = ["youtube.com", "youtu.be", "player.vimeo.com", "vimeo.com"];
  const canEmbed = (url: string): boolean => {
    try {
      const host = new URL(url).host.toLowerCase();
      return EMBED_ALLOWLIST.some((d) => host.includes(d));
    } catch {
      return false;
    }
  };

  // Add: Instagram profile URL for embedded video
  const instagramProfileUrl = "https://instagram.com/justyouandskin";

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="md:border-b-4 border-b-0 border-black bg-[#FAD2E1] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center transition-[height] duration-300 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="logo-font text-4xl md:text-5xl font-black text-black"
            >
              Deepikaaaaaa
            </motion.div>
            <div className="hidden md:flex gap-4">
              {["About", "Portfolio", "Services", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-6 py-3 bg-[#F0EFEB] text-black font-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
                >
                  {item}
                </a>
              ))}
            </div>
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    className="bg-[#F0EFEB] text-black font-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] transition-all flex items-center gap-2"
                  >
                    <Menu className="w-5 h-5" />
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-6 w-72 border-l-4 border-black">
                  <div className="flex flex-col gap-4 mt-6">
                    {["About", "Portfolio", "Services", "Contact"].map((item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="px-4 py-3 bg-[#F0EFEB] text-black font-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] transition-all text-lg"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-8 md:py-10 px-4 min-h-[calc(100svh-5rem)]"
      >
        {/* Animated background from /hero assets */}
        <HeroBackground />
        <div className="max-w-7xl mx-auto h-full flex items-center relative z-[1]">
          <div
            className="grid md:grid-cols-2 gap-6 md:gap-6 items-center w-full translate-x-2 md:translate-x-4"
          >
            <motion.div
              className="order-2 md:order-1"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-6 py-2 bg-[#E2ECE9] text-black font-black border-4 border-black text-lg shadow-[4px_4px_0px_#000000]">
                ⚡ TOP UGC CREATOR 2024
              </Badge>
              <h1
                className="text-[2.4rem] md:text-[3rem] font-bold mb-4 text-black leading-tight normal-case"
                style={{ fontFamily: '"Quintessential", cursive' }}
              >
                Hello! I'm <span style={{ color: '#8B5E3C' }}>Deepika</span>, creating content that's thoughtful, fun, and meant to inspire.
              </h1>
              <p className="text-xl mb-6 text-black font-bold">
                I create scroll-stopping UGC that converts viewers into customers. 
                Let's make your brand go viral! 🚀
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="px-8 py-6 bg-[#FAD2E1] text-black font-black text-xl border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  WORK WITH ME 💕
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 bg-[#F0EFEB] text-black font-black text-xl border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  VIEW PORTFOLIO
                </Button>
              </div>
            </motion.div>
            {/* Ensure hero image is visible on initial mobile viewport by placing it first on small screens */}
            <div className="order-1 md:order-2">
              <Parallax strength={60}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative origin-center scale-[0.72] md:scale-[0.83] max-w-[420px] mx-auto self-center justify-self-center mt-0 md:mt-0"
                >
                  <div className="relative origin-center scale-[1.06] p-2 bg-gradient-to-br from-[#FAD2E1] via-[#FFF1E6] to-[#FDE2E4] border-4 border-black rounded-3xl shadow-[12px_12px_0px_#000000] -rotate-2 -translate-y-2 md:-translate-y-4">
                    <div className="bg-white rounded-2xl p-2 border-4 border-black">
                      <img 
                        src="https://i.ibb.co/ynDN3N9c/IMG-20250822-WA0002-1-1.jpg" 
                        alt="Deepika"
                        className="w-full h-auto rounded-xl border-4 border-black"
                      />
                    </div>
                    <div className="absolute -top-3 -left-3 bg-[#FAD2E1] text-black border-4 border-black px-3 py-1 font-black shadow-[6px_6px_0px_#000000] rotate-[-8deg]">
                      💕 UGC BLOOM
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#E2ECE9] text-black border-4 border-black px-4 py-2 font-black shadow-[6px_6px_0px_#000000] rotate-[4deg]">
                      500K+ VIEWS
                    </div>
                    <div className="absolute -top-4 right-6 bg-[#F0EFEB] text-black border-4 border-black px-2 py-1 font-black shadow-[4px_4px_0px_#000000] rotate-[8deg]">
                      💖
                    </div>
                    <div className="absolute top-1/2 -left-4 translate-y-[-50%] bg-[#FDE2E4] text-black border-4 border-black px-2 py-1 font-black shadow-[4px_4px_0px_#000000] -rotate-[10deg]">
                      ✨
                    </div>
                  </div>
                </motion.div>
              </Parallax>
            </div>
          </div>
        </div>
      </section>

      {/* About Me */}
      <section id="about" className="py-20 px-4 bg-white border-t-4 border-black scroll-mt-24 section-dots">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              MEET YOUR <span className="text-[#8B5E3C]">CREATOR</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-4 border-black shadow-[8px_8px_0px_#000000] bg-[#FDE2E4]">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-black text-black mb-4">70+</div>
                  <p className="font-black text-xl text-black">BRANDS WORKED WITH</p>
                </CardContent>
              </Card>
              <Card className="border-4 border-black shadow-[8px_8px_0px_#000000] bg-[#DFE7FD]">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-black text-black mb-4">10M+</div>
                  <p className="font-black text-xl text-black">TOTAL VIEWS</p>
                </CardContent>
              </Card>
              <Card className="border-4 border-black shadow-[8px_8px_0px_#000000] bg-[#E2ECE9]">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-black text-black mb-4">98%</div>
                  <p className="font-black text-xl text-black">CLIENT SATISFACTION</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 bg-[#FAD2E1] border-4 border-black shadow-[8px_8px_0px_#000000] p-8">
              <p className="text-2xl font-bold text-black leading-relaxed transition-colors duration-300 hover:text-[#8B5E3C]">
                Hey! I'm a passionate UGC creator who loves bringing brands to life through authentic, 
                relatable content. With 3+ years of experience, I specialize in creating videos that 
                don't just look good—they CONVERT. My secret? I create content that feels like a 
                recommendation from a friend, not an ad. Let's make magic together! ✨
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is UGC */}
      <section className="py-20 px-4 bg-[#FFF1E6] section-dots flower-separators">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              WHAT IS <span className="text-[#8B5E3C]">UGC?</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Camera, title: "AUTHENTIC", desc: "Real people, real stories, real results", color: "#FAD2E1" },
                { icon: TrendingUp, title: "CONVERTS", desc: "Content that drives sales & engagement", color: "#E2ECE9" },
                { icon: Heart, title: "RELATABLE", desc: "Builds trust & emotional connection", color: "#DFE7FD" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <Card className="border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all" style={{ backgroundColor: item.color }}>
                    <CardContent className="p-8 text-center">
                      <item.icon className="w-16 h-16 mx-auto mb-4 text-black" strokeWidth={3} />
                      <h3 className="text-3xl font-black mb-4 text-black">{item.title}</h3>
                      <p className="text-xl font-bold text-black">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media Stats */}
      <section id="stats" className="py-20 px-4 bg-white scroll-mt-24 section-dots flower-separators">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              MY <span className="text-[#8B5E3C]">REACH</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-stretch">
              {[
                { platform: "Instagram", stat: "120K+", label: "followers", icon: Instagram, color: "#FAD2E1" },
                { platform: "YouTube", stat: "25K+", label: "subs", icon: Video, color: "#DFE7FD" },
                { platform: "Brands", stat: "70+", label: "worked with", icon: Award, color: "#E2ECE9" },
                { platform: "Views", stat: "10M+", label: "total views", icon: TrendingUp, color: "#FFF1E6" },
                { platform: "Engagement", stat: "8.5%", label: "average", icon: MessageSquare, color: "#CDDAFD" },
                { platform: "Rating", stat: "4.9★", label: "average", icon: Star, color: "#FDE2E4" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] transition-all" style={{ backgroundColor: item.color }}>
                    <CardContent className="p-6 text-center">
                      <item.icon className="w-10 h-10 mx-auto mb-3 text-black" strokeWidth={3} />
                      <div className="text-4xl font-black text-black mb-2">{item.stat}</div>
                      <div className="text-sm font-bold text-black uppercase">{item.platform}</div>
                      <div className="text-xs font-bold text-black/80">{item.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Audience Demographics by Location */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <h3 className="text-4xl font-black mb-8 text-center text-black">
                AUDIENCE <span className="text-[#8B5E3C]">DEMOGRAPHICS</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-4 border-black shadow-[8px_8px_0px_#000000] bg-[#FFE5F0]">
                  <CardContent className="p-8">
                    <h4 className="text-2xl font-black mb-6 text-black flex items-center gap-2">
                      <Target className="w-6 h-6" strokeWidth={3} />
                      TOP LOCATIONS
                    </h4>
                    <div className="space-y-4">
                      {[
                        { location: "🇮🇳 Mumbai, India", percentage: 35 },
                        { location: "🇮🇳 Delhi, India", percentage: 22 },
                        { location: "🇮🇳 Bangalore, India", percentage: 18 },
                        { location: "🇺🇸 United States", percentage: 12 },
                        { location: "🇬🇧 United Kingdom", percentage: 8 },
                        { location: "🌍 Others", percentage: 5 }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold" style={{ color: textShades[idx % textShades.length] }}>{item.location}</span>
                            <span className="font-black text-lg" style={{ color: textShades[idx % textShades.length] }}>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-white border-2 border-black h-4 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className="h-full bg-[#FAD2E1]"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-black shadow-[8px_8px_0px_#000000] bg-[#E5F0FF]">
                  <CardContent className="p-8">
                    <h4 className="text-2xl font-black mb-6 text-black flex items-center gap-2">
                      <Users className="w-6 h-6" strokeWidth={3} />
                      AUDIENCE INSIGHTS
                    </h4>
                    <div className="space-y-6">
                      {[
                        { label: "Age Group", value: "18-34 years", icon: "👥", color: "#FAD2E1" },
                        { label: "Gender Split", value: "65% Female, 35% Male", icon: "⚖️", color: "#CDDAFD" },
                        { label: "Primary Language", value: "English & Telugu", icon: "🗣️", color: "#E2ECE9" },
                        { label: "Engagement Rate", value: "8.5% Average", icon: "💬", color: "#FFF1E6" }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="flex items-start gap-4 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_#000000]"
                        >
                          <div className="text-3xl">{item.icon}</div>
                          <div>
                            <div
                              className="font-black text-sm uppercase mb-1"
                              style={{ color: textShades[idx % textShades.length] }}
                            >
                              {item.label}
                            </div>
                            <div
                              className="font-bold text-lg"
                              style={{ color: textShades[(idx + 1) % textShades.length] }}
                            >
                              {item.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Brands Choose Me */}
      <section className="py-20 px-4 bg-white section-dots flower-separators">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              WHY <span className="text-[#8B5E3C]">CHOOSE ME?</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {[
                { icon: Zap, title: "FAST DELIVERY", desc: "48-hour turnaround", bg: "#FDE2E4" },
                { icon: Target, title: "HIGH ROI", desc: "Content that converts", bg: "#DFE7FD" },
                { icon: Award, title: "PROVEN RESULTS", desc: "250+ happy clients", bg: "#E2ECE9" },
                { icon: Sparkles, title: "CREATIVE", desc: "Unique concepts", bg: "#FFF1E6" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full flex flex-col border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all" style={{ backgroundColor: item.bg }}>
                    <CardContent className="p-8 text-center">
                      <item.icon className="w-12 h-12 mx-auto mb-4 text-black" strokeWidth={3} />
                      <h3 className="text-2xl font-black mb-2 text-black">{item.title}</h3>
                      <p className="text-lg font-bold text-black">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20 px-4 bg-[#FFF1E6] scroll-mt-24 section-dots flower-separators">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              MY <span className="text-[#8B5E3C]">WORK</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-14">
              {categories.map((cat) => (
                <motion.div
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-4 md:px-10 md:py-5 font-black text-lg md:text-xl border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all ${
                      selectedCategory === cat 
                        ? "bg-[#FAD2E1] text-black" 
                        : "bg-[#F0EFEB] text-black"
                    }`}
                  >
                    {cat}
                  </Button>
                </motion.div>
              ))}
            </div>
            <motion.div 
              className="grid md:grid-cols-3 lg:grid-cols-4 gap-8"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredPortfolio.length > 0 ? (
                  filteredPortfolio.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      layout
                    >
                      <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="h-full"
                      >
                        <Card className="h-full flex flex-col border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all overflow-hidden bg-[#F0EFEB] cursor-pointer">
                          <div className="relative overflow-hidden aspect-[3/4] md:aspect-[2/3] w-full">
                            {item.reelUrl && canEmbed(item.reelUrl) ? (
                              <div className="w-full h-full bg-black">
                                <iframe
                                  src={item.reelUrl}
                                  className="w-full h-full block"
                                  frameBorder="0"
                                  scrolling="no"
                                  allowTransparency={true}
                                  allow="encrypted-media"
                                  allowFullScreen
                                />
                                <a
                                  href={instagramProfileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Open Instagram profile"
                                  className="absolute inset-0 z-10"
                                />
                              </div>
                            ) : (
                              <>
                                <motion.img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                />
                                <div className="absolute top-3 right-3 z-20">
                                  {item.reelUrl ? (
                                    <a
                                      href={instagramProfileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label="Open Instagram profile"
                                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAD2E1] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                                      title="Open video"
                                    >
                                      Open video ↗
                                    </a>
                                  ) : (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0EFEB] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                                      <Video className="w-4 h-4 text-black" />
                                    </div>
                                  )}
                                </div>
                              </>
                            )}

                            <div className="absolute top-3 left-3 z-20">
                              <div className="inline-flex items-center px-3 py-1.5 bg-[#E2ECE9] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                                <span className="text-xs">{item.category}</span>
                              </div>
                            </div>

                            <div className="absolute bottom-4 left-4 bg-[#F0EFEB] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_#000000]">
                              <p className="font-black text-black flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                {item.views} views
                              </p>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-2xl font-black text-black truncate">{item.title}</h3>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full text-center py-12"
                  >
                    <p className="text-2xl font-black text-black">No items in this category yet</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brands */}
      <section id="brands" className="py-20 px-4 bg-gradient-to-b from-[#FFF1E6] to-[#FAD2E1] section-dots flower-separators">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              BRANDS <span className="text-[#8B5E3C]">I'VE WORKED WITH</span>
            </h2>

              <div className="relative overflow-hidden space-y-6 w-screen left-1/2 -ml-[50vw] right-1/2 -mr-[50vw]">
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className={`flex items-center gap-10 md:gap-12 whitespace-nowrap will-change-transform marquee ${
                    row === 1 ? "marquee-reverse marquee-fast" : row === 2 ? "marquee-slow" : ""
                  }`}
                >
                  {[...brandSequences[row], ...brandSequences[row]].map((name, idx) => (
                    <div key={`${row}-${name}-${idx}`} className="select-none">
                      <span className="text-xl md:text-2xl lg:text-3xl font-black text-black transition-colors tracking-tight">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-16 bg-gradient-to-r from-[#FFF1E6] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-16 bg-gradient-to-l from-[#FFF1E6] to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center"
            >
              <Badge className="bg-[#E2ECE9] text-black font-black border-4 border-black px-6 py-3 text-lg md:text-xl shadow-[4px_4px_0px_#000000]">
                Trusted by 70+ brands worldwide
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 bg-white scroll-mt-24 section-dots flower-separators">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              MY <span className="text-[#8B5E3C]">SERVICES</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { 
                  title: "STARTER", 
                  price: "₹3,500", 
                  features: ["1 Video (30s)", "Basic Editing", "2 Revisions", "3-Day Delivery"],
                  bg: "#FDE2E4"
                },
                { 
                  title: "PRO", 
                  price: "₹6,500", 
                  features: ["3 Videos (30-60s)", "Advanced Editing", "Unlimited Revisions", "48h Delivery", "Script Writing"],
                  bg: "#FAD2E1",
                  highlight: true
                },
                { 
                  title: "PREMIUM", 
                  price: "₹10,500", 
                  features: ["5 Videos (60s)", "Premium Editing", "Unlimited Revisions", "24h Delivery", "Script + Strategy", "Usage Rights"],
                  bg: "#DFE7FD"
                }
              ].map((tier, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="h-full"
                >
                  <Card className={`border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all h-full flex flex-col ${tier.highlight ? "ring-4 ring-[#E2ECE9]" : ""}`} style={{ backgroundColor: tier.bg }}>
                    <CardContent className="p-8 flex flex-col h-full">
                      {tier.highlight && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.2 + 0.1 }}
                        >
                          <Badge className="mb-4 bg-[#E2ECE9] text-black font-black border-2 border-black text-lg px-4 py-2">
                            ⭐ MOST POPULAR
                          </Badge>
                        </motion.div>
                      )}
                      <motion.h3 
                        className={`text-4xl font-black mb-4 ${tier.highlight ? "text-[#3F3A37]" : "text-black"}`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {tier.title}
                      </motion.h3>
                      <motion.div 
                        className={`text-5xl font-black mb-6 ${tier.highlight ? "text-[#3F3A37]" : "text-black"}`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {tier.price}
                      </motion.div>
                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature, i) => (
                          <motion.li 
                            key={i} 
                            className={`flex items-start gap-2 ${tier.highlight ? "text-black" : "text-black"} font-bold text-lg`}
                            style={{ color: textShades[i % textShades.length] }}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.2 + i * 0.05 }}
                            whileHover={{ x: 4 }}
                          >
                            <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${tier.highlight ? "text-[#E2ECE9]" : "text-[#FAD2E1]"}`} strokeWidth={3} />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <Button 
                        className={`mt-auto w-full py-6 font-black text-xl border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all ${
                          tier.highlight 
                            ? "bg-[#E2ECE9] text-black" 
                            : "bg-[#CDDAFD] text-black"
                        }`}
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        GET STARTED
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white section-dots flower-separators">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              CLIENT <span className="text-[#8B5E3C]">LOVE</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah M.", brand: "Beauty Brand", text: "Her content increased our sales by 300%! Absolutely incredible work.", rating: 5, bg: "#FDE2E4" },
                { name: "Mike T.", brand: "Tech Startup", text: "Professional, creative, and delivers on time. Best UGC creator we've worked with!", rating: 5, bg: "#DFE7FD" },
                { name: "Emma L.", brand: "Fashion Label", text: "The videos feel so authentic and relatable. Our engagement skyrocketed!", rating: 5, bg: "#E2ECE9" }
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer h-full flex flex-col" style={{ backgroundColor: testimonial.bg }}>
                    <CardContent className="p-8">
                      <motion.div 
                        className="flex gap-1 mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: idx * 0.2 + 0.1 }}
                      >
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            transition={{ delay: idx * 0.2 + i * 0.05 }}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          >
                            <Star className="w-6 h-6 fill-[#3F3A37] text-[#3F3A37]" />
                          </motion.div>
                        ))}
                      </motion.div>
                      <motion.p 
                        className="text-xl font-bold text-black mb-6 leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: idx * 0.2 + 0.15 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        "{testimonial.text}"
                      </motion.p>
                      <motion.div 
                        className="font-black text-black"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 + 0.2 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="text-xl">{testimonial.name}</div>
                        <div className="text-lg text-[#3F3A37]">{testimonial.brand}</div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Niche Showcase */}
      <section className="py-20 px-4 bg-[#FFF1E6] section-dots flower-separators">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-12 text-center text-black">
              MY <span className="text-[#8B5E3C]">NICHES</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { name: "BEAUTY", emoji: "💄", color: "#FAD2E1" },
                { name: "FASHION", emoji: "👗", color: "#CDDAFD" },
                { name: "LIFESTYLE", emoji: "✨", color: "#E2ECE9" },
                { name: "TECH", emoji: "📱", color: "#FFF1E6" },
                { name: "FOOD", emoji: "🍕", color: "#FDE2E4" }
              ].map((niche, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Card className="border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] transition-all cursor-pointer" style={{ backgroundColor: niche.color }}>
                    <CardContent className="p-8 text-center">
                      <div className="text-6xl mb-4">{niche.emoji}</div>
                      <div className="text-2xl font-black text-black">{niche.name}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 bg-white scroll-mt-24 section-dots flower-separators">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-black mb-6 text-center text-black">
              LET'S <span className="text-[#8B5E3C]">WORK TOGETHER!</span>
            </h2>
            <p className="text-2xl font-bold text-center text-black mb-12">
              Ready to create content that converts? Drop me a message! 💌
            </p>
            <Card className="border-4 border-black shadow-[12px_12px_0px_#000000] bg-[#FDE2E4]">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xl font-black text-black mb-2">YOUR NAME</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border-4 border-black shadow-[4px_4px_0px_#000000] font-bold text-lg p-6"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-black text-black mb-2">EMAIL</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="border-4 border-black shadow-[4px_4px_0px_#000000] font-bold text-lg p-6"
                      placeholder="jane@brand.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-black text-black mb-2">BRAND NAME</label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="border-4 border-black shadow-[4px_4px_0px_#000000] font-bold text-lg p-6"
                      placeholder="Your Brand"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-black text-black mb-2">MESSAGE</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="border-4 border-black shadow-[4px_4px_0px_#000000] font-bold text-lg p-6 min-h-[150px]"
                      placeholder="Tell me about your project..."
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full py-6 bg-[#FAD2E1] text-black font-black text-2xl border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
                  >
                    SEND MESSAGE 💕
                  </Button>
                </form>
                <div className="flex justify-center gap-6 mt-8">
                  {[
                    { icon: Instagram, label: "@deepikaapenugonda", color: "#FAD2E1" },
                    { icon: Instagram, label: "@justyouandskin", color: "#E2ECE9" },
                    { icon: Mail, label: "justyouandskin.dee@gmail.com", color: "#DFE7FD" }
                  ].map((social, idx) => (
                    <motion.a
                      key={idx}
                      href={
                        social.label.startsWith("@")
                          ? `https://instagram.com/${social.label.slice(1)}`
                          : `mailto:${social.label}`
                      }
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center gap-2 px-6 py-3 font-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] transition-all"
                      style={{ backgroundColor: social.color }}
                    >
                      <social.icon className="w-6 h-6 text-black" strokeWidth={3} />
                      <span className="text-black hidden md:inline">{social.label}</span>
                    </motion.a>
                  ))}
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  <a
                    href="mailto:justyouandskin.dee@gmail.com?subject=UGC%20Project%20Inquiry&body=Hi%20Deepika,%0D%0A%0D%0AWe%27re%20interested%20in%20UGC%20content.%20Here%27s%20a%20quick%20brief:%0D%0A-%20Brand:%0D%0A-%20Goals:%0D%0A-%20Deliverables:%0D%0A-%20Timeline:%0D%0A%0D%0AThanks!"
                    className="flex items-center gap-2 px-4 py-2 bg-[#CDDAFD] text-black font-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Email me
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F0EFEB] text-black font-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copy email
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black py-16 px-4 border-t-4 border-black flower-separators">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div
              className="logo-font text-4xl md:text-5xl font-black text-white"
            >
              Deepikaaaaaa
            </div>
<div className="flex flex-wrap justify-end w-full gap-4 text-white font-bold">
  <a href="#about" className="hover:underline underline-offset-4">About</a>
  <a href="#portfolio" className="hover:underline underline-offset-4">Work</a>
  <a href="#services" className="hover:underline underline-offset-4">Services</a>
  <a href="#stats" className="hover:underline underline-offset-4">Stats</a>
  <a href="#contact" className="hover:underline underline-offset-4">Contact</a>
</div>
          </div>
          <div className="mt-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block text-4xl mb-4"
            >
              💕
            </motion.div>
            <p className="text-white font-bold text-lg">
              © Deepika, Made with love & creativity
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}