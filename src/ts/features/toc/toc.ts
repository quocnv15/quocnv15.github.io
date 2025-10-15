/**
 * Simple Table of Contents for Personal Blog
 * 
 * Auto-generates TOC from headings with smooth scroll and active highlighting.
 * No external dependencies.
 */

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

class TableOfContents {
  private container: HTMLElement | null = null;
  private headings: HTMLElement[] = [];
  private cleanupFns: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    // Only run on post pages
    if (!document.body.classList.contains('post') && 
        !document.querySelector('.post-content')) {
      console.log('📚 Not a post page - skipping TOC');
      return;
    }

    // Setup when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    // Find or create container
    this.container = document.querySelector('#toc, [data-toc]');
    
    if (!this.container) {
      console.log('📚 TOC container not found - skipping');
      return;
    }

    // Find all headings in content
    const content = document.querySelector('.post-content, article');
    if (!content) return;

    this.headings = Array.from(content.querySelectorAll('h2, h3, h4'));
    
    if (this.headings.length === 0) {
      console.log('📚 No headings found');
      return;
    }

    // Generate TOC
    this.generateTOC();

    // Setup scroll spy
    this.setupScrollSpy();

    console.log(`📚 TOC generated with ${this.headings.length} headings`);
  }

  private generateTOC(): void {
    if (!this.container) return;

    const nav = document.createElement('nav');
    nav.className = 'toc';
    nav.setAttribute('aria-label', 'Table of contents');

    const title = document.createElement('h2');
    title.className = 'toc-title';
    title.textContent = 'Table of Contents';
    nav.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'toc-list';

    this.headings.forEach((heading, index) => {
      // Ensure heading has an ID
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      const item = document.createElement('li');
      item.className = `toc-item toc-${heading.tagName.toLowerCase()}`;

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.className = 'toc-link';
      link.textContent = heading.textContent || '';
      link.setAttribute('data-heading-id', heading.id);

      // Smooth scroll on click
      const handler = (e: Event) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update URL without jumping
        history.pushState(null, '', `#${heading.id}`);
        
        // Update active state
        this.updateActive(heading.id);
      };

      link.addEventListener('click', handler);
      this.cleanupFns.push(() => link.removeEventListener('click', handler));

      item.appendChild(link);
      list.appendChild(item);
    });

    nav.appendChild(list);
    this.container.appendChild(nav);
  }

  private setupScrollSpy(): void {
    let ticking = false;

    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.highlightActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handler);
    this.cleanupFns.push(() => window.removeEventListener('scroll', handler));

    // Initial highlight
    setTimeout(() => this.highlightActive(), 100);
  }

  private highlightActive(): void {
    // Find the currently visible heading
    let activeHeading: HTMLElement | null = null;
    const scrollPos = window.scrollY + 100; // Offset for better UX

    for (const heading of this.headings) {
      if (heading.offsetTop <= scrollPos) {
        activeHeading = heading;
      } else {
        break;
      }
    }

    if (activeHeading) {
      this.updateActive(activeHeading.id);
    }
  }

  private updateActive(headingId: string): void {
    // Remove all active classes
    this.container?.querySelectorAll('.toc-link').forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to current
    const activeLink = this.container?.querySelector(`[data-heading-id="${headingId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  /**
   * Cleanup (for testing)
   */
  public destroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
    
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Export singleton instance
export const toc = new TableOfContents();
