import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactRequestSchema, type InsertContactRequest } from "@shared/schema";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from "lucide-react";
import { FaWhatsapp, FaLine, FaFacebookMessenger } from "react-icons/fa";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Contact() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<InsertContactRequest>({
    resolver: zodResolver(insertContactRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      serviceInterest: "",
      message: "",
      language: language,
    },
  });

  const submitContact = useMutation({
    mutationFn: async (data: InsertContactRequest) => {
      const response = await apiRequest("/api/contact-requests", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      setShowSuccessDialog(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactRequest) => {
    // Validate all required fields are filled
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.serviceInterest || !data.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    submitContact.mutate({ ...data, language });
  };

  return (
    <section className="py-20 bg-white" data-section="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="medical-h2 mb-4">
            {t.contact.title}
          </h2>
          <p className="medical-subtitle">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">

            <div id="instant-contact">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.contact.instantCommunication}</h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-2 px-4 sm:px-6 py-3 text-sm sm:text-base shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-white/10 rounded-full" 
                  style={{ 
                    fontFamily: 'mayo-display, Georgia, serif',
                    borderColor: 'hsl(220, 26%, 14%)',
                    color: 'hsl(220, 26%, 14%)'
                  }}
                  onClick={() => window.open('https://wa.me/821090723330?text=Hello%20I%20have%20a%20question%20about%20Medigo%20services', '_blank')}
                >
                  <FaWhatsapp className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-2 px-4 sm:px-6 py-3 text-sm sm:text-base shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-white/10 rounded-full" 
                  style={{ 
                    fontFamily: 'mayo-display, Georgia, serif',
                    borderColor: 'hsl(220, 26%, 14%)',
                    color: 'hsl(220, 26%, 14%)'
                  }}
                  onClick={() => window.open('https://line.me/R/ti/p/@684qxhin', '_blank')}
                >
                  <FaLine className="mr-2 h-4 w-4" />
                  Line
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-2 px-4 sm:px-6 py-3 text-sm sm:text-base shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-white/10 rounded-full" 
                  style={{ 
                    fontFamily: 'mayo-display, Georgia, serif',
                    borderColor: 'hsl(220, 26%, 14%)',
                    color: 'hsl(220, 26%, 14%)'
                  }}
                  onClick={() => window.open('https://m.me/medigokorea.kr', '_blank')}
                >
                  <FaFacebookMessenger className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
              </div>
            </div>
          </div>

          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                {t.contact.scheduleConsultation}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.contact.firstName}</FormLabel>
                          <FormControl>
                            <Input placeholder={t.contact.placeholders.firstName} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.contact.lastName}</FormLabel>
                          <FormControl>
                            <Input placeholder={t.contact.placeholders.lastName} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.email}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t.contact.placeholders.email} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.phone}</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder={t.contact.placeholders.phone} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.serviceInterest}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t.contact.placeholders.serviceInterest} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="skin-treatment">Skin Treatment</SelectItem>
                            <SelectItem value="dt-7">DT-7</SelectItem>
                            <SelectItem value="dentistry">Dentistry</SelectItem>
                            <SelectItem value="health-checkup">Health Check-up</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.message}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t.contact.placeholders.message}
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    variant="outline"
                    className="w-full bg-transparent border-2 px-6 py-3 text-base shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-white/10 rounded-full"
                    style={{ 
                      fontFamily: 'mayo-display, Georgia, serif',
                      borderColor: 'hsl(220, 26%, 14%)',
                      color: 'hsl(220, 26%, 14%)'
                    }}
                    disabled={submitContact.isPending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {submitContact.isPending ? "Sending..." : (t.contact.submit.charAt(0).toUpperCase() + t.contact.submit.slice(1).toLowerCase())}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-bold text-gray-900">
              Message Sent Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 mt-2">
              Thank you for your inquiry. We have received your message and will respond via email within 24 hours to schedule your consultation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
