// albayan-landing-page.component.ts
import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

interface CompanyInfo {
  tradeName: {
    english: string;
    arabic: string;
  };
  legalForm: {
    english: string;
    arabic: string;
  };
  licenseNumber: string;
  registerNumber: string;
  acciNumber: string;
  issueDate: string;
  expiryDate: string;
  owner: string;
  address: string;
}
@Component({
  selector: 'app-landing-page-container',
  standalone: false,
  templateUrl: './landing-page-container.component.html',
  styleUrl: './landing-page-container.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LandingPageContainerComponent   {
  // State management
  currentSlide = 0;
  previousSlide = -1;
  progressWidth = 0;
  isMobileMenuOpen = false;
  isScrolled = false;
  isBrowser: boolean;
  currentProjectIndex = 0;
  currentTestimonial = 0;
  activeTab: 'team' | 'expertise' = 'team';
  selectedService: any = null;
  beforeAfterSliders: {[key: number]: number} = { 0: 50, 1: 50, 2: 50 };
  statsData = [
    { value: 0, label: 'Years of Service' },
    { value: 0, label: 'Documents Processed' },
    { value: 0, label: 'Happy Clients' },
    { value: 0, label: 'Success Rate' }
  ];
  showScrollTop = false;
  
  formData = {
    serviceType: '',
    urgency: '',
    name: '',
    phone: '',
    email: '',
    message: ''
  };
  
  calculatorData = {
    serviceType: '',
    quantity: '',
    urgency: '',
    additionalServices: ''
  };
  
  estimatedCost: number | null = null;
  openFAQ: number | null = null;

  private intervalTimer: any;
  private progressTimer: any;
  private statsTimer: any;
  private testimonialTimer: any;

 COMPANY_INFO: CompanyInfo = {
    tradeName: {
      english: 'AL BAYAN TYPING SERVICES',
      arabic: 'البيان لخدمات الطباعة'
    },
    legalForm: {
      english: 'Sole Establishment',
      arabic: 'مؤسسة فردية'
    },
    licenseNumber: '70510',
    registerNumber: '71028',
    acciNumber: '80063',
    issueDate: '2015-01-11',
    expiryDate: '2027-01-02',
    owner: 'HASSAN ABDULLA SHAHDAD AL MANDOOS ALBLOGSHI',
    address: 'Shop No. 6, Rashideya 2, Ajman, UAE'
  };

  // Hero slides data
  heroSlides = [
     {
      title: 'AL BAYAN TYPING SERVICES',
      subtitle: 'Your Trusted Partner for All Typing, Translation & PRO Services in Ajman Since 2015',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      accent: 'BAYAN'
    },
     {
      title: 'COMPLETE BUSINESS SOLUTIONS',
      subtitle: 'Mainland & Freezone Company Formation | Ajman | Dubai | Sharjah | Rakez',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      accent: 'BUSINESS'
    },
    {
      title: 'LICENSED & CERTIFIED CENTER',
      subtitle: `License No. ${this.COMPANY_INFO.licenseNumber} | Officially Registered Since 2015`,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      accent: 'LICENSED'
    },
    {
      title: 'YOUR TRUSTED DOCUMENT PARTNER',
      subtitle: 'Complete Visa, Emirates ID, and Government Services Solutions',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      accent: 'PARTNER'
    },
    {
      title: 'EXCELLENCE IN DOCUMENTATION',
      subtitle: 'Certified Translation and PRO Services Since 2015',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      accent: 'EXCELLENCE'
    }
  ];


  services = [
    {
      icon: '📄',
      title: 'Visa Services',
      description: 'Complete visa typing services including residence, visit, and renewal applications processed efficiently with all Emirates support.'
    },
    {
      icon: '🆔',
      title: 'Emirates ID',
      description: 'Emirates ID application, renewal, and modification services with quick turnaround times and ICP direct access.'
    },
    {
      icon: '🏥',
      title: 'Medical Fitness',
      description: 'Medical fitness typing and processing for employment and residence permits with approved medical centers.'
    },
    {
      icon: '✈️',
      title: 'Immigration Services',
      description: 'Complete immigration and labor typing services with GDRFA, AMER, and Tasheel integration.'
    },
    {
      icon: '🌐',
      title: 'Translation Services',
      description: 'Certified English to Arabic and Arabic to English translation for legal, technical, and commercial documents.'
    },
    {
      icon: '🏢',
      title: 'PRO Services',
      description: 'Professional company formation, trade license processing, and document attestation services for all Emirates.'
    },
    {
      icon: '🏦',
      title: 'Bank Account Opening',
      description: 'Complete assistance with corporate and personal bank account opening in major UAE banks.'
    },
    {
      icon: '📋',
      title: 'Document Clearing',
      description: 'Document clearing services for customs, trade, and government departments across UAE.'
    },
    {
      icon: '🔄',
      title: 'License Renewals',
      description: 'Company license renewals for mainland and freezone businesses with Economic Department services.'
    },
    {
      icon: '🎁',
      title: 'Packages & Offers',
      description: 'Special promotional packages for business setup, visa processing, and bulk document services.'
    }
  ];


  // Jurisdictions
  JURISDICTIONS = [
    {
      title: 'Mainland',
      description: 'Dubai, Ajman, Sharjah Economic Department licenses',
      icon: '🏙️',
      features: [
        'Unrestricted Market Access',
        'Direct Access to Government Contracts',
        'Greater Business Flexibility',
        'Enhanced Brand Reputation'
      ]
    },
    {
      title: 'Free Zones',
      description: 'Rakez, SAIF Zone, Dubai Free Zones, Ajman Free Zone',
      icon: '🌐',
      features: [
        '100% Foreign Ownership',
        'Corporate Tax-Friendly Structure',
        'Simplified Banking',
        'Easy to Hire and Sponsor Professionals'
      ]
    }
  ];
  get yearsOfService(): number {
    return new Date().getFullYear() - 2015;
  }
  // Business Support Services
  BUSINESS_SUPPORT = [
    {
      icon: '🏦',
      title: 'Bank Account Opening',
      description: 'Assistance with opening corporate bank accounts in major UAE banks'
    },
    {
      icon: '📄',
      title: 'Visa Services',
      description: 'Complete visa processing for employees, partners, and family members'
    },
    {
      icon: '📋',
      title: 'Document Clearing Services',
      description: 'Clearing documents from customs, municipalities, and government departments'
    },
    {
      icon: '💼',
      title: 'PRO Services',
      description: 'Full PRO support for all government-related transactions and renewals'
    },
    {
      icon: '🔄',
      title: 'Company License Renewals',
      description: 'Timely renewal of trade licenses for mainland and freezone companies'
    }
  ];

  // Freezone Benefits
  FREEZONE_BENEFITS = [
    {
      title: 'Company Formation in 1-2 Business Days',
      icon: '⚡',
      description: 'Fast-track setup with minimal paperwork'
    },
    {
      title: 'Easy to Open a Bank Account',
      icon: '💳',
      description: 'Banking support for corporate accounts'
    },
    {
      title: 'Minimal Paperwork',
      icon: '📝',
      description: 'Streamlined documentation process'
    },
    {
      title: '100% Foreign Ownership',
      icon: '🌍',
      description: 'Complete control of your business'
    },
    {
      title: 'Dubai Investor Visa',
      icon: '✈️',
      description: 'Residence visa for investors and partners'
    }
  ];

  // Freezone Setup Steps
  FREEZONE_STEPS = [
    {
      number: '1',
      title: 'Select a Legal Structure',
      description: 'Choose the appropriate business structure: FZ LLC, FZ Establishment, or Branch Office',
      icon: '⚖️'
    },
    {
      number: '2',
      title: 'Pick a Trade Name',
      description: 'Reserve and approve your company name with the freezone authority',
      icon: '✍️'
    },
    {
      number: '3',
      title: 'Apply for the Business License',
      description: 'Submit application with required documents and business activity details',
      icon: '📋'
    },
    {
      number: '4',
      title: 'Select an Office Space',
      description: 'Choose flexi-desk, office, or warehouse space based on your needs',
      icon: '🏢'
    },
    {
      number: '5',
      title: 'Secure Approvals and Obtain License',
      description: 'Receive final approvals and collect your business license',
      icon: '✅'
    }
  ];

  // Packages
  PACKAGES = [
    {
      title: 'Visa Package',
      price: 'AED 2,500',
      description: 'Complete visa processing with Emirates ID',
      features: [
        'Residence visa typing',
        'Medical fitness coordination',
        'Emirates ID application',
        'Status change services',
        'Free document consultation'
      ],
      popular: false
    },
    {
      title: 'Business Starter',
      price: 'AED 8,500',
      description: 'Complete company setup package',
      features: [
        'Trade license processing',
        'Initial approval services',
        '2 Investor visas included',
        'Bank account assistance',
        '1 Year PRO support'
      ],
      popular: true
    },
    {
      title: 'Translation Bundle',
      price: 'AED 500',
      description: 'Document translation services',
      features: [
        '10 documents translation',
        'Certified attestation',
        'Legal document support',
        'Same-day express option',
        'Free delivery in Ajman'
      ],
      popular: false
    }
  ];
  // Detailed services
  detailedServices = [
    {
      title: 'Visa Processing Services',
      subtitle: 'Complete visa solutions for all your UAE requirements',
      description: 'Our comprehensive visa services cover all types of residence visas, visit visas, employment visas, and visa renewals. We handle the entire process from application to approval, ensuring compliance with UAE immigration regulations.',
      images: [
        'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      ],
      stats: [
        { value: '5000+', label: 'Visas Processed' },
        { value: '98%', label: 'Approval Rate' },
        { value: '24hrs', label: 'Average Time' }
      ],
      benefits: [
        'All visa types: residence, visit, employment, family',
        'Visa renewal and cancellation services',
        'Status change and visa modification',
        'Express processing available',
        'Complete documentation assistance',
        'Direct submission to immigration'
      ],
      features: [
        'New residence visa applications',
        'Visit visa for tourists and family',
        'Employment visa processing',
        'Visa renewal before expiry',
        'Visa cancellation services',
        'Visa status checking'
      ],
      process: [
        'Submit required documents and passport copy',
        'We verify and prepare your application',
        'Application submitted to immigration',
        'Track status and receive updates',
        'Collect visa upon approval'
      ]
    },
    {
      title: 'Emirates ID Services',
      subtitle: 'Fast and reliable Emirates ID solutions',
      description: 'Complete Emirates ID services including new applications, renewals, and modifications. We ensure your Emirates ID is processed quickly and accurately with minimal hassle.',
      images: [
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      ],
      stats: [
        { value: '10000+', label: 'IDs Processed' },
        { value: '100%', label: 'Accuracy' },
        { value: '3-5', label: 'Working Days' }
      ],
      benefits: [
        'New Emirates ID application',
        'Renewal before expiry',
        'Lost or damaged ID replacement',
        'Information modification',
        'Express service available',
        'Home delivery option'
      ],
      features: [
        'ICP typing and submission',
        'Biometric appointment booking',
        'Application tracking',
        'SMS updates on status',
        'Document verification',
        'Collection assistance'
      ],
      process: [
        'Provide passport, visa, and entry stamp',
        'We complete ICP typing and submission',
        'Biometric appointment scheduled',
        'Attend biometric session',
        'Receive Emirates ID at your address'
      ]
    },
    {
      title: 'Translation Services',
      subtitle: 'Certified and accurate translation services',
      description: 'Professional translation services for legal, commercial, and personal documents. Our certified translators ensure accuracy and compliance with UAE legal requirements.',
      images: [
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      ],
      stats: [
        { value: '15000+', label: 'Documents Translated' },
        { value: '100%', label: 'Certified' },
        { value: 'Same Day', label: 'Service Available' }
      ],
      benefits: [
        'English to Arabic and Arabic to English',
        'Certified and attested translations',
        'Legal document translation',
        'Technical document translation',
        'Same-day service for urgent requests',
        'Competitive pricing'
      ],
      features: [
        'Educational certificates translation',
        'Commercial documents',
        'Legal contracts and agreements',
        'Personal documents (birth, marriage certificates)',
        'Technical manuals and specifications',
        'Medical reports and prescriptions'
      ],
      process: [
        'Submit original document for review',
        'Receive quotation and timeline',
        'Translation by certified translator',
        'Quality check and verification',
        'Delivery with certification stamp'
      ]
    },
    {
      title: 'PRO Services',
      subtitle: 'Complete business setup and PRO solutions',
      description: 'Comprehensive PRO services for company formation, trade license processing, and all government-related documentation. We handle everything so you can focus on your business.',
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      ],
      stats: [
        { value: '500+', label: 'Companies Formed' },
        { value: '100%', label: 'Success Rate' },
        { value: '10+', label: 'Years Experience' }
      ],
      benefits: [
        'Company formation in UAE mainland and freezones',
        'Trade license application and renewal',
        'Document attestation and notarization',
        'Ministry approvals and clearances',
        'Partner visa processing',
        'Complete PRO support'
      ],
      features: [
        'Ajman, Dubai, Sharjah mainland licenses',
        'Rakez, SAIF Zone, and other freezone licenses',
        'Economic Department services',
        'Chamber of Commerce registration',
        'Municipality approvals',
        'Bank account opening assistance'
      ],
      process: [
        'Consultation on business setup requirements',
        'Company name reservation and approval',
        'License application and documentation',
        'Government approvals and submissions',
        'License issuance and collection'
      ]
    },
    {
      title: 'Government Services',
      subtitle: 'Tasheel, AMER, and GDRFA services',
      description: 'Direct access to government services including Tasheel, AMER centers, and GDRFA for all immigration and labor-related transactions.',
      images: [
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      ],
      stats: [
        { value: '20000+', label: 'Transactions' },
        { value: 'Direct', label: 'Government Access' },
        { value: 'Fast', label: 'Processing' }
      ],
      benefits: [
        'Tasheel typing and services',
        'AMER center submissions',
        'GDRFA immigration services',
        'ICP Federal Authority services',
        'Labor department typing',
        'Economic Department services'
      ],
      features: [
        'Entry permit typing',
        'Labor contract typing',
        'Establishment card services',
        'Immigration fines settlement',
        'Status adjustment',
        'Deportation clearance'
      ],
      process: [
        'Identify required government service',
        'Document preparation and typing',
        'Submission to relevant authority',
        'Follow-up and status tracking',
        'Collection and delivery to client'
      ]
    },
    {
      title: 'Medical Fitness Services',
      subtitle: 'Complete medical fitness typing and processing',
      description: 'Medical fitness test typing and processing for employment and residence permits, coordinated with approved medical centers.',
      images: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      ],
      stats: [
        { value: '8000+', label: 'Tests Processed' },
        { value: 'All', label: 'Medical Centers' },
        { value: '1-2', label: 'Working Days' }
      ],
      benefits: [
        'Medical fitness typing for all visa types',
        'Coordination with approved medical centers',
        'Online application submission',
        'Result tracking and collection',
        'Renewal services',
        'Fast processing'
      ],
      features: [
        'Employment medical fitness',
        'Residence visa medical',
        'Pre-employment screening',
        'Medical test renewal',
        'Occupational health tests',
        'Result delivery'
      ],
      process: [
        'Register for medical fitness test',
        'Attend medical center for examination',
        'We type and submit application',
        'Track medical fitness status',
        'Receive fitness certificate'
      ]
    }
  ];

  // Process steps
  processSteps = [
    {
      icon: '📋',
      number: '01',
      title: 'Submit Documents',
      description: 'Visit our office or send your documents. We verify all requirements and provide a checklist.'
    },
    {
      icon: '⚙️',
      number: '02',
      title: 'Processing & Typing',
      description: 'Our expert typists prepare and submit your applications to the relevant government departments.'
    },
    {
      icon: '✅',
      number: '03',
      title: 'Approval & Updates',
      description: 'Track your application status. We provide regular updates via SMS and phone calls.'
    },
    {
      icon: '📦',
      number: '04',
      title: 'Collection & Delivery',
      description: 'Collect your processed documents from our office or opt for home delivery service.'
    }
  ];

  // Team members
  teamMembers = [
    {
      name: 'Expert Typists',
      role: 'Document Processing',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Experienced typists ensuring accuracy in every document'
    },
    {
      name: 'PRO Specialists',
      role: 'Government Relations',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Government liaison experts handling all official procedures'
    },
    {
      name: 'Certified Translators',
      role: 'Translation Services',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Professional translators with legal certification'
    },
    {
      name: 'Customer Support',
      role: 'Client Relations',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Dedicated support team for all your inquiries'
    }
  ];

  // Expertise items
  expertise = [
    {
      icon: '🎓',
      title: 'Certified Professionals',
      description: 'All our staff are certified and trained in UAE government procedures'
    },
    {
      icon: '⏰',
      title: 'Fast Turnaround',
      description: 'Quick processing times with express services available for urgent requests'
    },
    {
      icon: '💼',
      title: 'Complete Solutions',
      description: 'One-stop shop for all typing, translation, and PRO services'
    },
    {
      icon: '📈',
      title: 'Latest Updates',
      description: 'Stay updated with latest government regulations and requirements'
    }
  ];

  // Achievements
  achievements = [
    {
      icon: 'fas fa-award',
      number: '10+',
      label: 'Years Experience',
      color: '#d4a574'
    },
    {
      icon: 'fas fa-users',
      number: '25000+',
      label: 'Happy Clients',
      color: '#8B7355'
    },
    {
      icon: 'fas fa-check-circle',
      number: '50000+',
      label: 'Documents Processed',
      color: '#A0826D'
    },
    {
      icon: 'fas fa-shield-alt',
      number: '100%',
      label: 'Confidential',
      color: '#BC9A6F'
    }
  ];

  // Projects/Success Stories
  projects = [
    {
      category: 'Visa Services',
      title: 'Family Residence Visas',
      description: 'Successfully processed family residence visas for 200+ families',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      category: 'Business Setup',
      title: 'Company Formations',
      description: 'Established 500+ companies in UAE mainland and freezones',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      category: 'Translation',
      title: 'Legal Documents',
      description: 'Translated and certified over 15,000 legal documents',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      category: 'Emirates ID',
      title: 'ID Renewals',
      description: 'Processed 10,000+ Emirates ID applications and renewals',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      category: 'PRO Services',
      title: 'License Processing',
      description: 'Handled complete PRO services for 1000+ businesses',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      category: 'Medical Services',
      title: 'Medical Fitness',
      description: 'Coordinated 8000+ medical fitness tests and certifications',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    }
  ];

  // Testimonials
  testimonials = [
    {
      name: 'Ahmed Al Mansoori',
      location: 'Ajman',
      rating: 5,
      text: 'Al Bayan Typing Services made my visa renewal process incredibly smooth. Professional, fast, and accurate. Highly recommended for all government services!',
      project: 'Residence Visa Renewal'
    },
    {
      name: 'Sarah Johnson',
      location: 'Dubai',
      rating: 5,
      text: 'Excellent translation services! They translated all my educational certificates quickly and professionally. The certified translations were accepted everywhere.',
      project: 'Document Translation'
    },
    {
      name: 'Mohammed Rahman',
      location: 'Sharjah',
      rating: 5,
      text: 'Best PRO services in Ajman. They helped me set up my company and handled all the paperwork efficiently. Very knowledgeable team!',
      project: 'Company Formation'
    },
    {
      name: 'Fatima Al Ali',
      location: 'Ajman',
      rating: 5,
      text: 'Very professional service for Emirates ID renewal. They kept me updated throughout the process. Received my ID within a week!',
      project: 'Emirates ID Renewal'
    },
    {
      name: 'David Chen',
      location: 'Ajman',
      rating: 5,
      text: 'Fantastic service! Processed my family visit visa in just 2 days. The staff is friendly and very helpful. Will definitely use their services again.',
      project: 'Visit Visa'
    }
  ];

  // Before/After comparisons
  beforeAfterProjects = [
    {
      title: 'Complete Document Processing',
      location: 'Ajman',
      before: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      after: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Transformed from manual paper-based processing to fully digital document management system.'
    },
    {
      title: 'Service Expansion',
      location: 'Ajman',
      before: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      after: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Expanded from basic typing to comprehensive government and PRO services.'
    },
    {
      title: 'Customer Experience',
      location: 'Ajman',
      before: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      after: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Enhanced customer experience with digital tracking and SMS updates.'
    }
  ];

  // Gallery images
  galleryImages = [
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ];

  
 faqs = [
    {
      question: 'What documents do I need for visa processing?',
      answer: 'Required documents typically include: valid passport copy, Emirates ID copy (if applicable), photographs, current visa copy, and sponsor documents. Specific requirements vary by visa type. Contact us for a detailed checklist.'
    },
    {
      question: 'How long does Emirates ID processing take?',
      answer: 'Standard Emirates ID processing takes 3-5 working days after biometric completion. Express services are available for urgent requests.'
    },
    {
      question: 'Can you help with freezone company formation?',
      answer: 'Yes! We process freezone licenses for Rakez, SAIF Zone, Dubai Free Zones, Ajman Free Zone, and other Emirates. We handle the complete process from name reservation to license issuance.'
    },
    {
      question: 'What are your license details?',
      answer: `We are officially licensed (License No. ${this.COMPANY_INFO.licenseNumber}, Register No. ${this.COMPANY_INFO.registerNumber}, ACCI No. ${this.COMPANY_INFO.acciNumber}) and have been serving Ajman since 2015.`
    },
    {
      question: 'Do you assist with bank account opening?',
      answer: 'Yes, we provide complete assistance with opening corporate and personal bank accounts in major UAE banks for both mainland and freezone companies.'
    },
    {
      question: 'What mainland jurisdictions do you cover?',
      answer: 'We process mainland licenses for Ajman, Dubai, and Sharjah Economic Departments with complete PRO support.'
    },
    {
      question: 'What are your working hours?',
      answer: 'We are open Saturday to Thursday, 8:00 AM to 8:00 PM, and Friday 4:00 PM to 8:00 PM. Appointments available outside hours for urgent matters.'
    },
    {
      question: 'Do you offer promotional packages?',
      answer: 'Yes, we have special packages for visa processing, business setup, and translation services. Check our Packages & Offers section for current promotions.'
    }
  ];

  // Special features
  specialFeatures = [
    {
      icon: '📱',
      title: 'SMS Updates',
      description: 'Receive real-time SMS notifications on your application status and progress'
    },
    {
      icon: '⚡',
      title: 'Express Services',
      description: 'Urgent processing available for time-sensitive visa and document requirements'
    },
    {
      icon: '🔒',
      title: 'Secure Processing',
      description: 'All documents handled with utmost confidentiality and secure storage systems'
    },
    {
      icon: '💯',
      title: 'Quality Guarantee',
      description: '100% accuracy guarantee on all typing and translation services'
    },
    {
      icon: '🚚',
      title: 'Home Delivery',
      description: 'Document collection and delivery service available within Ajman emirate'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'Clear pricing with no hidden fees. Get detailed quotations upfront'
    },
    {
      icon: '🌐',
      title: 'Multi-Language Support',
      description: 'Staff fluent in Arabic, English, Hindi, and Urdu for better communication'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Emergency contact available for urgent queries and time-sensitive matters'
    }
  ];

  // Unique services
  uniqueServices = [
    {
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Direct Government Access',
      description: 'We have direct access to Tasheel, AMER, GDRFA, and ICP systems for faster processing.'
    },
    {
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Free Consultation',
      description: 'Get expert advice on visa requirements, business setup, and documentation at no charge.'
    },
    {
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Lifetime Support',
      description: 'Ongoing assistance for all documents processed through our center, even years later.'
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

ngOnInit() {
  // Only run browser-specific code in browser environment
  if (!this.isBrowser) {
    return;
  }

  // Setup scroll event listener
  if (typeof window !== 'undefined') {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  // Hero slider interval
  this.intervalTimer = setInterval(() => {
    this.nextSlide();
  }, 5000);

  // Progress bar animation
  this.progressTimer = setInterval(() => {
    this.progressWidth = this.progressWidth >= 100 ? 0 : this.progressWidth + 2;
  }, 100);

  // Animate stats
  this.statsTimer = setTimeout(() => {
    this.animateStats();
  }, 500);

  // Testimonial rotation
  this.testimonialTimer = setInterval(() => {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }, 6000);
}

  ngOnDestroy() {
    // Remove event listener only if in browser
    if (this.isBrowser && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
    
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    if (this.progressTimer) clearInterval(this.progressTimer);
    if (this.statsTimer) clearTimeout(this.statsTimer);
    if (this.testimonialTimer) clearInterval(this.testimonialTimer);
  }


  @HostListener('window:scroll', [])
  handleScroll() {
   if (this.isBrowser && typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 50;
      this.showScrollTop = window.scrollY > 300;
    }
  }

  // Functions
  nextSlide() {
    this.previousSlide = this.currentSlide;
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    this.progressWidth = 0;
  }

  goToSlide(index: number) {
    this.previousSlide = this.currentSlide;
    this.currentSlide = index;
    this.progressWidth = 0;
  }

    scrollToSection(id: string) {
    if (this.isBrowser && typeof window !== 'undefined') {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        this.isMobileMenuOpen = false;
      }
    }
  }

   scrollToTop() {
    if (this.isBrowser && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  animateStats() {
    const targets = [
      { value: 10, label: 'Years of Service' },
      { value: 50000, label: 'Documents Processed' },
      { value: 25000, label: 'Happy Clients' },
      { value: 100, label: 'Success Rate' }
    ];

    let progress = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
      
      this.statsData = targets.map(target => ({
        value: Math.floor(target.value * progress),
        label: target.label
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.statsData = targets;
      }
    };

    requestAnimationFrame(animate);
  }

  handleFormSubmit(e: Event) {
    e.preventDefault();
    alert(`Thank you! We'll contact you at ${this.formData.phone} shortly.`);
    this.formData = {
      serviceType: '',
      urgency: '',
      name: '',
      phone: '',
      email: '',
      message: ''
    };
  }

  calculateCost(e: Event) {
    e.preventDefault();
    
    const baseRates: {[key: string]: number} = {
      'visa-residence': 500,
      'visa-visit': 300,
      'emirates-id': 200,
      'translation': 50,
      'pro-services': 1000,
      'medical-fitness': 150
    };

    const urgencyMultiplier: {[key: string]: number} = {
      'standard': 1,
      'express': 1.5,
      'urgent': 2
    };

    const quantity = parseInt(this.calculatorData.quantity) || 1;
    const baseRate = baseRates[this.calculatorData.serviceType] || 0;
    const urgency = urgencyMultiplier[this.calculatorData.urgency] || 1;
    
    const total = baseRate * quantity * urgency;
    this.estimatedCost = total;
  }

  getCurrentWords() {
    return this.heroSlides[this.currentSlide].title.split(' ');
  }

  isAccentWord(word: string) {
    return this.heroSlides[this.currentSlide].accent.includes(word);
  }

  nextProject() {
    this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length;
  }

  prevProject() {
    this.currentProjectIndex = this.currentProjectIndex === 0 ? this.projects.length - 1 : this.currentProjectIndex - 1;
  }

  getVisibleProjects() {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(this.projects[(this.currentProjectIndex + i) % this.projects.length]);
    }
    return visible;
  }

  handleSliderChange(index: number, event: any) {
    this.beforeAfterSliders = { ...this.beforeAfterSliders, [index]: parseInt(event.target.value) };
  }



}