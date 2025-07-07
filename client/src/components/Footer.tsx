import { useLanguage } from "@/hooks/useLanguage";
import { Phone, Mail, MapPin, Award } from "lucide-react";

export default function Footer() {
  const { t, language } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-12" style={{ backgroundColor: 'hsl(220, 26%, 14%)', color: 'hsl(0, 0%, 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {/* Logo - Medical Cross */}
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="4" width="6" height="16" rx="1" fill="black"/>
                  <rect x="4" y="9" width="16" height="6" rx="1" fill="black"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>Medigo Korea</h3>
            </div>
            <p className="text-gray-300 mb-4" style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}>
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
              {t.footer.services}
            </h4>
            <ul className="space-y-2 text-gray-300" style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}>
              <li><a href="#services" onClick={() => scrollToSection('services')} className="transition-colors cursor-pointer hover:text-[#009f94]">
                {t.services.skinTreatment.title}
              </a></li>
              <li><a href="#services" onClick={() => scrollToSection('services')} className="transition-colors cursor-pointer hover:text-[#009f94]">
                {t.services.dietCourse.title}
              </a></li>
              <li><a href="#services" onClick={() => scrollToSection('services')} className="transition-colors cursor-pointer hover:text-[#009f94]">
                {t.services.dentistry.title}
              </a></li>
              <li><a href="#services" onClick={() => scrollToSection('services')} className="transition-colors cursor-pointer hover:text-[#009f94]">
                {t.services.healthCheckup.title}
              </a></li>
              <li><a href="#" className="transition-colors hover:text-[#009f94]">
                {t.services.fitPrivateTour.title}
              </a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-gray-300" style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}>
              <li><a href="#" className="hover:text-[#009f94] transition-colors">
                {t.footer.medicalConsent}
              </a></li>
              <li><a href="#" className="hover:text-[#009f94] transition-colors">
                {t.footer.privacyPolicy}
              </a></li>
              <li><a href="#" className="hover:text-[#009f94] transition-colors">
                {t.footer.termsOfService}
              </a></li>
              <li><a href="#" className="hover:text-[#009f94] transition-colors">
                {t.footer.refundPolicy}
              </a></li>
              <li><a href="#" className="hover:text-[#009f94] transition-colors">
                {t.footer.aftercarePolicy}
              </a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
              {t.footer.contact}
            </h4>
            <div className="space-y-3 text-gray-300" style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}>
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 flex-shrink-0" style={{ color: '#009f94' }} />
                <p>+82-10-2729-0702</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 flex-shrink-0" style={{ color: '#009f94' }} />
                <p>cs@medigokorea.kr</p>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#009f94' }} />
                <p>15-1, Achasan-ro 7-gil, seongdong-gu, seoul, korea</p>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 flex-shrink-0" style={{ color: '#009f94' }} />
                  <p className="text-sm">Medical Tourism License: A-2025-01-01-06147</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
          <p style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}>
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
