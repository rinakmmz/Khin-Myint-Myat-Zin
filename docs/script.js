// JavaScript for Bean Boutique Website
// This file contains all interactive functionality for the coffee shop website

// Global variables for cart and application state
let cart = [];
let currentUser = null;
let loyaltyPoints = 0;

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initializeApp();
  
  // Load cart from localStorage
  loadCartFromStorage();
  
  // Update cart display
  updateCartDisplay();
  
  // Initialize security notification
  showSecurityNotification();
  
  // Initialize mobile navigation
  initializeMobileNav();
  
  // Initialize search functionality
  initializeSearch();
});

// Initialize the application
function initializeApp() {
  console.log('Bean Boutique website initialized');
  
  // Add smooth scrolling to all anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Initialize form submissions
  initializeForms();
}

// Mobile Navigation Functions
function initializeMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Animate hamburger menu
      const spans = navToggle.querySelectorAll('span');
      spans.forEach((span, index) => {
        span.style.transform = navMenu.classList.contains('active') 
          ? `rotate(${index === 1 ? 45 : -45}deg)` 
          : 'rotate(0deg)';
      });
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = 'rotate(0deg)';
        });
      });
    });
  }
}

// Search Functionality
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchContent();
      }
    });
  }
}

// Search content function with animation
function searchContent() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    alert('Please enter a search term');
    return;
  }
  
  // Simple search implementation - in a real app, this would search through content
  const searchableElements = document.querySelectorAll('h1, h2, h3, p');
  let found = false;
  
  searchableElements.forEach(element => {
    if (element.textContent.toLowerCase().includes(searchTerm)) {
      element.style.backgroundColor = '#F4A460';
      element.style.transition = 'background-color 0.3s ease';
      found = true;
      
      // Scroll to first match
      if (!found) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 3000);
    }
  });
  
  if (!found) {
    alert(`No results found for "${searchTerm}"`);
  } else {
    alert(`Found results for "${searchTerm}". Highlighted content will fade in 3 seconds.`);
  }
  
  // Clear search input
  searchInput.value = '';
}

// Scroll to section function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Security notification functions
function showSecurityNotification() {
  const notification = document.getElementById('securityNotification');
  if (notification) {
    // Show notification after 2 seconds
    setTimeout(() => {
      notification.style.display = 'flex';
      notification.classList.add('fade-in');
    }, 2000);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      closeSecurityNotification();
    }, 12000);
  }
}

function closeSecurityNotification() {
  const notification = document.getElementById('securityNotification');
  if (notification) {
    notification.style.display = 'none';
  }
}

// Shopping Cart Functions
function addToCart(productName, price) {
  // Create cart item object
  const cartItem = {
    id: Date.now(), // Simple ID generation
    name: productName,
    price: parseFloat(price),
    quantity: 1
  };
  
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.name === productName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(cartItem);
  }
  
  // Save cart to localStorage
  saveCartToStorage();
  
  // Update cart display
  updateCartDisplay();
  
  // Show success message
  showNotification(`${productName} added to cart!`, 'success');
  
  console.log('Added to cart:', cartItem);
  console.log('Current cart:', cart);
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCartToStorage();
  updateCartDisplay();
  showNotification('Item removed from cart', 'info');
}

function updateQuantity(itemId, newQuantity) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      item.quantity = newQuantity;
      saveCartToStorage();
      updateCartDisplay();
    }
  }
}

function updateCartDisplay() {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const emptyCart = document.getElementById('emptyCart');
  const subtotalElement = document.getElementById('subtotal');
  const taxElement = document.getElementById('tax');
  const totalElement = document.getElementById('total');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (!cartItemsContainer) return; // Not on cart page
  
  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  if (emptyCart) emptyCart.style.display = 'none';
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  // Update display elements
  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  
  // Update shipping display
  const shippingElement = document.getElementById('shipping');
  if (shippingElement) {
    shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  }
  
  // Enable checkout button
  if (checkoutBtn) checkoutBtn.disabled = false;
  
  // Generate cart items HTML
  const cartHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p class="item-price">$${item.price.toFixed(2)} each</p>
      </div>
      <div class="item-controls">
        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <span class="quantity">${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');
  
  cartItemsContainer.innerHTML = cartHTML;
}

function saveCartToStorage() {
  localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('beanBoutiqueCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function clearCart() {
  cart = [];
  saveCartToStorage();
  updateCartDisplay();
  showNotification('Cart cleared', 'info');
}

// Promo code functionality
function applyPromoCode() {
  const promoInput = document.getElementById('promoCode');
  const promoCode = promoInput.value.toUpperCase().trim();
  
  // Define available promo codes
  const promoCodes = {
    'WELCOME25': { discount: 0.25, description: '25% off' },
    'FREESHIP': { discount: 0, description: 'Free shipping', freeShipping: true },
    'BUNDLE3': { discount: 0.15, description: '15% off' }
  };
  
  if (promoCodes[promoCode]) {
    const promo = promoCodes[promoCode];
    showNotification(`Promo code applied: ${promo.description}`, 'success');
    
    // In a real application, you would apply the discount to the cart
    console.log('Promo code applied:', promo);
    
    promoInput.value = '';
  } else {
    showNotification('Invalid promo code', 'error');
  }
}

// Checkout functionality
function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'error');
    return;
  }
  
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Coffee Selection Page Functions
function filterCoffees() {
  const searchInput = document.getElementById('coffeeSearch');
  const searchTerm = searchInput.value.toLowerCase();
  const coffeeCards = document.querySelectorAll('.coffee-card');
  
  coffeeCards.forEach(card => {
    const coffeeName = card.querySelector('h3').textContent.toLowerCase();
    const coffeeDescription = card.querySelector('.coffee-description').textContent.toLowerCase();
    
    if (coffeeName.includes(searchTerm) || coffeeDescription.includes(searchTerm)) {
      card.style.display = 'block';
      card.classList.add('fade-in');
    } else {
      card.style.display = 'none';
    }
  });
}

function filterByCategory(category) {
  const coffeeCards = document.querySelectorAll('.coffee-card');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Update active button
  filterButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  coffeeCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'block';
      card.classList.add('fade-in');
    } else {
      card.style.display = 'none';
    }
  });
}

// Equipment Page Functions
function showCategory(category) {
  const equipmentCards = document.querySelectorAll('.equipment-card');
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  // Update active button
  tabButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  equipmentCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'block';
      card.classList.add('fade-in');
    } else {
      card.style.display = 'none';
    }
  });
}

function showDetails(productId) {
  // In a real application, this would show detailed product information
  showNotification('Product details would be displayed here', 'info');
  console.log('Showing details for:', productId);
}

// Events Page Functions
function openRegistration(eventName, eventDate, price) {
  const modal = document.getElementById('registrationModal');
  const eventDetails = document.getElementById('eventDetails');
  const workshopFee = document.getElementById('workshopFee');
  const totalFee = document.getElementById('totalFee');
  
  if (modal && eventDetails) {
    // Populate event details
    eventDetails.innerHTML = `
      <div class="event-summary">
        <h3>${eventName}</h3>
        <p><i class="fas fa-calendar"></i> ${eventDate}</p>
        <p><i class="fas fa-dollar-sign"></i> $${price}</p>
      </div>
    `;
    
    // Update pricing
    if (workshopFee) workshopFee.textContent = `$${price}`;
    if (totalFee) totalFee.textContent = `$${price}`;
    
    modal.style.display = 'block';
  }
}

function closeRegistrationModal() {
  const modal = document.getElementById('registrationModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Special Offers Page Functions
function copyPromoCode(code) {
  // Copy to clipboard
  navigator.clipboard.writeText(code).then(() => {
    showNotification(`Promo code ${code} copied to clipboard!`, 'success');
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification(`Promo code ${code} copied to clipboard!`, 'success');
  });
}

function openSubscription(planName, price) {
  const modal = document.getElementById('subscriptionModal');
  const subscriptionDetails = document.getElementById('subscriptionDetails');
  
  if (modal && subscriptionDetails) {
    subscriptionDetails.innerHTML = `
      <div class="subscription-summary">
        <h3>${planName}</h3>
        <p class="plan-price">$${price}/month</p>
        <p>Start your coffee subscription today and never run out of your favorite beans!</p>
      </div>
    `;
    
    modal.style.display = 'block';
  }
}

function closeSubscriptionModal() {
  const modal = document.getElementById('subscriptionModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function openLoyaltySignup() {
  const modal = document.getElementById('loyaltyModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeLoyaltyModal() {
  const modal = document.getElementById('loyaltyModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Location and Map Functions
function showDirections() {
  // In a real application, this would integrate with a mapping service
  const address = "123 Coffee Street, Downtown District, Coffee City, CC 12345";
  showNotification(`Directions to: ${address}`, 'info');
  
  // Simulate opening directions in a new window
  console.log('Opening directions to Bean Boutique');
  
  // You could integrate with Google Maps or another mapping service here
  // window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
}

// Form Handling Functions
function initializeForms() {
  // Checkout form
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmission);
  }
  
  // Registration form
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', handleRegistrationSubmission);
  }
  
  // Subscription form
  const subscriptionForm = document.getElementById('subscriptionForm');
  if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', handleSubscriptionSubmission);
  }
  
  // Loyalty form
  const loyaltyForm = document.getElementById('loyaltyForm');
  if (loyaltyForm) {
    loyaltyForm.addEventListener('submit', handleLoyaltySubmission);
  }
}

function handleCheckoutSubmission(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const orderData = {
    customer: {
      firstName: formData.get('firstName') || document.getElementById('firstName').value,
      lastName: formData.get('lastName') || document.getElementById('lastName').value,
      email: formData.get('email') || document.getElementById('email').value,
      phone: formData.get('phone') || document.getElementById('phone').value
    },
    shipping: {
      address: formData.get('address') || document.getElementById('address').value,
      city: formData.get('city') || document.getElementById('city').value,
      state: formData.get('state') || document.getElementById('state').value,
      zipCode: formData.get('zipCode') || document.getElementById('zipCode').value
    },
    items: cart,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };
  
  // Simulate order processing
  showNotification('Processing your order...', 'info');
  
  setTimeout(() => {
    showNotification('Order placed successfully! You will receive a confirmation email.', 'success');
    clearCart();
    closeCheckoutModal();
    
    // In a real application, you would send this data to your backend
    console.log('Order submitted:', orderData);
  }, 2000);
}

function handleRegistrationSubmission(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('regFirstName').value;
  const lastName = document.getElementById('regLastName').value;
  const email = document.getElementById('regEmail').value;
  
  showNotification('Processing registration...', 'info');
  
  setTimeout(() => {
    showNotification(`Registration successful! Welcome ${firstName} ${lastName}. Confirmation sent to ${email}.`, 'success');
    closeRegistrationModal();
    
    // Reset form
    e.target.reset();
  }, 1500);
}

function handleSubscriptionSubmission(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('subFirstName').value;
  const email = document.getElementById('subEmail').value;
  const frequency = document.getElementById('deliveryFrequency').value;
  
  showNotification('Setting up your subscription...', 'info');
  
  setTimeout(() => {
    showNotification(`Subscription activated! Welcome ${firstName}. Your ${frequency} deliveries will start soon.`, 'success');
    closeSubscriptionModal();
    
    // Reset form
    e.target.reset();
  }, 2000);
}

function handleLoyaltySubmission(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('loyaltyFirstName').value;
  const email = document.getElementById('loyaltyEmail').value;
  
  showNotification('Creating your rewards account...', 'info');
  
  setTimeout(() => {
    loyaltyPoints = 100; // Welcome bonus
    showNotification(`Welcome to Bean Boutique Rewards, ${firstName}! You've earned 100 welcome points.`, 'success');
    closeLoyaltyModal();
    
    // Update points display if on the page
    const pointsDisplay = document.querySelector('.current-points');
    if (pointsDisplay) {
      pointsDisplay.textContent = loyaltyPoints;
    }
    
    // Reset form
    e.target.reset();
  }, 1500);
}

// Notification System
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background-color: ${getNotificationColor(type)};
    color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 2000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
  const colors = {
    success: '#28A745',
    error: '#DC3545',
    warning: '#FFC107',
    info: '#17A2B8'
  };
  return colors[type] || '#17A2B8';
}

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// Handle escape key to close modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });
  }
});

// Smooth scroll behavior for older browsers
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    const offsetTop = element.offsetTop - 80; // Account for fixed header
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Initialize animations on scroll
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate on scroll
  const animateElements = document.querySelectorAll('.feature-card, .product-card, .coffee-card, .equipment-card, .event-card');
  animateElements.forEach(el => observer.observe(el));
}

// Initialize scroll animations when page loads
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Performance optimization: Debounce search function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to search functions
const debouncedCoffeeFilter = debounce(filterCoffees, 300);

// Update search input to use debounced function
document.addEventListener('DOMContentLoaded', function() {
  const coffeeSearchInput = document.getElementById('coffeeSearch');
  if (coffeeSearchInput) {
    coffeeSearchInput.addEventListener('input', debouncedCoffeeFilter);
  }
});

// Console log for debugging
console.log('Bean Boutique JavaScript loaded successfully');
