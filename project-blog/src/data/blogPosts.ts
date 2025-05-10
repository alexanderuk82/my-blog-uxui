import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Rise of Component-Driven Development',
    date: 'May 15, 2024',
    readTime: '6 min',
    excerpt: 'How component-driven development is changing the frontend landscape',
    slug: 'rise-of-component-driven-development',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop',
    author: {
      name: 'Alex Bennett',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop'
    }
  },
  {
    id: 2,
    title: 'Building Design Systems That Scale',
    date: 'May 8, 2024',
    readTime: '8 min',
    excerpt: 'Lessons learned from creating design systems for enterprise applications',
    slug: 'building-design-systems-that-scale',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1470&auto=format&fit=crop',
    author: {
      name: 'Maria Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop'
    }
  },
  {
    id: 3,
    title: 'The Psychology of UI Design',
    date: 'Apr 30, 2024',
    readTime: '5 min',
    excerpt: 'Understanding how users interact with interfaces',
    slug: 'psychology-of-ui-design',
    image: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?q=80&w=1470&auto=format&fit=crop',
    author: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop'
    }
  },
  {
    id: 4,
    title: 'Performance Optimization for Web Components',
    date: 'Apr 22, 2024',
    readTime: '9 min',
    excerpt: 'Techniques to ensure your components load and render quickly',
    slug: 'performance-optimization-web-components',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop',
    author: {
      name: 'Sophie Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522&auto=format&fit=crop'
    }
  },
  {
    id: 5,
    title: 'The Future of Micro-Frontends',
    date: 'Apr 15, 2024',
    readTime: '7 min',
    excerpt: 'How micro-frontends are changing the way we build applications',
    slug: 'future-of-micro-frontends',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1528&auto=format&fit=crop',
    author: {
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop'
    }
  },
];