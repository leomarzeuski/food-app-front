/**
 * Utility functions for handling images
 */

// Default placeholder image as base64 data URL
// This is a simple gray placeholder image
const PLACEHOLDER_IMAGE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z';

/**
 * Get a fallback image URL based on restaurant categories
 */
export const getFallbackImageUrl = (categories: string[] | string = []): string => {
  const categoryString = typeof categories === 'string' 
    ? categories.toLowerCase() 
    : categories.join(' ').toLowerCase();

  if (categoryString.includes('pizza')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop';
  } else if (categoryString.includes('hambúrguer')) {
    return 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2065&auto=format&fit=crop';
  } else if (categoryString.includes('japonesa') || categoryString.includes('sushi')) {
    return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop';
  } else if (categoryString.includes('brasileira')) {
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop';
  } else if (categoryString.includes('italiana')) {
    return 'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?q=80&w=2070&auto=format&fit=crop';
  } else if (categoryString.includes('batata')) {
    return 'https://bakeandcakegourmet.com.br/uploads/site/receitas/batata-recheada-6-lgr1yoar.jpg';
  }

  return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070&auto=format&fit=crop';
};

/**
 * Convert external URL to a local proxy URL
 * This avoids Next.js image domain restrictions by proxying the request through a local API route
 */
export const getProxyImageUrl = (url: string): string => {
  if (!url) return PLACEHOLDER_IMAGE;
  
  // Create a safe URL parameter by encoding the URL
  const encodedUrl = encodeURIComponent(url);
  
  // Return an API route path that will proxy the image
  return `/api/proxy-image?url=${encodedUrl}`;
};

/**
 * Get a safe image URL that works with Next.js Image component
 * If the URL is from an allowed domain, it returns the original URL
 * Otherwise, it returns a proxy URL
 */
export const getSafeImageUrl = (url: string): string => {
  if (!url) return PLACEHOLDER_IMAGE;
  
  // List of allowed domains (should match next.config.js)
  const allowedDomains = [
    'images.unsplash.com', 
    'via.placeholder.com', 
    'receitatodahora.com.br',
    'bakeandcakegourmet.com.br'
  ];
  
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    
    // If the domain is allowed, use the original URL
    if (allowedDomains.includes(domain)) {
      return url;
    }
    
    // Otherwise, use the proxy URL
    return getProxyImageUrl(url);
  } catch {
    // If URL parsing fails, return the original URL - it might be a data URL or relative path
    if (url.startsWith('data:') || url.startsWith('/')) {
      return url;
    }
    console.error("Invalid URL format:", url);
    return PLACEHOLDER_IMAGE;
  }
};

/**
 * Convert image URL to base64
 * Note: This should only be used on the server side or during build time
 * Don't use this directly in components as it will cause client-side network requests
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return '';
  }
}; 