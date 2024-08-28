import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
                        title:
            <input
              type="text"
              value={title}
              name="title"
              id="title-input"
              data-testid="title"
              onChange={handleTitleChange}
            />
          </label>
        </div>
        <div>
          <label>
                        author:
            <input
              type="text"
              value={author}
              name="author"
              id="author-input"
              data-testid="author"
              onChange={handleAuthorChange}
            />
          </label>
        </div>
        <div>
          <label>
                        url:
            <input
              type="text"
              value={url}
              name="url"
              id="url-input"
              data-testid="url"
              onChange={handleUrlChange}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.protoTypes = {
  createBlog: PropTypes.func.isRequired
}
export default BlogForm