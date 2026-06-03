import { useEffect } from 'react';

const useDynamicViewport = () => {
  useEffect(() => {
    // Fungsi untuk update height semua section
    const updateAllHeights = () => {
      const viewportHeight = window.innerHeight;
      
      // Untuk landing page sections
      const sections = document.querySelectorAll('.hero, .about, .vision, .faq');
      sections.forEach(section => {
        section.style.minHeight = `${viewportHeight}px`;
      });
      
      // Untuk layout dashboard
      const appContainer = document.querySelector('.app-container');
      const contentArea = document.querySelector('.content');
      
      if (appContainer) {
        appContainer.style.height = `${viewportHeight}px`;
      }
      
      if (contentArea) {
        contentArea.style.height = `${viewportHeight}px`;
      }
    };

    // Initial update
    updateAllHeights();

    // Debounce untuk resize dan zoom
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateAllHeights, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Observasi untuk perubahan DOM (jika ada dynamic content)
    const observer = new ResizeObserver(() => {
      updateAllHeights();
    });
    
    const contentDiv = document.querySelector('.content');
    if (contentDiv) {
      observer.observe(contentDiv);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      observer.disconnect();
    };
  }, []);
};

export default useDynamicViewport;