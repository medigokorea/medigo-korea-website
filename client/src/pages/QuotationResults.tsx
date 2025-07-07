import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft, CheckCircle, Clock, DollarSign, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface TreatmentRecommendation {
  id: string;
  title: string;
  description: string;
  procedures: string[];
  duration: string;
  estimatedCost: string;
  clinicType: string;
  advantages: string[];
  category: 'skinTreatment' | 'dietCourse' | 'dentistry' | 'healthCheckup';
}

export default function QuotationResults() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [recommendedTreatment, setRecommendedTreatment] = useState<TreatmentRecommendation | null>(null);
  const [userSelections, setUserSelections] = useState<{
    mainConcern: string[];
    desiredResults: string[];
    budgetRange: string;
    preferredDuration: string;
    recommendedType: number;
    scores: number[];
  }>({
    mainConcern: [],
    desiredResults: [],
    budgetRange: '',
    preferredDuration: '',
    recommendedType: 1,
    scores: [0, 0, 0, 0]
  });

  const generateAllTreatments = (): TreatmentRecommendation[] => {
    return [
      {
        id: 'type1-lifting',
        title: 'Type 1: Lifting + Wrinkles + Firmness + Hydration + Skin Regeneration',
        description: 'Comprehensive anti-aging treatment combining Ultherapy, Botox, HA Filler, and Skin Booster for complete facial rejuvenation.',
        procedures: [
          'Ultherapy (Grade A): Non-surgical lifting using MFU-V ultrasound targeting SMAS and dermis',
          'Botox (Grade S): Smooths frown lines and crow\'s feet',
          'HA Filler (Grade A): Restores volume to nasolabial folds and mid-cheek',
          'Skin Booster (Grade A): Hydration and skin texture improvement',
          'Rejuran / Juvelook / Exosomes: Intensive regeneration for thin and dehydrated skin'
        ],
        duration: 'Ultherapy → (after 1 week) Botox + Filler + Skin Booster',
        estimatedCost: '₱85,500 PHP ($1,500 USD)',
        clinicType: 'Premium Korean Aesthetic Clinic',
        advantages: ['Non-surgical lifting', 'Immediate volume restoration', 'Deep hydration', 'Complete facial rejuvenation'],
        category: 'skinTreatment'
      },
      {
        id: 'type2-pores',
        title: 'Type 2: Pores + Acne Scars + Skin Texture',
        description: 'Advanced treatment for acne scarring and pore refinement using Fraxel laser and regenerative therapies.',
        procedures: [
          'Fraxel (Grade B): Fractional laser for deep remodeling of acne scars and pores',
          'Skin Botox (Grade S): Tightens pores and smooths fine wrinkles',
          'Exosomes (Grade A): Boosts regeneration, prevents PIH (post-inflammatory hyperpigmentation)',
          'Hyperbaric Oxygen (Grade A): Enhances healing and skin recovery'
        ],
        duration: 'Fraxel → (3–5 days later) Skin Botox + Exosome Booster',
        estimatedCost: '₱89,000 PHP ($1,600 USD)',
        clinicType: 'Specialized Laser & Scar Treatment Center',
        advantages: ['Deep scar remodeling', 'Pore tightening', 'Advanced regeneration', 'Enhanced healing'],
        category: 'skinTreatment'
      },
      {
        id: 'type3-pigmentation',
        title: 'Type 3: Skin Tone + Pigmentation + Melasma / Freckles',
        description: 'Comprehensive pigmentation treatment using advanced laser technology and regenerative medicine.',
        procedures: [
          'Pigment Laser (Grade S): IPL or Pico Laser for melanin breakdown',
          'LDM (Grade A): Ultrasound tech for anti-inflammation & deep tissue repair',
          'Rejuran + Skin Botox (Grade A): Collagen regeneration, anti-aging',
          'Laser Toning (Grade B): Targets uneven tone, diffuse pigmentation'
        ],
        duration: 'Laser Toning + Pigment Removal → (after 1 week) Rejuran + LDM',
        estimatedCost: '₱87,000 PHP ($1,550 USD)',
        clinicType: 'Pigmentation Specialist Clinic',
        advantages: ['Melanin breakdown', 'Anti-inflammation', 'Collagen regeneration', 'Even skin tone'],
        category: 'skinTreatment'
      },
      {
        id: 'type4-vline',
        title: 'Type 4: V-Line Slimming + Facial Contour Enhancement',
        description: 'Facial contouring treatment for jawline slimming and enhanced facial definition.',
        procedures: [
          'Jaw Botox (Grade S): Masseter muscle slimming',
          'InMode FX (Grade B): RF technology for fat melting and lifting',
          'Rejuran + Skin Botox (Grade A): Firming and regeneration',
          'Chin Filler (Grade A): Enhances jawline definition'
        ],
        duration: 'InMode FX + Botox → (after 1 week) Chin Filler + Skin Botox',
        estimatedCost: '₱90,000 PHP ($1,600 USD)',
        clinicType: 'Facial Contouring Specialist Clinic',
        advantages: ['Jawline slimming', 'Fat melting technology', 'Enhanced definition', 'Natural V-line'],
        category: 'skinTreatment'
      }
    ];
  };

  useEffect(() => {
    // Get data from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const concerns = urlParams.get('concerns')?.split(',') || [];
    const results = urlParams.get('results')?.split(',') || [];
    const budget = urlParams.get('budget') || '';
    const duration = urlParams.get('duration') || '';
    const recommendedType = parseInt(urlParams.get('recommendedType') || '1');
    const scores = urlParams.get('scores')?.split(',').map(s => parseInt(s)) || [0, 0, 0, 0];

    setUserSelections({
      mainConcern: concerns,
      desiredResults: results,
      budgetRange: budget,
      preferredDuration: duration,
      recommendedType,
      scores
    });

    // Generate the recommended treatment based on type
    const allTreatments = generateAllTreatments();
    const recommended = allTreatments[recommendedType - 1];
    setRecommendedTreatment(recommended);
  }, []);

  const getIdealFor = (id: string) => {
    switch (id) {
      case 'type1-lifting':
        return 'Clients with mid-face sagging, fine lines, hollow cheeks, and dull skin';
      case 'type2-pores':
        return 'Clients with acne marks, enlarged pores, uneven skin texture';
      case 'type3-pigmentation':
        return 'Clients with melasma, dull complexion, age spots, fine lines';
      case 'type4-vline':
        return 'Clients with wide jawline, cheek bulges, or a large facial appearance';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors self-start mobile-touch-target"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">{t.assessment.backToHome}</span>
              </Button>
              <div className="md:border-l md:border-gray-200 md:pl-6">
                <h1 className="medical-h1 mb-2">
                  Your Personalized Treatment Recommendation
                </h1>
                <p className="medical-body">
                  Based on your selections, here is the best treatment for your skin concerns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div style={{ backgroundColor: '#f8f4ea' }} className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User Selections Summary */}
          <Card className="mb-8 md:mb-12 shadow-xl border-0">
            <CardHeader className="bg-white border-b border-gray-200 p-4 md:p-6">
              <CardTitle className="flex items-center space-x-3 text-lg md:text-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
                </div>
                <span className="text-gray-900 medical-heading">Your Selections</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <h4 className="font-semibold mb-3 md:mb-4 text-gray-900 text-base md:text-lg">Main Concerns:</h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {userSelections.mainConcern.map((concern) => (
                      <Badge key={concern} className="bg-gray-100 text-gray-800 border-gray-300 px-2 md:px-3 py-1 text-xs md:text-sm">
                        {concern}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 md:mb-4 text-gray-900 text-base md:text-lg">Desired Results:</h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {userSelections.desiredResults.map((result) => (
                      <Badge key={result} className="bg-gray-100 text-gray-800 border-gray-300 px-2 md:px-3 py-1 text-xs md:text-sm">
                        {result}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Title */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="medical-h2 mb-3 md:mb-4">
              Your Recommended Treatment
            </h2>
            <p className="medical-subtitle px-4">
              Based on your answers, this is the best treatment for your skin concerns
            </p>
            <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white rounded-lg border border-gray-200 inline-block">
              <span className="text-xs md:text-sm text-gray-600">
                Treatment Type {userSelections.recommendedType} selected with score: {userSelections.scores[userSelections.recommendedType - 1]}
              </span>
            </div>
          </div>

          {/* Recommended Treatment */}
          <div className="max-w-4xl mx-auto">
            {recommendedTreatment && (
              <Card className="h-full shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 overflow-hidden bg-white">
                <CardHeader className="bg-white border-b border-gray-200 p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-3 md:mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-lg">
                          {userSelections.recommendedType}
                        </div>
                        <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm self-start">
                          Recommended Skin Treatment Package
                        </Badge>
                      </div>
                      <CardTitle className="medical-h3 mb-2 md:mb-3 leading-tight">
                        {recommendedTreatment.title}
                      </CardTitle>
                      <CardDescription className="text-base md:text-lg text-gray-700 leading-relaxed">
                        {recommendedTreatment.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Procedures */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center text-gray-900 text-lg">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <CheckCircle className="h-5 w-5 text-gray-700" />
                      </div>
                      Included Procedures
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-3">
                      {recommendedTreatment.procedures.map((procedure, procedureIndex) => (
                        <li key={procedureIndex} className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="w-3 h-3 bg-gray-400 rounded-full mr-3 mt-1 flex-shrink-0"></span>
                          <span className="leading-relaxed">{procedure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment Schedule */}
                  <div style={{ backgroundColor: '#f8f4ea' }} className="p-5 rounded-xl border border-gray-200">
                    <h4 className="font-semibold mb-3 flex items-center text-gray-900">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm border border-gray-200">
                        <Clock className="h-5 w-5 text-gray-700" />
                      </div>
                      Treatment Schedule
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{recommendedTreatment.duration}</p>
                  </div>

                  {/* Cost and Clinic */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                          <DollarSign className="h-5 w-5 text-gray-700" />
                        </div>
                        <span className="font-semibold text-gray-900">Total Cost:</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">{recommendedTreatment.estimatedCost}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{recommendedTreatment.clinicType}</span>
                    </div>
                  </div>

                  {/* Ideal For */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Ideal For:</h4>
                    <div className="text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      {getIdealFor(recommendedTreatment.id)}
                    </div>
                  </div>

                  {/* Advantages */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Key Advantages</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendedTreatment.advantages.map((advantage, advantageIndex) => (
                        <Badge key={advantageIndex} className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">
                          {advantage}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full custom-button text-white mt-6 py-4 text-base font-semibold shadow-xl transform hover:scale-105 transition-all duration-300">
                    Select This Package
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Other Treatment Options */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="medical-h3 mb-4">
                Other Available Treatments
              </h3>
              <p className="medical-subtitle">
                Explore alternative treatments that might also interest you
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {generateAllTreatments().map((treatment, index) => (
                <div key={treatment.id} className={`p-4 bg-white rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                  treatment.id === recommendedTreatment?.id 
                    ? 'border-gray-900 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      treatment.id === recommendedTreatment?.id 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    {treatment.id === recommendedTreatment?.id && (
                      <Badge className="bg-gray-900 text-white text-xs px-2 py-1">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
                    {treatment.title.split(':')[1]?.trim() || treatment.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {treatment.description.substring(0, 80)}...
                  </p>
                  <div className="text-sm font-bold text-gray-900">
                    {treatment.estimatedCost.split('(')[1]?.replace(')', '') || treatment.estimatedCost}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-white border-b border-gray-200 text-center p-8">
              <CardTitle className="medical-h2 text-gray-900">Next Steps</CardTitle>
              <p className="text-lg text-gray-600 mt-2">Your journey to beautiful skin starts here</p>
            </CardHeader>
            <CardContent className="p-12">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                <div>
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h4 className="font-semibold mb-3 text-lg text-gray-900">Review Recommendation</h4>
                  <p className="text-gray-600 leading-relaxed">Confirm your personalized treatment plan based on your specific needs</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h4 className="font-semibold mb-3 text-lg text-gray-900">Book Consultation</h4>
                  <p className="text-gray-600 leading-relaxed">Schedule a free consultation with our Korean medical specialists</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h4 className="font-semibold mb-3 text-lg text-gray-900">Plan Your Trip</h4>
                  <p className="text-gray-600 leading-relaxed">We'll help arrange your complete medical tourism journey to Korea</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}