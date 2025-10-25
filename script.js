/* script.js - small visuals + page helpers + theme toggle */

// set footer years immediately
const y = new Date().getFullYear();
if (document.getElementById('year')) document.getElementById('year').textContent = y;
if (document.getElementById('year2')) document.getElementById('year2').textContent = y;
if (document.getElementById('year3')) document.getElementById('year3').textContent = y;

// Theme toggle - set up immediately
let currentTheme = 'light';
try {
  const saved = localStorage.getItem('theme');
  if (saved) currentTheme = saved;
} catch (e) {
  console.log('LocalStorage not available');
}

// Apply theme immediately
document.documentElement.setAttribute('data-theme', currentTheme);

// Wait for DOM to be ready for button click handler
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Update icon on load
  if (themeToggle) {
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    
    // Add click handler
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Theme button clicked!'); // Debug log
      
      const htmlEl = document.documentElement;
      const current = htmlEl.getAttribute('data-theme') || 'light';
      const newTheme = current === 'light' ? 'dark' : 'light';
      
      console.log('Switching from', current, 'to', newTheme); // Debug log
      
      htmlEl.setAttribute('data-theme', newTheme);
      themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
      
      try {
        localStorage.setItem('theme', newTheme);
      } catch (e) {
        console.log('Could not save theme');
      }
    });
  } else {
    console.log('Theme toggle button not found!'); // Debug log
  }

  // create simple SVG shapes in the visual canvas for subtle motion
  const canvas = document.getElementById('visual-canvas');
  if (canvas) {
    // Create multiple canvases spread across the screen
    canvas.innerHTML = `
      <svg class="float-shape" style="top: 10%; left: 15%;" width="100" height="100" viewBox="0 0 100 100">
        <g id="g1" transform="translate(50 50)">
          <circle r="30" fill="#3b3e79"></circle>
        </g>
      </svg>
      
      <svg class="float-shape" style="top: 60%; left: 8%;" width="80" height="80" viewBox="0 0 80 80">
        <g id="g2" transform="translate(40 40)">
          <rect x="-15" y="-15" width="30" height="30" rx="5" fill="#3b3e79"></rect>
        </g>
      </svg>
      
      <svg class="float-shape" style="top: 20%; right: 20%;" width="70" height="70" viewBox="0 0 70 70">
        <g id="g3" transform="translate(35 35)">
          <circle r="20" fill="#3b3e79"></circle>
        </g>
      </svg>
      
      <svg class="float-shape" style="bottom: 15%; right: 12%;" width="90" height="90" viewBox="0 0 90 90">
        <g id="g4" transform="translate(45 45)">
          <polygon points="0,-15 13,7.5 -13,7.5" fill="#3b3e79"></polygon>
        </g>
      </svg>
      
      <svg class="float-shape" style="top: 45%; left: 45%;" width="60" height="60" viewBox="0 0 60 60">
        <g id="g5" transform="translate(30 30)">
          <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#3b3e79"></rect>
        </g>
      </svg>
      
      <svg class="float-shape" style="bottom: 40%; left: 25%;" width="75" height="75" viewBox="0 0 75 75">
        <g id="g6" transform="translate(37.5 37.5)">
          <circle r="22" fill="#3b3e79"></circle>
        </g>
      </svg>
      
      <svg class="float-shape" style="top: 70%; right: 35%;" width="65" height="65" viewBox="0 0 65 65">
        <g id="g7" transform="translate(32.5 32.5)">
          <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#3b3e79"></rect>
        </g>
      </svg>
    `;

    // animate with simple JS (float) - each shape moves at different speeds
    let t = 0;
    function animate() {
      t += 0.015;
      const shapes = [
        { el: document.getElementById('g1'), base: [50, 50], speed: 1.0, distance: 6 },
        { el: document.getElementById('g2'), base: [40, 40], speed: 1.3, distance: 5 },
        { el: document.getElementById('g3'), base: [35, 35], speed: 0.8, distance: 7 },
        { el: document.getElementById('g4'), base: [45, 45], speed: 1.1, distance: 4, rotate: true },
        { el: document.getElementById('g5'), base: [30, 30], speed: 1.5, distance: 5 },
        { el: document.getElementById('g6'), base: [37.5, 37.5], speed: 0.9, distance: 6 },
        { el: document.getElementById('g7'), base: [32.5, 32.5], speed: 1.2, distance: 4 }
      ];
      
      shapes.forEach(shape => {
        if (shape.el) {
          const x = shape.base[0] + Math.sin(t * shape.speed) * shape.distance;
          const y = shape.base[1] + Math.cos(t * shape.speed) * shape.distance;
          const rotation = shape.rotate ? ` rotate(${t * 20})` : '';
          shape.el.setAttribute('transform', `translate(${x} ${y})${rotation}`);
        }
      });
      
      requestAnimationFrame(animate);
    }
    animate();
  }

  // small nav active link handling:
  document.querySelectorAll('.main-nav .nav-link').forEach(a => {
    a.addEventListener('click', () => {
      document.querySelectorAll('.main-nav .nav-link').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
    });
  });

  // Lightbox for gallery images
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    // Protect images from downloading
    const protectImages = () => {
      const allImages = document.querySelectorAll('.gallery img, .lightbox img');
      
      allImages.forEach(img => {
        // Disable right-click
        img.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });
        
        // Disable drag
        img.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });
      });
      
      // Disable right-click on gallery container
      gallery.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
          e.preventDefault();
          return false;
        }
      });
    };
    
    protectImages();

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <img src="" alt="Preview">
        <div class="lightbox-nav">
          <button class="lightbox-prev">&#10094;</button>
          <button class="lightbox-next">&#10095;</button>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Protect lightbox image after it's created
    protectImages();
    
    // Get all gallery images
    const galleryImages = Array.from(gallery.querySelectorAll('.thumb img'));
    let currentIndex = 0;

    // Open lightbox
    galleryImages.forEach((img, index) => {
      img.parentElement.style.cursor = 'pointer';
      img.parentElement.addEventListener('click', () => {
        currentIndex = index;
        showImage(currentIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        protectImages(); // Re-apply protection after image loads
      });
    });

    // Show specific image
    function showImage(index) {
      lightboxImg.src = galleryImages[index].src;
      lightboxImg.alt = galleryImages[index].alt;
    }

    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Navigation
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      showImage(currentIndex);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryImages.length;
      showImage(currentIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(currentIndex);
      }
      if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        showImage(currentIndex);
      }
    });
    
    // Prevent common keyboard shortcuts for saving
    document.addEventListener('keydown', (e) => {
      // Prevent Ctrl+S / Cmd+S (save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
    });
  }

});