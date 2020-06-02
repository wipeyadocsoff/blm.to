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

## How to add redirects
Redirects are stored in the `static/_redirects` file.

They follow the format outlined here:
https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file


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
