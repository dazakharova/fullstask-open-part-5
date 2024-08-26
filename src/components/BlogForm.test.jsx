import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm.jsx'

test('the form calls the event handler it received as props with the right details when a new blog is created', async() => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  await user.type(titleInput, 'Some new title')
  await user.type(authorInput, 'Unknown author')
  await user.type(urlInput, 'something.com')
  const sendButton = screen.getByText('create')

  await user.click(sendButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Some new title')
  expect(createBlog.mock.calls[0][0].author).toBe('Unknown author')
  expect(createBlog.mock.calls[0][0].url).toBe('something.com')
})
