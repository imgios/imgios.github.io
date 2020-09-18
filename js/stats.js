const API_BASE_URL = "https://api.github.com/users/imgios";

getUserData();

async function getUserData() {
    const res = await fetch(API_BASE_URL);
    const resJson = await res.json();

    fillUserData(resJson);
    let repos = await getRepos();
    fillUserTopRepos(repos);
    getRecentActivities();
    fillLanguagesUsed(repos);
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

async function getRepos() {
    const res = await fetch(API_BASE_URL + '/repos');
    const resJson = await res.json();

    return resJson;
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

async function getRecentActivities() {
    const res = await fetch(API_BASE_URL + '/events');
    const resJson = await res.json();

    fillRecentActivities(resJson);
}

function fillRecentActivities(activities) {
    let commits = 0;
    let i = 0;
    while (commits < 5) {
        for (let commit of activities[i].payload.commits) {
            if (commits == 5) {
                break;
            }
            if (activities[i].type == 'PushEvent') {
                const listItem = document.createElement('li');
                const element = document.createElement('a');
                element.href = commit.url.replace('api.github.com/repos','github.com').replace('commits','commit');
                element.innerText = commit.message;

                listItem.appendChild(element);
                document.getElementById('recent-activities').appendChild(listItem);
                commits+=1;
            }
        }
        i+=1;
    }
}

function fillLanguagesUsed(repos) {
    let languages = {};
    repos.forEach(repo => {
        if (repo.language != null && repo.language in languages) {
            let count = languages[repo.language] + 1;
            languages[repo.language] = count;
        } else if (repo.language != null) {
            languages[repo.language] = 1;
        }
    });
    console.log(languages);
}