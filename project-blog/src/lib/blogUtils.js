/**
 * Blog utilities and helpers
 */

export const blogCategories = [
  { 
    name: 'Challenges', 
    count: 10, 
    color: 'bg-blue-100 text-blue-800',
    darkColor: 'dark:bg-blue-900/20 dark:text-blue-300',
    icon: '⚡'
  },
  { 
    name: 'Network', 
    count: 10, 
    color: 'bg-green-100 text-green-800',
    darkColor: 'dark:bg-green-900/20 dark:text-green-300',
    icon: '🌐'
  },
  { 
    name: 'Tips', 
    count: 10, 
    color: 'bg-purple-100 text-purple-800',
    darkColor: 'dark:bg-purple-900/20 dark:text-purple-300',
    icon: '💡'
  },
  { 
    name: 'Tutorials', 
    count: 10, 
    color: 'bg-orange-100 text-orange-800',
    darkColor: 'dark:bg-orange-900/20 dark:text-orange-300',
    icon: '📚'
  }
];

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Get reading time estimate for a post
 * @param {string} content - Post content
 * @returns {string} Reading time estimate
 */
export const getReadingTime = (content) => {
  if (!content) return '1 min read';
  
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return minutes === 1 ? '1 min read' : `${minutes} min read`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get category color based on category name
 * @param {string} categoryName - Category name
 * @returns {object} Color classes for the category
 */
export const getCategoryColor = (categoryName) => {
  const category = blogCategories.find(cat => 
    cat.name.toLowerCase() === categoryName?.toLowerCase()
  );
  
  return category || { 
    color: 'bg-gray-100 text-gray-800', 
    darkColor: 'dark:bg-gray-800 dark:text-gray-300',
    icon: '📝'
  };
};

/**
 * Filter posts by category
 * @param {array} posts - Array of posts
 * @param {string} category - Category to filter by
 * @returns {array} Filtered posts
 */
export const filterPostsByCategory = (posts, category) => {
  if (!category || category === 'all') return posts;
  
  return posts.filter(post => 
    post.category?.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Sort posts by a given field
 * @param {array} posts - Array of posts
 * @param {string} sortBy - Field to sort by (date, title, views)
 * @param {string} order - Sort order (asc, desc)
 * @returns {array} Sorted posts
 */
export const sortPosts = (posts, sortBy = 'date', order = 'desc') => {
  return [...posts].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'date':
        aVal = new Date(a.published_at || a.created_at);
        bVal = new Date(b.published_at || b.created_at);
        break;
      case 'title':
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case 'views':
        aVal = a.view_count || 0;
        bVal = b.view_count || 0;
        break;
      default:
        return 0;
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

/**
 * Get related posts based on category and tags
 * @param {object} currentPost - Current post
 * @param {array} allPosts - All posts
 * @param {number} limit - Number of related posts to return
 * @returns {array} Related posts
 */
export const getRelatedPosts = (currentPost, allPosts, limit = 3) => {
  if (!currentPost || !allPosts) return [];
  
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
  
  // Calculate similarity score based on category and tags
  const scoredPosts = otherPosts.map(post => {
    let score = 0;
    
    // Same category gets higher score
    if (post.category === currentPost.category) {
      score += 10;
    }
    
    // Shared tags get points
    if (post.tags && currentPost.tags) {
      const sharedTags = post.tags.filter(tag => 
        currentPost.tags.includes(tag)
      );
      score += sharedTags.length * 5;
    }
    
    return { ...post, score };
  });
  
  // Sort by score and return top N
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Format post URL slug
 * @param {string} title - Post title
 * @returns {string} URL-friendly slug
 */
export const createSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export default {
  blogCategories,
  formatDate,
  getReadingTime,
  truncateText,
  getCategoryColor,
  filterPostsByCategory,
  sortPosts,
  getRelatedPosts,
  createSlug
};
