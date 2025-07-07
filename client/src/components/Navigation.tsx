import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { Language } from "@/lib/translations";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languageOptions = [
    { value: "en", label: "🇺🇸 English", flag: "🇺🇸" },
    { value: "cn", label: "🇨🇳 Chinese", flag: "🇨🇳" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-1 md:space-x-2">
              {/* Logo */}
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 rounded-full flex items-center justify-center" style={{ borderColor: 'hsl(220, 26%, 14%)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-3 md:h-3">
                  <rect x="8" y="3" width="8" height="18" rx="1" fill="hsl(220, 26%, 14%)"/>
                  <rect x="3" y="8" width="18" height="8" rx="1" fill="hsl(220, 26%, 14%)"/>
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl text-black" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>Medigo Korea</h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="w-32 lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="bg-transparent border-2 px-6 py-3 text-base shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-white/10 rounded-full" 
              style={{ 
                fontFamily: 'mayo-display, Georgia, serif',
                borderColor: 'hsl(220, 26%, 14%)',
                color: 'hsl(220, 26%, 14%)'
              }}
              onClick={() => {
                const contactSection = document.getElementById('instant-contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                  // Add pulsing effect
                  contactSection.classList.add('animate-pulse');
                  setTimeout(() => {
                    contactSection.classList.remove('animate-pulse');
                  }, 3000);
                }
              }}
            >
              {t.nav.freeQuote.charAt(0).toUpperCase() + t.nav.freeQuote.slice(1).toLowerCase()}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-touch-target"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-3 bg-white border-t border-gray-200">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'mayo-sans, Times, sans-serif' }}>Language</label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-2 px-6 py-3 text-base shadow-lg transform hover:scale-105 transition-all duration-300 mobile-touch-target hover:bg-white/10 rounded-full" 
                  style={{ 
                    fontFamily: 'mayo-display, Georgia, serif',
                    borderColor: 'hsl(220, 26%, 14%)',
                    color: 'hsl(220, 26%, 14%)'
                  }}
                  onClick={() => {
                    const contactSection = document.getElementById('instant-contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                      // Add pulsing effect
                      contactSection.classList.add('animate-pulse');
                      setTimeout(() => {
                        contactSection.classList.remove('animate-pulse');
                      }, 3000);
                    }
                  }}
                >
                  {t.nav.freeQuote.charAt(0).toUpperCase() + t.nav.freeQuote.slice(1).toLowerCase()}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
