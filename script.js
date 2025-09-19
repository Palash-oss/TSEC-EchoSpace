const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

// 3D Spiral Staircase Gallery with Mouse Wheel Only
function initSpiralGallery() {
    const artworks = document.querySelectorAll('.artwork');
    const spiralGallery = document.querySelector('#spiral-gallery');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let currentIndex = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    console.log('Initializing spiral gallery...');
    console.log('Found artworks:', artworks.length);
    console.log('Spiral gallery element:', spiralGallery);
    
    if (!artworks.length || !spiralGallery) {
        console.error('Missing artworks or spiral gallery element');
        return;
    }
    
    // Position artworks in a 3D spiral staircase pattern with increased depth
    artworks.forEach((artwork, index) => {
        const angle = (index * 18) * (Math.PI / 180); // 18 degrees between each artwork (360/20)
        const radius = 50 + (index * 15); // Smaller radius for tighter spiral
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = index * 200; // Much larger Z-depth for staircase effect
        
        artwork.style.left = `calc(50% + ${x}px)`;
        artwork.style.top = `calc(50% + ${y}px)`;
        artwork.style.transform = `translate(-50%, -50%) scale(0.1) translateZ(${z}px) rotateY(${angle * 180 / Math.PI}deg)`;
        artwork.style.opacity = '0';
        artwork.style.zIndex = '1';
    });
    
    // Show first artwork
    if (artworks[0]) {
        console.log('Setting up first artwork...');
        artworks[0].classList.add('active');
        artworks[0].style.transform = 'translate(-50%, -50%) scale(1) translateZ(0px) rotateY(0deg)';
        artworks[0].style.opacity = '1';
        artworks[0].style.zIndex = '10';
        console.log('First artwork setup complete');
    }
    
    // Mouse wheel event handler
    function handleWheel(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        isScrolling = true;
        clearTimeout(scrollTimeout);
        
        const delta = e.deltaY;
        let newIndex = currentIndex;
        
        if (delta > 0 && currentIndex < artworks.length - 1) {
            // Scroll down - next artwork
            newIndex = currentIndex + 1;
        } else if (delta < 0 && currentIndex > 0) {
            // Scroll up - previous artwork
            newIndex = currentIndex - 1;
        }
        
        if (newIndex !== currentIndex) {
            // Hide current artwork
            if (artworks[currentIndex]) {
                artworks[currentIndex].classList.remove('active');
                const currentAngle = (currentIndex * 18) * (Math.PI / 180);
                anime({
                    targets: artworks[currentIndex],
                    scale: 0.1,
                    opacity: 0,
                    translateZ: currentIndex * 200,
                    rotateY: currentAngle * 180 / Math.PI,
                    duration: 600,
                    easing: 'easeOutExpo'
                });
            }
            
            // Show new artwork
            currentIndex = newIndex;
            if (artworks[currentIndex]) {
                artworks[currentIndex].classList.add('active');
                artworks[currentIndex].style.zIndex = '10';
                anime({
                    targets: artworks[currentIndex],
                    scale: 1,
                    opacity: 1,
                    translateZ: 0,
                    rotateY: 0,
                    duration: 800,
                    easing: 'easeOutExpo'
                });
            }
            
            // Update scroll indicator
            if (scrollIndicator) {
                scrollIndicator.querySelector('p').textContent = `Artwork ${currentIndex + 1} of ${artworks.length}`;
            }
        }
        
        // Reset scrolling flag after delay
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 300);
    }
    
    // Add wheel event listener to spiral gallery
    spiralGallery.addEventListener('wheel', handleWheel, { passive: false });
    
    // Prevent page scroll when in spiral gallery
    spiralGallery.addEventListener('wheel', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // Initialize scroll indicator
    if (scrollIndicator) {
        scrollIndicator.querySelector('p').textContent = `Artwork 1 of ${artworks.length}`;
    }
    
    // Add interactive hover/click effects for artworks
    artworks.forEach((artwork, index) => {
        const artworkInfo = artwork.querySelector('.artwork-info');
        
        // Hover effect
        artwork.addEventListener('mouseenter', () => {
            if (artwork.classList.contains('active')) {
                anime({
                    targets: artworkInfo,
                    opacity: 1,
                    translateY: 0,
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            }
        });
        
        artwork.addEventListener('mouseleave', () => {
            anime({
                targets: artworkInfo,
                opacity: 0,
                translateY: 20,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });
        
        // Click effect
        artwork.addEventListener('click', () => {
            if (artwork.classList.contains('active')) {
                // Show detailed info or open modal
                const title = artwork.querySelector('h4').textContent;
                const medium = artwork.querySelector('p').textContent;
                
                // Create a temporary detailed view
                const detailView = document.createElement('div');
                detailView.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 255, 255, 0.95);
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                    max-width: 400px;
                    text-align: center;
                    backdrop-filter: blur(10px);
                `;
                
                detailView.innerHTML = `
                    <h3 style="font-size: 24px; margin-bottom: 10px; color: #333;">${title}</h3>
                    <p style="font-size: 16px; color: #666; margin-bottom: 15px;">${medium}</p>
                    <p style="font-size: 14px; color: #888; line-height: 1.6;">
                        This contemporary artwork represents the intersection of traditional techniques 
                        and modern expression, showcasing the artist's unique perspective on contemporary themes.
                    </p>
                    <button onclick="this.parentElement.remove()" style="
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #ff00a6, #007bff);
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Close</button>
                `;
                
                document.body.appendChild(detailView);
                
                // Animate in
                detailView.style.opacity = '0';
                detailView.style.transform = 'translate(-50%, -50%) scale(0.8)';
                anime({
                    targets: detailView,
                    opacity: 1,
                    scale: 1,
                    duration: 400,
                    easing: 'easeOutExpo'
                });
            }
        });
    });
}

// Initialize spiral gallery when page loads
document.addEventListener('DOMContentLoaded', initSpiralGallery);

// Also initialize on window load as backup
window.addEventListener('load', () => {
    console.log('Window loaded, re-initializing spiral gallery...');
    setTimeout(initSpiralGallery, 100);
});


var side = document.querySelector("#lefti")
var imgTag = document.querySelector("#main-img");
var extract = document.querySelectorAll("#lefti h1");
var descEl = document.querySelector('#tab-desc');

extract.forEach(function(e) {
  e.addEventListener("click", function() {
     extract.forEach(el => {
         el.style.padding = "0 2vw";
        el.style.color = "gray";
        el.classList.remove('active');
     });
     e.style.color = "#EFEAE3"; 
    e.style.padding = "0 0";
    e.classList.add('active');
    var img = e.getAttribute("data-image");
    imgTag.src = img; // update <img>
    if (descEl) {
      var text = e.getAttribute('data-desc') || '';
      if (text) descEl.textContent = text;
    }
  });
});

// initialize description on load based on active tab
if (descEl) {
  var active = document.querySelector('#lefti h1.active');
  if (active) {
    var text = active.getAttribute('data-desc') || '';
    if (text) descEl.textContent = text;
  }
}

function page4Animation(){
var elemC = document.querySelector("#artists-container")
var fixed = document.querySelector('#fixed-image')
if (elemC) {
    elemC.addEventListener("mouseenter",function(){
        fixed.style.display = 'block'
    })
    elemC.addEventListener("mouseleave",function(){
        fixed.style.display = 'none'
    })
}

var elems = document.querySelectorAll(".artist")
elems.forEach(function(e){
e.addEventListener("mouseenter",function(){
    var image = e.getAttribute("data-artist")
    if (fixed && image) {
        fixed.style.backgroundImage = `url(${image})`
    }
})
})
}
   function swiperAnimation(){
 var swiper = new Swiper(".mySwiper", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 100,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
   } 
swiperAnimation()  
page4Animation()
function menuAnimation(){
  var menu = document.querySelector("nav h3")
var full= document.querySelector("#full-scr")
var navimg = document.querySelector("nav img")
var flag  = 0;
menu.addEventListener("click",function(){
    if(flag==0){
 full.style.top = 0;
 navimg.style.opacity = 0;
 flag = 1;
    }
    else{
         full.style.top = "-100%";
 navimg.style.opacity = 1;
 flag = 0;
    }

})
}
menuAnimation()


var loader = document.querySelector("#loader")
setTimeout(function(){
  loader.style.top = "-100%"
},4000)

// Additional Anime.js animations
function initPageAnimations() {
    // Animate hero text on load
    anime({
        targets: '#center h1',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: 500,
        easing: 'easeOutExpo'
    });
    
    anime({
        targets: '#left h3',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 800,
        easing: 'easeOutExpo'
    });
    
    // Animate navigation
    anime({
        targets: 'nav .logo',
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
    });
    
    anime({
        targets: '#nav-part2 h4',
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(100, {start: 400}),
        easing: 'easeOutExpo'
    });
    
    // Animate section titles
    anime({
        targets: '.section-title',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    initPageAnimations();
});