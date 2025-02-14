// Pagination
const prevBtn = document.querySelector('.pagination a:first-child');
const nextBtn = document.querySelector('.pagination a:last-child');

prevBtn.addEventListener('click', function(event) {
  event.preventDefault();
  alert('Previous page functionality');
});

nextBtn.addEventListener('click', function(event) {
  event.preventDefault();
  alert('Next page functionality');
});

document.addEventListener("DOMContentLoaded", () => {
  // Apply the transition to the page container when the page loads
  const pageContainer = document.querySelector('.page-container');
  pageContainer.classList.add('show');
  
  // Add page transitions for navigation or content changes if necessary
  const navLinks = document.querySelectorAll('.navbar a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Simulate loading a new page or content
      pageContainer.classList.remove('show'); // Remove current transition effect

      setTimeout(() => {
        // Update content or navigate to new page here
        pageContainer.classList.add('show'); // Add the transition again
      }, 500); // Adjust this timeout as needed
    });
  });
});

