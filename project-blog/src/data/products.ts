import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: "Modern Dashboard UI Kit",
    description: "A comprehensive dashboard UI kit with modular components",
    price: 129.99,
    currency: 'gbp',
    image_url: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    tags: ["Dashboard", "React", "Tailwind"],
    is_free: false,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: "E-commerce Product Cards",
    description: "Beautifully designed product cards for your shop",
    price: 49.99,
    currency: 'gbp',
    image_url: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    tags: ["E-commerce", "Cards", "UI"],
    is_free: false,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: "Authentication Flow Kit",
    description: "Complete authentication flow with form validation",
    price: 79.99,
    currency: 'gbp',
    image_url: "https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    tags: ["Auth", "Forms", "Security"],
    is_free: false,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: "Analytics Dashboard Components",
    description: "Data visualization and analytics components",
    price: 99.99,
    currency: 'gbp',
    image_url: "https://images.pexels.com/photos/7947941/pexels-photo-7947941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    tags: ["Analytics", "Charts", "Dashboard"],
    is_free: false,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: "Mobile Navigation System",
    description: "Responsive mobile navigation with animations",
    price: 59.99,
    currency: 'gbp',
    image_url: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    tags: ["Mobile", "Navigation", "Responsive"],
    is_free: false,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: "Form Component Library",
    description: "Accessible and customizable form components",
    price: 69.99,
    currency: 'gbp',
    image_url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    tags: ["Forms", "Accessibility", "Components"],
    is_free: false,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];