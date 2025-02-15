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


// Initialize Supabase Client
const supabaseUrl = 'https://bglwtwtarghrhetdqfsz.supabase.co'; // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbHd0d3RhcmdocmhldGRxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MjAxMjYsImV4cCI6MjA1NTE5NjEyNn0.7fUsfqJeYmV7ubgFmWVKnA0o8Lz0aIf0FaNYtFo64qY'; // Replace with your Supabase Anon Key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Declare the necessary elements once
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const commentsContainer = document.getElementById('comments-container');

// Define the state variables for pagination
let currentPage = 1;
let totalPages = 0;
let postsPerPage = 10; // Define the number of posts per page

// Fetch comments from Supabase
async function fetchComments() {
  try {
    const { data, error, count } = await supabase
      .from('comments') // Assuming your table name is 'comments'
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((currentPage - 1) * postsPerPage, currentPage * postsPerPage - 1);

    if (error) throw error;

    // Clear the existing comments
    commentsContainer.innerHTML = "";

    // Create HTML for each comment
    data.forEach(comment => {
      const commentElement = document.createElement("article");
      commentElement.classList.add("comment");
      commentElement.innerHTML = `
        <h3>${comment.name}</h3>
        <p class="date">${new Date(comment.created_at).toDateString()}</p>
        <p class="content">${comment.content}</p>
      `;
      commentsContainer.appendChild(commentElement);
    });

    // Set total pages based on the number of records
    totalPages = Math.ceil(count / postsPerPage);

    // Update pagination buttons state
    updatePaginationLinks();
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

// Handle pagination button clicks
function changePage(direction) {
  if (direction === 1 && currentPage < totalPages) {
    currentPage++;
    fetchComments();
  } else if (direction === -1 && currentPage > 1) {
    currentPage--;
    fetchComments();
  }
}

// Update pagination button states
function updatePaginationLinks() {
  prevBtn.disabled = currentPage === 1;
  prevBtn.style.color = currentPage === 1 ? '#ccc' : '#8ec5fc';

  nextBtn.disabled = currentPage === totalPages;
  nextBtn.style.color = currentPage === totalPages ? '#ccc' : '#8ec5fc';
}

// Initial call to fetch comments
fetchComments();