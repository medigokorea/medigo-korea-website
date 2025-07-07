import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import QuotationEstimator from "@/components/QuotationEstimator";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f4ea' }}>
      <Navigation />
      <Hero />
      <About />
      <Services />
      <QuotationEstimator />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
