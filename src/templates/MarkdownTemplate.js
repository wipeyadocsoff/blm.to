import React from "react"
import { graphql } from "gatsby"
import SEO from "../components/seo"

const MarkdownTemplate = ({ data }) => {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <React.Fragment>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <h1>{frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </React.Fragment>
  )
}
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
        description
      }
    }
  }
`

export { MarkdownTemplate as default }
