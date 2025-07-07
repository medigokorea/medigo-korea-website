import { Button } from "@/components/ui/button";
import { Calendar, Quote, Shield, UserCheck, Star, ClipboardList } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import heroImage from "@assets/Image_fx-3_1751680796865.jpg";

export default function Hero() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = heroImage;
  }, []);

  return (
    <section className="relative bg-white text-gray-900 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0" style={{ backgroundColor: 'hsl(220, 14%, 96%)', opacity: 0.3 }}></div>
      <div 
        className={`absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-700 ${
          imageLoaded ? 'opacity-40' : 'opacity-0'
        }`}
        style={{
          backgroundImage: imageLoaded ? `url(${heroImage})` : 'none'
        }}
      ></div>
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl" style={{ backgroundColor: 'hsl(220, 14%, 96%)', opacity: 0.3 }}></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 md:w-80 md:h-80 rounded-full blur-3xl" style={{ backgroundColor: 'hsl(220, 14%, 96%)', opacity: 0.2 }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-32 h-32 md:w-64 md:h-64 rounded-full blur-3xl" style={{ backgroundColor: 'hsl(220, 14%, 96%)', opacity: 0.15 }}></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="text-left">
          <h1 className="medical-h1 mb-4 md:mb-6 font-normal">
            {t.hero.title}
          </h1>
          <p className="medical-subtitle mb-6 md:mb-8">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-start">
            <Button 
              variant="outline" 
              className="bg-transparent border-2 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg shadow-xl transform hover:scale-105 transition-all duration-300 mobile-touch-target hover:bg-white/10 rounded-full" 
              style={{ 
                fontFamily: 'mayo-display, Georgia, serif',
                borderColor: 'hsl(220, 26%, 14%)',
                color: 'hsl(220, 26%, 14%)'
              }}
              onClick={() => {
                const contactSection = document.querySelector('[data-section="contact"]');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Quote className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              {t.hero.freeConsultation.charAt(0).toUpperCase() + t.hero.freeConsultation.slice(1).toLowerCase()}
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-2 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg shadow-xl transform hover:scale-105 transition-all duration-300 mobile-touch-target hover:bg-white/10 rounded-full" 
              style={{ 
                fontFamily: 'mayo-display, Georgia, serif',
                borderColor: 'hsl(220, 26%, 14%)',
                color: 'hsl(220, 26%, 14%)'
              }}
              onClick={() => setLocation('/assessment')}
            >
              <ClipboardList className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              {t.hero.startAssessment}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-start items-start mt-8 md:mt-12 space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8">
            <div className="flex items-center">
              <Shield className="h-6 w-6 md:h-8 md:w-8 mr-2" style={{ color: 'hsl(158, 75%, 39%)' }} />
              <span className="text-xs md:text-sm" style={{ color: 'hsl(220, 26%, 14%)' }}>{t.hero.fdaApproved}</span>
            </div>
            <div className="flex items-center">
              <UserCheck className="h-6 w-6 md:h-8 md:w-8 mr-2" style={{ color: 'hsl(158, 75%, 39%)' }} />
              <span className="text-xs md:text-sm" style={{ color: 'hsl(220, 26%, 14%)' }}>{t.hero.certifiedSpecialists}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-6 w-6 md:h-8 md:w-8 mr-2" style={{ color: 'hsl(158, 75%, 39%)' }} />
              <span className="text-xs md:text-sm" style={{ color: 'hsl(220, 26%, 14%)' }}>{t.hero.verifiedReviews}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
