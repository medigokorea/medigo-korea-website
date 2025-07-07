import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { type QuotationRequest, type ContactRequest } from "@shared/schema";
import { Calendar, User, Mail, Phone, DollarSign, Clock, MessageSquare, Bell, Check, Download, Edit, Save, X, Calculator, Search, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

// Treatment interface for admin management
interface Treatment {
  id: string;
  name: string;
  nameKr: string;
  description: string;
  basePrice: number;
  commission: number;
  finalPrice: number;
  category: string;
}

// Skin Treatment for the estimator
interface SkinTreatment {
  id: string;
  name: string;
  nameKr: string;
  description: string;
  price: number;
  category: string;
  grade: string;
}

// Skin Treatment Estimator Component
function SkinTreatmentEstimator({ treatments }: { treatments: Treatment[] }) {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Convert treatment prices to skin treatment format, using final prices from Treatment Prices
  const allSkinTreatments: SkinTreatment[] = treatments.map(treatment => ({
    id: treatment.id,
    name: treatment.name,
    nameKr: treatment.nameKr,
    description: treatment.description,
    price: treatment.finalPrice, // Use final price from Treatment Prices
    category: treatment.category,
    grade: getGradeFromPrice(treatment.finalPrice) // Determine grade based on price
  }));

  // Function to determine grade based on price ranges
  function getGradeFromPrice(price: number): string {
    if (price >= 1000000) return 'S'; // Premium treatments 1M+ KRW
    if (price >= 500000) return 'A';  // High-end treatments 500K-1M KRW
    if (price >= 200000) return 'B';  // Mid-range treatments 200K-500K KRW
    return 'C';                       // Basic treatments under 200K KRW
  }

  const filteredTreatments = allSkinTreatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.nameKr.includes(searchTerm) ||
    treatment.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTreatmentToggle = (treatmentId: string) => {
    setSelectedTreatments(prev =>
      prev.includes(treatmentId)
        ? prev.filter(id => id !== treatmentId)
        : [...prev, treatmentId]
    );
  };

  const selectedTreatmentDetails = allSkinTreatments.filter(treatment =>
    selectedTreatments.includes(treatment.id)
  );

  const totalPrice = selectedTreatmentDetails.reduce((sum, treatment) => sum + treatment.price, 0);
  const totalUSD = Math.round(totalPrice / 1300);

  const clearAll = () => {
    setSelectedTreatments([]);
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'S': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'A': return 'bg-green-100 text-green-800 border-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search treatments by name, Korean name, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm border-2 rounded-lg px-4 py-2 focus:outline-none transition-all duration-300"
            style={{ 
              fontFamily: 'mayo-sans, Times New Roman, sans-serif',
              borderColor: 'hsl(220, 26%, 14%)',
              color: 'hsl(220, 26%, 14%)'
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={clearAll}
            variant="outline"
            className="bg-transparent border-2 px-4 py-2 rounded-full transform hover:scale-105 transition-all duration-300"
            style={{ 
              fontFamily: 'mayo-sans, Times New Roman, sans-serif',
              borderColor: 'hsl(220, 26%, 14%)',
              color: 'hsl(220, 26%, 14%)'
            }}
            size="sm"
            disabled={selectedTreatments.length === 0}
          >
            Clear All
          </Button>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            {selectedTreatments.length} selected
          </Badge>
        </div>
      </div>

      {/* Treatment Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Treatments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Available Treatments ({filteredTreatments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {filteredTreatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedTreatments.includes(treatment.id)
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedTreatments.includes(treatment.id)}
                        onCheckedChange={() => handleTreatmentToggle(treatment.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {treatment.name}
                          </h4>
                          <Badge variant="outline" className={`text-xs ${getGradeBadgeColor(treatment.grade)}`}>
                            {treatment.grade}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{treatment.nameKr}</p>
                        <p className="text-xs text-gray-500 mb-2">{treatment.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {treatment.category}
                          </Badge>
                          <span className="text-sm font-semibold text-teal-600">
                            ₩{treatment.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Selected Treatments & Total */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Selected Treatments ({selectedTreatmentDetails.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedTreatmentDetails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No treatments selected</p>
                  <p className="text-sm">Select treatments from the left to see pricing</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-2">
                      {selectedTreatmentDetails.map((treatment) => (
                        <div key={treatment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {treatment.name}
                              </span>
                              <Badge variant="outline" className={`text-xs ${getGradeBadgeColor(treatment.grade)}`}>
                                {treatment.grade}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{treatment.nameKr}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-teal-600">
                              ₩{treatment.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="border-t pt-4">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-lg border border-teal-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-teal-800">Total Estimate:</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-teal-600">
                            ₩{totalPrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-teal-700">
                            (${totalUSD.toLocaleString()} USD)
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-teal-700">
                        Based on {selectedTreatmentDetails.length} selected treatment{selectedTreatmentDetails.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [selectedAssessment, setSelectedAssessment] = useState<QuotationRequest | null>(null);
  const [editingTreatment, setEditingTreatment] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [treatments, setTreatments] = useState<Treatment[]>([
    // Laser Treatments
    { id: "pdt", name: "PDT 13% 1 Session", nameKr: "PDT 13% 1회", description: "Photodynamic therapy for acne and skin renewal", basePrice: 150000, commission: 20, finalPrice: 180000, category: "Laser Treatment" },
    { id: "gold-ptt", name: "Gold PTT 1 Session", nameKr: "골드PTT 1회", description: "Gold nanoparticle photothermal therapy", basePrice: 350000, commission: 20, finalPrice: 420000, category: "Laser Treatment" },
    { id: "fraxel-full", name: "Fraxel Full Face 1 Session", nameKr: "프락셀 Full face 1회", description: "Fractional laser for full face treatment", basePrice: 500000, commission: 20, finalPrice: 600000, category: "Laser Treatment" },
    { id: "fraxel-full-pdrn", name: "Fraxel Full Face 1 Session + PDRN", nameKr: "프락셀 Full face 1회 + PDRN", description: "Fraxel with regenerative PDRN therapy", basePrice: 600000, commission: 20, finalPrice: 720000, category: "Laser Treatment" },
    { id: "fraxel-butterfly", name: "Fraxel Butterfly Zone", nameKr: "프락셀 나비존", description: "Fraxel laser treatment for cheek area", basePrice: 300000, commission: 20, finalPrice: 360000, category: "Laser Treatment" },
    { id: "fraxel-butterfly-pdrn", name: "Fraxel Butterfly Zone + PDRN", nameKr: "프락셀 나비존 + PDRN", description: "Fraxel butterfly zone with regenerative therapy", basePrice: 400000, commission: 20, finalPrice: 480000, category: "Laser Treatment" },
    { id: "triple-toning", name: "Triple Toning 1 Session", nameKr: "트리플 토닝 1회", description: "Advanced pigmentation treatment", basePrice: 250000, commission: 20, finalPrice: 300000, category: "Laser Treatment" },
    { id: "triple-toning-10", name: "Triple Toning 10 Sessions", nameKr: "트리플 토닝 10회", description: "Complete pigmentation treatment package", basePrice: 2000000, commission: 20, finalPrice: 2400000, category: "Laser Treatment" },
    
    // Botox Treatments
    { id: "domestic-wrinkle-botox", name: "Domestic Wrinkle Botox", nameKr: "국산 주름 보톡스", description: "Korean-made botox for wrinkles", basePrice: 50000, commission: 20, finalPrice: 60000, category: "Botox" },
    { id: "imported-wrinkle-botox", name: "Imported (German) Wrinkle Botox", nameKr: "수입(독일) 주름 보톡스", description: "Premium German botox for wrinkles", basePrice: 100000, commission: 20, finalPrice: 120000, category: "Botox" },
    { id: "domestic-jaw-botox", name: "Domestic Jaw Botox", nameKr: "국산 턱 보톡스", description: "Korean-made botox for masseter slimming", basePrice: 70000, commission: 20, finalPrice: 84000, category: "Botox" },
    { id: "imported-jaw-botox", name: "Imported (German) Jaw Botox", nameKr: "수입(독일) 턱 보톡스", description: "Premium German botox for jaw slimming", basePrice: 140000, commission: 20, finalPrice: 168000, category: "Botox" },
    { id: "skin-botox-full", name: "Skin Botox Full Face", nameKr: "스킨보톡스 (Full face)", description: "Micro-botox for skin texture improvement", basePrice: 190000, commission: 20, finalPrice: 228000, category: "Botox" },
    { id: "skin-botox-eyes", name: "Skin Botox Eye Area", nameKr: "스킨보톡스 (눈가)", description: "Micro-botox for eye area fine lines", basePrice: 70000, commission: 20, finalPrice: 84000, category: "Botox" },
    { id: "skin-botox-aqua", name: "Skin Botox + Aqua Injection", nameKr: "스킨보톡스 + 물광주사", description: "Combined micro-botox and hydration therapy", basePrice: 290000, commission: 20, finalPrice: 348000, category: "Botox" },
    
    // Filler Treatments
    { id: "domestic-filler", name: "Domestic Filler 1cc", nameKr: "국산 필러 1cc", description: "Korean-made hyaluronic acid filler", basePrice: 200000, commission: 20, finalPrice: 240000, category: "Filler" },
    { id: "imported-filler", name: "Imported Filler 1cc", nameKr: "수입 필러 1cc", description: "Premium imported hyaluronic acid filler", basePrice: 400000, commission: 20, finalPrice: 480000, category: "Filler" },
    
    // Regenerative Treatments
    { id: "rejuran-1cc", name: "Rejuran/Juvelook/Exosome 1cc", nameKr: "리쥬란/쥬베룩/엑소제 1cc", description: "Regenerative skin healing treatment", basePrice: 150000, commission: 20, finalPrice: 180000, category: "Regenerative" },
    { id: "rejuran-4cc", name: "Rejuran/Juvelook/Exosome 4cc", nameKr: "리쥬란/쥬베룩/엑소제 4cc", description: "Intensive regenerative treatment", basePrice: 500000, commission: 20, finalPrice: 600000, category: "Regenerative" },
    { id: "rejuran-sleep-4cc", name: "Rejuran Sleep 4cc+", nameKr: "(수면)리쥬란 4cc 이상", description: "Sleep anesthesia rejuran treatment", basePrice: 650000, commission: 20, finalPrice: 780000, category: "Regenerative" },
    { id: "rejuran-combo", name: "Rejuran + Aqua + Skin Botox", nameKr: "리쥬란+물광+스킨보톡스", description: "Complete regenerative combo treatment", basePrice: 550000, commission: 20, finalPrice: 660000, category: "Regenerative" },
    { id: "exosome-combo", name: "Exosome + Aqua + Skin Botox", nameKr: "엑소좀+물광+스킨보톡스", description: "Advanced exosome combination therapy", basePrice: 550000, commission: 20, finalPrice: 660000, category: "Regenerative" },
    
    // HIFU/RF Treatments
    { id: "oligio-300", name: "Oligio 300 Shots", nameKr: "올리지오 300shot", description: "RF microneedling for skin tightening", basePrice: 600000, commission: 20, finalPrice: 720000, category: "HIFU/RF" },
    { id: "oligio-600", name: "Oligio 600 Shots", nameKr: "올리지오 600shot", description: "Intensive RF microneedling treatment", basePrice: 1100000, commission: 20, finalPrice: 1320000, category: "HIFU/RF" },
    { id: "eye-oligio", name: "Eye Oligio 100 Shots", nameKr: "아이 올리지오 100shot", description: "RF treatment for eye area", basePrice: 200000, commission: 20, finalPrice: 240000, category: "HIFU/RF" },
    { id: "ulthera-100", name: "Ulthera/Thermage 100 Shots", nameKr: "울쎄라/써마지 100shot", description: "HIFU lifting treatment", basePrice: 450000, commission: 20, finalPrice: 540000, category: "HIFU/RF" },
    { id: "ulthera-300", name: "Ulthera/Thermage 300 Shots", nameKr: "울쎄라/써마지 300shot", description: "Comprehensive HIFU lifting treatment", basePrice: 1300000, commission: 20, finalPrice: 1560000, category: "HIFU/RF" },
    { id: "linear-firm-100", name: "Linear Firm 100 Shots", nameKr: "리니어펌 100shot", description: "Linear HIFU body contouring", basePrice: 250000, commission: 20, finalPrice: 300000, category: "HIFU/RF" },
    { id: "linear-firm-300", name: "Linear Firm 300 Shots", nameKr: "리니어펌 300shot", description: "Intensive linear HIFU treatment", basePrice: 750000, commission: 20, finalPrice: 900000, category: "HIFU/RF" },
    { id: "linear-firm-400", name: "Linear Firm 400 Shots", nameKr: "리니어펌 400shot", description: "Maximum linear HIFU treatment", basePrice: 900000, commission: 20, finalPrice: 1080000, category: "HIFU/RF" },
    { id: "rf-lifting", name: "RF Lifting", nameKr: "고주파 리프팅", description: "Radiofrequency skin tightening", basePrice: 200000, commission: 20, finalPrice: 240000, category: "HIFU/RF" },
    
    // Advanced Treatments
    { id: "accento-regen", name: "Accento 1 Session + Regenerative", nameKr: "악센토 1회+재생 1회", description: "Advanced body contouring with regenerative therapy", basePrice: 500000, commission: 20, finalPrice: 600000, category: "Advanced Treatment" },
    { id: "inmode-1", name: "InMode 1 (One Area)", nameKr: "인모드1 (한부위)", description: "Fractional RF treatment for one area", basePrice: 200000, commission: 20, finalPrice: 240000, category: "Advanced Treatment" },
    { id: "inmode-1-2", name: "InMode 1,2 (One Area)", nameKr: "인모드1,2 (한부위)", description: "Combined InMode treatment for one area", basePrice: 300000, commission: 20, finalPrice: 360000, category: "Advanced Treatment" },
    { id: "mts", name: "MTS (Microneedling)", nameKr: "MTS", description: "Microneedling therapy system", basePrice: 250000, commission: 20, finalPrice: 300000, category: "Advanced Treatment" },
    { id: "ldm-lifting", name: "LDM Water Drop Lifting", nameKr: "LDM 물방울 리프팅", description: "Ultrasonic deep cleansing and lifting", basePrice: 300000, commission: 20, finalPrice: 360000, category: "Advanced Treatment" },
    { id: "aqua-peel", name: "Aqua Peel 1 Session", nameKr: "아쿠아필 1회", description: "Hydro-dermabrasion treatment", basePrice: 250000, commission: 20, finalPrice: 300000, category: "Advanced Treatment" },
    { id: "ion-enzyme", name: "Ion Enzyme Care", nameKr: "이온자임 관리", description: "Ion enzyme facial treatment", basePrice: 200000, commission: 20, finalPrice: 240000, category: "Advanced Treatment" },
    { id: "collagen-egg", name: "Collagen Egg (Doctor)", nameKr: "코레지 에그(원장님)", description: "Premium collagen treatment by doctor", basePrice: 400000, commission: 20, finalPrice: 480000, category: "Advanced Treatment" },
    { id: "collagen-jar-glove", name: "Collagen Jar + Glove", nameKr: "코레지 도자+글러브", description: "Collagen jar and glove treatment", basePrice: 400000, commission: 20, finalPrice: 480000, category: "Advanced Treatment" }
  ]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check authentication status
  const authQuery = useQuery({
    queryKey: ["/api/admin/status"],
    queryFn: getQueryFn<{ isAuthenticated: boolean }>({ on401: "returnNull" }),
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authQuery.data !== undefined) {
      setIsAuthChecked(true);
      if (!authQuery.data?.isAuthenticated) {
        setLocation("/admin/login");
      }
    }
  }, [authQuery.data, setLocation]);

  const assessmentsQuery = useQuery({
    queryKey: ["/api/quotation-requests"],
    queryFn: getQueryFn<QuotationRequest[]>({ on401: "throw" }),
    enabled: isAuthChecked && authQuery.data?.isAuthenticated,
  });

  const contactsQuery = useQuery({
    queryKey: ["/api/contact-requests"],
    queryFn: getQueryFn<ContactRequest[]>({ on401: "throw" }),
    enabled: isAuthChecked && authQuery.data?.isAuthenticated,
  });

  // Filter assessments based on search
  const filteredAssessments = assessmentsQuery.data?.filter(assessment => 
    assessment.name.toLowerCase().includes(searchName.toLowerCase()) ||
    assessment.email.toLowerCase().includes(searchName.toLowerCase())
  ) || [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/contact-requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-requests"] });
      toast({
        title: "상태 업데이트",
        description: "연락처 요청 상태가 성공적으로 업데이트되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "상태 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmContact = (id: number) => {
    updateStatusMutation.mutate({ id, status: "sent" });
  };

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "Successfully logged out of admin panel",
      });
      setLocation("/admin/login");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Treatment management functions
  const updateTreatmentPrice = (id: string, newBasePrice: number) => {
    setTreatments(prev => prev.map(treatment => 
      treatment.id === id 
        ? { 
            ...treatment, 
            basePrice: newBasePrice, 
            finalPrice: Math.round(newBasePrice * (1 + treatment.commission / 100))
          }
        : treatment
    ));
  };

  const updateTreatmentCommission = (id: string, newCommission: number) => {
    setTreatments(prev => prev.map(treatment => 
      treatment.id === id 
        ? { 
            ...treatment, 
            commission: newCommission, 
            finalPrice: Math.round(treatment.basePrice * (1 + newCommission / 100))
          }
        : treatment
    ));
  };

  const saveTreatmentPrices = () => {
    toast({
      title: "가격 업데이트",
      description: "시술 가격이 성공적으로 업데이트되었습니다.",
    });
    setEditingTreatment(null);
  };

  const exportToExcel = () => {
    if (!assessmentsQuery.data || assessmentsQuery.data.length === 0) {
      toast({
        title: "데이터 없음",
        description: "내보낼 Assessment 데이터가 없습니다.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV header
    const headers = [
      "ID", "이름", "이메일", "주요 관심사", "원하는 결과", "피부 타입", "피부 민감도",
      "이전 치료", "치료 세부사항", "부작용", "의료 기록", "약물 복용", "일광 차단제 사용",
      "흡연", "음주", "물 섭취", "운동", "다운타임", "효과 지속기간", "예산 범위",
      "치료 강도", "선호 기간", "추가 정보", "언어", "생성 날짜"
    ];

    // Create CSV data
    const csvData = assessmentsQuery.data.map(assessment => [
      assessment.id,
      assessment.name,
      assessment.email,
      Array.isArray(assessment.mainConcern) ? assessment.mainConcern.join(", ") : assessment.mainConcern,
      Array.isArray(assessment.desiredResults) ? assessment.desiredResults.join(", ") : assessment.desiredResults,
      assessment.skinType || "",
      Array.isArray(assessment.skinSensitivity) ? assessment.skinSensitivity.join(", ") : assessment.skinSensitivity || "",
      assessment.previousTreatments || "",
      assessment.treatmentDetails || "",
      assessment.sideEffects || "",
      Array.isArray(assessment.medicalHistory) ? assessment.medicalHistory.join(", ") : assessment.medicalHistory || "",
      assessment.medicationsList || "",
      assessment.sunscreenUse || "",
      assessment.smoking || "",
      assessment.alcohol || "",
      assessment.waterIntake || "",
      assessment.exercise || "",
      assessment.preferredDowntime || "",
      assessment.effectDuration || "",
      assessment.budgetRange,
      assessment.treatmentIntensity || "",
      assessment.preferredDuration,
      assessment.additionalDetails || "",
      assessment.language,
      formatDate(assessment.createdAt)
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    // Create and download file
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `medical_beauty_assessments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "내보내기 완료",
      description: "Medical Beauty Assessment 데이터가 성공적으로 내보내졌습니다.",
    });
  };

  const assessments = assessmentsQuery.data || [];
  const contacts = contactsQuery.data || [];

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, "MMM dd, yyyy 'at' HH:mm");
    } catch {
      return "N/A";
    }
  };

  const formatArray = (arr: string[] | string | null) => {
    if (!arr) return "Not specified";
    if (Array.isArray(arr)) {
      return arr.length > 0 ? arr.join(", ") : "Not specified";
    }
    return arr;
  };

  // Get recommended treatment based on assessment data - Fixed to match Assessment page logic
  const getRecommendedTreatment = (assessment: QuotationRequest) => {
    const concerns = assessment.mainConcern || [];
    const results = assessment.desiredResults || [];
    
    // Score-based recommendation system (same as Assessment page)
    const scores = {
      lifting: 0,
      texture: 0,
      pigmentation: 0,
      contouring: 0
    };

    // Score based on main concerns
    concerns.forEach(concern => {
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
    results.forEach(result => {
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

    if (assessment.budgetRange && budgetScores[assessment.budgetRange as keyof typeof budgetScores]) {
      const budgetScore = budgetScores[assessment.budgetRange as keyof typeof budgetScores];
      Object.keys(budgetScore).forEach(key => {
        scores[key as keyof typeof scores] += budgetScore[key as keyof typeof budgetScore];
      });
    }

    // Find the category with highest score
    const maxScore = Math.max(...Object.values(scores));
    const recommendedCategory = Object.keys(scores).find(key => 
      scores[key as keyof typeof scores] === maxScore
    ) as keyof typeof scores;

    // Return treatment based on recommended category
    if (recommendedCategory === 'lifting') {
      return {
        type: 1,
        title: "Complete Anti-Aging & Facial Rejuvenation",
        description: "Comprehensive anti-aging treatment combining Ultherapy, Botox, HA Filler, and Skin Booster for complete facial rejuvenation",
        procedures: [
          { name: "Ulthera/Thermage 300 Shots", price: 1560000, description: "Dermal & SMAS layer lifting (MFU-V ultrasound) - A-Grade" },
          { name: "Imported (German) Wrinkle Botox", price: 120000, description: "Forehead & eye wrinkle removal - S-Grade" },
          { name: "Imported Filler 1cc", price: 480000, description: "Nasolabial & cheek volume enhancement - A-Grade" },
          { name: "Skin Botox + Aqua Injection", price: 348000, description: "Moisture & skin texture improvement - A-Grade" },
          { name: "Rejuran/Juvelook/Exosome 4cc", price: 600000, description: "Deep dryness, thin skin, overall regeneration - A-Grade" }
        ],
        totalPrice: 3108000
      };
    } else if (recommendedCategory === 'texture') {
      return {
        type: 2,
        title: "Advanced Pore & Scar Treatment",
        description: "Advanced treatment for acne scarring and pore refinement using Fraxel laser and regenerative therapies",
        procedures: [
          { name: "Fraxel Full Face 1 Session + PDRN", price: 720000, description: "Fractional laser for deep remodeling of acne scars and pore refinement - B-Grade" },
          { name: "Skin Botox Full Face", price: 228000, description: "Tightens pores and smooths fine wrinkles - S-Grade" },
          { name: "Exosome + Aqua + Skin Botox", price: 660000, description: "Boosts regeneration, prevents PIH (post-inflammatory hyperpigmentation) - A-Grade" },
          { name: "LDM Water Drop Lifting", price: 360000, description: "Enhances healing and skin recovery - A-Grade" }
        ],
        totalPrice: 1968000
      };
    } else if (recommendedCategory === 'pigmentation') {
      return {
        type: 3,
        title: "Brightening & Pigmentation Correction",
        description: "Comprehensive pigmentation treatment using advanced laser technology and regenerative medicine",
        procedures: [
          { name: "Triple Toning 1 Session", price: 300000, description: "IPL or Pico Laser for melanin breakdown - S-Grade" },
          { name: "LDM Water Drop Lifting", price: 360000, description: "Ultrasound tech for anti-inflammation & deep tissue repair - A-Grade" },
          { name: "Rejuran + Aqua + Skin Botox", price: 660000, description: "Collagen regeneration, anti-aging - A-Grade" },
          { name: "PDT 13% 1 Session", price: 180000, description: "Targets uneven tone, diffuse pigmentation - B-Grade" }
        ],
        totalPrice: 1500000
      };
    } else if (recommendedCategory === 'contouring') {
      return {
        type: 4,
        title: "V-Line Sculpting & Facial Contouring",
        description: "Facial contouring treatment for jawline slimming and enhanced facial definition",
        procedures: [
          { name: "Imported (German) Jaw Botox", price: 168000, description: "Masseter muscle slimming - S-Grade" },
          { name: "InMode 1,2 (One Area)", price: 360000, description: "RF technology for fat melting and lifting - B-Grade" },
          { name: "Oligio 300 Shots", price: 720000, description: "Firming and regeneration - A-Grade" },
          { name: "Imported Filler 1cc", price: 480000, description: "Enhances jawline definition - A-Grade" }
        ],
        totalPrice: 1728000
      };
    } else {
      // Default to Type 1 if no specific matches
      return {
        type: 1,
        title: "Complete Anti-Aging & Facial Rejuvenation",
        description: "Comprehensive anti-aging treatment combining Ultherapy, Botox, HA Filler, and Skin Booster for complete facial rejuvenation",
        procedures: [
          { name: "Ulthera/Thermage 300 Shots", price: 1560000, description: "Dermal & SMAS layer lifting (MFU-V ultrasound) - A-Grade" },
          { name: "Imported (German) Wrinkle Botox", price: 120000, description: "Forehead & eye wrinkle removal - S-Grade" },
          { name: "Imported Filler 1cc", price: 480000, description: "Nasolabial & cheek volume enhancement - A-Grade" },
          { name: "Skin Botox + Aqua Injection", price: 348000, description: "Moisture & skin texture improvement - A-Grade" },
          { name: "Rejuran/Juvelook/Exosome 4cc", price: 600000, description: "Deep dryness, thin skin, overall regeneration - A-Grade" }
        ],
        totalPrice: 3108000
      };
    }
  };

  const formatPrice = (price: number) => {
    const usdPrice = Math.round(price / 1300);
    return `₩${price.toLocaleString()} ($${usdPrice.toLocaleString()})`;
  };

  // Show loading while checking authentication
  if (!isAuthChecked || authQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!authQuery.data?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8 text-center relative">
          {/* Logout Button */}
          <div className="absolute top-0 right-0">
            <Button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              variant="outline"
              className="bg-transparent border-2 px-4 py-2 text-red-600 border-red-600 hover:bg-red-50 rounded-full transform hover:scale-105 transition-all duration-300"
              style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border-2" style={{ borderColor: 'hsl(220, 26%, 14%)' }}>
            <MessageSquare className="h-8 w-8" style={{ color: 'hsl(220, 26%, 14%)' }} />
          </div>
          <h1 className="medical-h1 mb-3" style={{ color: 'hsl(220, 26%, 14%)' }}>
            Medigo Korea Admin Dashboard
          </h1>
          <p className="medical-text max-w-2xl mx-auto" style={{ color: 'hsl(220, 26%, 14%)', opacity: 0.8 }}>
            Comprehensive management system for medical beauty assessments and customer inquiries
          </p>
        </div>

        <Tabs defaultValue="assessments" className="space-y-6">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-5xl grid-cols-4 h-12 bg-white/95 backdrop-blur-md shadow-xl rounded-full border-2" style={{ borderColor: 'hsl(220, 26%, 14%)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <TabsTrigger 
                value="assessments" 
                className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
                style={{ 
                  fontFamily: 'mayo-sans, Times New Roman, sans-serif', 
                  color: 'hsl(220, 26%, 14%)'
                }}
              >
                <MessageSquare className="h-4 w-4" />
                Medical Assessments ({assessments.length})
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
                style={{ 
                  fontFamily: 'mayo-sans, Times New Roman, sans-serif',
                  color: 'hsl(220, 26%, 14%)'
                }}
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Requests ({contacts.length})</span>
                  {contacts.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Bell className="h-3 w-3 text-red-500" />
                      <Badge variant="destructive" className="h-4 w-4 p-0 text-xs flex items-center justify-center">
                        {contacts.length}
                      </Badge>
                    </div>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="treatments" 
                className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
                style={{ 
                  fontFamily: 'mayo-sans, Times New Roman, sans-serif',
                  color: 'hsl(220, 26%, 14%)'
                }}
              >
                <DollarSign className="h-4 w-4" />
                Treatment Prices ({treatments.length})
              </TabsTrigger>
              <TabsTrigger 
                value="estimator" 
                className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
                style={{ 
                  fontFamily: 'mayo-sans, Times New Roman, sans-serif',
                  color: 'hsl(220, 26%, 14%)'
                }}
              >
                <Calculator className="h-4 w-4" />
                Skin Treatment Estimator
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="assessments" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Assessments List */}
              <Card className="shadow-xl border-2 bg-white/95 backdrop-blur-md" style={{ borderColor: 'hsl(220, 26%, 14%)' }}>
                <CardHeader className="border-b-2 rounded-t-lg" style={{ borderColor: 'hsl(220, 26%, 14%)', backgroundColor: 'hsl(220, 26%, 14%)', color: '#ffffff' }}>
                  <CardTitle className="flex items-center justify-between text-xl mb-4" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      Medical Beauty Assessments
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {filteredAssessments.length} / {assessmentsQuery.data?.length || 0}
                      </Badge>
                    </div>
                    <Button
                      onClick={exportToExcel}
                      disabled={!assessmentsQuery.data || assessmentsQuery.data.length === 0}
                      variant="outline"
                      className="bg-transparent border-2 px-4 py-2 text-white border-white/30 backdrop-blur-sm hover:bg-white/10 rounded-full transform hover:scale-105 transition-all duration-300"
                      style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                      style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px] px-4">
                    {assessmentsQuery.isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading assessments...</p>
                      </div>
                    ) : filteredAssessments.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          {searchName ? "No search results found" : "No assessments submitted yet"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 py-4">
                        {filteredAssessments.map((assessment) => (
                          <Card 
                            key={assessment.id} 
                            className={`cursor-pointer transition-all duration-300 border-0 shadow-sm hover:shadow-lg ${
                              selectedAssessment?.id === assessment.id 
                                ? 'ring-2 ring-teal-400 bg-gradient-to-r from-teal-50 to-cyan-50 transform scale-[1.02]' 
                                : 'hover:shadow-lg hover:transform hover:scale-[1.01] bg-white'
                            }`}
                            onClick={() => setSelectedAssessment(assessment)}
                          >
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-teal-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 text-lg" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                                      {assessment.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">Patient Assessment</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="mb-2 bg-teal-50 text-teal-700 border-teal-200">
                                    #{assessment.id}
                                  </Badge>
                                  <p className="text-xs text-gray-400">{formatDate(assessment.createdAt)}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                  <Mail className="h-4 w-4 text-teal-500" />
                                  <span className="text-gray-700 truncate">{assessment.email}</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                  <DollarSign className="h-4 w-4 text-green-500" />
                                  <span className="text-gray-700 font-medium">{assessment.budgetRange}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-1">
                                {assessment.mainConcern?.slice(0, 2).map((concern, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                    {concern}
                                  </Badge>
                                ))}
                                {assessment.mainConcern && assessment.mainConcern.length > 2 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                    +{assessment.mainConcern.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Assessment Details */}
              <Card className="shadow-xl border-2 bg-white/95 backdrop-blur-md" style={{ borderColor: 'hsl(220, 26%, 14%)' }}>
                <CardHeader className="border-b-2 rounded-t-lg" style={{ borderColor: 'hsl(220, 26%, 14%)', backgroundColor: 'hsl(220, 26%, 14%)', color: '#ffffff' }}>
                  <CardTitle className="flex items-center gap-3 text-xl" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                    <div className="p-2 bg-white/20 rounded-lg">
                      <User className="h-6 w-6" />
                    </div>
                    Assessment Details
                    {selectedAssessment && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Patient #{selectedAssessment.id}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {selectedAssessment ? (
                    <ScrollArea className="h-[600px] px-6">
                      <div className="space-y-6 py-6">
                        {/* Patient Header */}
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
                              <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                                {selectedAssessment.name}
                              </h2>
                              <p className="text-teal-600 font-medium">Medical Beauty Assessment</p>
                              <p className="text-sm text-gray-500">Submitted {formatDate(selectedAssessment.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <Mail className="h-4 w-4 text-teal-500" />
                                <span className="text-sm font-medium text-gray-700">Contact Email</span>
                              </div>
                              <p className="text-gray-900 font-medium">{selectedAssessment.email}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-gray-700">Budget Range</span>
                              </div>
                              <p className="text-gray-900 font-medium">{selectedAssessment.budgetRange}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium text-gray-700">Age</span>
                              </div>
                              <p className="text-gray-900 font-medium">{selectedAssessment.age || "Not specified"}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium text-gray-700">Nationality</span>
                              </div>
                              <p className="text-gray-900 font-medium">{selectedAssessment.nationality || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">1</span>
                            </div>
                            Basic Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Language Preference</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.language}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assessment ID</span>
                              <p className="text-gray-900 font-medium mt-1">#{selectedAssessment.id}</p>
                            </div>
                          </div>
                        </div>

                        {/* Main Concerns */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-red-600">2</span>
                            </div>
                            Main Concerns
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedAssessment.mainConcern?.map((concern, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                                {concern}
                              </Badge>
                            )) || <span className="text-gray-500 italic">No concerns specified</span>}
                          </div>
                        </div>

                        {/* Desired Results */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-green-600">3</span>
                            </div>
                            Desired Results
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedAssessment.desiredResults?.map((result, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                                {result}
                              </Badge>
                            )) || <span className="text-gray-500 italic">No desired results specified</span>}
                          </div>
                        </div>

                        {/* Skin Information */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-yellow-600">4</span>
                            </div>
                            Skin Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skin Type</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.skinType || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skin Sensitivity</span>
                              <p className="text-gray-900 font-medium mt-1">{formatArray(selectedAssessment.skinSensitivity)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Previous Treatments */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-indigo-600">5</span>
                            </div>
                            Previous Treatments
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Previous Treatments</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.previousTreatments || "None"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Have you received any cosmetic or skin treatments in the past year?</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.treatmentDetails || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Did you experience any side effects?</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.sideEffects || "Not specified"}</p>
                            </div>
                            {selectedAssessment.sideEffects === "yes" && selectedAssessment.sideEffectDetails && (
                              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <span className="text-xs font-medium text-yellow-700 uppercase tracking-wide">Side Effect Details</span>
                                <p className="text-yellow-900 font-medium mt-1">{selectedAssessment.sideEffectDetails}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Medical History */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-600">6</span>
                            </div>
                            Medical History
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Medical History</span>
                              <p className="text-gray-900 font-medium mt-1">{formatArray(selectedAssessment.medicalHistory)}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Allergies</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.allergies || "None"}</p>
                            </div>
                            {selectedAssessment.allergies === "yes" && selectedAssessment.allergyDetails && (
                              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <span className="text-xs font-medium text-yellow-700 uppercase tracking-wide">Allergy Details</span>
                                <p className="text-yellow-900 font-medium mt-1">{selectedAssessment.allergyDetails}</p>
                              </div>
                            )}
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Have you had cold sores/herpes?</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.coldSores || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Have you used retinoids (e.g., Accutane)?</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.retinoids || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Lifestyle Habits */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-orange-600">7</span>
                            </div>
                            Lifestyle Habits
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Smoking</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.smoking || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alcohol</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.alcohol || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Water Intake</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.waterIntake || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Exercise</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.exercise || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sunscreen Use</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.sunscreenUse || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Budget & Preferences */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-600">8</span>
                            </div>
                            Budget & Preferences
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Budget Range</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.budgetRange || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Duration</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.preferredDuration || "Not specified"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Downtime</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.preferredDowntime || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Treatment Intensity */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-600">9</span>
                            </div>
                            Treatment Intensity
                          </h3>
                          <div className="text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Treatment Intensity</span>
                              <p className="text-gray-900 font-medium mt-1">{selectedAssessment.treatmentIntensity || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Recommended Treatment */}
                        {(() => {
                          const recommendedTreatment = getRecommendedTreatment(selectedAssessment);
                          return (
                            <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-xl border border-teal-200 shadow-lg">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">10</span>
                                </div>
                                Recommended Treatment Package
                                <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-300">
                                  Type {recommendedTreatment.type}
                                </Badge>
                              </h3>
                              
                              <div className="mb-4">
                                <h4 className="text-lg font-bold text-teal-800 mb-2">{recommendedTreatment.title}</h4>
                                <p className="text-gray-600 text-sm mb-4">{recommendedTreatment.description}</p>
                              </div>

                              <div className="space-y-3 mb-4">
                                <h5 className="font-semibold text-gray-900">Treatment Procedures:</h5>
                                {recommendedTreatment.procedures.map((procedure, idx) => (
                                  <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                      <h6 className="font-semibold text-gray-900">{procedure.name}</h6>
                                      <span className="text-lg font-bold text-teal-600">{formatPrice(procedure.price)}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{procedure.description}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="bg-teal-100 p-4 rounded-lg border border-teal-300">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-bold text-teal-800">Total Package Price:</span>
                                  <span className="text-2xl font-bold text-teal-600">{formatPrice(recommendedTreatment.totalPrice)}</span>
                                </div>
                                <p className="text-sm text-teal-700 mt-1">Based on patient's concerns and desired results</p>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Additional Details */}
                        {selectedAssessment.additionalDetails && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Additional Details</h3>
                            <p className="text-gray-600 text-sm">{selectedAssessment.additionalDetails}</p>
                          </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-xl border-t-4 border-teal-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-teal-500" />
                              <span className="text-sm font-medium text-gray-700">Assessment Submitted</span>
                            </div>
                            <span className="text-sm text-gray-600">{formatDate(selectedAssessment.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Select an assessment to view details
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="shadow-xl border-2 bg-white/95 backdrop-blur-md" style={{ borderColor: 'hsl(220, 26%, 14%)' }}>
              <CardHeader className="border-b-2 rounded-t-lg" style={{ borderColor: 'hsl(220, 26%, 14%)', backgroundColor: 'hsl(220, 26%, 14%)', color: '#ffffff' }}>
                <CardTitle className="flex items-center justify-between text-xl" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Mail className="h-6 w-6" />
                    </div>
                    Contact Requests
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {contacts.length} total
                    </Badge>
                  </div>
                  {contacts.filter(c => c.status === "new").length > 0 && (
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-yellow-300 animate-pulse" />
                      <Badge variant="secondary" className="bg-yellow-500 text-white border-yellow-300">
                        {contacts.filter(c => c.status === "new").length} New
                      </Badge>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {contactsQuery.isLoading ? (
                  <div className="text-center py-8">Loading contacts...</div>
                ) : contactsQuery.error ? (
                  <div className="text-center py-8 text-red-500">Error loading contacts: {String(contactsQuery.error)}</div>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No contact requests yet</div>
                ) : (
                  <ScrollArea className="h-[600px] px-4">
                    <div className="space-y-3 py-4">
                      {contacts.map((contact) => (
                        <Card key={contact.id} className="shadow-sm border-0 hover:shadow-lg transition-all duration-300 bg-white">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-teal-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                                    {contact.firstName} {contact.lastName}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-white border-gray-200">#{contact.id}</Badge>
                                    {contact.status === "new" ? (
                                      <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">
                                        NEW
                                      </Badge>
                                    ) : (
                                      <Badge variant="default" className="bg-green-500 text-white">
                                        Sent
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(contact.createdAt)}
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="text-gray-600">{contact.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-gray-600">{contact.phone}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Service Interest:</span>
                                  <span className="text-gray-600 ml-1">{contact.serviceInterest}</span>
                                </div>
                              </div>
                              
                              <div>
                                <span className="font-medium">Message:</span>
                                <p className="text-gray-600 mt-1">{contact.message}</p>
                                
                                {contact.status === "new" && (
                                  <div className="mt-3 pt-3 border-t">
                                    <Button
                                      onClick={() => handleConfirmContact(contact.id)}
                                      disabled={updateStatusMutation.isPending}
                                      variant="outline"
                                      className="bg-transparent border-2 px-4 py-2 text-green-600 border-green-600 hover:bg-green-50 rounded-full transform hover:scale-105 transition-all duration-300"
                                      style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                                      size="sm"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      {updateStatusMutation.isPending ? "Processing..." : "Confirm"}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatments" className="space-y-6">
            <Card className="shadow-xl border-2 bg-white/95 backdrop-blur-md" style={{ borderColor: 'hsl(220, 26%, 14%)' }}>
              <CardHeader className="border-b-2 rounded-t-lg" style={{ borderColor: 'hsl(220, 26%, 14%)', backgroundColor: 'hsl(220, 26%, 14%)', color: '#ffffff' }}>
                <CardTitle className="flex items-center justify-between text-xl" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    Treatment Price Management
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {treatments.length} treatments
                    </Badge>
                  </div>
                  <Button
                    onClick={saveTreatmentPrices}
                    variant="outline"
                    className="bg-transparent border-2 px-4 py-2 text-white border-white/30 backdrop-blur-sm hover:bg-white/10 rounded-full transform hover:scale-105 transition-all duration-300"
                    style={{ fontFamily: 'mayo-sans, Times New Roman, sans-serif' }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save All Changes
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <strong>Price Structure:</strong> Base Cost + Commission (20%) = Final Price shown on website
                  </div>
                  
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                      {treatments.map((treatment) => (
                        <div key={treatment.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                                {treatment.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-1">{treatment.nameKr}</p>
                              <p className="text-sm text-gray-500">{treatment.description}</p>
                              <Badge variant="outline" className="mt-2">
                                {treatment.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => setEditingTreatment(editingTreatment === treatment.id ? null : treatment.id)}
                                variant="outline"
                                className="bg-transparent border-2 px-3 py-1 rounded-full transform hover:scale-105 transition-all duration-300"
                                style={{ 
                                  fontFamily: 'mayo-sans, Times New Roman, sans-serif',
                                  borderColor: 'hsl(220, 26%, 14%)',
                                  color: 'hsl(220, 26%, 14%)'
                                }}
                                size="sm"
                              >
                                {editingTreatment === treatment.id ? (
                                  <X className="h-4 w-4" />
                                ) : (
                                  <Edit className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Base Cost (₩)
                              </label>
                              {editingTreatment === treatment.id ? (
                                <Input
                                  type="number"
                                  value={treatment.basePrice}
                                  onChange={(e) => updateTreatmentPrice(treatment.id, parseInt(e.target.value) || 0)}
                                  className="text-right border-2 rounded-lg px-4 py-2 focus:outline-none transition-all duration-300"
                                  style={{ 
                                    fontFamily: 'mayo-sans, Times New Roman, sans-serif',
                                    borderColor: 'hsl(220, 26%, 14%)',
                                    color: 'hsl(220, 26%, 14%)'
                                  }}
                                />
                              ) : (
                                <div className="p-2 bg-white rounded border text-right">
                                  ₩{treatment.basePrice.toLocaleString()}
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Commission (%)
                              </label>
                              {editingTreatment === treatment.id ? (
                                <Input
                                  type="number"
                                  value={treatment.commission}
                                  onChange={(e) => updateTreatmentCommission(treatment.id, parseInt(e.target.value) || 0)}
                                  className="text-right border-2 rounded-lg px-4 py-2 focus:outline-none transition-all duration-300"
                                  style={{ 
                                    fontFamily: 'mayo-sans, Times New Roman, sans-serif',
                                    borderColor: 'hsl(220, 26%, 14%)',
                                    color: 'hsl(220, 26%, 14%)'
                                  }}
                                />
                              ) : (
                                <div className="p-2 bg-white rounded border text-right">
                                  {treatment.commission}%
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Final Price (₩)
                              </label>
                              <div className="p-2 bg-teal-50 rounded border text-right font-semibold text-teal-700">
                                ₩{treatment.finalPrice.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estimator" className="space-y-6">
            <Card className="shadow-xl border-2 bg-white/95 backdrop-blur-md" style={{ borderColor: 'hsl(220, 26%, 14%)' }}>
              <CardHeader className="border-b-2 rounded-t-lg" style={{ borderColor: 'hsl(220, 26%, 14%)', backgroundColor: 'hsl(220, 26%, 14%)', color: '#ffffff' }}>
                <CardTitle className="flex items-center gap-3 text-xl" style={{ fontFamily: 'mayo-display, Georgia, serif' }}>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calculator className="h-6 w-6" />
                  </div>
                  Skin Treatment Estimator
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Custom Calculator
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SkinTreatmentEstimator treatments={treatments} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}