// GitHub Search App
// This file contains the main logic for the GitHub Search App
document.addEventListener('DOMContentLoaded', () => {
  const form        = document.querySelector('#github-form');
  const searchInput = document.querySelector('#search');
  const userList    = document.querySelector('#user-list');
  const reposList   = document.querySelector('#repos-list');




  // Handle form submission
  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    // Clear previous results
    userList.innerHTML  = '';
    reposList.innerHTML = '';

// Fetch matching users
fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
  }
})
  .then(res => res.json())
      .then(data => {
        if (data.items.length === 0) {
          const li = document.createElement('li');
          li.textContent = 'No users found.';
          userList.appendChild(li);
          return;
        }

        data.items.forEach(user => {
          const li = document.createElement('li');
          li.classList.add('user-item');
          li.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="48" height="48">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
          `;

          // When clicking a user, fetch and show their repos
          li.addEventListener('click', () => fetchUserRepos(user.login));
          userList.appendChild(li);
        });
      })
      .catch(err => {
        console.error(err);
        const li = document.createElement('li');
        li.textContent = 'Error fetching users.';
        userList.appendChild(li);
      })
      .finally(() => form.reset());
  });

  // Fetch and display a user’s repositories
  function fetchUserRepos(username) {
    reposList.innerHTML = '';

    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos`)
      .then(res => res.json())
      .then(repos => {
        if (repos.length === 0) {
          const li = document.createElement('li');
          li.textContent = 'No repositories found.';
          reposList.appendChild(li);
          return;
        }

        repos.forEach(repo => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <span>★ ${repo.stargazers_count}</span>
          `;
          reposList.appendChild(li);
        });
      })
      .catch(err => {
        console.error(err);
        const li = document.createElement('li');
        li.textContent = 'Error fetching repositories.';
        reposList.appendChild(li);
      });
  }
}); 