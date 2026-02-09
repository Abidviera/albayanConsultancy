import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import * as AOS from 'aos';

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
  encapsulation: ViewEncapsulation.None,
})
export class LandingPageContainerComponent {
  @ViewChild('statsSection') statsSection!: ElementRef;
  currentSlide = 0;
  previousSlide = -1;
  isLoading = true;
  private aosInitialized = false;
  private isComponentReady = false;
  progressWidth = 0;
  isMobileMenuOpen = false;
  private statsAnimationRun = false;
  isScrolled = false;
  isBrowser: boolean;
  currentProjectIndex = 0;
  currentTestimonial = 0;
  activeTab: 'team' | 'expertise' = 'team';
  selectedService: any = null;
  beforeAfterSliders: { [key: number]: number } = { 0: 50, 1: 50, 2: 50 };
  statsData = [
    { value: 0, label: 'Years Serving UAE' },
    { value: 0, label: 'Documents Across UAE' },
    { value: 0, label: 'UAE-Wide Clients' },
    { value: 0, label: 'Success Rate' },
  ];

  showScrollTop = false;
  COMPANY_CONTACT = {
    phone: '+971501234567',
    whatsappNumber: '+971555343873',
  };
  formData = {
    serviceType: '',
    urgency: '',
    name: '',
    phone: '',
    email: '',
    message: '',
  };

  calculatorData = {
    serviceType: '',
    quantity: '',
    urgency: '',
    additionalServices: '',
  };

  estimatedCost: number | null = null;
  openFAQ: number | null = null;

  private intervalTimer: any;
  private progressTimer: any;
  private statsTimer: any;
  private testimonialTimer: any;
  COMPANY_TRADEMARK = {
    english: 'AL BAYAN TYPING SERVICES',
    arabic: 'البيان لخدمات الطباعة',
    legalForm: {
      english: 'Sole Establishment',
      arabic: 'مؤسسة فردية',
    },
  };

  COMPANY_LICENSE_DETAILS = {
    licenseNumber: '70510',
    registerNumber: '71028',
    acciNumber: '80063',
    issueDate: '2015-01-11',
    expiryDate: '2027-01-02',
    printedDate: '2026-01-06',
  };
  PROPRIETOR_DETAILS = {
    name: {
      arabic: 'حسن عبداهلل شهدهللا مندوس البلوضه',
      english: 'HASSAN ABDULLA SHAHDAD AL MANDOOS ALBLOGSHI',
    },
    role: 'Owner - Proprietor',
    ownershipShare: '100.00%',
    nationality: 'United Arab Emirates (The UAE)',
    passportNumber: 'AA0616182',
  };

  COMPANY_ACTIVITIES = [
    'Administrative Services',
    'Businessmen Services',
    'Typing and Documents Photocopying Services',
    'Commercial Information Services',
  ];

  COMPANY_ADDRESS = {
    shop: 'Shop No. 6, Rashideya 2',
    city: 'Ajman',
    emirate: 'United Arab Emirates',
    area: 'Rashideya 2',
    serviceArea:
      'Serving Dubai, Sharjah, Ajman, Ras Al Khaimah & All UAE Emirates',
  };
  COMPANY_MISSION_VISION = {
    mission:
      'To deliver fast, reliable, and accurate business setup, typing, and documentation solutions across Dubai, Sharjah, Ajman, and all UAE Emirates, simplifying government and legal processes for our clients throughout the United Arab Emirates.',
    vision:
      "To be the UAE's leading businessmen services provider, headquartered in Ajman and recognized across Dubai, Sharjah, and all Emirates for excellence, customer satisfaction, and innovative business solutions.",
  };

  SERVICES_BREAKDOWN = {
    typingServices: [
      'Visa applications (residence, visit, renewal)',
      'Emirates ID application and renewal',
      'Medical fitness typing',
      'Immigration and labor typing',
    ],
    governmentServices: [
      'Tasheel services',
      'Amer and GDRFA services',
      'ICP (Federal Authority for Identity & Citizenship) typing',
      'Economic Department services (Trade License Renewal & Application)',
    ],
    translationServices: [
      'English to Arabic and Arabic to English certified translations',
      'Legal and technical documents',
    ],
    proServices: [
      'Company formation support',
      'Trade license processing',
      'Document attestation and notarization',
    ],
    additionalServices: ['Photocopying, printing, scanning'],
    freezoneServices: [
      'Ajman Freezone license processing',
      'RAK Economic Zone (RAKEZ) license processing',
      'Dubai Freezone license processing',
      'Sharjah Freezone license processing',
    ],

    administrativeServices: [
      'Document management services',
      'Record keeping assistance',
      'Administrative paperwork processing',
      'Office documentation support',
    ],
    commercialInformationServices: [
      'Market research documentation',
      'Commercial data processing',
      'Business information services',
      'Trade documentation support',
    ],
  };

  businessmenServices = [
    {
      title: 'Business Setup Consultation',
      icon: 'bi-building',
      description:
        'Professional guidance for company formation in Ajman, Dubai, Sharjah',
    },
    {
      title: 'Investor Visa Processing',
      icon: 'bi-passport',
      description: 'Complete investor visa solutions for business owners',
    },
    {
      title: 'Commercial Registration',
      icon: 'bi-file-earmark-text',
      description: 'Commercial information services and business registration',
    },
    {
      title: 'Administrative Support',
      icon: 'bi-clipboard-data',
      description: 'Comprehensive administrative services for businesses',
    },
  ];

  freezoneDetailedServices = [
    {
      emirate: 'Ajman',
      zones: ['Ajman Free Zone', 'Ajman Media Free Zone'],
      services: ['License Processing', 'Company Formation', 'Visa Services'],
    },
    {
      emirate: 'Dubai',
      zones: ['DIFC', 'JAFZA', 'DMCC', 'Dubai South', 'Dubai Silicon Oasis'],
      services: ['Business Setup', 'Trade License', 'Office Space Solutions'],
    },
    {
      emirate: 'Sharjah',
      zones: ['SAIF Zone', 'Hamriyah Free Zone', 'Sharjah Airport Free Zone'],
      services: ['Industrial License', 'Commercial License', 'Warehouse Setup'],
    },
    {
      emirate: 'Ras Al Khaimah',
      zones: ['RAKEZ (Ras Al Khaimah Economic Zone)'],
      services: ['Business Formation', 'License Processing', 'Visa Services'],
    },
  ];

  COMPANY_INFO: CompanyInfo = {
    tradeName: {
      english: 'AL BAYAN TYPING SERVICES',
      arabic: 'البيان لخدمات الطباعة',
    },
    legalForm: {
      english: 'Sole Establishment',
      arabic: 'مؤسسة فردية',
    },
    licenseNumber: '70510',
    registerNumber: '71028',
    acciNumber: '80063',
    issueDate: '2015-01-11',
    expiryDate: '2027-01-02',
    owner: 'HASSAN ABDULLA SHAHDAD AL MANDOOS ALBLOGSHI',
    address: 'Shop No. 6, Rashideya 2, Ajman, UAE',
  };

  heroSlides = [
    {
      title: 'AL BAYAN UAE-WIDE BUSINESSMEN SERVICES',
      subtitle:
        'Your Trusted Partner Across Dubai, Sharjah, Ajman & All UAE | Business Setup, Typing, Translation & PRO Services Since 2015',
      image: '/hero1.webp',
      accent: 'BAYAN',
    },
    {
      title: 'DUBAI BUSINESS SETUP EXPERTS',
      subtitle:
        'Mainland & Freezone Company Formation in Dubai, Sharjah, Ajman | DIFC, JAFZA, DMCC, RAKEZ & All UAE Freezones',
      image: '/hero3.webp',
      accent: 'DUBAI',
    },
    {
      title: 'LICENSED AJMAN HEADQUARTERS',
      subtitle: `Based in Ajman, Serving All UAE | License No. ${this.COMPANY_INFO.licenseNumber} | Officially Registered Since 2015`,
      image: '/hero5.webp',
      accent: 'LICENSED',
    },
    {
      title: 'YOUR UAE-WIDE DOCUMENT PARTNER',
      subtitle:
        'Complete Visa, Emirates ID, and Government Services Across Dubai, Sharjah, Ajman, RAK & All Emirates',
      image: '/hero4.webp',
      accent: 'UAE-WIDE',
    },
    {
      title: 'EXCELLENCE ACROSS THE UAE',
      subtitle:
        'Certified Translation and PRO Services in Dubai, Sharjah, Ajman & Beyond Since 2015',
      image: '/hero6.webp',
      accent: 'EXCELLENCE',
    },
  ];

  // REORDERED: Business services first
  services = [
    {
      icon: '🏢',
      title: 'PRO Services',
      description:
        'Professional company formation, trade license processing, and document attestation services for all Emirates.',
    },
    {
      icon: '🏦',
      title: 'Bank Account Opening',
      description:
        'Complete assistance with corporate and personal bank account opening in major UAE banks.',
    },
    {
      icon: '🔄',
      title: 'License Renewals',
      description:
        'Company license renewals for mainland and freezone businesses with Economic Department services.',
    },
    {
      icon: '📋',
      title: 'Document Clearing',
      description:
        'Document clearing services for customs, trade, and government departments across UAE.',
    },
    {
      icon: '📄',
      title: 'Visa Services',
      description:
        'Complete visa typing services including residence, visit, and renewal applications processed efficiently with all Emirates support.',
    },
    {
      icon: '🆔',
      title: 'Emirates ID',
      description:
        'Emirates ID application, renewal, and modification services with quick turnaround times and ICP direct access.',
    },
    {
      icon: '🌐',
      title: 'Translation Services',
      description:
        'Certified English to Arabic and Arabic to English translation for legal, technical, and commercial documents.',
    },
    {
      icon: '✈️',
      title: 'Immigration Services',
      description:
        'Complete immigration and labor typing services with GDRFA, AMER, and Tasheel integration.',
    },
    {
      icon: '🏥',
      title: 'Medical Fitness',
      description:
        'Medical fitness typing and processing for employment and residence permits with approved medical centers.',
    },
    {
      icon: '🎁',
      title: 'Packages & Offers',
      description:
        'Special promotional packages for business setup, visa processing, and bulk document services.',
    },
  ];

  JURISDICTIONS = [
    {
      title: 'UAE Mainland',
      description:
        'Dubai, Sharjah, Ajman Economic Department licenses - Unrestricted UAE market access',
      icon: '🏙️',
      features: [
        'Dubai Mainland Company Setup',
        'Sharjah Economic Department Licenses',
        'Ajman Business Registration',
        'Direct Access to UAE Government Contracts',
        'Greater Business Flexibility Across Emirates',
        'Enhanced Brand Reputation in Dubai & UAE',
      ],
    },
    {
      title: 'UAE Free Zones',
      description:
        'Dubai (DIFC, JAFZA, DMCC), Sharjah (SAIF), Ajman, RAK (RAKEZ) & All UAE Freezones',
      icon: '🌐',
      features: [
        'Dubai Freezone Setup (DIFC, JAFZA, DMCC, Dubai South)',
        'RAKEZ & RAK Freezone Processing',
        'Sharjah SAIF Zone & Hamriyah FZ',
        'Ajman Freezone Company Formation',
        '100% Foreign Ownership',
        'Corporate Tax-Friendly Structure Across UAE',
      ],
    },
  ];
  get yearsOfService(): number {
    return new Date().getFullYear() - 2015;
  }

  BUSINESS_SUPPORT = [
    {
      icon: 'bi-bank2',
      title: 'UAE Bank Account Opening',
      description:
        'Assistance with opening corporate bank accounts in major Dubai, Sharjah, Ajman, and UAE banks',
    },
    {
      icon: 'bi-file-earmark-text',
      title: 'Dubai & UAE Visa Services',
      description:
        'Complete visa processing for Dubai, Sharjah, Ajman - employees, partners, and family members',
    },
    {
      icon: 'bi-clipboard-check',
      title: 'Multi-Emirate Document Clearing',
      description:
        'Clearing documents from Dubai, Sharjah, Ajman customs, municipalities, and government departments',
    },
    {
      icon: 'bi-briefcase',
      title: 'UAE-Wide PRO Services',
      description:
        'Full PRO support for Dubai, Sharjah, Ajman and all UAE government-related transactions',
    },
    {
      icon: 'bi-arrow-repeat',
      title: 'License Renewals (All Emirates)',
      description:
        'Timely renewal of trade licenses for Dubai, Sharjah, Ajman mainland and freezone companies',
    },
  ];

  FREEZONE_BENEFITS = [
    {
      title: 'Company Formation in 1-2 Business Days',
      icon: '⚡',
      description: 'Fast-track setup with minimal paperwork',
    },
    {
      title: 'Easy to Open a Bank Account',
      icon: '💳',
      description: 'Banking support for corporate accounts',
    },
    {
      title: 'Minimal Paperwork',
      icon: '📝',
      description: 'Streamlined documentation process',
    },
    {
      title: '100% Foreign Ownership',
      icon: '🌍',
      description: 'Complete control of your business',
    },
    {
      title: 'Dubai Investor Visa',
      icon: '✈️',
      description: 'Residence visa for investors and partners',
    },
  ];

  FREEZONE_STEPS = [
    {
      number: '1',
      title: 'Select UAE Freezone & Legal Structure',
      description:
        'Choose from Dubai (DIFC, JAFZA, DMCC), Sharjah (SAIF), Ajman FZ, RAKEZ. Select FZ LLC, Establishment, or Branch',
      icon: 'bi-diagram-3',
    },
    {
      number: '2',
      title: 'Reserve Your UAE Trade Name',
      description:
        'Reserve and approve your company name with Dubai, Sharjah, Ajman, or RAK freezone authorities',
      icon: 'bi-pencil-square',
    },
    {
      number: '3',
      title: 'Apply for UAE Business License',
      description:
        'Submit application with required documents for Dubai, Sharjah, Ajman, or other UAE freezone',
      icon: 'bi-file-earmark-text',
    },
    {
      number: '4',
      title: 'Select Office Space in UAE',
      description:
        'Choose flexi-desk, office, or warehouse space in Dubai, Sharjah, Ajman, or other Emirates',
      icon: 'bi-building',
    },
    {
      number: '5',
      title: 'Obtain UAE License',
      description:
        'Receive final approvals from Dubai, Sharjah, Ajman, or RAK authorities and collect your license',
      icon: 'bi-patch-check',
    },
  ];
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
        'Free document consultation',
      ],
      popular: false,
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
        '1 Year PRO support',
      ],
      popular: true,
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
        'Free delivery in Ajman',
      ],
      popular: false,
    },
  ];

  // REORDERED: Business services first, then other services
  // COMPLETE detailedServices ARRAY - All services updated for Dubai/UAE scope

  detailedServices = [
    {
      title: 'Dubai & UAE PRO Services',
      subtitle:
        'Complete business setup across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Comprehensive PRO services for company formation in Dubai mainland, Sharjah Economic Department, Ajman licenses, and all UAE freezones. We handle everything from our Ajman headquarters so you can focus on your Dubai or UAE-wide business.',
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '500+', label: 'UAE Companies Formed' },
        { value: '100%', label: 'Success Rate' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'Dubai mainland company formation (DED)',
        'Sharjah Economic Department licenses',
        'Ajman business registration (local expertise)',
        'RAK and other Emirates mainland setup',
        'All UAE freezone company formation',
        'Trade license application and renewal (all Emirates)',
        'Document attestation across UAE',
        'Ministry approvals in Dubai, Sharjah, Ajman',
      ],
      features: [
        'Dubai, Sharjah, Ajman mainland licenses',
        'Dubai freezones: DIFC, JAFZA, DMCC, Dubai South, Silicon Oasis',
        'Sharjah: SAIF Zone, Hamriyah FZ, Airport FZ',
        'Ajman Freezone (specialized local knowledge)',
        'RAKEZ and RAK freezones',
        'Economic Department services (all Emirates)',
        'UAE Chamber of Commerce registration',
        'Bank account opening assistance across UAE',
      ],
      process: [
        'UAE business setup consultation (Dubai/Sharjah/Ajman focus)',
        'Company name reservation in chosen Emirate',
        'License application and documentation (all UAE)',
        'Government approvals and submissions',
        'License issuance and collection from Ajman HQ',
      ],
    },
    {
      title: 'Dubai Freezone License Processing',
      subtitle: 'Expert Dubai freezone setup from Ajman headquarters',
      description:
        'Professional assistance with Dubai freezone company formation including DIFC, JAFZA, DMCC, Dubai South, Silicon Oasis, and all other UAE freezones. Managed from our Ajman office with deep Dubai market expertise.',
      images: [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '300+', label: 'Dubai FZ Companies' },
        { value: '48hrs', label: 'Dubai Setup Time' },
        { value: '100%', label: 'Foreign Ownership' },
      ],
      benefits: [
        'Dubai DIFC financial services setup',
        'Dubai JAFZA industrial and trading licenses',
        'Dubai DMCC commodity trading setup',
        'Dubai South logistics and aviation',
        'Dubai Silicon Oasis technology companies',
        'Sharjah SAIF Zone processing',
        'Ajman Freezone (local Ajman expertise)',
        'RAKEZ license setup',
        '100% foreign ownership across UAE freezones',
      ],
      features: [
        'Dubai freezone selection consultation',
        'Company name reservation (Dubai/UAE)',
        'Dubai and UAE freezone license application',
        'Office space solutions in Dubai and other Emirates',
        'Visa processing for Dubai and UAE freezones',
        'Bank account assistance (Dubai banks)',
        'Annual renewal services (all UAE freezones)',
      ],
      process: [
        'Dubai/UAE freezone selection consultation',
        'Document preparation (Dubai-compliant)',
        'License application submission to Dubai/UAE authorities',
        'Government approvals tracking',
        'License issuance and delivery from Ajman',
        'Post-setup support for Dubai and UAE operations',
      ],
    },
    {
      title: 'Businessmen Services',
      subtitle:
        'Complete business solutions across Dubai, Sharjah, Ajman & UAE',
      description:
        'Comprehensive services for businessmen establishing companies in Dubai, Sharjah, Ajman, or anywhere in the UAE. Investor visa processing, commercial registration, and complete business support from our Ajman headquarters.',
      images: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '1000+', label: 'UAE Businesses' },
        { value: 'Dubai+', label: 'All Emirates' },
        { value: 'Fast', label: 'Processing' },
      ],
      benefits: [
        'Dubai business setup consultation and market entry',
        'Sharjah and Ajman business registration',
        'Investor visa processing (Dubai, Sharjah, Ajman, UAE)',
        'Commercial registration across all Emirates',
        'Legal documentation for UAE businesses',
        'Government liaison (Dubai, Sharjah, Ajman)',
        'Ongoing UAE-wide business support',
      ],
      features: [
        'Dubai company formation (mainland & freezone)',
        'Sharjah business setup assistance',
        'Ajman local business expertise',
        'UAE investor visa applications (all Emirates)',
        'Commercial registration (Dubai DED, Sharjah, Ajman)',
        'Partner visa processing for UAE businesses',
        'Annual renewal services across Emirates',
      ],
      process: [
        'Initial UAE business consultation (Dubai/Sharjah/Ajman focus)',
        'Document preparation for chosen Emirate',
        'Government approvals (Dubai, Sharjah, Ajman authorities)',
        'License issuance in target Emirate',
        'Post-setup support from Ajman headquarters',
      ],
    },
    {
      title: 'Bank Account Opening',
      subtitle: 'Banking solutions across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Professional assistance with opening corporate and personal bank accounts in major UAE banks including Dubai-based institutions, Sharjah banks, and Ajman branches. Complete banking support from our Ajman office.',
      images: [
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '500+', label: 'UAE Accounts Opened' },
        { value: '20+', label: 'UAE Banks' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'Dubai bank account opening for companies',
        'Sharjah and Ajman bank account services',
        'Corporate accounts for UAE mainland companies',
        'Freezone company accounts (Dubai, Sharjah, Ajman, RAK)',
        'Personal accounts for UAE residents',
        'Priority banking in Dubai and UAE',
        'Online banking setup assistance',
      ],
      features: [
        'Account opening in Dubai, Sharjah, Ajman banks',
        'UAE local and international bank options',
        'Document preparation (Dubai bank requirements)',
        'Bank liaison across all Emirates',
        'Dubai bank appointment coordination',
        'Corporate banking in UAE major banks',
        'Trade finance and LC services (Dubai focus)',
      ],
      process: [
        'UAE bank selection consultation (Dubai/Sharjah/Ajman)',
        'Document checklist and preparation',
        'Bank appointment scheduling in chosen Emirate',
        'Accompanied bank visit (Dubai, Sharjah, or Ajman)',
        'Account activation support',
        'Ongoing UAE banking support from Ajman',
      ],
    },
    {
      title: 'License Renewal Services',
      subtitle: 'License renewals across Dubai, Sharjah, Ajman & all Emirates',
      description:
        'Professional license renewal services for Dubai mainland companies, Sharjah businesses, Ajman firms, and all UAE freezone companies. Timely renewals managed from our Ajman headquarters.',
      images: [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '1000+', label: 'UAE Renewals' },
        { value: 'Zero', label: 'Late Penalties' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'Dubai DED trade license renewal',
        'Sharjah Economic Department renewals',
        'Ajman business license renewal (local expertise)',
        'Dubai freezone license renewals (DIFC, JAFZA, DMCC)',
        'RAKEZ and other UAE freezone renewals',
        'Municipality license renewal (all Emirates)',
        'Chamber of commerce renewal across UAE',
      ],
      features: [
        'Dubai mainland company license renewal',
        'Sharjah business license renewal',
        'Ajman commercial license renewal',
        'All UAE freezone renewals (Dubai, Sharjah, RAK)',
        'Commercial, professional, industrial licenses',
        'Tourism and trading license renewals',
      ],
      process: [
        'License expiry reminder (Dubai/Sharjah/Ajman/UAE)',
        'Document collection for target Emirate',
        'Renewal application submission',
        'Fee payment processing',
        'New license collection from relevant Emirate',
        'Delivery to client or Ajman office',
      ],
    },
    {
      title: 'Document Clearing Services',
      subtitle:
        'Customs and government clearance across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Complete document clearing services for Dubai customs, Sharjah ports, Ajman facilities, and all UAE government departments. We handle all types of import/export documentation and clearance procedures across Emirates.',
      images: [
        'https://images.unsplash.com/photo-1519457431-44ccd64a579b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '2000+', label: 'UAE Clearances' },
        { value: 'Dubai+', label: 'All Ports' },
        { value: '48hrs', label: 'Average Time' },
      ],
      benefits: [
        'Dubai customs clearance (Jebel Ali, DXB Airport)',
        'Sharjah port and airport clearance services',
        'Ajman port clearance (local expertise)',
        'Import/export clearance all UAE ports',
        'Bill of entry/exit processing (all Emirates)',
        'Customs duty calculation and payment UAE-wide',
        'Certificate of origin processing (Dubai, Sharjah, Ajman)',
        'Health and safety certificate clearance across UAE',
      ],
      features: [
        'Dubai customs declaration preparation',
        'Sharjah and Ajman import/export permits',
        'UAE health and agricultural clearance',
        'Phytosanitary certificate processing (all Emirates)',
        'Certificate of origin attestation (Dubai focus)',
        'Customs duty assessment for Dubai, Sharjah, Ajman',
        'Multi-emirate clearance coordination',
      ],
      process: [
        'Document verification for Dubai/Sharjah/Ajman clearance',
        'Customs declaration submission to relevant Emirate',
        'Duty calculation and payment in target port',
        'Physical inspection coordination (if needed)',
        'Clearance certificate issuance',
        'Cargo release and UAE-wide delivery coordination',
      ],
    },
    {
      title: 'Commercial Information Services',
      subtitle:
        'Market research and business intelligence across Dubai, Sharjah, Ajman & UAE',
      description:
        'Professional commercial information services including Dubai market research, Sharjah business intelligence, Ajman commercial data, and UAE-wide analysis. We provide valuable insights for business decision-making across all Emirates.',
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '500+', label: 'UAE Reports' },
        { value: 'Dubai+', label: 'Market Focus' },
        { value: 'Timely', label: 'Delivery' },
      ],
      benefits: [
        'Dubai market research reports and analysis',
        'Sharjah and Ajman business intelligence',
        'UAE-wide commercial data analysis',
        'Dubai industry insights and trends',
        'Competitor analysis across Emirates',
        'Customized reports for UAE businesses',
        'Multi-emirate market comparisons',
      ],
      features: [
        'Dubai market analysis reports',
        'Sharjah and Ajman business feasibility studies',
        'UAE commercial data processing',
        'Dubai industry trend analysis',
        'Competitor intelligence (Dubai, Sharjah, Ajman)',
        'Custom research projects across Emirates',
        'UAE regulatory and compliance updates',
      ],
      process: [
        'Define research requirements (Dubai/Sharjah/Ajman focus)',
        'UAE-wide data collection and analysis',
        'Report preparation with Emirate-specific insights',
        'Client review and feedback',
        'Final report delivery from Ajman headquarters',
      ],
    },
    {
      title: 'Administrative Services',
      subtitle:
        'Complete administrative support across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Professional administrative services for businesses in Dubai, Sharjah, Ajman, and throughout the UAE. Document management, record keeping, and office administration support to streamline your UAE operations from our Ajman headquarters.',
      images: [
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '24/7', label: 'UAE Support' },
        { value: 'Dubai+', label: 'All Emirates' },
        { value: 'Secure', label: 'Handling' },
      ],
      benefits: [
        'Document management for Dubai businesses',
        'Sharjah and Ajman record keeping services',
        'UAE-wide office administration support',
        'Filing system setup for all Emirates',
        'Administrative workflow optimization (Dubai focus)',
        'Process optimization across UAE operations',
        'Confidential document handling UAE-wide',
      ],
      features: [
        'Document organization for Dubai, Sharjah, Ajman offices',
        'UAE business record maintenance',
        'Administrative paperwork processing (all Emirates)',
        'Dubai office documentation support',
        'Process documentation for UAE businesses',
        'Administrative consulting across Emirates',
        'Multi-location coordination (Dubai/Sharjah/Ajman)',
      ],
      process: [
        'Assess UAE business administrative needs',
        'Develop process plan for Dubai/Sharjah/Ajman operations',
        'Implement solutions across Emirates',
        'Training and support from Ajman HQ',
        'Ongoing UAE-wide maintenance and optimization',
      ],
    },
    {
      title: 'Dubai & UAE Packages - Special Offers',
      subtitle: 'Cost-effective bundled services for UAE businesses',
      description:
        'Special promotional packages designed for Dubai, Sharjah, Ajman, and UAE-wide businesses. Complete solutions at discounted rates, perfect for Dubai company formation, UAE visa processing, and bulk service requirements managed from our Ajman headquarters.',
      images: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '50%', label: 'Cost Saving' },
        { value: '200+', label: 'UAE Packages Sold' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'Dubai business setup all-inclusive packages',
        'Sharjah and Ajman company formation bundles',
        'Bulk UAE visa processing discounts',
        'Translation package deals (all Emirates)',
        'Corporate PRO service bundles for Dubai businesses',
        'Annual maintenance packages UAE-wide',
        'New business special offers (Dubai focus)',
      ],
      features: [
        'Dubai business setup with visa package',
        'Sharjah/Ajman corporate banking and PRO bundle',
        'UAE document translation bulk packages',
        'Annual license renewal packages (all Emirates)',
        'Employee visa processing packages (Dubai, Sharjah, Ajman)',
        'Customized service bundles for UAE businesses',
        'Multi-emirate discount packages',
      ],
      process: [
        'Package selection for Dubai/Sharjah/Ajman/UAE needs',
        'Requirement assessment and customized quotation',
        'Package confirmation and payment',
        'Service implementation across Emirates',
        'Regular progress updates from Ajman HQ',
        'Package completion and UAE-wide follow-up',
      ],
    },
    {
      title: 'Visa Processing Services',
      subtitle:
        'Complete visa solutions across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Comprehensive visa services for Dubai, Sharjah, Ajman, and all UAE Emirates. Residence visas, visit visas, employment visas, and renewals processed efficiently from our Ajman headquarters.',
      images: ['/services/visa2.webp', '/services/visaproccesing.webp'],
      stats: [
        { value: '5000+', label: 'UAE Visas Processed' },
        { value: '98%', label: 'Approval Rate' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'Dubai residence visa processing',
        'Sharjah and Ajman visa services',
        'All visa types across UAE Emirates',
        'Visit visas for Dubai and UAE',
        'Employment visa processing (all Emirates)',
        'Visa renewal services UAE-wide',
        'Status change in Dubai, Sharjah, Ajman',
      ],
      features: [
        'New UAE residence visa applications',
        'Dubai visit visa processing',
        'Employment visas (Dubai, Sharjah, Ajman)',
        'Visa renewal across all Emirates',
        'Visa cancellation services (UAE-wide)',
        'Status checking for Dubai and UAE visas',
      ],
      process: [
        'Submit documents (Dubai/Sharjah/Ajman/UAE)',
        'Application preparation for target Emirate',
        'Submission to Dubai, Sharjah, or Ajman immigration',
        'Track UAE visa status',
        'Collect visa from Ajman office or deliver',
      ],
    },
    {
      title: 'Emirates ID Services',
      subtitle:
        'Fast Emirates ID processing across Dubai, Sharjah, Ajman & UAE',
      description:
        'Complete Emirates ID services for residents in Dubai, Sharjah, Ajman, and all UAE. New applications, renewals, and modifications processed from our Ajman headquarters.',
      images: ['/services/emiratedId.webp', '/services/emiratedId2.webp'],
      stats: [
        { value: '10000+', label: 'UAE IDs Processed' },
        { value: '100%', label: 'Accuracy' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'New Emirates ID for Dubai residents',
        'Sharjah and Ajman Emirates ID services',
        'UAE-wide ID renewal services',
        'Lost/damaged ID replacement (all Emirates)',
        'Information modification across UAE',
        'Home delivery in Dubai, Sharjah, Ajman',
      ],
      features: [
        'ICP typing for Dubai, Sharjah, Ajman residents',
        'Biometric appointment booking (all Emirates)',
        'Application tracking across UAE',
        'SMS updates for Dubai and UAE residents',
        'Document verification UAE-wide',
        'Collection assistance from Ajman',
      ],
      process: [
        'Provide documents (Dubai/Sharjah/Ajman resident)',
        'ICP typing and submission',
        'Biometric appointment in your Emirate',
        'Attend biometric session',
        'Receive Emirates ID at address (Dubai/Sharjah/Ajman/UAE)',
      ],
    },
    {
      title: 'Translation Services',
      subtitle: 'Certified translation across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Professional translation services for documents used in Dubai, Sharjah, Ajman, and throughout the UAE. Certified translators ensuring legal compliance across all Emirates.',
      images: ['/services/translation2.webp', '/services/translation.webp'],
      stats: [
        { value: '15000+', label: 'UAE Documents' },
        { value: '100%', label: 'UAE Certified' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'English-Arabic translation for Dubai use',
        'Arabic-English translation for UAE authorities',
        'Certified for Dubai, Sharjah, Ajman courts',
        'Legal document translation (UAE-compliant)',
        'Technical translation for UAE businesses',
        'Same-day service from Ajman for urgent Dubai needs',
      ],
      features: [
        'Educational certificates (Dubai university acceptance)',
        'Commercial documents (UAE business use)',
        'Legal contracts for Dubai, Sharjah, Ajman',
        'Personal documents (all Emirates)',
        'Technical manuals for UAE companies',
        'Medical reports (UAE hospital requirements)',
      ],
      process: [
        'Submit document (Dubai/Sharjah/Ajman use)',
        'Quotation for UAE-certified translation',
        'Translation by certified UAE translator',
        'Quality check and verification',
        'Delivery with UAE certification stamp',
      ],
    },
    {
      title: 'Government Services',
      subtitle:
        'Tasheel, AMER, GDRFA services across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Direct access to UAE government services including Dubai Tasheel, Sharjah AMER centers, Ajman GDRFA, and all Emirates immigration and labor-related transactions. Comprehensive support from our Ajman headquarters.',
      images: [
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '20000+', label: 'UAE Transactions' },
        { value: 'Dubai+', label: 'All Emirates' },
        { value: 'Direct', label: 'Gov Access' },
      ],
      benefits: [
        'Dubai Tasheel typing and services',
        'Sharjah and Ajman AMER center submissions',
        'GDRFA immigration services (all Emirates)',
        'ICP Federal Authority services UAE-wide',
        'Labor department typing (Dubai, Sharjah, Ajman)',
        'Economic Department services across UAE',
        'Multi-emirate government liaison',
      ],
      features: [
        'Entry permit typing (Dubai, Sharjah, Ajman)',
        'Labor contract typing for UAE businesses',
        'Establishment card services (all Emirates)',
        'Immigration fines settlement UAE-wide',
        'Status adjustment in Dubai, Sharjah, Ajman',
        'Deportation clearance across Emirates',
        'Government department coordination',
      ],
      process: [
        'Identify required UAE government service',
        'Document preparation and typing for target Emirate',
        'Submission to Dubai, Sharjah, Ajman, or other authority',
        'Follow-up and status tracking across UAE',
        'Collection and delivery to client or Ajman office',
      ],
    },
    {
      title: 'Medical Fitness Services',
      subtitle:
        'Complete medical fitness processing across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Medical fitness test typing and processing for employment and residence permits in Dubai, Sharjah, Ajman, and all UAE Emirates. Coordinated with approved medical centers across the UAE from our Ajman headquarters.',
      images: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '8000+', label: 'UAE Tests Processed' },
        { value: 'Dubai+', label: 'All Medical Centers' },
        { value: '1-2', label: 'Working Days' },
      ],
      benefits: [
        'Medical fitness typing for Dubai residents',
        'Sharjah and Ajman medical center coordination',
        'All UAE Emirates medical fitness processing',
        'Coordination with approved centers (Dubai, Sharjah, Ajman)',
        'Online application submission UAE-wide',
        'Result tracking and collection across Emirates',
        'Renewal services for all Emirates',
      ],
      features: [
        'Employment medical fitness (Dubai, Sharjah, Ajman)',
        'Residence visa medical for UAE residents',
        'Pre-employment screening across Emirates',
        'Medical test renewal UAE-wide',
        'Occupational health tests (all Emirates)',
        'Result delivery in Dubai, Sharjah, Ajman',
        'Multi-emirate medical coordination',
      ],
      process: [
        'Register for medical fitness test in your Emirate',
        'Attend medical center (Dubai/Sharjah/Ajman)',
        'We type and submit application to relevant authority',
        'Track medical fitness status across UAE',
        'Receive fitness certificate at Ajman office or delivery',
      ],
    },
    {
      title: 'Typing Services',
      subtitle:
        'Professional document typing across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Comprehensive typing services covering all UAE government and legal document requirements for Dubai, Sharjah, Ajman, and all Emirates. Our experienced typists ensure error-free documentation for all your needs across the UAE.',
      images: [
        'https://images.unsplash.com/photo-1545235617-9465d2a55698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '100000+', label: 'UAE Documents Typed' },
        { value: '100%', label: 'Accuracy' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'Dubai government-approved typing formats',
        'Sharjah and Ajman typing services',
        'Expert typists with UAE-wide experience',
        'Fast turnaround time for all Emirates',
        'Error-free documentation across UAE',
        'Confidential handling (Dubai, Sharjah, Ajman)',
        'Affordable pricing UAE-wide',
      ],
      features: [
        'Visa application typing (Dubai, Sharjah, Ajman)',
        'Emirates ID application typing for UAE residents',
        'Medical fitness forms (all Emirates)',
        'Immigration document typing UAE-wide',
        'Labor contract typing for Dubai businesses',
        'General document typing across Emirates',
        'Multi-language typing support',
      ],
      process: [
        'Submit typing requirements (Dubai/Sharjah/Ajman/UAE)',
        'Our typists prepare documents for target Emirate',
        'Quality check and verification',
        'Final review with client',
        'Document delivery or collection from Ajman',
      ],
    },
    {
      title: 'Photocopying & Printing Services',
      subtitle:
        'High-quality document reproduction across Dubai, Sharjah, Ajman & all UAE',
      description:
        'Professional photocopying, printing, and scanning services for all types of documents in Dubai, Sharjah, Ajman, and throughout the UAE. We handle everything from single pages to bulk document processing for UAE businesses with utmost quality.',
      images: [
        'https://images.unsplash.com/photo-1555099962-4199c345e5dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      stats: [
        { value: '500000+', label: 'UAE Pages Processed' },
        { value: 'High', label: 'Quality Print' },
        { value: 'Dubai+', label: 'All Emirates' },
      ],
      benefits: [
        'High-quality color and B/W printing for UAE documents',
        'Fast bulk photocopying for Dubai businesses',
        'Document scanning services (Sharjah, Ajman)',
        'Lamination and binding across Emirates',
        'Confidential document handling UAE-wide',
        'Competitive pricing for all Emirates',
        'Bulk discounts for UAE businesses',
      ],
      features: [
        'Color photocopying for Dubai presentations',
        'Black & white printing UAE-wide',
        'Document scanning for Sharjah, Ajman businesses',
        'Lamination services (all Emirates)',
        'Spiral and hard binding across UAE',
        'Bulk order processing for Dubai companies',
        'Same-day service from Ajman',
      ],
      process: [
        'Submit documents for copying/printing (Dubai/Sharjah/Ajman)',
        'Select paper quality and format',
        'Process documents with quality control',
        'Final quality check',
        'Collection from Ajman office or UAE-wide delivery',
      ],
    },
  ];

  processSteps = [
    {
      icon: 'bi-file-earmark-text',
      number: '01',
      title: 'Submit Documents',
      description:
        'Visit our office or send your documents. We verify all requirements and provide a checklist.',
    },
    {
      icon: 'bi-gear',
      number: '02',
      title: 'Processing & Typing',
      description:
        'Our expert typists prepare and submit your applications to the relevant government departments.',
    },
    {
      icon: 'bi-check-circle',
      number: '03',
      title: 'Approval & Updates',
      description:
        'Track your application status. We provide regular updates via SMS and phone calls.',
    },
    {
      icon: 'bi-box-seam',
      number: '04',
      title: 'Collection & Delivery',
      description:
        'Collect your processed documents from our office or opt for home delivery service.',
    },
  ];

  teamMembers = [
    {
      name: 'Expert Typists',
      role: 'Document Processing',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Experienced typists ensuring accuracy in every document',
    },
    {
      name: 'PRO Specialists',
      role: 'Government Relations',
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description:
        'Government liaison experts handling all official procedures',
    },
    {
      name: 'Certified Translators',
      role: 'Translation Services',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Professional translators with legal certification',
    },
    {
      name: 'Customer Support',
      role: 'Client Relations',
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Dedicated support team for all your inquiries',
    },
  ];

  achievements = [
    {
      icon: 'fas fa-award',
      number: '10+',
      label: 'Years Serving UAE',
      color: '#d4a574',
    },
    {
      icon: 'fas fa-map-marked-alt',
      number: 'Dubai+',
      label: 'All Emirates Coverage',
      color: '#8B7355',
    },
    {
      icon: 'fas fa-users',
      number: '25000+',
      label: 'UAE-Wide Clients',
      color: '#A0826D',
    },
    {
      icon: 'fas fa-building',
      number: '500+',
      label: 'UAE Companies Formed',
      color: '#BC9A6F',
    },
  ];

  projects = [
    {
      category: 'Visa Services',
      title: 'Family Residence Visas',
      description:
        'Successfully processed family residence visas for 200+ families',
      image:
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      category: 'Business Setup',
      title: 'Company Formations',
      description: 'Established 500+ companies in UAE mainland and freezones',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      category: 'Translation',
      title: 'Legal Documents',
      description: 'Translated and certified over 15,000 legal documents',
      image:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      category: 'Emirates ID',
      title: 'ID Renewals',
      description: 'Processed 10,000+ Emirates ID applications and renewals',
      image:
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      category: 'PRO Services',
      title: 'License Processing',
      description: 'Handled complete PRO services for 1000+ businesses',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      category: 'Medical Services',
      title: 'Medical Fitness',
      description: 'Coordinated 8000+ medical fitness tests and certifications',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  testimonials = [
    {
      name: 'Ahmed Al Mansoori',
      location: 'Ajman',
      rating: 5,
      text: 'Al Bayan Typing Services made my visa renewal process incredibly smooth. Professional, fast, and accurate. Highly recommended for all government services!',
      project: 'Residence Visa Renewal',
    },
    {
      name: 'Sarah Johnson',
      location: 'Dubai',
      rating: 5,
      text: 'Excellent translation services! They translated all my educational certificates quickly and professionally. The certified translations were accepted everywhere.',
      project: 'Document Translation',
    },
    {
      name: 'Mohammed Rahman',
      location: 'Sharjah',
      rating: 5,
      text: 'Best PRO services in Ajman. They helped me set up my company and handled all the paperwork efficiently. Very knowledgeable team!',
      project: 'Company Formation',
    },
    {
      name: 'Fatima Al Ali',
      location: 'Ajman',
      rating: 5,
      text: 'Very professional service for Emirates ID renewal. They kept me updated throughout the process. Received my ID within a week!',
      project: 'Emirates ID Renewal',
    },
    {
      name: 'David Chen',
      location: 'Ajman',
      rating: 5,
      text: 'Fantastic service! Processed my family visit visa in just 2 days. The staff is friendly and very helpful. Will definitely use their services again.',
      project: 'Visit Visa',
    },
  ];

  beforeAfterProjects = [
    {
      title: 'Complete Document Processing',
      location: 'Ajman',
      before: '/traditional.png',
      after: '/modern.png',
      description:
        'Transformed from manual paper-based processing to fully digital document management system.',
    },
    {
      title: 'Brand Evolution & Service Expansion',
      location: 'Ajman',
      before: '/albayanbefore.png',
      after: '/albayanafter.png',
      description:
        'Our establishments previous name was Al Bayan Typing Service. It had been that way for many years, and we recently converted it to Al Bayan Businessmen Services.',
    },
  ];

  galleryImages = [
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ];
  faqs = [
    {
      question: 'Do you provide services in Dubai and other Emirates?',
      answer:
        'Yes! While our headquarters is in Ajman, we provide complete business setup, visa processing, translation, and PRO services across all UAE Emirates including Dubai, Sharjah, Ras Al Khaimah, and beyond. We specialize in Dubai mainland and freezone company formation.',
    },
    {
      question: 'Can you help with Dubai freezone company formation?',
      answer:
        'Absolutely! We process Dubai freezone licenses for DIFC, JAFZA, DMCC, Dubai South, Silicon Oasis, and all other UAE freezones including Sharjah SAIF Zone, Ajman Freezone, and RAKEZ. We handle the complete process from our Ajman headquarters.',
    },
    {
      question: 'What mainland jurisdictions do you cover?',
      answer:
        'We process mainland licenses for Dubai (DED), Sharjah Economic Department, Ajman Economic Department, and all other UAE Emirates with complete PRO support. We have specialized expertise in Dubai business setup.',
    },
    {
      question: 'Where is your office located and which areas do you serve?',
      answer:
        'Our headquarters is located in Ajman at Shop No. 6, Rashideya 2. From here, we serve clients across the entire UAE including Dubai, Sharjah, Ajman, Ras Al Khaimah, and all Emirates for business setup, visa processing, and documentation services.',
    },
    {
      question: 'Do you assist with bank account opening in Dubai?',
      answer:
        'Yes, we provide complete assistance with opening corporate and personal bank accounts in major UAE banks including Dubai-based banks, Sharjah banks, and Ajman branches. We support both mainland and freezone companies across all Emirates.',
    },
    {
      question: 'What are your UAE business setup packages?',
      answer:
        'We offer special packages for Dubai mainland setup, Dubai freezone formation, Sharjah business registration, Ajman company setup, and other UAE Emirates. Our packages include complete business setup, visa processing, and PRO services. Contact us for Dubai-specific pricing.',
    },
    {
      question: 'How long does Dubai company formation take?',
      answer:
        'Dubai freezone company formation typically takes 1-2 business days. Dubai mainland company setup through DED takes 2-3 weeks. Sharjah and Ajman mainland licenses have similar timelines. We provide express services for urgent Dubai business setup needs.',
    },
    {
      question: 'What is your license information?',
      answer: `We are officially licensed in Ajman (License No. ${this.COMPANY_INFO.licenseNumber}, Register No. ${this.COMPANY_INFO.registerNumber}) and have been serving the UAE including Dubai, Sharjah, and all Emirates since 2015.`,
    },
  ];

  // Updated Team Expertise
  expertise = [
    {
      icon: '🏙️',
      title: 'Dubai Market Specialists',
      description:
        'Deep expertise in Dubai mainland and freezone business setup, with knowledge of all UAE Emirates',
    },
    {
      icon: '🎓',
      title: 'UAE Certified Professionals',
      description:
        'All staff certified and trained in UAE government procedures across Dubai, Sharjah, Ajman, and other Emirates',
    },
    {
      icon: '⏰',
      title: 'Fast UAE-Wide Processing',
      description:
        'Quick processing for Dubai, Sharjah, Ajman services with express options available across all Emirates',
    },
    {
      icon: '💼',
      title: 'Complete UAE Solutions',
      description:
        'One-stop shop for Dubai business setup, Sharjah licenses, Ajman services, and all UAE typing, translation, PRO needs',
    },
  ];

  specialFeatures = [
    {
      icon: 'bi-chat-dots',
      title: 'SMS Updates',
      description:
        'Receive real-time SMS notifications on your application status and progress',
    },
    {
      icon: 'bi-lightning-charge',
      title: 'Express Services',
      description:
        'Urgent processing available for time-sensitive visa and document requirements',
    },
    {
      icon: 'bi-shield-lock',
      title: 'Secure Processing',
      description:
        'All documents handled with utmost confidentiality and secure storage systems',
    },
    {
      icon: 'bi-patch-check',
      title: 'Quality Guarantee',
      description:
        '100% accuracy guarantee on all typing and translation services',
    },
    {
      icon: 'bi-truck',
      title: 'Home Delivery',
      description:
        'Document collection and delivery service available within Ajman emirate',
    },
    {
      icon: 'bi-currency-dollar',
      title: 'Transparent Pricing',
      description:
        'Clear pricing with no hidden fees. Get detailed quotations upfront',
    },
    {
      icon: 'bi-translate',
      title: 'Multi-Language Support',
      description:
        'Staff fluent in Arabic, English, Hindi, and Urdu for better communication',
    },
    {
      icon: 'bi-headset',
      title: '24/7 Support',
      description:
        'Emergency contact available for urgent queries and time-sensitive matters',
    },
  ];

  uniqueServices = [
    {
      image:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Dubai & UAE Government Access',
      description:
        'Direct access to Dubai DED, Sharjah Economic Dept, Ajman authorities, plus Tasheel, AMER, GDRFA, and ICP systems across all UAE Emirates.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Free UAE Business Consultation',
      description:
        'Expert advice on Dubai business setup, Sharjah company formation, Ajman licenses, visa requirements, and documentation across all Emirates at no charge.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'UAE-Wide Lifetime Support',
      description:
        'Ongoing assistance for all Dubai, Sharjah, Ajman, and UAE documents processed through our Ajman center, even years later.',
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) {
      return;
    }

    this.isComponentReady = true;

    setTimeout(() => {
      this.initializeAOS();
      this.setupScrollAnimation();
      this.isLoading = false;
      this.cdRef.detectChanges();
    }, 100);
  }

  private setupScrollAnimation() {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      setTimeout(() => {
        this.animateStats();
      }, 1000);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.statsAnimationRun) {
            this.statsAnimationRun = true;
            this.animateStats();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3,
      },
    );

    setTimeout(() => {
      const statsElement =
        this.elementRef.nativeElement.querySelector('#stats');
      if (statsElement) {
        observer.observe(statsElement);
      } else {
        setTimeout(() => {
          this.animateStats();
        }, 1000);
      }
    }, 100);
  }
  ngOnInit() {
    if (!this.isBrowser) {
      return;
    }

    if (typeof window !== 'undefined') {
      this.handleScroll();
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    this.intervalTimer = setInterval(() => {
      this.nextSlide();
    }, 5000);

    this.progressTimer = setInterval(() => {
      this.progressWidth =
        this.progressWidth >= 100 ? 0 : this.progressWidth + 2;
    }, 100);

    this.testimonialTimer = setInterval(() => {
      this.currentTestimonial =
        (this.currentTestimonial + 1) % this.testimonials.length;
    }, 6000);
  }

  ngOnDestroy() {
    if (this.isBrowser && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    if (this.intervalTimer) clearInterval(this.intervalTimer);
    if (this.progressTimer) clearInterval(this.progressTimer);
    if (this.statsTimer) clearTimeout(this.statsTimer);
    if (this.testimonialTimer) clearInterval(this.testimonialTimer);
  }

  private initializeAOS() {
    if (!this.isBrowser || this.aosInitialized) {
      return;
    }

    try {
      AOS.init({
        disable: false,
        startEvent: 'DOMContentLoaded',
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        useClassNames: false,
        disableMutationObserver: false,
        debounceDelay: 50,
        throttleDelay: 99,
        offset: 120,
        delay: 0,
        duration: 800,
        easing: 'ease-in-out-cubic',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
      });

      this.aosInitialized = true;

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          AOS.refresh();
        }, 500);

        let resizeTimeout: any;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            if (this.aosInitialized) {
              AOS.refresh();
            }
          }, 250);
        });

        window.addEventListener(
          'load',
          () => {
            setTimeout(() => {
              if (this.aosInitialized) {
                AOS.refresh();
              }
            }, 300);
          },
          { once: true },
        );
      }
    } catch (error) {
      console.error('AOS initialization error:', error);
    }
  }
  @HostListener('window:scroll', [])
  handleScroll() {
    if (this.isBrowser && typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 50;
      this.showScrollTop = window.scrollY > 300;
    }
  }

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
      { value: 100, label: 'Success Rate' },
    ];

    let progress = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      this.statsData = targets.map((target, index) => {
        const delay = index * 200;
        const adjustedProgress = Math.max(
          0,
          (elapsed - delay) / (duration - delay),
        );
        const easedProgress =
          1 - Math.pow(1 - Math.min(adjustedProgress, 1), 4);

        return {
          value: Math.floor(target.value * easedProgress),
          label: target.label,
        };
      });

      this.cdRef.detectChanges();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.statsData = targets;
        this.cdRef.detectChanges();
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
      message: '',
    };
  }

  calculateCost(e: Event) {
    e.preventDefault();

    const baseRates: { [key: string]: number } = {
      'visa-residence': 500,
      'visa-visit': 300,
      'emirates-id': 200,
      translation: 50,
      'pro-services': 1000,
      'medical-fitness': 150,
    };

    const urgencyMultiplier: { [key: string]: number } = {
      standard: 1,
      express: 1.5,
      urgent: 2,
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
    this.currentProjectIndex =
      (this.currentProjectIndex + 1) % this.projects.length;
  }

  prevProject() {
    this.currentProjectIndex =
      this.currentProjectIndex === 0
        ? this.projects.length - 1
        : this.currentProjectIndex - 1;
  }

  getVisibleProjects() {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(
        this.projects[(this.currentProjectIndex + i) % this.projects.length],
      );
    }
    return visible;
  }

  handleSliderChange(index: number, event: any) {
    this.beforeAfterSliders = {
      ...this.beforeAfterSliders,
      [index]: parseInt(event.target.value),
    };
  }

  isToday(day: string): boolean {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const today = new Date().getDay();
    return days[today] === day.toLowerCase();
  }
}
