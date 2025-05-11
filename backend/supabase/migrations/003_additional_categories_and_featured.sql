-- Add more categories and update posts for featured and popular content
-- This script extends the sample data with additional categories and marks posts as featured

-- Add more categories
INSERT INTO categories (id, name, slug, description, type, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000004', 'UX Research', 'ux-research', 'Articles about user experience research and methodologies', 'blog', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'React', 'react', 'Articles about React framework and ecosystem', 'blog', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000006', 'Tailwind CSS', 'tailwind-css', 'Articles about Tailwind CSS framework', 'blog', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000007', 'Accessibility', 'accessibility', 'Articles about web accessibility and inclusive design', 'blog', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000008', 'Frontend', 'frontend', 'Articles about frontend development', 'blog', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Add additional category relationships to existing posts
INSERT INTO posts_categories (post_id, category_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005'), -- React
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008'), -- Frontend
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'), -- UI Design
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004'), -- UX Research
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005'), -- React
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006')  -- Tailwind CSS
ON CONFLICT DO NOTHING;

-- Add featured flag to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Mark some posts as featured
UPDATE posts
SET featured = TRUE
WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000003'
);

-- Add view counts to simulate popular posts
UPDATE posts
SET views = 156
WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE posts
SET views = 243
WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE posts
SET views = 189
WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE posts
SET views = 78
WHERE id = '00000000-0000-0000-0000-000000000004';

-- Add a few more posts for better testing
INSERT INTO posts (id, title, slug, excerpt, content, featured_image, author_id, published, published_at, featured, views, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000005',
    'Accessibility Best Practices for Web Developers',
    'accessibility-best-practices',
    'How to make your web applications more accessible to all users',
    '# Accessibility Best Practices for Web Developers

Creating accessible web applications is not just a legal requirement in many countries, but also a moral imperative. By making your applications accessible, you ensure that people with disabilities can use them effectively.

## WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide a framework for making web content accessible. The guidelines are organized around four principles:

1. **Perceivable**: Information must be presentable to users in ways they can perceive.
2. **Operable**: User interface components must be operable.
3. **Understandable**: Information and operation must be understandable.
4. **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents.

## Practical Implementation Tips

### Semantic HTML
Use appropriate HTML elements for their intended purpose.

```html
<!-- Bad -->
<div class="button" onclick="submit()">Submit</div>

<!-- Good -->
<button type="submit">Submit</button>
```

### Keyboard Navigation
Ensure all interactive elements are keyboard accessible.

### Color Contrast
Maintain sufficient color contrast between text and background.

### Alternative Text
Provide alternative text for images.

```html
<img src="chart.png" alt="Bar chart showing sales data for Q1 2025" />
```

### ARIA Attributes
Use ARIA attributes when necessary to enhance accessibility.

By implementing these best practices, you can make your web applications more inclusive and accessible to all users.',
    'https://images.unsplash.com/photo-1584697964358-3e14ca57658b?q=80&w=1470&auto=format&fit=crop',
    '00000000-0000-0000-0000-000000000002',
    TRUE,
    '2024-05-01 11:20:00',
    TRUE,
    112,
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    'Mastering Tailwind CSS: Advanced Techniques',
    'mastering-tailwind-css-advanced-techniques',
    'Take your Tailwind CSS skills to the next level with these advanced techniques',
    '# Mastering Tailwind CSS: Advanced Techniques

Tailwind CSS has revolutionized the way we approach styling in web development. While its utility-first approach is easy to get started with, there are many advanced techniques that can help you build more sophisticated interfaces.

## Custom Configuration

Tailwind''s configuration file allows you to customize every aspect of the framework.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4da6ff",
          DEFAULT: "#0066cc",
          dark: "#004d99",
        },
      },
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
    },
  },
  plugins: [],
};
```

## Creating Custom Plugins

Plugins allow you to add your own utilities, components, and base styles.

```javascript
// Example plugin
const plugin = require("tailwindcss/plugin");

module.exports = {
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-sm": {
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
        },
        ".text-shadow": {
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        },
        ".text-shadow-lg": {
          textShadow: "4px 4px 8px rgba(0, 0, 0, 0.3)",
        },
      };
      
      addUtilities(newUtilities);
    }),
  ],
};
```

## Using @apply for Component Extraction

When you find yourself repeating the same utility combinations, use @apply to extract them.

```css
/* Before */
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Button
</button>

/* After */
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}
```

## Responsive Design with Tailwind

Tailwind makes responsive design straightforward with its mobile-first approach.

```html
<div class="text-sm md:text-base lg:text-lg">
  Responsive text that changes size at different breakpoints
</div>
```

By mastering these advanced techniques, you can leverage the full power of Tailwind CSS in your projects.',
    'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?q=80&w=1470&auto=format&fit=crop',
    '00000000-0000-0000-0000-000000000001',
    TRUE,
    '2024-04-25 16:40:00',
    FALSE,
    198,
    NOW(),
    NOW()
  );

-- Link new posts to categories
INSERT INTO posts_categories (post_id, category_id)
VALUES
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007'), -- Accessibility
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008'), -- Frontend
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006'), -- Tailwind CSS
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000008')  -- Frontend
ON CONFLICT DO NOTHING;
