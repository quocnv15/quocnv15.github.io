/**
 * Simple Jekyll Blog Frontend
 * 
 * Simplified architecture with self-contained features.
 * No complex infrastructure needed for a personal blog.
 */

// Import features (they auto-initialize on import)
import './features/theme/theme';
import './features/navigation/navigation';
import './features/copy-code/copy-code';
import './features/toc/toc';

// Mark app as loaded when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');
  document.body.classList.remove('js-loading');
  console.log('✅ All features loaded');
});

console.log('🚀 Jekyll blog frontend initialized');
