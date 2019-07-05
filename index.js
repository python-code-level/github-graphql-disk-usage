function getDiskUsageForOrganization(organization) {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`
    },
    body: JSON.stringify({
      query: `{
        organization(login: "${organization}"){
  	      members(last: 100){
          nodes{
            login
            repositories(last: 100){
              nodes{
                name
                diskUsage
        	    }
              totalCount
              totalDiskUsage
            }
          }
        } 
      }
    }`
    })
  })
  .then(response => response.json())
  .then(formatted => formatted.data.organization.members.nodes)
}

function sortUsersByDiskUsage(members) {
  return members.sort(
    (a, b) => b.repositories.totalDiskUsage - a.repositories.totalDiskUsage
  );
}

function getHighestDiskUsageRepo(repos) {
  const [firstRepo] = repos.sort((a, b) => b.diskUsage - a.diskUsage);
  return firstRepo;
}

function formatDiskUsage(members) {
  return members.reduce((output, member) => {
    const { name, diskUsage, url } = getHighestDiskUsageRepo(
      member.repositories.nodes
    );
    return (
      output +
      `<div>
        <img src="${member.avatarUrl}" alt="${member.login}"/>
        <h2><a href="${member.url}"> ${member.login} </a></h2>
        <p>
          ${member.repositories.totalDiskUsage} kb
        </p>
        <p>
          <strong>Heaviest:</strong> 
          <a href="${url}">${name}</a> ~ ${diskUsage} kb
        </p>
      </div>`
    );
  },'');
}

function appendToHTML(html) {
  document.getElementById('app').innerHTML = html;
}

getDiskUsageForOrganization(organization)
  .then(sortUsersByDiskUsage)
  .then(formatDiskUsage)
  .then(appendToHTML);
