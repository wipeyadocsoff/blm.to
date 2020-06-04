[![Netlify Status](https://api.netlify.com/api/v1/badges/d870b73c-43b8-4f8f-b609-869b75980b8b/deploy-status)](https://app.netlify.com/sites/zen-jones-3e750c/deploys)

# blm.to

Link shortner/directory for protest information. 

## Running locally
Install dependencies
```
npm install
npm install -g gatsby-cli
```

Run the dev server
```
gatsby develop
```

To build static pages
```
npm run build
```

## How to add re-directs
Go to [blm.to/form](https://blm.to/form) to add a new link to be shortened/re-direct.
You can view all proposed links at [blm.to/table](https://blm.to/table)

## How to add pages
Pages can be added by creating a Github-flavored markdown file in the `src/markdown` directory. Frontmatter block should be added as such:

```
---
slug: "/nyc"
title: "New York City Resources"
date: "06-01-2020"
---
# NYC Resources
```
              
<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-dark.svg" alt="Deploys by Netlify" />
</a>
