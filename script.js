function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");
  const mainContent = document.querySelector("#main-content");
  
  sidebar.classList.toggle("open");
  toggle.classList.toggle("active");
  mainContent.classList.toggle("shifted");
}

// Create Random Dots with Parallax Effect
function initParallax() {
  const layers = document.querySelectorAll('.parallax-layer');
  const dots = [];
  let lastScrollY = window.pageYOffset;
  let scrollVelocity = 0;
  let isScrolling = false;
  let scrollTimeout;
  
  // Create random dots for each layer
  layers.forEach((layer, layerIndex) => {
    const numDots = 50 + (layerIndex * 20); // Different number of dots per layer
    
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      
      // Random size with some dots being larger
      const sizeChance = Math.random();
      let size;
      if (sizeChance > 0.9) {
        dot.classList.add('extra-large');
        size = 8 + Math.random() * 4; // 8-12px
      } else if (sizeChance > 0.7) {
        dot.classList.add('large');
        size = 4 + Math.random() * 3; // 4-7px
      } else {
        size = 2 + Math.random() * 2; // 2-4px
      }
      
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      
      // Random initial position
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 2);
      
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      
      // Store random motion parameters
      dot.dataset.speedX = (Math.random() - 0.5) * 0.5;
      dot.dataset.speedY = parseFloat(layer.dataset.speed) + (Math.random() - 0.5) * 0.2;
      dot.dataset.randomOffset = Math.random() * Math.PI * 2;
      dot.dataset.randomSpeed = 0.001 + Math.random() * 0.002;
      dot.dataset.initialX = x;
      dot.dataset.initialY = y;
      dot.dataset.fallSpeed = 0.2 + Math.random() * 0.3; // Snowfall speed
      dot.dataset.currentX = x; // Track current absolute position
      dot.dataset.currentY = y; // Track current absolute position
      
      layer.appendChild(dot);
      dots.push(dot);
    }
  });
  
  // Track scrolling state
  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;
    scrollVelocity = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;
    
    if (!isScrolling) {
      // Just started scrolling - capture current positions as starting point
      dots.forEach((dot) => {
        dot.dataset.scrollStartX = dot.dataset.currentX;
        dot.dataset.scrollStartY = dot.dataset.currentY;
      });
    }
    
    isScrolling = true;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 100);
  });
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const time = Date.now() * 0.001;
    
    dots.forEach((dot) => {
      const speedX = parseFloat(dot.dataset.speedX);
      const speedY = parseFloat(dot.dataset.speedY);
      const randomOffset = parseFloat(dot.dataset.randomOffset);
      const randomSpeed = parseFloat(dot.dataset.randomSpeed);
      const initialX = parseFloat(dot.dataset.initialX);
      const initialY = parseFloat(dot.dataset.initialY);
      const fallSpeed = parseFloat(dot.dataset.fallSpeed);
      
      let currentX = parseFloat(dot.dataset.currentX);
      let currentY = parseFloat(dot.dataset.currentY);
      
      if (isScrolling || scrollVelocity > 0.1) {
        // During scrolling, show parallax effect but don't drastically change positions
        const scrollStartX = parseFloat(dot.dataset.scrollStartX) || currentX;
        const scrollStartY = parseFloat(dot.dataset.scrollStartY) || currentY;
        
        // Add gentle parallax movement relative to where scrolling started
        const parallaxOffsetX = (scrolled * speedX * 0.2) + Math.sin(time * randomSpeed + randomOffset) * 10;
        const parallaxOffsetY = (scrolled * speedY * 0.1) + Math.cos(time * randomSpeed * 0.7 + randomOffset) * 5;
        
        currentX = scrollStartX + parallaxOffsetX;
        currentY = scrollStartY + parallaxOffsetY;
      } else {
        // Snowfall effect when static - continue falling from wherever dots are now
        // Gentle side-to-side sway while falling
        const swayX = Math.sin(time * randomSpeed + randomOffset) * 15;
        
        currentX = currentX + (swayX * 0.01); // Very gentle horizontal drift
        currentY = currentY + fallSpeed; // Continue falling from current position
        
        // Reset position when dot falls too far down (off-screen)
        if (currentY > window.innerHeight + 200) {
          currentY = -100; // Reset well above visible area
          currentX = Math.random() * window.innerWidth; // New random X position
        }
      }
      
      // Update stored positions
      dot.dataset.currentX = currentX;
      dot.dataset.currentY = currentY;
      
      // Apply transform
      dot.style.transform = `translate3d(${currentX - initialX}px, ${currentY - initialY}px, 0)`;
      
      // Occasionally change size slightly for breathing effect
      if (Math.random() > 0.995) {
        const currentSize = parseFloat(dot.style.width);
        const newSize = currentSize + (Math.random() - 0.5) * 0.5;
        dot.style.width = Math.max(1, newSize) + 'px';
        dot.style.height = Math.max(1, newSize) + 'px';
      }
    });
    
    // Decay scroll velocity
    scrollVelocity *= 0.95;
  }
  
  // Use requestAnimationFrame for smooth animation
  function smoothParallax() {
    updateParallax();
    requestAnimationFrame(smoothParallax);
  }
  
  smoothParallax();
}

// Initialize parallax when DOM is loaded
// document.addEventListener('DOMContentLoaded', initParallax);

function openPDF() {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfFrame');
    
    // Set the PDF source
    iframe.src = './assets/J Aditya Ratan.pdf';
    
    // Show the modal
    modal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function openPDFWithURL() {
    openPDF();
    // Update URL without page reload
    history.pushState(null, '', '/cv');
}

// Updated closePDF function with URL reset
function closePDF() {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfFrame');
    
    // Hide the modal
    modal.classList.remove('active');
    
    // Clear the iframe source to stop loading
    iframe.src = '';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Reset URL to main page
    const currentPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    if (currentPath.endsWith('/cv') || urlParams.get('view') === 'cv') {
        history.pushState(null, '', '/');
    }
}

// Handle Escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('pdfModal');
        if (modal && modal.classList.contains('active')) {
            closePDF();
        }
    }
});

// Close modal when clicking outside the PDF container
document.getElementById('pdfModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePDF();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePDF();
    }
});

function copyResumeLink() {
    // Get the full URL to your PDF
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
    const pdfUrl = baseUrl + '/assets/CV.pdf';
    
    // Copy to clipboard
    navigator.clipboard.writeText(pdfUrl).then(() => {
        alert('Resume link copied to clipboard!\n\n' + pdfUrl);
    }).catch((err) => {
        console.error('Clipboard error:', err);
        // Fallback for older browsers or if clipboard access is denied
        const input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        input.value = pdfUrl;
        document.body.appendChild(input);
        input.focus();
        input.select();
        try {
            document.execCommand('copy');
            alert('Resume link copied to clipboard!\n\n' + pdfUrl);
        } catch (err) {
            alert('Could not copy link. Please copy manually:\n\n' + pdfUrl);
        }
        document.body.removeChild(input);
    });
}

