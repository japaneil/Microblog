document.addEventListener('DOMContentLoaded', () => {
  const SUPABASE_URL = 'https://uunojuhlytecrgrwsuxi.supabase.co'; // Replace with your Supabase URL
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bm9qdWhseXRlY3JncndzdXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NDA0NjYsImV4cCI6MjA1NTExNjQ2Nn0.17yDBBp6jYWr62OnR-dBt0HiPxeOhYRWusr3ywRXT9A'; // Replace with your anon key
  
  const postsPerPage = 5; // Number of posts per page
  let currentPage = 1; // Track the current page
  let totalPosts = 0; // Track the total number of posts
  let totalPages = 0; // Track total pages based on the number of posts
  let lastTimestamp = null; // Track the timestamp of the last post loaded for pagination

  const blogContainer = document.getElementById("blog-container");
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (!prevBtn || !nextBtn || !blogContainer) {
    console.error("❌ Missing pagination elements in the DOM.");
  }

  // Fetch all posts and determine the total number of posts
  async function fetchAllPosts() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/blogs?order=created_at.desc&limit=1000`, {  // limit high to get all posts (adjust the limit as needed)
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    const posts = await response.json();
    totalPosts = posts.length; // Get the total number of posts
    totalPages = Math.ceil(totalPosts / postsPerPage); // Calculate total pages
    console.log("Total posts:", totalPosts);
    return posts;
  }

  // Fetch posts with pagination
  async function fetchPosts() {
    const allPosts = await fetchAllPosts();

    // Calculate the range of posts to display
    const startIdx = (currentPage - 1) * postsPerPage;
    const endIdx = startIdx + postsPerPage;

    // Get the subset of posts for the current page
    const postsToDisplay = allPosts.slice(startIdx, endIdx);

    // Clear existing posts and load new ones
    blogContainer.innerHTML = ""; // Clear the blog container

    postsToDisplay.forEach(post => {
      const postElement = document.createElement("article");
      postElement.classList.add("post", "fade-in");

      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p class="date">${new Date(post.created_at).toDateString()}</p>
        <p class="description">${post.content}</p>
      `;

      blogContainer.appendChild(postElement);
    });

    updatePaginationLinks(); // Update pagination button states
  }

  // Change page when clicking "Next" or "Previous"
  function changePage(direction) {
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      fetchPosts();
    }
  }

  // Update pagination button states
  function updatePaginationLinks() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
    nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
  }

  // Add event listeners for pagination buttons
  prevBtn.addEventListener("click", (event) => {
    event.preventDefault();
    changePage(-1);
  });

  nextBtn.addEventListener("click", (event) => {
    event.preventDefault();
    changePage(1);
  });

  // Initial fetch of posts
  fetchPosts();
});