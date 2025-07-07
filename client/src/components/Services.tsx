import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useState, useEffect } from "react";

import clinicImage from "@assets/Whisk_cfdb5f3ac5_1751686161495.jpg";
import dietImage from "@assets/Whisk_7099817862_1751686320167.jpg";
import dentistryImage from "@assets/Whisk_3d04f4d08a_1751686477441.jpg";
import healthCheckupImage from "@assets/Whisk_4775bef2ef_1751686648410.jpg";
import skinTreatmentImage from "@assets/Whisk_9528dc3a8e_1751692453501.jpg";

function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (hasIntersected) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = src;
    }
  }, [hasIntersected, src]);

  return (
    <div ref={elementRef} className={`${className} relative overflow-hidden`}>
      {/* Fixed height placeholder to prevent layout shift */}
      <div className="w-full h-48 bg-gray-200 rounded-lg">
        {hasIntersected && (
          <img 
            src={src} 
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {(!imageLoaded || !hasIntersected) && (
          <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      key: "skinTreatment",
      image: skinTreatmentImage,
      alt: "Korean skin treatment procedures",
    },
    {
      key: "dietCourse",
      image: dietImage,
      alt: "DT-7 Diet Course program",
    },
    {
      key: "dentistry",
      image: dentistryImage,
      alt: "Korean dental clinic",
    },
    {
      key: "healthCheckup",
      image: healthCheckupImage,
      alt: "Korean health check-up facility",
    },
  ];

  return (
    <section id="services" className="py-20" style={{ backgroundColor: '#f8f4ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="medical-h2 mb-4">
            {t.services.title}
          </h2>
          <p className="medical-subtitle">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const serviceData = t.services[service.key as keyof typeof t.services];
            
            // Type guard to ensure serviceData has the expected structure
            if (typeof serviceData === 'string' || !serviceData || !('title' in serviceData)) {
              return null;
            }
            
            return (
              <Card key={service.key} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                <LazyImage 
                  src={service.image} 
                  alt={service.alt}
                  className="w-full"
                />
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    {serviceData.title}
                  </CardTitle>
                  <CardDescription>
                    {serviceData.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="text-sm text-gray-500 space-y-1 mb-4 flex-1">
                    {serviceData.items.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline"
                    className="w-full bg-transparent border-2 px-6 py-3 text-base shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-white/10 rounded-full mt-auto"
                    style={{ 
                      fontFamily: 'mayo-display, Georgia, serif',
                      borderColor: 'hsl(220, 26%, 14%)',
                      color: 'hsl(220, 26%, 14%)'
                    }}
                  >
                    {t.services.learnMore.charAt(0).toUpperCase() + t.services.learnMore.slice(1).toLowerCase()}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
