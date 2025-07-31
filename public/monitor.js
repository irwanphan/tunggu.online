(function() {
  'use strict';
  
  // Configuration
  const TRACKING_ENDPOINT = window.location.origin + '/api/events';
  const SITE_ID = document.currentScript?.getAttribute('data-site-id') || 'default';
  
  // Event tracking
  function trackEvent(type, data = {}) {
    const eventData = {
      siteId: SITE_ID,
      type: type,
      url: window.location.href,
      referrer: document.referrer,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...data
    };

    // Send to server
    fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }).catch(console.error);
  }

  // Pageview tracking
  function trackPageview() {
    trackEvent('pageview');
  }

  // Click tracking
  function trackClick(event) {
    const rect = event.target.getBoundingClientRect();
    const data = {
      x: Math.round(event.clientX - rect.left),
      y: Math.round(event.clientY - rect.top),
      element: event.target.tagName.toLowerCase(),
      text: event.target.textContent?.substring(0, 100) || '',
    };
    trackEvent('click', data);
  }

  // Scroll tracking
  let scrollTimeout;
  function trackScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      trackEvent('scroll', { scrollDepth });
    }, 1000);
  }

  // Initialize tracking
  function init() {
    // Track initial pageview
    trackPageview();

    // Track clicks
    document.addEventListener('click', trackClick, true);

    // Track scroll
    document.addEventListener('scroll', trackScroll, { passive: true });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        trackEvent('pageview');
      }
    });

    // Track beforeunload
    window.addEventListener('beforeunload', () => {
      trackEvent('pageview');
    });
  }

  // Start tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
