import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
 
  // Company Information
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
    'Commercial Information Services'
  ];

  COMPANY_ADDRESS = {
    shop: 'Shop No. 6, Rashideya 2',
    city: 'Ajman',
    emirate: 'United Arab Emirates'
  };

  COMPANY_MISSION_VISION = {
    mission: 'To deliver fast, reliable, and accurate typing and documentation solutions that simplify government and legal processes for our clients.',
    vision: 'To be Ajman\'s leading typing center known for excellence, customer satisfaction, and innovative document solutions.'
  };

  achievements = [
    {
      icon: 'fas fa-award',
      number: '10+',
      label: 'Years Experience',
      color: '#d4a574',
    },
    {
      icon: 'fas fa-users',
      number: '25000+',
      label: 'Happy Clients',
      color: '#8B7355',
    },
    {
      icon: 'fas fa-check-circle',
      number: '50000+',
      label: 'Documents Processed',
      color: '#A0826D',
    },
    {
      icon: 'fas fa-shield-alt',
      number: '100%',
      label: 'Confidential',
      color: '#BC9A6F',
    },
  ];

  teamMembers = [
    {
      name: 'Expert Typists',
      role: 'Document Processing',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Experienced typists ensuring accuracy in every document',
    },
    {
      name: 'PRO Specialists',
      role: 'Government Relations',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Government liaison experts handling all official procedures',
    },
    {
      name: 'Certified Translators',
      role: 'Translation Services',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Professional translators with legal certification',
    },
    {
      name: 'Customer Support',
      role: 'Client Relations',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Dedicated support team for all your inquiries',
    },
  ];

  get yearsOfService(): number {
    return new Date().getFullYear() - 2015;
  }

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }
}
