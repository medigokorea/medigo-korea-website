import { Shield, Users, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useState, useEffect } from "react";

import aboutImage from "@assets/Whisk_cfdb5f3ac5_1751685967023.jpg";

function LazyAboutImage() {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (hasIntersected) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = aboutImage;
    }
  }, [hasIntersected]);

  return (
    <div ref={elementRef} className="relative">
      {/* Fixed height container to prevent layout shift */}
      <div 
        className="rounded-xl shadow-lg w-full bg-gray-200 overflow-hidden"
        style={{ height: '400px' }}
      >
        {hasIntersected && (
          <img 
            src={aboutImage}
            alt="Professional medical aesthetics treatment in Korean clinic"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {(!imageLoaded || !hasIntersected) && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="medical-h2 mb-4" style={{ fontWeight: 'normal' }}>
            {t.about.title}
          </h2>
          <p className="medical-subtitle max-w-3xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-gray-800 text-white p-3 rounded-full">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2" style={{ fontFamily: 'mayo-display, Georgia, serif', fontSize: '25px', fontWeight: '600', color: '#1f2937' }}>
                  {t.about.worldClassStandards}
                </h3>
                <p className="medical-text">
                  {t.about.worldClassDescription}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="text-white p-3 rounded-full" style={{ backgroundColor: '#009f94' }}>
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2" style={{ fontFamily: 'mayo-display, Georgia, serif', fontSize: '25px', fontWeight: '600', color: '#1f2937' }}>
                  {t.about.seamlessExperience}
                </h3>
                <p className="medical-text">
                  {t.about.seamlessDescription}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-gray-500 text-white p-3 rounded-full">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2" style={{ fontFamily: 'mayo-display, Georgia, serif', fontSize: '25px', fontWeight: '600', color: '#1f2937' }}>
                  {t.about.healingCulture}
                </h3>
                <p className="medical-text">
                  {t.about.healingDescription}
                </p>
              </div>
            </div>
          </div>

          <LazyAboutImage />
        </div>
      </div>
    </section>
  );
}