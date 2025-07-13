document.addEventListener('DOMContentLoaded', function() {
  const list = document.getElementById('list');
  const showPanel = document.getElementById('show-panel');
  const currentUser = { id: 1, username: "pouros" };

  // Fetch all books and display their titles
  function fetchBooks() {
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        list.innerHTML = '';
        books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = book.title;
          li.addEventListener('click', () => showBookDetails(book));
          list.appendChild(li);
        });
      });
  }

  // Show book details when clicked
  function showBookDetails(book) {
    const isLiked = book.users.some(user => user.id === currentUser.id);
    
    showPanel.innerHTML = `
      <img src="${book.img_url}" alt="${book.title}">
      <h2>${book.title}</h2>
      <p>${book.description}</p>
      <button class="like-btn">${isLiked ? 'UNLIKE' : 'LIKE'}</button>
      <h3>Liked by:</h3>
      <ul class="likers-list">
        ${book.users.map(user => `<li>${user.username}</li>`).join('')}
      </ul>
    `;

    // Add event listener to like button
    const likeBtn = showPanel.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => toggleLike(book, isLiked));
  }

  // Toggle like status
  function toggleLike(book, isLiked) {
    let updatedUsers;
    
    if (isLiked) {
      // Remove current user from likes
      updatedUsers = book.users.filter(user => user.id !== currentUser.id);
    } else {
      // Add current user to likes
      updatedUsers = [...book.users, currentUser];
    }

    // Send PATCH request to update the book
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        users: updatedUsers
      })
    })
    .then(response => response.json())
    .then(updatedBook => {
      showBookDetails(updatedBook);
    });
  }

  // Initialize the app
  fetchBooks();
});