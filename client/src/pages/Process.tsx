import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calculator, MessageCircle, Phone, Video, Syringe, Heart, ArrowRight, CheckCircle, Clock, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Process() {
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Navigate to contact section with highlight effect
  const handleInstantConsultation = () => {
    setLocation('/');
    // Small delay to ensure page loads before scrolling
    setTimeout(() => {
      const contactSection = document.getElementById('instant-contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Add pulsing effect
        contactSection.classList.add('animate-pulse');
        setTimeout(() => {
          contactSection.classList.remove('animate-pulse');
        }, 3000);
      }
    }, 100);
  };

  const processSteps = [
    {
      step: 1,
      title: t.process.steps.quote.title,
      icon: <Calculator className="w-8 h-8" />,
      description: t.process.steps.quote.description
    },
    {
      step: 2,
      title: t.process.steps.initial.title,
      icon: <Phone className="w-8 h-8" />,
      description: t.process.steps.initial.description
    },
    {
      step: 3,
      title: t.process.steps.medical.title,
      icon: <Video className="w-8 h-8" />,
      description: t.process.steps.medical.description
    },
    {
      step: 4,
      title: t.process.steps.treatment.title,
      icon: <Syringe className="w-8 h-8" />,
      description: t.process.steps.treatment.description
    },
    {
      step: 5,
      title: t.process.steps.aftercare.title,
      icon: <Heart className="w-8 h-8" />,
      description: t.process.steps.aftercare.description
    }
  ];

  const handleScrollToContact = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setLocation('/#contact');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="pt-4 pb-8 md:pb-16 relative overflow-hidden min-h-screen" style={{ backgroundColor: '#f8f4ea' }}>
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/assessment')}
                  className="bg-transparent text-black border-black hover:bg-gray-50 w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center"
                  style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                >
                  <ArrowLeft className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
                
                <h1 style={{ 
                  fontFamily: 'mayo-display, Georgia, serif', 
                  fontSize: 'clamp(20px, 6vw, 64px)', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  lineHeight: '1.2',
                  margin: '0',
                  textAlign: 'center',
                  letterSpacing: '-0.3px',
                  padding: '0 8px'
                }}>
                  {t.process.title}
                </h1>
                
                <div className="w-6 sm:w-8"></div>
              </div>

            {/* Main Content Box */}
            <Card className="shadow-xl sm:shadow-2xl max-w-7xl mx-auto border-2 border-black overflow-hidden bg-white/95 backdrop-blur-sm transform scale-95 sm:scale-90">
              <CardContent className="p-4 sm:p-6 md:p-8">
                {/* Subtitle */}
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                  <p className="text-gray-800 text-lg sm:text-xl font-semibold max-w-3xl mx-auto tracking-wide px-4" style={{ fontFamily: 'mayo-display, Georgia, serif', letterSpacing: '0.3px' }}>
                    {t.process.subtitle}
                  </p>
                </div>

                {/* Simplified Process Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  {processSteps.map((step, index) => (
                    <div key={step.step} className="group relative">
                      {/* Simple clean card */}
                      <div className="relative bg-white border-2 border-black rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-600">
                        {/* Step number */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                            {step.step}
                          </div>
                        </div>
                        
                        {/* Icon */}
                        <div className="mb-3 sm:mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center text-black group-hover:bg-gray-200 transition-colors duration-300">
                            <div className="w-5 h-5 sm:w-6 sm:h-6">
                              {step.icon}
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-1 sm:space-y-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            {step.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Simple arrow connector */}
                      {index < processSteps.length - 1 && (
                        <div className="hidden lg:flex absolute top-8 -right-3 transform text-gray-300">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Simple CTA Section */}
                <div className="text-center py-8 sm:py-12 px-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-3 sm:mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                    {language === 'cn' ? '지금 시작하세요' : 'Start Your Journey Today'}
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                    {language === 'cn' 
                      ? '전문 의료진과의 상담을 통해 맞춤형 치료 계획을 세워보세요' 
                      : 'Create a personalized treatment plan through consultation with our medical professionals'}
                  </p>
                  
                  <Button 
                    onClick={handleInstantConsultation}
                    variant="outline"
                    className="bg-transparent text-black border-black py-2 px-4 sm:px-6 text-sm sm:text-base font-medium rounded-full hover:bg-gray-50 transition-all duration-200"
                    style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                  >
                    <MessageCircle className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {language === 'cn' ? '즉시 상담' : 'Instant Consultation'}
                  </Button>
                  
                  {/* Simple completion time indicator */}
                  <div className="flex justify-center items-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <span>Average completion time: 2-3 weeks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}