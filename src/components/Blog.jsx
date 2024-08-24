import { useState } from 'react'

const Blog = ({ blog, username, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const incrementLikes = (event) => {
    event.preventDefault()
    updateBlog({
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }, blog.id)
  }

  const removeBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  const details = () => (
    <div>
      <div>{blog.url}</div>
      <div>likes {blog.likes} <button onClick={incrementLikes}>like</button></div>
      <div>{blog.user.name}</div>
      {blog.user.username === username ? <button onClick={removeBlog}>remove</button> : <div></div>}
    </div>
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>hide</button>
        {details()}
      </div>
    </div>
  )}

export default Blog