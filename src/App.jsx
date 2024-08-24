import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

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

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
  }

  const updateBlog = (blogObject, id) => {
    blogService
        .update(blogObject, id)
        .then(returnedBlog => {
          setBlogs(prevBlogs => {
            const blogId = prevBlogs.findIndex(blog => blog.id === returnedBlog.id)

            if (blogId === -1) return prevBlogs

            const updatedBlogs = [
                ...prevBlogs.slice(0, blogId),
                returnedBlog,
                ...prevBlogs.slice(blogId + 1)
            ]

            return updatedBlogs
          })
        })
  }

  const deleteBlog = (id) => {
      blogService
          .deleteBlog(id)
          .then(() => {
              setBlogs(prevBlogs => {
                  const blogId = prevBlogs.findIndex(blog => blog.id === id)

                  if (blogId === -1) return prevBlogs

                  const updatedBlogs = [
                      ...prevBlogs.slice(0, blogId),
                      ...prevBlogs.slice(blogId + 1)
                  ]

                  return updatedBlogs
              })
          })
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
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
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
              {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                  <Blog key={blog.id} blog={blog} username={user.username} updateBlog={updateBlog} deleteBlog={deleteBlog} />
              )}
            </div>
        }
      </div>
  )
}

export default App