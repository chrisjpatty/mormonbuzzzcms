import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import './index.scss'

export default class IndexPage extends React.Component {
  reducePostsToTypes = (arr, post, i) => {
    const itr = arr.length;
    if (i >= 3 && i <= 5) {
      return [
        ...arr.slice(0, 3),
        {
          type: 'highlights',
          posts: [...((arr[3] || {}).posts || []), post.node],
          index: itr
        },
        ...arr.slice(4)
      ]
    }
    if (i >= 6 && (i % 6 === 0 || i % 6 === 1)) {
      const index = itr - i % 6;
      return [
        ...arr.slice(0, index),
        {
          type: 'double-row',
          posts: [...((arr[index] || {}).posts || []), post.node],
          index: itr
        },
        ...arr.slice(index + 1)
      ]
    }
    return [...arr, { type: 'block', post: post.node, index: i }]
  }
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark
    const rows = new Array(Math.ceil(posts.length / 4))
      .fill(null)
      .map((_, i) => posts.slice(i * 4, i * 4 + 4).map(({ node }) => node))
    const computedPosts = posts.reduce(this.reducePostsToTypes, [])
    console.log(computedPosts)
    return (
      <section className="section">
        <div className="container">
          <div className="posts-wrapper">
            {computedPosts.map((cp, i) => {
              switch (cp.type) {
                case 'highlights':
                  return <HighlightsBlock posts={cp.posts} key={i} />
                case 'double-row':
                  return <DoubleRow posts={cp.posts} key={i} />
                default:
                  return <VerticalBlock post={cp.post} key={i} />
              }
            })}
          </div>
          {/* {
            rows.map((row, i) => (
              <PostRow row={row} key={i} />
            ))
          } */}
          {/* {posts
            .map(({ node: post }) => (
              <div
                className="content"
                // style={{ border: '1px solid #eaecee', padding: '2em 4em' }}
                key={post.id}
              >
                {
                  post.frontmatter.featuredImg &&
                  <img src={post.frontmatter.featuredImg} />
                }
                <p>
                  <Link className="has-text-primary" to={post.fields.slug}>
                    {post.frontmatter.title}
                  </Link>
                  <span> &bull; </span>
                  <small>{post.frontmatter.date}</small>
                </p>
                <p>
                  {post.excerpt}
                  <br />
                  <br />
                  <Link className="button is-small" to={post.fields.slug}>
                    Keep Reading →
                  </Link>
                </p>
              </div>
            ))} */}
        </div>
      </section>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array
    })
  })
}

class PostRow extends React.Component {
  render() {
    const { row } = this.props
    return (
      <div className="post-row">
        {row.map(post => <VerticalBlock post={post} />)}
      </div>
    )
  }
}

class VerticalBlock extends React.Component {
  render() {
    const { post } = this.props
    return (
      <div className="post-block-wrapper">
        <Link
          to={post.fields.slug}
          className="post-block"
          style={
            post.frontmatter.featuredImg
              ? {
                  backgroundImage: `url(${post.frontmatter.featuredImg})`
                }
              : {
                  backgroundImage: `url(https://source.unsplash.com/900x1200/?church,spiritual)`
                }
          }
        >
          <div className="title-wrapper">
            <span className="title">{post.frontmatter.title}</span>
            <div className="author-wrapper">
              <span className="author">By {post.frontmatter.author}</span>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

const HighlightsBlock = ({ posts }) => (
  <div className="post-block-wrapper">
    <div className="highlights-block">
      <h2>Highlights</h2>
      {posts.map((post, i) => <TextPost post={post} key={i} />)}
    </div>
  </div>
)

const TextPost = ({ post }) => (
  <div className="text-post">
    <span className="title">{post.frontmatter.title}</span>
    <span className="author">By {post.frontmatter.author}</span>
  </div>
)

const DoubleRow = ({ posts }) => (
  <div className="double-row">
    {posts.map((post, i) => <ImageRowPost post={post} key={i} />)}
  </div>
)

const ImageRowPost = ({ post }) => (
  <div className="post-block-wrapper image-row-post">
    <div
      className="image"
      style={
        post.frontmatter.featuredImg
          ? {
              backgroundImage: `url(${post.frontmatter.featuredImg})`
            }
          : {
              backgroundImage: `url(https://source.unsplash.com/900x1200/?church,spiritual)`
            }
      }
    />
    <div className='title-wrapper'>
      <span className="title">{post.frontmatter.title}</span>
      <span className='author'>{post.frontmatter.author}</span>
    </div>
  </div>
)

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            featuredImg
            author
          }
        }
      }
    }
  }
`
