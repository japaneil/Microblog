document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = 'https://uunojuhlytecrgrwsuxi.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bm9qdWhseXRlY3JncndzdXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NDA0NjYsImV4cCI6MjA1NTExNjQ2Nn0.17yDBBp6jYWr62OnR-dBt0HiPxeOhYRWusr3ywRXT9A';
  
    const postsPerPage = 5;
    let currentPage = 1;
    let totalPosts = 0;
    let totalPages = 0;
    let allPosts = [];
  
    const blogContainer = document.getElementById("blog-container");
    const searchInput = document.getElementById("search-input");
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
  
    if (!prevBtn || !nextBtn || !blogContainer || !searchInput) {
        console.error("❌ Missing essential elements in the DOM.");
    }
  
    // Fetch all posts and store them for searching
    async function fetchAllPosts() {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/blogs?order=created_at.desc`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
  
        allPosts = await response.json();
        totalPosts = allPosts.length;
        totalPages = Math.ceil(totalPosts / postsPerPage);
        console.log("Total posts:", totalPosts);
        fetchPosts(); // Load posts initially
    }
  
    // Display posts with pagination or search results
    function fetchPosts(filteredPosts = null) {
        const postsToShow = filteredPosts || allPosts;
        const startIdx = (currentPage - 1) * postsPerPage;
        const endIdx = startIdx + postsPerPage;
        const postsToDisplay = postsToShow.slice(startIdx, endIdx);
  
        blogContainer.innerHTML = ""; // Clear existing posts
  
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
  
        updatePaginationLinks(filteredPosts);
    }
  
    // Handle search input
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
  
        if (query.length > 0) {
            const filteredPosts = allPosts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                new Date(post.created_at).toDateString().toLowerCase().includes(query)
            );
            currentPage = 1; // Reset to first page for search results
            fetchPosts(filteredPosts);
        } else {
            fetchPosts();
        }
    });
  
    // Change page when clicking "Next" or "Previous"
    function changePage(direction) {
        const newPage = currentPage + direction;
        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            fetchPosts();
        }
    }
  
    // Update pagination buttons
    function updatePaginationLinks(filteredPosts = null) {
        const totalFilteredPages = Math.ceil((filteredPosts ? filteredPosts.length : totalPosts) / postsPerPage);
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalFilteredPages;
    }
  
    prevBtn.addEventListener("click", (event) => {
        event.preventDefault();
        changePage(-1);
    });
  
    nextBtn.addEventListener("click", (event) => {
        event.preventDefault();
        changePage(1);
    });
  
    // Load posts on page load
    fetchAllPosts();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const quoteEl = document.getElementById("quote-text");

    fetch("https://thequoteshub.com/api/getquote")
        .then(res => res.json())
        .then(data => {
            console.log("API response:", data); // DEBUG: See what's returned

            const quote = data?.text || "Stay strong, stay focused.";
            const author = data?.author || "Unknown";

            quoteEl.textContent = `“${quote}” — ${author}`;
        })
        .catch(err => {
            console.error("Quote API error:", err);
            quoteEl.textContent = "“You’ve got this. Keep going.”";
        });
});