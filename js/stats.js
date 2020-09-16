const API_BASE_URL = "https://api.github.com/users/imgios";

getUserData();

async function getUserData() {
    const res = await fetch(API_BASE_URL);
    const resJson = await res.json();

    fillUserData(resJson);
    getTopRepos();
}

function fillUserData(data) {
    document.getElementById("github-image").innerHTML = 
    `<img src="${data.avatar_url}" class="realgios rounded-circle" alt="${data.name}">`;
    document.getElementById("github-username").innerText = data.name;
    document.getElementById("github-bio").innerText = data.bio;
    document.getElementById("github-followers").innerText = data.followers;
    document.getElementById("github-following").innerText = data.following;
    document.getElementById("github-repos").innerText = data.public_repos;
}

async function getTopRepos() {
    const res = await fetch(API_BASE_URL + '/repos');
    const resJson = await res.json();

    fillUserTopRepos(resJson);
}

function fillUserTopRepos(repos) {
    repos
    .sort((a,b) => (a.stargazers_count > b.stargazers_count) ? -1 : 1)
    .slice(0,5)
    .forEach(repo => {
        const listItem = document.createElement('li');
        const element = document.createElement('a');
        element.classList.add('badge', 'badge-primary')
        element.href = repo.html_url;
        element.target = '_blank';
        element.innerText = repo.name;

        listItem.appendChild(element);
        document.getElementById('top-repos').appendChild(listItem);
    });
}