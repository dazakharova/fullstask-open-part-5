const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Daria Zakharova',
        username: 'daria14',
        password: 'zakharova04'
      }
    })
    await page.goto('http://localhost:5173')
  })


  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to the application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'daria14', 'zakharova04')
      await expect(page.getByText('Daria Zakharova logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'daria', 'zakharova')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'daria14', 'zakharova04')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'The Future of Artificial Intelligence in Healthcare', 'John Doe', 'https://www.techmedfuture.com')
      await expect(page.getByText('a new blog The Future of Artificial Intelligence in Healthcare by John Doe added')).toBeVisible()
      await expect(page.getByText('The Future of Artificial Intelligence in Healthcare John Doe')).toBeVisible()
    })

    describe('and a blog is created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'The Future of Artificial Intelligence in Healthcare', 'John Doe', 'https://www.techmedfuture.com')
      })

      test('the blog can be liked', async({ page }) => {
        const blogContainer = page.getByText('The Future of Artificial Intelligence in Healthcare John Doe').locator('..')
        await blogContainer.getByRole('button', { name: 'view' }).click()
        await expect(blogContainer.getByRole('button', { name: 'like' })).toBeVisible()
        await blogContainer.getByRole('button', { name: 'like' }).click()
        await expect(blogContainer.getByText('likes 1')).toBeVisible()
      })

      test('the just created blog can be removed', async({ page }) => {
        const blogContainer = page.getByText('The Future of Artificial Intelligence in Healthcare John Doe').locator('..')
        await blogContainer.getByRole('button', { name: 'view' }).click()
        await expect(blogContainer.getByRole('button', { name: 'remove' })).toBeVisible()
        page.on('dialog', dialog => dialog.accept())
        await blogContainer.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('The Future of Artificial Intelligence in Healthcare John Doe')).not.toBeVisible()
      })

      test('only the user who added the blog sees the blog\'s remove button', async({ page, request }) => {
        const blogContainer = page.getByText('The Future of Artificial Intelligence in Healthcare John Doe').locator('..')
        await blogContainer.getByRole('button', { name: 'view' }).click()
        await expect(blogContainer.getByRole('button', { name: 'remove' })).toBeVisible()
        await page.getByRole('button', { name: 'logout' }).click()

        // Create the second account to see there's no 'remove' button
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Marry Jane',
            username: 'marry',
            password: 'jane'
          }
        })
        await loginWith(page, 'marry', 'jane')
        await blogContainer.getByRole('button', { name: 'view' }).click()
        await expect(blogContainer.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('and several blogs are created', () => {
      beforeEach(async({ page }) => {
        await createBlog(page, 'Blog Title 1', 'John Doe', 'https://www.blog1.com')
        await createBlog(page, 'Blog Title 2', 'Jane Smith', 'https://www.blog2.com')
        await createBlog(page, 'Blog Title 3', 'Alice Blue', 'https://www.blog3.com')
      })

      test('blogs are arranged in the ascending order according to the likes amount', async({ page }) => {
        const blogContainer1 = page.getByText('Blog Title 1 John Doe').locator('..')
        const blogContainer2 = page.getByText('Blog Title 2 Jane Smith').locator('..')
        const blogContainer3 = page.getByText('Blog Title 3 Alice Blue').locator('..')

        // Add 5 likes to 'Blog 3'
        await blogContainer3.getByRole('button', { name: 'view' }).click()
        for (let i = 0; i < 5; i++) {
          await blogContainer3.getByRole('button', { name: 'like' }).click()
        }

        // Add 2 likes to 'Blog 1'
        await blogContainer1.getByRole('button', { name: 'view' }).click()
        for (let i = 0; i < 5; i++) {
          await blogContainer1.getByRole('button', { name: 'like' }).click()
        }

        const blogContainers = await page.locator('.blog')
        await expect(blogContainers.nth(0)).toContainText('Blog Title 3')
        await expect(blogContainers.nth(1)).toContainText('Blog Title 1')
        await expect(blogContainers.nth(2)).toContainText('Blog Title 2')
      })
    })
  })
})