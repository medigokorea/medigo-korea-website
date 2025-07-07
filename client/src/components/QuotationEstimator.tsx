import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Calculator } from "lucide-react";
import { useLocation } from "wouter";

export default function QuotationEstimator() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();

  return (
    <section className="py-12 md:py-20 bg-white quotation-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-gray-900 mb-8 md:mb-12">
          <h2 style={{ fontFamily: 'mayo-display, Georgia, serif', fontSize: '50px', fontWeight: '400', color: '#1f2937' }}>
            {language === 'cn' ? "找到适合您的治疗方案" : "Find Your Perfect Treatment Plan"}
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            {language === 'cn' 
              ? "通过简单的6步评估，我们将为您推荐最适合的治疗方案" 
              : "Through a simple 6-step assessment, we'll recommend the perfect treatment plan for you"}
          </p>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => {
              setLocation('/assessment');
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            variant="outline"
            className="bg-transparent border-2 px-8 py-4 text-base shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-white/10 rounded-full"
            style={{ 
              fontFamily: 'mayo-display, Georgia, serif',
              borderColor: 'hsl(220, 26%, 14%)',
              color: 'hsl(220, 26%, 14%)'
            }}
          >
            <Calculator className="mr-3 h-5 w-5" />
            Start Assessment
          </Button>
        </div>
      </div>
    </section>
  );
}