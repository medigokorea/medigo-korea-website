import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useState, useEffect } from "react";
import mariaImage from "@assets/Whisk_485e1d4b87_1751787669515.jpg";
import emilyImage from "@assets/Whisk_bcac0b10ea_1751787669515.jpg";
import wangMeilingImage from "@assets/Whisk_54f1661165_1751788030474.jpg";
import chenWeiImage from "@assets/Whisk_08a8a8dcd5_1751787669515.jpg";

function LazyTestimonialImage({ src, alt }: { src: string; alt: string }) {
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
    <div ref={elementRef} className="w-12 h-12 rounded-full overflow-hidden">
      {hasIntersected && (
        <img 
          src={src} 
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      )}
      {!imageLoaded && hasIntersected && (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Maria S.",
      country: "Philippines",
      rating: 5,
      text: "The laser skin resurfacing treatment transformed my complexion completely. My acne scars are gone and my skin looks radiant. The Korean medical technology is truly advanced!",
      image: mariaImage,
    },
    {
      name: "Emily Johnson",
      country: "United States",
      rating: 5,
      text: "Amazing results with the skin whitening and anti-aging treatment. The procedure was comfortable and the staff spoke perfect English. My skin tone is now even and glowing!",
      image: emilyImage,
    },
    {
      name: "王美玲",
      country: "Taiwan",
      rating: 5,
      text: "DT-7減肥療程效果驚人！短短三個月就瘦了15公斤，而且沒有任何副作用。韓國的醫療技術真的很先進，醫生和護士都很專業貼心。",
      image: wangMeilingImage,
    },
    {
      name: "Chen Wei",
      country: "Singapore",
      rating: 5,
      text: "The dental implant procedure was painless and the results are perfect. The medical team was incredibly skilled and the facilities were world-class. Worth every penny!",
      image: chenWeiImage,
    },
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#f8f4ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="medical-h2 mb-4">
            {t.testimonials.title}
          </h2>
          <p className="medical-subtitle">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{t.testimonials.verifiedClient}</span>
                  <CheckCircle className="h-4 w-4 text-green-600 ml-1" />
                </div>
                <p className="text-gray-700 mb-4 flex-grow">"{testimonial.text}"</p>
                <div className="flex items-center mt-auto">
                  <LazyTestimonialImage 
                    src={testimonial.image} 
                    alt={`${testimonial.name} testimonial`}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
