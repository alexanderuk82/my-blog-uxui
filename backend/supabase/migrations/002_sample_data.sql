-- Insert sample data for testing Supabase connection
-- This script adds sample blog posts to the database

-- First, let's create a test user profile
INSERT INTO profiles (id, firebase_uid, email, display_name, avatar_url, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test-user-1', 'alex@example.com', 'Alex Bennett', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'test-user-2', 'maria@example.com', 'Maria Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'test-user-3', 'david@example.com', 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop', NOW(), NOW())
ON CONFLICT (firebase_uid) DO NOTHING;

-- Create some sample categories
INSERT INTO categories (id, name, slug, description, type, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'UI Design', 'ui-design', 'Articles about user interface design', 'blog', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Development', 'development', 'Articles about web development', 'blog', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'Design Systems', 'design-systems', 'Articles about design systems', 'blog', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO posts (id, title, slug, excerpt, content, featured_image, author_id, published, published_at, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'The Rise of Component-Driven Development',
    'rise-of-component-driven-development',
    'How component-driven development is changing the frontend landscape',
    '# The Rise of Component-Driven Development

Component-driven development has revolutionized how we build user interfaces. By breaking down complex UIs into smaller, reusable components, developers can create more maintainable and scalable applications.

## Benefits of Component-Driven Development

1. **Reusability**: Components can be reused across different parts of an application.
2. **Maintainability**: Smaller components are easier to test and maintain.
3. **Collaboration**: Designers and developers can work on the same components simultaneously.
4. **Consistency**: Using a component library ensures UI consistency throughout the application.

## Popular Component Libraries

- React: Material UI, Chakra UI, Ant Design
- Vue: Vuetify, Quasar
- Angular: Angular Material, NG-Bootstrap

Component-driven development continues to evolve, with tools like Storybook making it easier to document and test components in isolation.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop',
    '00000000-0000-0000-0000-000000000001',
    TRUE,
    '2024-05-15 12:00:00',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Building Design Systems That Scale',
    'building-design-systems-that-scale',
    'Lessons learned from creating design systems for enterprise applications',
    '# Building Design Systems That Scale

Design systems have become essential for organizations looking to maintain consistency across their digital products. But creating a design system that can scale with your organization presents unique challenges.

## Key Components of a Scalable Design System

1. **Design Tokens**: The foundational elements like colors, typography, and spacing.
2. **Component Library**: A collection of reusable UI components.
3. **Pattern Library**: Common UI patterns that solve specific user problems.
4. **Documentation**: Comprehensive guidelines on how to use the design system.

## Challenges and Solutions

### Challenge: Adoption
**Solution**: Involve stakeholders early and demonstrate the value of the design system.

### Challenge: Maintenance
**Solution**: Establish a dedicated team responsible for maintaining and evolving the design system.

### Challenge: Versioning
**Solution**: Implement semantic versioning to manage changes and updates.

A well-implemented design system can significantly improve development efficiency and product consistency.',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1470&auto=format&fit=crop',
    '00000000-0000-0000-0000-000000000002',
    TRUE,
    '2024-05-08 10:30:00',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'The Psychology of UI Design',
    'psychology-of-ui-design',
    'Understanding how users interact with interfaces',
    '# The Psychology of UI Design

User interface design is as much about psychology as it is about aesthetics. Understanding how users think and behave is crucial for creating intuitive and effective interfaces.

## Psychological Principles in UI Design

### 1. Hicks Law
The time it takes to make a decision increases with the number and complexity of choices. This is why simplifying interfaces and reducing options can improve user experience.

### 2. Millers Law
The average person can only keep 7 (plus or minus 2) items in their working memory. This principle guides how we organize and present information.

### 3. Gestalt Principles
These principles explain how humans perceive visual elements:
- Proximity
- Similarity
- Continuity
- Closure
- Figure/Ground

### 4. Color Psychology
Colors evoke different emotions and associations:
- Blue: Trust, security
- Green: Growth, health
- Red: Urgency, importance
- Yellow: Optimism, clarity

By applying these psychological principles, designers can create interfaces that feel natural and intuitive to users.',
    'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?q=80&w=1470&auto=format&fit=crop',
    '00000000-0000-0000-0000-000000000003',
    TRUE,
    '2024-04-30 14:15:00',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Performance Optimization for Web Components',
    'performance-optimization-web-components',
    'Techniques to ensure your components load and render quickly',
    '# Performance Optimization for Web Components

As web applications become more complex, optimizing component performance becomes increasingly important. Slow-loading components can significantly impact user experience and conversion rates.

## Key Performance Metrics

1. **First Contentful Paint (FCP)**: Time until the first content is rendered.
2. **Largest Contentful Paint (LCP)**: Time until the largest content element is rendered.
3. **Time to Interactive (TTI)**: Time until the page becomes fully interactive.
4. **Total Blocking Time (TBT)**: Total time the main thread is blocked.

## Optimization Techniques

### Code Splitting
Break your application into smaller chunks that can be loaded on demand.

```javascript
// Example using React.lazy
const LazyComponent = React.lazy(() => import(./LazyComponent));
```

### Tree Shaking
Eliminate dead code to reduce bundle size.

### Memoization
Prevent unnecessary re-renders using memoization techniques.

```javascript
// Example using React.memo
const MemoizedComponent = React.memo(MyComponent);
```

### Image Optimization
Optimize images and use modern formats like WebP.

### Lazy Loading
Load components and resources only when they are needed.

Implementing these techniques can significantly improve the performance of your web components and enhance user experience.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop',
    '00000000-0000-0000-0000-000000000001',
    TRUE,
    '2024-04-22 09:45:00',
    NOW(),
    NOW()
  );

-- Link posts to categories
INSERT INTO posts_categories (post_id, category_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002');

-- Add some sample comments
INSERT INTO comments (id, post_id, author_id, content, is_approved, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Great article! I''ve been using component-driven development for a while now and it''s definitely improved my workflow.', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'I''d love to see more examples of how to implement this in larger projects.', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'This is exactly what I needed for my current project. Thanks for sharing!', TRUE, NOW(), NOW());
