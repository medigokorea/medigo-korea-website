import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, DollarSign, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface TreatmentItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'KRW';
}

interface TreatmentPackage {
  id: string;
  title: string;
  category: string;
  description: string;
  items: TreatmentItem[];
  totalPrice: number;
  currency: 'USD' | 'KRW';
  duration: string;
  included: string[];
}

// Real treatment packages based on assessment results - synchronized with Admin pricing
const treatmentPackages: Record<string, TreatmentPackage> = {
  type1: {
    id: "type1-lifting",
    title: "Type 1: Complete Anti-Aging & Facial Rejuvenation",
    category: "Skin Treatment",
    description: "Comprehensive anti-aging treatment combining Ultherapy, Botox, HA Filler, and Skin Booster for complete facial rejuvenation",
    items: [
      {
        id: "ultherapy",
        name: "Ulthera/Thermage 300 Shots",
        description: "Dermal & SMAS layer lifting (MFU-V ultrasound) - A-Grade",
        price: 1560000,
        currency: 'KRW'
      },
      {
        id: "botox",
        name: "Imported (German) Wrinkle Botox",
        description: "Forehead & eye wrinkle removal - S-Grade",
        price: 120000,
        currency: 'KRW'
      },
      {
        id: "ha-filler",
        name: "Imported Filler 1cc",
        description: "Nasolabial & cheek volume enhancement - A-Grade",
        price: 480000,
        currency: 'KRW'
      },
      {
        id: "skin-booster",
        name: "Skin Botox + Aqua Injection",
        description: "Moisture & skin texture improvement - A-Grade",
        price: 348000,
        currency: 'KRW'
      },
      {
        id: "rejuran",
        name: "Rejuran/Juvelook/Exosome 4cc",
        description: "Deep dryness, thin skin, overall regeneration - A-Grade",
        price: 600000,
        currency: 'KRW'
      }
    ],
    totalPrice: 3108000,
    currency: 'KRW',
    duration: "Ulthera → (after 1 week) Botox + Filler + Skin Botox",
    included: ["Premium Korean clinic treatment", "Post-treatment care", "Follow-up consultation", "Regeneration therapy"]
  },
  type2: {
    id: "type2-pores",
    title: "Type 2: Advanced Pore & Scar Treatment",
    category: "Skin Treatment",
    description: "Advanced treatment for acne scarring and pore refinement using Fraxel laser and regenerative therapies",
    items: [
      {
        id: "fraxel",
        name: "Fraxel Full Face 1 Session + PDRN",
        description: "Fractional laser for deep remodeling of acne scars and pore refinement - B-Grade",
        price: 720000,
        currency: 'KRW'
      },
      {
        id: "skin-botox",
        name: "Skin Botox Full Face",
        description: "Tightens pores and smooths fine wrinkles - S-Grade",
        price: 228000,
        currency: 'KRW'
      },
      {
        id: "exosome-booster",
        name: "Exosome + Aqua + Skin Botox",
        description: "Boosts regeneration, prevents PIH (post-inflammatory hyperpigmentation) - A-Grade",
        price: 660000,
        currency: 'KRW'
      },
      {
        id: "ldm-lifting",
        name: "LDM Water Drop Lifting",
        description: "Enhances healing and skin recovery - A-Grade",
        price: 360000,
        currency: 'KRW'
      }
    ],
    totalPrice: 1968000,
    currency: 'KRW',
    duration: "Fraxel → (3-5 days later) Skin Botox + Exosome Booster",
    included: ["Specialized laser treatment", "Deep scar remodeling", "Pore tightening", "Advanced regeneration therapy"]
  },
  type3: {
    id: "type3-pigmentation",
    title: "Type 3: Brightening & Pigmentation Correction",
    category: "Skin Treatment", 
    description: "Comprehensive pigmentation treatment using advanced laser technology and regenerative medicine",
    items: [
      {
        id: "triple-toning",
        name: "Triple Toning 1 Session",
        description: "IPL or Pico Laser for melanin breakdown - S-Grade",
        price: 300000,
        currency: 'KRW'
      },
      {
        id: "ldm",
        name: "LDM Water Drop Lifting",
        description: "Ultrasound tech for anti-inflammation & deep tissue repair - A-Grade",
        price: 360000,
        currency: 'KRW'
      },
      {
        id: "rejuran-skin-botox",
        name: "Rejuran + Aqua + Skin Botox",
        description: "Collagen regeneration, anti-aging - A-Grade",
        price: 660000,
        currency: 'KRW'
      },
      {
        id: "pdt",
        name: "PDT 13% 1 Session",
        description: "Targets uneven tone, diffuse pigmentation - B-Grade",
        price: 180000,
        currency: 'KRW'
      }
    ],
    totalPrice: 1500000,
    currency: 'KRW',
    duration: "Toning + Pigment Removal → (after 1 week) Rejuran + LDM",
    included: ["Melanin breakdown treatment", "Anti-inflammation therapy", "Collagen regeneration", "Even skin tone restoration"]
  },
  type4: {
    id: "type4-vline",
    title: "Type 4: V-Line Sculpting & Facial Contouring",
    category: "Skin Treatment",
    description: "Facial contouring treatment for jawline slimming and enhanced facial definition",
    items: [
      {
        id: "jaw-botox",
        name: "Imported (German) Jaw Botox",
        description: "Masseter muscle slimming - S-Grade",
        price: 168000,
        currency: 'KRW'
      },
      {
        id: "inmode",
        name: "InMode 1,2 (One Area)",
        description: "RF technology for fat melting and lifting - B-Grade",
        price: 360000,
        currency: 'KRW'
      },
      {
        id: "oligio",
        name: "Oligio 300 Shots",
        description: "Firming and regeneration - A-Grade",
        price: 720000,
        currency: 'KRW'
      },
      {
        id: "chin-filler",
        name: "Imported Filler 1cc",
        description: "Enhances jawline definition - A-Grade",
        price: 480000,
        currency: 'KRW'
      }
    ],
    totalPrice: 1728000,
    currency: 'KRW',
    duration: "InMode + Botox → (after 1 week) Chin Filler + Oligio",
    included: ["Jawline slimming", "Fat melting technology", "Enhanced facial definition", "Natural V-line creation"]
  },
  type5: {
    id: "type5-custom",
    title: "Type 5: Custom Treatment Package",
    category: "Custom Selection",
    description: "Create your personalized treatment plan by selecting from our comprehensive menu of Korean medical aesthetic procedures",
    items: [], // Will be populated dynamically based on user selection
    totalPrice: 0,
    currency: 'KRW',
    duration: "Customized schedule based on your selections",
    included: ["Personalized treatment plan", "Flexible scheduling", "Professional consultation", "Aftercare guidance"]
  }
};

// Complete treatment menu for Type 5 customization - synchronized with admin system
const allTreatments: TreatmentItem[] = [
  // Laser Treatments
  { id: "pdt", name: "PDT 13% 1 Session", description: "Photodynamic therapy for acne and skin renewal", price: 180000, currency: 'KRW' },
  { id: "gold-ptt", name: "Gold PTT 1 Session", description: "Gold nanoparticle photothermal therapy", price: 420000, currency: 'KRW' },
  { id: "fraxel-full", name: "Fraxel Full Face 1 Session", description: "Fractional laser for full face treatment", price: 600000, currency: 'KRW' },
  { id: "fraxel-full-pdrn", name: "Fraxel Full Face 1 Session + PDRN", description: "Fraxel with regenerative PDRN therapy", price: 720000, currency: 'KRW' },
  { id: "fraxel-butterfly", name: "Fraxel Butterfly Zone", description: "Fraxel laser treatment for cheek area", price: 360000, currency: 'KRW' },
  { id: "fraxel-butterfly-pdrn", name: "Fraxel Butterfly Zone + PDRN", description: "Fraxel butterfly zone with regenerative therapy", price: 480000, currency: 'KRW' },
  { id: "triple-toning", name: "Triple Toning 1 Session", description: "Advanced pigmentation treatment", price: 300000, currency: 'KRW' },
  { id: "triple-toning-10", name: "Triple Toning 10 Sessions", description: "Complete pigmentation treatment package", price: 2400000, currency: 'KRW' },
  
  // Botox Treatments
  { id: "domestic-wrinkle-botox", name: "Domestic Wrinkle Botox", description: "Korean-made botox for wrinkles", price: 60000, currency: 'KRW' },
  { id: "imported-wrinkle-botox", name: "Imported (German) Wrinkle Botox", description: "Premium German botox for wrinkles", price: 120000, currency: 'KRW' },
  { id: "domestic-jaw-botox", name: "Domestic Jaw Botox", description: "Korean-made botox for masseter slimming", price: 84000, currency: 'KRW' },
  { id: "imported-jaw-botox", name: "Imported (German) Jaw Botox", description: "Premium German botox for jaw slimming", price: 168000, currency: 'KRW' },
  { id: "skin-botox-full", name: "Skin Botox Full Face", description: "Micro-botox for skin texture improvement", price: 228000, currency: 'KRW' },
  { id: "skin-botox-eyes", name: "Skin Botox Eye Area", description: "Micro-botox for eye area fine lines", price: 84000, currency: 'KRW' },
  { id: "skin-botox-aqua", name: "Skin Botox + Aqua Injection", description: "Combined micro-botox and hydration therapy", price: 348000, currency: 'KRW' },
  
  // Filler Treatments
  { id: "domestic-filler", name: "Domestic Filler 1cc", description: "Korean-made hyaluronic acid filler", price: 240000, currency: 'KRW' },
  { id: "imported-filler", name: "Imported Filler 1cc", description: "Premium imported hyaluronic acid filler", price: 480000, currency: 'KRW' },
  
  // Regenerative Treatments
  { id: "rejuran-1cc", name: "Rejuran/Juvelook/Exosome 1cc", description: "Regenerative skin healing treatment", price: 180000, currency: 'KRW' },
  { id: "rejuran-4cc", name: "Rejuran/Juvelook/Exosome 4cc", description: "Intensive regenerative treatment", price: 600000, currency: 'KRW' },
  { id: "rejuran-sleep-4cc", name: "Rejuran Sleep 4cc+", description: "Sleep anesthesia rejuran treatment", price: 780000, currency: 'KRW' },
  { id: "rejuran-combo", name: "Rejuran + Aqua + Skin Botox", description: "Complete regenerative combo treatment", price: 660000, currency: 'KRW' },
  { id: "exosome-combo", name: "Exosome + Aqua + Skin Botox", description: "Advanced exosome combination therapy", price: 660000, currency: 'KRW' },
  
  // HIFU/RF Treatments
  { id: "oligio-300", name: "Oligio 300 Shots", description: "RF microneedling for skin tightening", price: 720000, currency: 'KRW' },
  { id: "oligio-600", name: "Oligio 600 Shots", description: "Intensive RF microneedling treatment", price: 1320000, currency: 'KRW' },
  { id: "eye-oligio", name: "Eye Oligio 100 Shots", description: "RF treatment for eye area", price: 240000, currency: 'KRW' },
  { id: "ulthera-100", name: "Ulthera/Thermage 100 Shots", description: "HIFU lifting treatment", price: 540000, currency: 'KRW' },
  { id: "ulthera-300", name: "Ulthera/Thermage 300 Shots", description: "Comprehensive HIFU lifting treatment", price: 1560000, currency: 'KRW' },
  { id: "linear-firm-100", name: "Linear Firm 100 Shots", description: "Linear HIFU body contouring", price: 300000, currency: 'KRW' },
  { id: "linear-firm-300", name: "Linear Firm 300 Shots", description: "Intensive linear HIFU treatment", price: 900000, currency: 'KRW' },
  { id: "linear-firm-400", name: "Linear Firm 400 Shots", description: "Maximum linear HIFU treatment", price: 1080000, currency: 'KRW' },
  { id: "rf-lifting", name: "RF Lifting", description: "Radiofrequency skin tightening", price: 240000, currency: 'KRW' },
  
  // Advanced Treatments
  { id: "accento-regen", name: "Accento 1 Session + Regenerative", description: "Advanced body contouring with regenerative therapy", price: 600000, currency: 'KRW' },
  { id: "inmode-1", name: "InMode 1 (One Area)", description: "Fractional RF treatment for one area", price: 240000, currency: 'KRW' },
  { id: "inmode-1-2", name: "InMode 1,2 (One Area)", description: "Combined InMode treatment for one area", price: 360000, currency: 'KRW' },
  { id: "mts", name: "MTS (Microneedling)", description: "Microneedling therapy system", price: 300000, currency: 'KRW' },
  { id: "ldm-lifting", name: "LDM Water Drop Lifting", description: "Ultrasonic deep cleansing and lifting", price: 360000, currency: 'KRW' },
  { id: "aqua-peel", name: "Aqua Peel 1 Session", description: "Hydro-dermabrasion treatment", price: 300000, currency: 'KRW' },
  { id: "ion-enzyme", name: "Ion Enzyme Care", description: "Ion enzyme facial treatment", price: 240000, currency: 'KRW' },
  { id: "collagen-egg", name: "Collagen Egg (Doctor)", description: "Premium collagen treatment by doctor", price: 480000, currency: 'KRW' },
  { id: "collagen-jar-glove", name: "Collagen Jar + Glove", description: "Collagen jar and glove treatment", price: 480000, currency: 'KRW' }
];

export default function PriceEstimator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<TreatmentPackage | null>(null);
  const [treatmentType, setTreatmentType] = useState<string>('type1');
  const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());
  const [customTotal, setCustomTotal] = useState<number>(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Get treatment type from URL parameters or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    
    // Check localStorage for assessment results
    const assessmentResult = localStorage.getItem('assessmentResult');
    let recommendedType = 'type1'; // default
    
    if (assessmentResult) {
      try {
        const result = JSON.parse(assessmentResult);
        recommendedType = `type${result.recommendedType || 1}`;
      } catch (e) {
        console.log('Could not parse assessment result');
      }
    }
    
    // Use URL parameter if available, otherwise use assessment result
    const finalType = typeParam || recommendedType;
    setTreatmentType(finalType);
    
    // Set the selected package based on the type
    if (treatmentPackages[finalType]) {
      setSelectedPackage(treatmentPackages[finalType]);
    } else {
      setSelectedPackage(treatmentPackages.type1); // fallback to type1
    }
  }, []);

  const formatPrice = (price: number, currency: 'USD' | 'KRW', showBoth: boolean = false) => {
    if (currency === 'KRW') {
      // For KRW prices, show KRW first with USD conversion
      const usdPrice = Math.round(price / 1300);
      return showBoth ? `₩${price.toLocaleString()} ($${usdPrice.toLocaleString()})` : `₩${price.toLocaleString()}`;
    } else {
      // For USD prices, show both currencies
      if (showBoth) {
        const krwPrice = price * 1300;
        return `₩${krwPrice.toLocaleString()} ($${price.toLocaleString()})`;
      } else {
        return `$${price.toLocaleString()}`;
      }
    }
  };

  const handleTreatmentToggle = (treatmentId: string) => {
    const newSelected = new Set(selectedTreatments);
    if (newSelected.has(treatmentId)) {
      newSelected.delete(treatmentId);
    } else {
      newSelected.add(treatmentId);
    }
    setSelectedTreatments(newSelected);
    
    // Calculate new total
    const total = Array.from(newSelected).reduce((sum, id) => {
      const treatment = allTreatments.find(t => t.id === id);
      return sum + (treatment?.price || 0);
    }, 0);
    setCustomTotal(total);
  };

  const getCustomPackage = (): TreatmentPackage => {
    const selectedItems = allTreatments.filter(t => selectedTreatments.has(t.id));
    return {
      ...treatmentPackages.type5,
      items: selectedItems,
      totalPrice: customTotal
    };
  };

  // Update custom package when selections change
  useEffect(() => {
    if (treatmentType === 'type5') {
      setSelectedPackage(getCustomPackage());
    }
  }, [selectedTreatments, customTotal, treatmentType]);

  const handleBookConsultation = () => {
    setLocation('/process');
    toast({
      title: "Redirecting to Consultation",
      description: "Let's schedule your consultation and discuss your treatment plan",
    });
  };

  if (!selectedPackage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f4ea' }}>
      <Navigation />
      
      <main className="pt-2" style={{ backgroundColor: '#f8f4ea' }}>
        <section className="py-2 md:py-4 relative overflow-hidden min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-2 sm:mb-4 gap-2 sm:gap-4 px-2 sm:px-0">
              <Button
                variant="outline"
                onClick={() => setLocation('/')}
                className="bg-transparent text-black border-black hover:bg-gray-50 w-8 h-8 p-0 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center shrink-0"
                style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
              >
                <ArrowLeft className="h-3 w-3" />
              </Button>
              
              <h1 className="flex-1 text-center px-2" style={{ 
                fontFamily: 'mayo-display, Georgia, serif', 
                fontSize: 'clamp(18px, 4vw, 48px)', 
                fontWeight: '400', 
                color: '#1f2937', 
                lineHeight: '1.2',
                margin: '0',
                wordBreak: 'keep-all'
              }}>
                Price Estimator
              </h1>
              
              <div className="w-8 shrink-0"></div>
            </div>

            {/* Treatment Type Selector */}
            <div className="mb-2 px-2 sm:px-0">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-center" style={{ color: '#1f2937', fontFamily: 'mayo-display, Georgia, serif' }}>
                Select Treatment Type
              </h3>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2">
                {Object.entries(treatmentPackages).map(([key, pkg]) => (
                  <Button
                    key={key}
                    variant={treatmentType === key ? "default" : "outline"}
                    onClick={() => {
                      setTreatmentType(key);
                      if (key === 'type5') {
                        setSelectedPackage(getCustomPackage());
                      } else {
                        setSelectedPackage(pkg);
                      }
                    }}
                    className={`px-4 sm:px-6 py-3 text-sm sm:text-base rounded-full transition-all duration-200 ${
                      treatmentType === key 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'bg-white text-black border-black hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                  >
                    {key === 'type5' ? 'Customization' : `Type ${key.slice(-1)}`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Package Details Card */}
            <Card className="shadow-xl border-2 border-black rounded-3xl overflow-hidden bg-white backdrop-blur-sm mb-4">
              <CardHeader className="text-center pb-6 px-4 sm:px-6 bg-white border-b-2 border-black" style={{ backgroundColor: 'white' }}>
                <CardTitle className="text-lg sm:text-2xl md:text-3xl font-normal text-black mb-2 leading-tight px-2" 
                          style={{ fontFamily: 'mayo-display, Georgia, serif', wordBreak: 'keep-all' }}>
                  {selectedPackage.title}
                </CardTitle>
                <Badge variant="secondary" className="mx-auto text-xs sm:text-sm px-3 sm:px-4 py-1 bg-black text-white border-black">
                  {selectedPackage.category}
                </Badge>
                <p className="text-gray-700 text-sm sm:text-base lg:text-lg mt-4 max-w-2xl mx-auto leading-relaxed px-2">
                  {selectedPackage.description}
                </p>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* Type 5 Custom Treatment Selection */}
                {treatmentType === 'type5' && (
                  <div className="space-y-6 mb-8">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-6" style={{ color: '#1f2937', fontFamily: 'mayo-display, Georgia, serif' }}>
                      Select Your Treatments
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-5">
                      {allTreatments.map((treatment) => (
                        <div key={treatment.id} 
                             className={`p-4 sm:p-5 rounded-lg border transition-all cursor-pointer ${
                               selectedTreatments.has(treatment.id) 
                                 ? 'border-black bg-gray-50' 
                                 : 'border-gray-200 hover:border-gray-300'
                             }`}
                             onClick={() => handleTreatmentToggle(treatment.id)}>
                          <div className="flex items-start gap-4 mb-3">
                            <input 
                              type="checkbox" 
                              checked={selectedTreatments.has(treatment.id)}
                              onChange={() => handleTreatmentToggle(treatment.id)}
                              className="w-5 h-5 mt-1 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base sm:text-lg mb-2 break-words" style={{ color: '#1f2937' }}>
                                {treatment.name}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="text-center mb-3">
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed break-words">
                              {treatment.description}
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <span className="text-lg sm:text-xl font-bold break-words" style={{ color: '#009f94' }}>
                              {formatPrice(treatment.price, treatment.currency, true)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Treatment Items for Types 1-4 */}
                {treatmentType !== 'type5' && (
                  <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-6" style={{ color: '#1f2937', fontFamily: 'mayo-display, Georgia, serif' }}>
                      Included Treatments
                    </h3>
                  
                    {selectedPackage.items.map((item, index) => (
                      <div key={item.id} 
                           className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                 style={{ backgroundColor: 'black' }}>
                              {index + 1}
                            </div>
                            <h4 className="font-semibold text-lg sm:text-xl truncate" style={{ color: '#1f2937' }}>
                              {item.name}
                            </h4>
                          </div>
                          <p className="text-gray-600 text-base sm:text-lg ml-10 sm:ml-11 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-left sm:text-right ml-10 sm:ml-4 flex-shrink-0">
                          <span className="text-xl sm:text-2xl font-bold break-words" style={{ color: '#009f94' }}>
                            {formatPrice(item.price, item.currency, true)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}



                {/* Total Price */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 mb-8 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1" style={{ color: '#1f2937', fontFamily: 'mayo-display, Georgia, serif' }}>
                        Total Package Price
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        All treatments included • No hidden fees
                      </p>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="flex items-center justify-center sm:justify-end">
                        <span className="text-xl sm:text-3xl font-bold break-words" style={{ color: '#009f94' }}>
                          {formatPrice(selectedPackage.totalPrice, selectedPackage.currency, true)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Consultation Button */}
                <div className="text-center">
                  <Button 
                    variant="outline"
                    onClick={handleBookConsultation}
                    className="bg-transparent text-black border-black py-3 px-8 text-base font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg transform hover:scale-105"
                    style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Book Consultation
                  </Button>
                  <p className="text-gray-600 text-sm mt-3">
                    Get personalized consultation and detailed treatment planning
                  </p>
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