const API_BASE_URL = "https://api.github.com/users/imgios";

getUserData();

async function getUserData() {
    const res = await fetch(API_BASE_URL);
    const resJson = await res.json();

    fillUserData(resJson);
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