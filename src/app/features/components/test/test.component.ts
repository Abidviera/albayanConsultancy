// albayan-landing-page.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
interface Jurisdiction {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface BusinessSupport {
  icon: string;
  title: string;
  description: string;
}

interface FreezoneBenefit {
  title: string;
  icon: string;
  description: string;
}

interface FreezoneStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  // Company Legal Information
  COMPANY_INFO = {
    tradeName: {
      english: 'AL BAYAN TYPING SERVICES',
    },
    licenseNumber: '70510',
    registerNumber: '71028',
    acciNumber: '80063',
  };

  // Jurisdictions
  JURISDICTIONS: Jurisdiction[] = [
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

  // Business Support Services
  BUSINESS_SUPPORT: BusinessSupport[] = [
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
  FREEZONE_BENEFITS: FreezoneBenefit[] = [
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
  FREEZONE_STEPS: FreezoneStep[] = [
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

  // Computed property
  get yearsOfService(): number {
    return new Date().getFullYear() - 2015;
  }
}