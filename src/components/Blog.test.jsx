import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'Favourite music band',
    author: 'Sara Jackson',
    url: 'music.com',
    likes: 12,
    user: { name: 'Pekka Pekkanen' }
  }

  const deleteBlog = vi.fn()
  const updateBlog = vi.fn()

  beforeEach(() => {
    container = render(<Blog blog={blog} username="username1" deleteBlog={deleteBlog} updateBlog={updateBlog} />).container
  })

  test('renders blog title and author at start, but url and likes are not displayed', () => {
    const div = container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button "view", url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('calls onClick handler of the "like" button twice, if the "like" button is clicked twice', async () => {
    const user = userEvent.setup()

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
