// Redirect to login if not logged in
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
  }
  
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }
  
  // Load books (sample only)
  const bookList = document.getElementById('bookList');
  if (bookList) {
    fetch('https://www.googleapis.com/books/v1/volumes?q=javascript')
      .then(res => res.json())
      .then(data => {
        bookList.innerHTML = '';
        data.items.forEach(book => {
          const title = book.volumeInfo.title;
          const authors = book.volumeInfo.authors?.join(', ') || 'Unknown';
          bookList.innerHTML += `<div><strong>${title}</strong><br>by ${authors}</div><hr>`;
        });
      })
      .catch(err => {
        bookList.innerHTML = 'Failed to load books';
        console.error(err);
      });
  }
  