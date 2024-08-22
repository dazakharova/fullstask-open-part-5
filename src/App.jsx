import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = event => {
    event.preventDefault()

    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setSuccessMessage(`a new blog ${title} by ${author} added`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          setTitle('')
          setAuthor('')
          setUrl('')
        })
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
      <>
        <h2>log in to the application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
  )

  const blogForm = () => (
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
                  onChange={handleUrlChange}
              />
            </label>
          </div>
          <button type="submit">create</button>
        </form>
      </div>
  )

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
      <div>
        <Notification message={errorMessage} type="error" />
        {user === null ?
            loginForm() :
            <div>
              <h2>blogs</h2>
              <Notification message={successMessage} type="success"></Notification>
              <p>{user.name} logged-in</p>
              <button onClick={handleLogout} type="submit">logout</button>
              {blogForm()}
              {blogs.map(blog =>
                  <Blog key={blog.id} blog={blog} />
              )}
            </div>
        }
      </div>
  )
}

export default App