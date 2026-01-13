import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Rocket,
  Satellite,
  Globe,
  Zap,
  Shield,
  BookOpen,
  Video,
  FileText,
  MessageCircle,
  Mail,
  Github,
  Linkedin,
  Phone,
  ExternalLink,
  ChevronRight,
  Play,
} from 'lucide-react';

const HelpDocs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const features = [
    {
      icon: Globe,
      title: 'Earth View & Monitoring',
      description: 'Real-time 3D Earth visualization with satellite tracking',
      docs: [
        'View live satellite positions around Earth',
        'Toggle between Earth-only and full Solar System view',
        'Monitor satellite health and orbital parameters',
        'Track space debris and potential collision threats',
      ],
    },
    {
      icon: Satellite,
      title: 'Satellite Tracking',
      description: 'Comprehensive satellite database with filtering',
      docs: [
        'Browse 50+ Indian and international satellites',
        'Filter by orbit type (LEO, MEO, GEO, IGSO)',
        'Search by country, operator, or mission type',
        'View detailed specifications including mass, power, and design life',
      ],
    },
    {
      icon: Rocket,
      title: 'Rocket Launch Simulator',
      description: 'Interactive 3D rocket launch simulation',
      docs: [
        'Full manual control of launch sequence',
        'Real-time telemetry data (altitude, velocity, fuel, temperature)',
        'Stage separation visualization',
        'Multiple camera angles and views',
        'Configurable launch parameters',
      ],
    },
    {
      icon: Zap,
      title: 'Solar Activity Monitor',
      description: 'Track solar weather and space weather events',
      docs: [
        'Solar flare intensity monitoring',
        'Coronal mass ejection (CME) tracking',
        'Geomagnetic storm predictions',
        'Impact assessment on satellite operations',
      ],
    },
    {
      icon: Shield,
      title: 'Collision Prediction',
      description: 'AI-powered collision risk assessment',
      docs: [
        'Real-time conjunction analysis',
        'Probability calculations for close approaches',
        'Recommended avoidance maneuvers',
        'Historical collision event database',
      ],
    },
  ];

  const faqs = [
    {
      question: 'How accurate is the satellite tracking data?',
      answer: 'Our satellite tracking uses TLE (Two-Line Element) data from authoritative sources including ISRO, NASA, and ESA. Positions are typically accurate to within a few kilometers, with updates occurring every few seconds for LEO satellites.',
    },
    {
      question: 'Can I use the rocket simulator for educational purposes?',
      answer: 'Absolutely! The rocket simulator is designed for educational use and demonstrates realistic physics including gravity, drag, thrust curves, and orbital mechanics. It\'s perfect for students learning about space flight.',
    },
    {
      question: 'What does the collision prediction system detect?',
      answer: 'The system monitors all tracked objects and calculates close approaches. When two objects are predicted to pass within 1km of each other, it triggers an alert with probability assessment and recommended actions.',
    },
    {
      question: 'How often is the satellite database updated?',
      answer: 'The database is continuously updated with new launches and decommissioned satellites. Indian satellite data is sourced directly from ISRO publications and updated within 24 hours of any official announcements.',
    },
    {
      question: 'What browsers are supported?',
      answer: 'SpaceShield works best on modern browsers with WebGL support including Chrome, Firefox, Safari, and Edge. For optimal 3D visualization performance, we recommend using Chrome or Firefox with hardware acceleration enabled.',
    },
    {
      question: 'Is there an API available for developers?',
      answer: 'Yes! SpaceShield provides a RESTful API for accessing satellite data, collision predictions, and launch information. Contact us for API documentation and access keys.',
    },
  ];

  const tutorials = [
    { title: 'Getting Started with SpaceShield', duration: '5 min', type: 'video' },
    { title: 'Understanding Orbital Mechanics', duration: '8 min', type: 'video' },
    { title: 'Using the Launch Simulator', duration: '12 min', type: 'video' },
    { title: 'Satellite Tracking Basics', duration: '6 min', type: 'article' },
    { title: 'Reading Collision Alerts', duration: '4 min', type: 'article' },
    { title: 'Solar Weather Impact Analysis', duration: '7 min', type: 'article' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Help & Documentation</h1>
            <p className="text-muted-foreground">
              Everything you need to know about SpaceShield - Ultimate Space Traffic & Satellite Protection System
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Features Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Feature Documentation
                  </CardTitle>
                  <CardDescription>
                    Detailed guides for all SpaceShield features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                          <ul className="space-y-1">
                            {feature.docs.map((doc, docIndex) => (
                              <li key={docIndex} className="text-sm flex items-center gap-2">
                                <ChevronRight className="h-3 w-3 text-primary" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* FAQs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Quick Start Tutorials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {tutorials.map((tutorial, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start gap-3 h-auto py-3"
                        >
                          {tutorial.type === 'video' ? (
                            <Play className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium">{tutorial.title}</p>
                            <p className="text-xs text-muted-foreground">{tutorial.duration}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {tutorial.type}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Contact & Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Developer</CardTitle>
                  <CardDescription>Get in touch with the SpaceShield team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/30 border border-border/50">
                    <h3 className="font-semibold mb-1">Neetesh Kumar</h3>
                    <p className="text-sm text-muted-foreground mb-3">Lead Developer</p>
                    
                    <div className="space-y-2">
                      <a 
                        href="tel:+918218828273" 
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        +91 8218828273
                      </a>
                      <a 
                        href="mailto:neeteshk1104@gmail.com" 
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        neeteshk1104@gmail.com
                      </a>
                      <a 
                        href="https://github.com/neetesh1541" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        github.com/neetesh1541
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a 
                        href="https://in.linkedin.com/in/neetesh-kumar-846616287" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <Button className="w-full" variant="glow">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Feedback
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Github className="h-4 w-4 mr-2" />
                    Source Code
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Release Notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HelpDocs;
