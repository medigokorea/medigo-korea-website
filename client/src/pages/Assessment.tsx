import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertQuotationRequestSchema, type InsertQuotationRequest } from "@shared/schema";
import { Calculator, RefreshCw, Heart, Star, Sparkles, Calendar, DollarSign, ArrowLeft, Zap, Sun, Triangle } from "lucide-react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import backgroundImage from "@assets/Whisk_dg2ndmxyzy_1751769905693.jpg";

interface TreatmentRecommendation {
  id: string;
  title: string;
  description: string;
  procedures: {
    name: string;
    grade: string;
    description: string;
  }[];
  targetAudience: string;
  estimatedCost: string;
  category: 'lifting' | 'texture' | 'pigmentation' | 'contouring';
  icon: React.ReactNode;
}

export default function Assessment() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showResults, setShowResults] = useState(false);
  const [recommendation, setRecommendation] = useState<TreatmentRecommendation | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const form = useForm<InsertQuotationRequest>({
    resolver: zodResolver(insertQuotationRequestSchema),
    defaultValues: {
      mainConcern: [],
      desiredResults: [],
      skinType: "",
      skinSensitivity: [],
      previousTreatments: "",
      treatmentDetails: "",
      sideEffects: "",
      sideEffectDetails: "",
      medicalHistory: [],
      medicationsList: "",
      coldSores: "",
      retinoids: "",
      retinoidsDate: "",
      allergies: "",
      allergyDetails: "",
      sunscreenUse: "",
      smoking: "",
      alcohol: "",
      waterIntake: "",
      exercise: "",
      preferredDowntime: "",
      effectDuration: "",
      budgetRange: "",
      treatmentIntensity: "",
      preferredDuration: "",
      additionalDetails: "",
      name: "",
      email: "",
      age: "",
      nationality: "",
    },
  });

  // Treatment recommendations - dynamic based on language
  const getTreatmentRecommendations = (): TreatmentRecommendation[] => [
    {
      id: 'lifting-wrinkle-elasticity',
      title: language === 'cn' ? '全面抗衰老及面部年轻化' : 'Complete Anti-Aging & Facial Rejuvenation',
      description: language === 'cn' ? '超声刀 + 肉毒素 + 玻尿酸填充 + 水光针' : 'Ultherapy + Botox + HA Filler + Skin Booster',
      procedures: [
        {
          name: language === 'cn' ? '超声刀' : 'Ultherapy',
          grade: 'A-Grade',
          description: language === 'cn' ? '真皮层及SMAS层提升（MFU-V超声）' : 'Dermal & SMAS layer lifting (MFU-V ultrasound)'
        },
        {
          name: language === 'cn' ? '肉毒素' : 'Botox',
          grade: 'S-Grade',
          description: language === 'cn' ? '额头及眼部皱纹去除' : 'Forehead & eye wrinkle removal'
        },
        {
          name: language === 'cn' ? '玻尿酸填充' : 'HA Filler',
          grade: 'A-Grade',
          description: language === 'cn' ? '法令纹及脸颊体积增强' : 'Nasolabial & cheek volume enhancement'
        },
        {
          name: language === 'cn' ? '水光针' : 'Skin Booster',
          grade: 'A-Grade',
          description: language === 'cn' ? '保湿及肌肤质地改善' : 'Moisture & skin texture improvement'
        },
        {
          name: language === 'cn' ? '童颜针（朱维兰/外泌体）' : 'Rejuran (Juvelook/Exosome)',
          grade: 'A-Grade',
          description: language === 'cn' ? '深层干燥、薄弱肌肤、整体再生' : 'Deep dryness, thin skin, overall regeneration'
        }
      ],
      targetAudience: language === 'cn' ? '中面部弹性流失、细纹+凹陷+干燥等复合问题' : 'Mid-face elasticity loss, fine lines + hollowness + dryness complex issues',
      estimatedCost: '$1,462',
      category: 'lifting',
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      id: 'pore-acne-texture',
      title: language === 'cn' ? '高级毛孔及疤痕治疗' : 'Advanced Pore & Scar Treatment',
      description: language === 'cn' ? '点阵激光 + 肌肤肉毒素 + 外泌体水光针 + 高压氧' : 'Fraxel + Skin Botox + Exosome Skin Booster + Hyperbaric Oxygen',
      procedures: [
        {
          name: language === 'cn' ? '点阵激光' : 'Fraxel',
          grade: 'B-Grade',
          description: language === 'cn' ? '疤痕及肌肤质地重塑' : 'Scar & skin texture remodeling'
        },
        {
          name: language === 'cn' ? '肌肤肉毒素' : 'Skin Botox',
          grade: 'S-Grade',
          description: language === 'cn' ? '细纹及毛孔缩小' : 'Fine wrinkles & pore reduction'
        },
        {
          name: language === 'cn' ? '外泌体' : 'Exosome',
          grade: 'A-Grade',
          description: language === 'cn' ? '促进再生，预防炎症后色素沉着' : 'Regeneration promotion, post-inflammatory pigmentation prevention'
        },
        {
          name: language === 'cn' ? '高压氧' : 'Hyperbaric Oxygen',
          grade: 'A-Grade',
          description: language === 'cn' ? '增强恢复能力' : 'Enhanced recovery capacity'
        }
      ],
      targetAudience: language === 'cn' ? '痘印、毛孔粗大、肌肤弹性流失' : 'Acne marks, enlarged pores, skin elasticity loss',
      estimatedCost: '$1,521',
      category: 'texture',
      icon: <Zap className="w-8 h-8" />
    },
    {
      id: 'skin-tone-pigmentation',
      title: language === 'cn' ? '美白及色素沉着矫正' : 'Brightening & Pigmentation Correction',
      description: language === 'cn' ? '激光调理 + 祛斑（IPL/皮秒） + LDM + 童颜针' : 'Laser Toning + Dark Spot Removal (IPL/Pico) + LDM + Rejuran',
      procedures: [
        {
          name: language === 'cn' ? '祛斑治疗' : 'Dark Spot Removal',
          grade: 'S-Grade',
          description: language === 'cn' ? 'IPL/皮秒调理黑色素分解' : 'IPL/Pico toning melanin breakdown'
        },
        {
          name: 'LDM',
          grade: 'A-Grade',
          description: language === 'cn' ? '炎症抑制，真皮层再生' : 'Inflammation suppression, dermal regeneration'
        },
        {
          name: language === 'cn' ? '童颜针 + 肌肤肉毒素' : 'Rejuran + Skin Botox',
          grade: 'A-Grade',
          description: language === 'cn' ? '核心肌肤再生，弹性改善' : 'Core skin regeneration, elasticity improvement'
        },
        {
          name: language === 'cn' ? '激光调理' : 'Laser Toning',
          grade: 'B-Grade',
          description: language === 'cn' ? '整体色素沉着去除' : 'Overall pigmentation removal'
        }
      ],
      targetAudience: language === 'cn' ? '色素沉着、暗沉肌肤、细纹' : 'Pigmentation, dull skin tone, fine wrinkles',
      estimatedCost: '$1,487',
      category: 'pigmentation',
      icon: <Sun className="w-8 h-8" />
    },
    {
      id: 'v-line-face-slimming',
      title: language === 'cn' ? 'V线雕塑及面部轮廓' : 'V-Line Sculpting & Facial Contouring',
      description: language === 'cn' ? '方脸肉毒素 + InMode FX + 胶原注射 + 下巴填充' : 'Square Jaw Botox + InMode FX + Collagen Injection + Chin Filler',
      procedures: [
        {
          name: language === 'cn' ? '方脸肉毒素' : 'Square Jaw Botox',
          grade: 'S-Grade',
          description: language === 'cn' ? '咬肌缩小' : 'Masseter muscle reduction'
        },
        {
          name: 'InMode FX',
          grade: 'B-Grade',
          description: language === 'cn' ? 'RF提升 + 脂肪分解' : 'RF lifting + fat breakdown'
        },
        {
          name: language === 'cn' ? '童颜针 + 肌肤肉毒素' : 'Rejuran + Skin Botox',
          grade: 'A-Grade',
          description: language === 'cn' ? '核心肌肤再生，弹性改善' : 'Core skin regeneration, elasticity improvement'
        },
        {
          name: language === 'cn' ? '下巴填充' : 'Chin Filler',
          grade: 'A-Grade',
          description: language === 'cn' ? '面部轮廓矫正' : 'Facial contour correction'
        }
      ],
      targetAudience: language === 'cn' ? '下颌线不清晰、侧脸脂肪、脸显大' : 'Unclear jawline, side cheek fat, face appears large',
      estimatedCost: '$1,538',
      category: 'contouring',
      icon: <Triangle className="w-8 h-8" />
    }
  ];

  // Smart recommendation algorithm
  const getRecommendation = (formData: InsertQuotationRequest): TreatmentRecommendation => {
    const scores = {
      lifting: 0,
      texture: 0,
      pigmentation: 0,
      contouring: 0
    };

    // Score based on main concerns
    formData.mainConcern?.forEach(concern => {
      switch (concern) {
        case 'wrinkles':
        case 'sagging':
        case 'dryness':
          scores.lifting += 3;
          break;
        case 'pores':
        case 'acne':
          scores.texture += 3;
          break;
        case 'pigmentation':
        case 'redness':
          scores.pigmentation += 3;
          break;
        case 'asymmetry':
          scores.contouring += 3;
          break;
        default:
          scores.lifting += 1;
      }
    });

    // Score based on desired results
    formData.desiredResults?.forEach(result => {
      switch (result) {
        case 'lifting':
        case 'anti-aging':
        case 'immediate-effect':
          scores.lifting += 2;
          break;
        case 'texture':
        case 'wrinkle-reduction':
          scores.texture += 2;
          break;
        case 'brightening':
          scores.pigmentation += 2;
          break;
        case 'contouring':
          scores.contouring += 2;
          break;
        case 'minimal-downtime':
          scores.texture += 1;
          scores.pigmentation += 1;
          break;
        default:
          scores.lifting += 1;
      }
    });

    // Score based on budget range
    const budgetScores = {
      '1000-2000': { lifting: 1, texture: 2, pigmentation: 2, contouring: 1 },
      '2000-5000': { lifting: 2, texture: 2, pigmentation: 2, contouring: 2 },
      '5000-10000': { lifting: 3, texture: 2, pigmentation: 2, contouring: 3 },
      'considering': { lifting: 2, texture: 2, pigmentation: 2, contouring: 2 }
    };

    if (formData.budgetRange && budgetScores[formData.budgetRange as keyof typeof budgetScores]) {
      const budgetScore = budgetScores[formData.budgetRange as keyof typeof budgetScores];
      Object.keys(budgetScore).forEach(key => {
        scores[key as keyof typeof scores] += budgetScore[key as keyof typeof budgetScore];
      });
    }

    // Find the category with highest score
    const maxScore = Math.max(...Object.values(scores));
    const recommendedCategory = Object.keys(scores).find(key => 
      scores[key as keyof typeof scores] === maxScore
    ) as keyof typeof scores;

    const recommendations = getTreatmentRecommendations();
    return recommendations.find(rec => rec.category === recommendedCategory) || recommendations[0];
  };

  const submitQuotation = useMutation({
    mutationFn: async (data: InsertQuotationRequest) => {
      const response = await apiRequest("/api/quotation-requests", "POST", data);
      return response;
    },
    onSuccess: (data, variables) => {
      // Generate recommendation category and show results
      const recommendedTreatment = getRecommendation(variables);
      setRecommendation(recommendedTreatment);
      setShowResults(true);
      
      // Map category to type number for Price Estimator
      const categoryToType = {
        'lifting': 1,
        'texture': 2, 
        'pigmentation': 3,
        'contouring': 4
      };
      
      const recommendedType = categoryToType[recommendedTreatment.category as keyof typeof categoryToType] || 1;
      
      // Store assessment result for Price Estimator
      const assessmentResult = {
        recommendedType,
        category: recommendedTreatment.category,
        title: recommendedTreatment.title,
        estimatedCost: recommendedTreatment.estimatedCost
      };
      localStorage.setItem('assessmentResult', JSON.stringify(assessmentResult));
      
      // Scroll to top when showing results
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      
      toast({
        title: language === 'cn' ? "추천생성성공" : "Recommendation Generated",
        description: language === 'cn' 
          ? "我们为您推荐了最适合的治疗方案" 
          : "We've recommended the most suitable treatment plan for you",
      });
    },
    onError: () => {
      toast({
        title: language === 'cn' ? "提交失败" : "Submission Failed",
        description: language === 'cn' 
          ? "请检查您的网络连接并重试" 
          : "Please check your connection and try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertQuotationRequest) => {
    // Validate required sections: 1, 2, 3, 5, 7, 9
    const requiredFields = [
      { field: 'mainConcern', section: 1, name: 'Main Concerns' },
      { field: 'desiredResults', section: 2, name: 'Desired Results' },
      { field: 'skinType', section: 3, name: 'Skin Type' },
      { field: 'medicalHistory', section: 5, name: 'Medical History' },
      { field: 'budgetRange', section: 7, name: 'Budget Range' },
      { field: 'name', section: 9, name: 'Name' },
      { field: 'email', section: 9, name: 'Email' }
    ];

    for (const { field, section, name } of requiredFields) {
      const value = data[field as keyof InsertQuotationRequest];
      const isEmpty = !value || (Array.isArray(value) && value.length === 0) || value === '';
      
      if (isEmpty) {
        // Scroll to the section
        const sectionElement = document.querySelector(`[data-section="${section}"]`);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add visual highlight
          sectionElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-50');
          setTimeout(() => {
            sectionElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-50');
          }, 3000);
        }
        
        toast({
          title: "Required Field Missing",
          description: `Please complete the "${name}" section before proceeding.`,
          variant: "destructive",
        });
        return;
      }
    }

    submitQuotation.mutate(data);
  };

  const resetForm = () => {
    setShowResults(false);
    setRecommendation(null);
    form.reset();
  };

  // Options for form fields
  const concernOptions = [
    { value: "wrinkles", label: t.quotation.concerns.wrinkles },
    { value: "sagging", label: t.quotation.concerns.sagging },
    { value: "pores", label: t.quotation.concerns.pores },
    { value: "acne", label: t.quotation.concerns.acne },
    { value: "pigmentation", label: t.quotation.concerns.pigmentation },
    { value: "redness", label: t.quotation.concerns.redness },
    { value: "dryness", label: t.quotation.concerns.dryness },
    { value: "asymmetry", label: t.quotation.concerns.asymmetry },
  ];

  const resultOptions = [
    { value: "lifting", label: t.quotation.results.lifting },
    { value: "brightening", label: t.quotation.results.brightening },
    { value: "texture", label: t.quotation.results.texture },
    { value: "wrinkle-reduction", label: t.quotation.results.wrinkleReduction },
    { value: "contouring", label: t.quotation.results.contouring },
    { value: "anti-aging", label: t.quotation.results.antiAging },
    { value: "immediate-effect", label: t.quotation.results.immediate },
    { value: "minimal-downtime", label: t.quotation.results.minimal },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <main className="pt-4" style={{ backgroundColor: '#f8f4ea' }}>
        {/* Results Page */}
        {showResults && recommendation ? (
          <section className="py-12 md:py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <div className="mb-8">
                  <h2 
                    className="text-3xl md:text-4xl font-normal mb-4"
                    style={{ 
                      fontFamily: 'mayo-display, Georgia, serif',
                      color: '#1f2937'
                    }}
                  >
                    {language === 'cn' ? "您的专属推荐方案" : "Your Personalized Recommendation"}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {language === 'cn' ? "基于您的需求，我们为您推荐以下治疗方案" : "Based on your needs, we recommend the following treatment plan"}
                  </p>
                </div>

                <Card className="shadow-2xl max-w-4xl mx-auto border-2 border-black rounded-3xl overflow-hidden animate-in fade-in duration-700" style={{ transform: 'scale(0.9)' }}>
                  <CardContent 
                    className="p-6 relative rounded-3xl"
                    style={{
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Enhanced overlay for better text readability */}
                    <div 
                      className="absolute inset-0 rounded-3xl"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0.75) 100%)',
                        backdropFilter: 'blur(0.7px)'
                      }}
                    ></div>
                    
                    {/* Content wrapper with relative positioning */}
                    <div className="relative z-10">
                      <div className="text-center mb-8">
                      <div className="flex justify-center mb-5 p-5 rounded-full w-20 h-20 mx-auto items-center" style={{ backgroundColor: '#009f94', color: 'white' }}>
                        {recommendation.icon}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#1f2937' }}>
                        {(() => {
                          const currentRec = getTreatmentRecommendations().find(rec => rec.category === recommendation.category);
                          return currentRec?.title || recommendation.title;
                        })()}
                      </h3>
                      <p className="text-gray-600 text-lg mb-3">
                        {(() => {
                          const currentRec = getTreatmentRecommendations().find(rec => rec.category === recommendation.category);
                          return currentRec?.description || recommendation.description;
                        })()}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-5 text-center" style={{ color: '#1f2937' }}>
                          {language === 'cn' ? "治疗程序" : "Treatment Procedures"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(() => {
                            const currentRec = getTreatmentRecommendations().find(rec => rec.category === recommendation.category);
                            const procedures = currentRec?.procedures || recommendation.procedures;
                            return procedures.map((procedure, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-base" style={{ color: '#1f2937' }}>
                                    {procedure.name}
                                  </h5>
                                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {procedure.grade}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                  {procedure.description}
                                </p>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      <div className="p-5 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="text-base font-semibold mb-2" style={{ color: '#1f2937' }}>
                          {language === 'cn' ? "推荐对象：" : "Recommended For:"}
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {(() => {
                            const currentRec = getTreatmentRecommendations().find(rec => rec.category === recommendation.category);
                            return currentRec?.targetAudience || recommendation.targetAudience;
                          })()}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-5">
                        <Button 
                          variant="outline"
                          className="flex-1 bg-transparent text-black border-black py-3 text-base font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                          style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                          onClick={() => {
                            setLocation('/process');
                            toast({
                              title: language === 'cn' ? "跳转到流程指南" : "Redirecting to Process Guide",
                              description: language === 'cn' ? "了解我们的综合治疗流程" : "Learn about our comprehensive treatment process",
                            });
                          }}
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          {language === 'cn' ? "预约咨询" : "Book Consultation"}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="flex-1 bg-transparent text-black border-black py-3 text-base font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                          style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                          onClick={() => {
                            setLocation('/price-estimator');
                            toast({
                              title: language === 'cn' ? "前往价格估算器" : "Going to Price Estimator",
                              description: language === 'cn' ? "获取您治疗的详细价格明细" : "Get a detailed price breakdown for your treatment",
                            });
                          }}
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          {language === 'cn' ? "价格估算" : "Price Estimator"}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowResults(false);
                            setRecommendation(null);
                            form.reset();
                          }}
                          className="flex-1 bg-transparent text-black border-black py-3 text-base font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                          style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {language === 'cn' ? "重新评估" : "Take Assessment Again"}
                        </Button>
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        ) : (
          <section className="pt-2 pb-8 md:pb-16 relative overflow-hidden min-h-screen" style={{ backgroundColor: '#f8f4ea' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Header with back button and title on same line - positioned at very top */}
              <div className="flex items-center justify-between mb-8 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/')}
                  className="bg-transparent text-black border-black hover:bg-gray-50 w-8 h-8 p-0 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center shrink-0"
                  style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
                
                <h1 className="flex-1 text-center" style={{ 
                  fontFamily: 'mayo-display, Georgia, serif', 
                  fontSize: 'clamp(24px, 4vw, 48px)', 
                  fontWeight: '400', 
                  color: '#1f2937', 
                  lineHeight: '1.2',
                  margin: '0'
                }}>
                  {t.assessment.title}
                </h1>
                
                {/* Empty div for spacing balance */}
                <div className="w-8 shrink-0"></div>
              </div>

              {/* Subtitle */}
              <div className="text-center mb-12">
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  {t.assessment.subtitle}
                </p>
              </div>

              {/* Form Container */}
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-xl border-2 border-black rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-8 md:p-12">
                      <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                        
                        {/* Main Concerns Section */}
                        <div className="space-y-6" data-section="1">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {language === 'cn' ? "您的主要关注点是什么？" : "What are your main concerns?"}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {language === 'cn' ? "选择您想要改善的问题（可多选）" : "Select the issues you'd like to address (multiple choice)"}
                            </p>
                          </div>
                          <FormField
                            control={form.control}
                            name="mainConcern"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {concernOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                      <Checkbox
                                        id={`concern-${option.value}`}
                                        checked={field.value?.includes(option.value) || false}
                                        onCheckedChange={(checked) => {
                                          const currentValues = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValues, option.value]);
                                          } else {
                                            field.onChange(currentValues.filter((value) => value !== option.value));
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`concern-${option.value}`}
                                        className="text-base font-medium leading-none cursor-pointer flex-1"
                                        onClick={() => {
                                          const currentValues = field.value || [];
                                          const checked = currentValues.includes(option.value);
                                          if (checked) {
                                            field.onChange(currentValues.filter((value) => value !== option.value));
                                          } else {
                                            field.onChange([...currentValues, option.value]);
                                          }
                                        }}
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Desired Results Section */}
                        <div className="space-y-6" data-section="2">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {language === 'cn' ? "您希望达到什么效果？" : "What results are you hoping to achieve?"}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {language === 'cn' ? "告诉我们您的期望目标" : "Tell us your desired outcomes"}
                            </p>
                          </div>
                          <FormField
                            control={form.control}
                            name="desiredResults"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {resultOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                      <Checkbox
                                        id={`result-${option.value}`}
                                        checked={field.value?.includes(option.value) || false}
                                        onCheckedChange={(checked) => {
                                          const currentValues = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValues, option.value]);
                                          } else {
                                            field.onChange(currentValues.filter((value) => value !== option.value));
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`result-${option.value}`}
                                        className="text-base font-medium leading-none cursor-pointer flex-1"
                                        onClick={() => {
                                          const currentValues = field.value || [];
                                          const checked = currentValues.includes(option.value);
                                          if (checked) {
                                            field.onChange(currentValues.filter((value) => value !== option.value));
                                          } else {
                                            field.onChange([...currentValues, option.value]);
                                          }
                                        }}
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Skin Type & Sensitivity */}
                        <div className="space-y-6" data-section="3">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {language === 'cn' ? "肌肤类型和敏感性" : "Skin Type & Sensitivity"}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {language === 'cn' ? "了解您的肌肤类型有助于我们推荐最合适的治疗方案" : "Understanding your skin type helps us recommend the most suitable treatments"}
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-center mb-4" style={{ color: '#1f2937' }}>
                                {language === 'cn' ? "您的肌肤类型是什么？" : "What is your skin type?"}
                              </h4>
                              <FormField
                                control={form.control}
                                name="skinType"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="grid grid-cols-1 gap-3">
                                      {[
                                        { value: "dry", label: t.quotation.skinTypes.dry },
                                        { value: "oily", label: t.quotation.skinTypes.oily },
                                        { value: "combination", label: t.quotation.skinTypes.combination },
                                        { value: "sensitive", label: t.quotation.skinTypes.sensitive },
                                        { value: "normal", label: t.quotation.skinTypes.normal }
                                      ].map((option) => (
                                        <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                             onClick={() => field.onChange(option.value)}>
                                          <Checkbox
                                            id={`skin-${option.value}`}
                                            checked={field.value === option.value}
                                            onCheckedChange={() => field.onChange(option.value)}
                                          />
                                          <label
                                            htmlFor={`skin-${option.value}`}
                                            className="text-base font-medium leading-none cursor-pointer flex-1"
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-center mb-4" style={{ color: '#1f2937' }}>
                                {t.quotation.skinSensitivity.question}
                              </h4>
                              <FormField
                                control={form.control}
                                name="skinSensitivity"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="grid grid-cols-1 gap-3">
                                      {[
                                        { value: "redness", label: t.quotation.skinSensitivity.redness },
                                        { value: "itching", label: t.quotation.skinSensitivity.itching },
                                        { value: "allergic", label: t.quotation.skinSensitivity.allergic },
                                        { value: "pigmentation", label: t.quotation.skinSensitivity.pigmentation },
                                        { value: "none", label: t.quotation.skinSensitivity.none }
                                      ].map((option) => (
                                        <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                          <Checkbox
                                            id={`sensitivity-${option.value}`}
                                            checked={field.value?.includes(option.value) || false}
                                            onCheckedChange={(checked) => {
                                               const currentValues = field.value || [];
                                               if (checked) {
                                                 field.onChange([...currentValues, option.value]);
                                               } else {
                                                 field.onChange(currentValues.filter((value) => value !== option.value));
                                               }
                                             }}
                                          />
                                          <label
                                            htmlFor={`sensitivity-${option.value}`}
                                            className="text-base font-medium leading-none cursor-pointer flex-1"
                                            onClick={() => {
                                              const currentValues = field.value || [];
                                              const checked = currentValues.includes(option.value);
                                              if (checked) {
                                                field.onChange(currentValues.filter((value) => value !== option.value));
                                              } else {
                                                field.onChange([...currentValues, option.value]);
                                              }
                                            }}
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Previous Treatments */}
                        <div className="space-y-6">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">4</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {t.quotation.previousTreatments.title}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {t.quotation.previousTreatments.description}
                            </p>
                          </div>

                          <div className="space-y-8">
                            <div>
                              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                {language === 'cn' ? "您在过去一年中是否接受过任何美容或皮肤治疗？" : "Have you received any cosmetic or skin treatments in the past year?"}
                              </h4>
                              <FormField
                                control={form.control}
                                name="previousTreatments"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                      {[
                                        { value: "yes", label: language === 'cn' ? "是" : "Yes" },
                                        { value: "no", label: language === 'cn' ? "否" : "No" }
                                      ].map((option) => (
                                        <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                          <Checkbox
                                            id={`treatment-${option.value}`}
                                            checked={field.value === option.value}
                                            onCheckedChange={() => field.onChange(option.value)}
                                          />
                                          <label
                                            htmlFor={`treatment-${option.value}`}
                                            className="text-base font-medium leading-none cursor-pointer flex-1"
                                            onClick={() => field.onChange(option.value)}
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="treatmentDetails"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        placeholder={language === 'cn' ? "类型和日期：" : "Type & Date:"}
                                        {...field}
                                        value={field.value || ""}
                                        className="text-base p-4 rounded-xl border-gray-200"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                {language === 'cn' ? "您是否有任何副作用？" : "Did you experience any side effects?"}
                              </h4>
                              <FormField
                                control={form.control}
                                name="sideEffects"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                      {[
                                        { value: "yes", label: language === 'cn' ? "是" : "Yes" },
                                        { value: "no", label: language === 'cn' ? "否" : "No" }
                                      ].map((option) => (
                                        <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                          <Checkbox
                                            id={`side-${option.value}`}
                                            checked={field.value === option.value}
                                            onCheckedChange={() => field.onChange(option.value)}
                                          />
                                          <label
                                            htmlFor={`side-${option.value}`}
                                            className="text-base font-medium leading-none cursor-pointer flex-1"
                                            onClick={() => field.onChange(option.value)}
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {form.watch("sideEffects") === "yes" && (
                                <FormField
                                  control={form.control}
                                  name="sideEffectDetails"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input 
                                          placeholder={language === 'cn' ? "请详细说明副作用..." : "Please describe the side effects in detail..."}
                                          {...field}
                                          value={field.value || ""}
                                          className="text-base p-4 rounded-xl border-gray-200 mt-4"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Medical History */}
                        <div className="space-y-6" data-section="5">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">5</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {language === 'cn' ? "医疗史" : "Medical History"}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {language === 'cn' ? "请提供您的医疗背景信息以制定安全的治疗计划" : "Please provide your medical background for safe treatment planning"}
                            </p>
                          </div>

                          <div className="space-y-8">
                            <div>
                              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                {language === 'cn' ? "请勾选所有适用的项目：" : "Please check all that apply:"}
                              </h4>
                              <FormField
                                control={form.control}
                                name="medicalHistory"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      {[
                                        { value: "pregnant", label: language === 'cn' ? "怀孕/哺乳期" : "Pregnant / Breastfeeding" },
                                        { value: "hypertension", label: language === 'cn' ? "高血压/糖尿病" : "Hypertension / Diabetes" },
                                        { value: "autoimmune", label: language === 'cn' ? "自身免疫性疾病" : "Autoimmune disorders" },
                                        { value: "keloid", label: language === 'cn' ? "疤痕体质" : "Keloid tendency" },
                                        { value: "bleeding", label: language === 'cn' ? "出血性疾病" : "Bleeding disorder" },
                                        { value: "skin-disease", label: language === 'cn' ? "皮肤疾病（如湿疹、牛皮癣）" : "Skin disease (e.g., eczema, psoriasis)" },
                                        { value: "severe-acne", label: language === 'cn' ? "严重痤疮" : "Severe acne" },
                                        { value: "dermatologist", label: language === 'cn' ? "正在接受皮肤科医生治疗" : "Under dermatologist care" },
                                        { value: "medications", label: language === 'cn' ? "目前正在服用药物" : "Currently taking medications" },
                                        { value: "none", label: language === 'cn' ? "无" : "None" }
                                      ].map((option) => (
                                        <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                          <Checkbox
                                            id={`medical-${option.value}`}
                                            checked={field.value?.includes(option.value) || false}
                                            onCheckedChange={(checked) => {
                                              const currentValues = field.value || [];
                                              if (checked) {
                                                field.onChange([...currentValues, option.value]);
                                              } else {
                                                field.onChange(currentValues.filter((value) => value !== option.value));
                                              }
                                            }}
                                          />
                                          <label
                                            htmlFor={`medical-${option.value}`}
                                            className="text-base font-medium leading-none cursor-pointer flex-1"
                                            onClick={() => {
                                              const currentValues = field.value || [];
                                              const checked = currentValues.includes(option.value);
                                              if (checked) {
                                                field.onChange(currentValues.filter((value) => value !== option.value));
                                              } else {
                                                field.onChange([...currentValues, option.value]);
                                              }
                                            }}
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="medicationsList"
                                render={({ field }) => (
                                  <FormItem className="mt-4">
                                    <FormControl>
                                      <Input 
                                        placeholder={language === 'cn' ? "列出药物：" : "List medications:"}
                                        {...field}
                                        value={field.value || ""}
                                        className="text-base p-4 rounded-xl border-gray-200"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                  {t.quotation.medicalHistory.coldSores}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name="coldSores"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "yes", label: t.quotation.medicalHistory.yes },
                                          { value: "no", label: t.quotation.medicalHistory.no }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`cold-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`cold-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                  {t.quotation.medicalHistory.retinoids}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name="retinoids"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3 mb-4">
                                        {[
                                          { value: "yes", label: t.quotation.medicalHistory.yes },
                                          { value: "no", label: t.quotation.medicalHistory.no }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`retinoid-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`retinoid-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="retinoidsDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input 
                                          placeholder={t.quotation.medicalHistory.lastUsed}
                                          {...field}
                                          value={field.value || ""}
                                          className="text-base p-4 rounded-xl border-gray-200"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                {t.quotation.medicalHistory.allergies}
                              </h4>
                              <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                      {[
                                        { value: "yes", label: language === 'cn' ? "是" : "Yes" },
                                        { value: "no", label: language === 'cn' ? "否" : "No" }
                                      ].map((option) => (
                                        <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                          <Checkbox
                                            id={`allergy-${option.value}`}
                                            checked={field.value === option.value}
                                            onCheckedChange={() => field.onChange(option.value)}
                                          />
                                          <label
                                            htmlFor={`allergy-${option.value}`}
                                            className="text-base font-medium leading-none cursor-pointer flex-1"
                                            onClick={() => field.onChange(option.value)}
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {form.watch("allergies") === "yes" && (
                                <FormField
                                  control={form.control}
                                  name="allergyDetails"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input 
                                          placeholder={language === 'cn' ? "请详细说明过敏情况..." : "Please describe your allergies in detail..."}
                                          {...field}
                                          value={field.value || ""}
                                          className="text-base p-4 rounded-xl border-gray-200 mt-4"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Lifestyle Habits */}
                        <div className="space-y-6">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">6</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {language === 'cn' ? "生活习惯" : "Lifestyle Habits"}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {language === 'cn' ? "您的生活方式会影响治疗效果和恢复过程" : "Your lifestyle affects treatment outcomes and recovery"}
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                  {language === 'cn' ? "防晒霜使用情况：" : "Sunscreen use:"}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name="sunscreenUse"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "always", label: language === 'cn' ? "总是" : "Always" },
                                          { value: "sometimes", label: language === 'cn' ? "有时" : "Sometimes" },
                                          { value: "rarely", label: language === 'cn' ? "很少" : "Rarely" }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`sunscreen-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`sunscreen-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                  {language === 'cn' ? "吸烟：" : "Smoking:"}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name="smoking"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "yes", label: language === 'cn' ? "是" : "Yes" },
                                          { value: "no", label: language === 'cn' ? "否" : "No" }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`smoking-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`smoking-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                  {language === 'cn' ? "每日饮水量：" : "Water intake per day:"}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name="waterIntake"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "under1l", label: language === 'cn' ? "低于1升" : "Under 1L" },
                                          { value: "over1l", label: language === 'cn' ? "超过1升" : "Over 1L" }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`water-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`water-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>{t.quotation.lifestyle.alcohol}</h4>
                                <FormField
                                  control={form.control}
                                  name="alcohol"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "frequently", label: t.quotation.lifestyle.frequently },
                                          { value: "occasionally", label: t.quotation.lifestyle.occasionally },
                                          { value: "never", label: t.quotation.lifestyle.never }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`alcohol-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`alcohol-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>{t.quotation.lifestyle.exercise}</h4>
                                <FormField
                                  control={form.control}
                                  name="exercise"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "none", label: t.quotation.lifestyle.none },
                                          { value: "1-2", label: t.quotation.lifestyle.oneToTwo },
                                          { value: "3+", label: t.quotation.lifestyle.threePlus }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`exercise-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`exercise-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Budget & Preferences */}
                        <div className="space-y-6" data-section="7">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">7</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {t.quotation.budget.title}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {t.quotation.budget.description}
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                  {language === 'cn' ? "期望恢复期：" : "Preferred downtime:"}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name="preferredDowntime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "0-1", label: language === 'cn' ? "0-1天" : "0–1 day" },
                                          { value: "2-3", label: language === 'cn' ? "2-3天" : "2–3 days" },
                                          { value: "1week+", label: language === 'cn' ? "1周或更长" : "1 week or more" }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`downtime-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`downtime-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                  {language === 'cn' ? "效果持续时间：" : "Duration of effect:"}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name="effectDuration"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "short", label: language === 'cn' ? "短期 (1-3个月)" : "Short-term (1–3 months)" },
                                          { value: "mid", label: language === 'cn' ? "中期 (3-6个月)" : "Mid-term (3–6 months)" },
                                          { value: "long", label: language === 'cn' ? "长期 (6个月以上)" : "Long-term (6+ months)" }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`duration-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`duration-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
                                  {language === 'cn' ? "每次治疗预算：" : "Budget per session:"}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name="budgetRange"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-1 gap-3">
                                        {[
                                          { value: "1000-2000", label: language === 'cn' ? "$1,000 ~ $2,000" : "$1,000 ~ $2,000" },
                                          { value: "2000-5000", label: language === 'cn' ? "$2,000 ~ $5,000" : "$2,000 ~ $5,000" },
                                          { value: "5000-10000", label: language === 'cn' ? "$5,000 ~ $10,000" : "$5,000 ~ $10,000" },
                                          { value: "considering", label: language === 'cn' ? "考虑中" : "Considering" }
                                        ].map((option) => (
                                          <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Checkbox
                                              id={`budget-${option.value}`}
                                              checked={field.value === option.value}
                                              onCheckedChange={() => field.onChange(option.value)}
                                            />
                                            <label
                                              htmlFor={`budget-${option.value}`}
                                              className="text-base font-medium leading-none cursor-pointer flex-1"
                                              onClick={() => field.onChange(option.value)}
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Treatment Intensity */}
                        <div className="space-y-6">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">8</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {language === 'cn' ? "治疗强度" : "Treatment Intensity"}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {language === 'cn' ? "选择您偏好的治疗方式" : "Choose your preferred treatment approach"}
                            </p>
                          </div>

                          <FormField
                            control={form.control}
                            name="treatmentIntensity"
                            render={({ field }) => (
                              <FormItem>
                                <div className="grid grid-cols-1 gap-4">
                                  {[
                                    { value: "high-intensity", label: language === 'cn' ? "高强度治疗 (超声刀、点阵激光等)" : "High-intensity (Ultherapy, Fraxel, etc.)" },
                                    { value: "gentle", label: language === 'cn' ? "温和多次治疗 (水光针、调理等)" : "Gentle, multi-session (Skin booster, toning, etc.)" },
                                    { value: "consultation", label: language === 'cn' ? "咨询后决定" : "Decide after consultation" }
                                  ].map((option) => (
                                    <div key={option.value} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                      <Checkbox
                                        id={`intensity-${option.value}`}
                                        checked={field.value === option.value}
                                        onCheckedChange={() => field.onChange(option.value)}
                                      />
                                      <label
                                        htmlFor={`intensity-${option.value}`}
                                        className="text-base font-medium leading-none cursor-pointer flex-1"
                                        onClick={() => field.onChange(option.value)}
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6" data-section="9">
                          <div className="text-center pb-6 border-b border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6" style={{ backgroundColor: '#009f94' }}>
                              <span className="text-xl font-bold text-white">9</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif', color: '#1f2937' }}>
                              {language === 'cn' ? "联系信息" : "Contact Information"}
                            </h3>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                              {language === 'cn' ? "我们需要您的联系方式以便为您安排咨询" : "We need your contact details to arrange a consultation for you"}
                            </p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-medium">
                                    {language === 'cn' ? "姓名" : "Full Name"}
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder={language === 'cn' ? "请输入您的姓名" : "Enter your full name"} 
                                      {...field} 
                                      className="p-4 text-base rounded-xl border-gray-200" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-medium">
                                    {language === 'cn' ? "电子邮箱" : "Email Address"}
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="email" 
                                      placeholder={language === 'cn' ? "请输入您的邮箱地址" : "Enter your email address"} 
                                      {...field} 
                                      className="p-4 text-base rounded-xl border-gray-200" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="age"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-medium">
                                    {language === 'cn' ? "年龄" : "Age"}
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="text" 
                                      placeholder={language === 'cn' ? "请输入您的年龄" : "Enter your age"} 
                                      {...field} 
                                      value={field.value || ""}
                                      className="p-4 text-base rounded-xl border-gray-200" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="nationality"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-medium">
                                    {language === 'cn' ? "国籍" : "Nationality"}
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="text" 
                                      placeholder={language === 'cn' ? "请输入您的国籍" : "Enter your nationality"} 
                                      {...field} 
                                      value={field.value || ""}
                                      className="p-4 text-base rounded-xl border-gray-200" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center pt-8">
                          <Button 
                            type="submit" 
                            variant="outline"
                            className="bg-transparent text-black border-black py-3 text-lg font-semibold rounded-full hover:bg-gray-50"
                            style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                            disabled={submitQuotation.isPending}
                          >
                            {submitQuotation.isPending ? (
                              <>
                                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                {language === 'cn' ? '生成中...' : 'Generating...'}
                              </>
                            ) : (
                              <>
                                <Calculator className="mr-2 h-5 w-5" />
                                {language === 'cn' ? '获取推荐方案' : 'Recommendation'}
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                      </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}