# GitHub Organization Members Disk Usage

> Top chart of which member repos in an organization has the most weigth on the github servers and which repo is the heaviest. Using [GitHub v4 GraphQL API](https://developer.github.com/v4/)


query { 
  repository(owner: "python-code-level", name: "python-training") {
    refs(first: 50, refPrefix:"refs/heads/") {
      nodes {
        name
      }
      totalCount
    }
    diskUsage
  }
}


