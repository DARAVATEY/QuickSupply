
import { Supplier, Industry } from '../types';

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Phnom Penh Textile Co., Ltd.',
    industry: Industry.GarmentTextile,
    category: 'Outerwear',
    location: 'Phnom Penh',
    rating: 4.8,
    description: 'Leading manufacturer of high-quality jackets and sportswear for global brands. ISO 9001 certified. We operate state-of-the-art sewing lines and utilize advanced bonding technologies.',
    establishedYear: 2005,
    employeeCount: '2,500+',
    factorySize: '15,000 sqm',
    exportMarkets: ['USA', 'EU', 'Japan'],
    businessType: 'Manufacturer',
    productionCapacity: '150,000 units/month',
    products: [
      {
        id: 'p1',
        // Added supplier_id to satisfy Product type requirements
        supplier_id: '1',
        name: 'Technical Raincoat',
        description: 'Triple-layer waterproof tech-fabric with taped seams. Optimized for heavy rain and high durability.',
        price: '$15.00',
        moq: '500 units',
        category: 'Outerwear',
        images: [
          'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        id: 'p2',
        // Added supplier_id to satisfy Product type requirements
        supplier_id: '1',
        name: 'Insulated Ski Jacket',
        description: 'Sub-zero performance insulation with high breathability. Used by major Nordic sportswear brands.',
        price: '$28.00',
        moq: '300 units',
        category: 'Outerwear',
        images: [
          'https://images.unsplash.com/photo-1521791136064-7986c2959663?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1558444479-2748af58b62c?q=80&w=800&auto=format&fit=crop'
        ]
      }
    ],
    certifications: ['ISO 9001', 'OEKO-TEX'],
    contactEmail: 'sales@pptextile.kh',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Angkor Organic Cashews',
    industry: Industry.Agriculture,
    category: 'Nuts & Seeds',
    location: 'Kampong Thom',
    rating: 4.9,
    description: 'Specializing in premium organic cashews harvested from sustainable farms across Cambodia. Our processing facility follows strict international organic standards.',
    establishedYear: 2012,
    employeeCount: '150+',
    factorySize: '5,000 sqm',
    exportMarkets: ['EU', 'South Korea', 'China'],
    businessType: 'Agricultural Cooperative',
    productionCapacity: '500 MT/annum',
    products: [
      {
        id: 'p3',
        // Added supplier_id to satisfy Product type requirements
        supplier_id: '2',
        name: 'Roasted Cashews',
        description: 'Honey-roasted premium grade kernels. Vacuum packed for maximum freshness retention.',
        price: '$8.50 / kg',
        moq: '100 kg',
        category: 'Nuts',
        images: [
          'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        id: 'p4',
        // Added supplier_id to satisfy Product type requirements
        supplier_id: '2',
        name: 'Raw Cashew Kernels',
        description: 'Unprocessed WW320 grade cashews. Perfect for further processing or natural snack brands.',
        price: '$7.20 / kg',
        moq: '500 kg',
        category: 'Nuts',
        images: [
          'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop'
        ]
      }
    ],
    certifications: ['USDA Organic', 'EU Organic'],
    contactEmail: 'info@angkororganic.com',
    imageUrl: 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Mekong Craft Collective',
    industry: Industry.Handicrafts,
    category: 'Home Decor',
    location: 'Siem Reap',
    rating: 4.7,
    description: 'A social enterprise connecting rural artisans with international buyers. Unique hand-woven products that celebrate Cambodian heritage.',
    establishedYear: 2018,
    employeeCount: '300 Artisans',
    factorySize: 'N/A (Decentralized)',
    exportMarkets: ['Global (DTC)', 'EU Boutique Stores'],
    businessType: 'Social Enterprise',
    productionCapacity: '5,000 pieces/month',
    products: [
      {
        id: 'p5',
        // Added supplier_id to satisfy Product type requirements
        supplier_id: '3',
        name: 'Hand-woven Silk Scarf',
        description: 'Traditional Ikat weaving technique. 100% natural mulberry silk from Banteay Meanchey.',
        price: '$14.00',
        moq: '50 units',
        category: 'Textiles',
        images: [
          'https://images.unsplash.com/photo-1616489953149-80802f0a174c?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=800&auto=format&fit=crop'
        ]
      }
    ],
    certifications: ['Fair Trade Certified'],
    contactEmail: 'contact@mekongcrafts.org',
    imageUrl: 'https://images.unsplash.com/photo-1616489953149-80802f0a174c?q=80&w=800&auto=format&fit=crop'
  }
];
