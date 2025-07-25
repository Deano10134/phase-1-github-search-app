// GitHub Search App
// This file contains the main logic for the GitHub Search App
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#github-form');
  const searchInput = document.querySelector('#search');
  const userList = document.querySelector('#user-list');
  const reposList = document.querySelector('#repos-list');
  const toggleBtn = document.querySelector('#toggle-search');

  let searchMode = 'user'; // Can be 'user' or 'repo'

  toggleBtn.addEventListener('click', () => {
    searchMode = searchMode === 'user' ? 'repo' : 'user';
    toggleBtn.textContent = searchMode === 'user' ? 'Search Repos' : 'Search Users';
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    userList.innerHTML = '';
    reposList.innerHTML = '';

    if (searchMode === 'user') {
      searchGitHubUsers(query);
    } else {
      searchGitHubRepos(query);
    }

    form.reset();
  });

  function searchGitHubUsers(query) {
    fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.items.length === 0) {
          userList.innerHTML = '<li>No users found.</li>';
          return;
        }

        data.items.forEach(user => {
          const li = document.createElement('li');
          li.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="48" height="48">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
          `;
          li.addEventListener('click', () => fetchUserRepos(user.login));
          userList.appendChild(li);
        });
      })
      .catch(err => {
        console.error(err);
        userList.innerHTML = '<li>Error fetching users.</li>';
      });
  }

  function fetchUserRepos(username) {
    reposList.innerHTML = '';

    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos`)
      .then(res => res.json())
      .then(repos => {
        if (repos.length === 0) {
          reposList.innerHTML = '<li>No repositories found.</li>';
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
        reposList.innerHTML = '<li>Error fetching repositories.</li>';
      });
  }

  function searchGitHubRepos(query) {
    fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.items.length === 0) {
          reposList.innerHTML = '<li>No repositories found.</li>';
          return;
        }

        data.items.forEach(repo => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.full_name}</a>
            <span>★ ${repo.stargazers_count}</span>
          `;
          reposList.appendChild(li);
        });
      })
      .catch(err => {
        console.error(err);
        reposList.innerHTML = '<li>Error fetching repositories.</li>';
      });
  }
});
