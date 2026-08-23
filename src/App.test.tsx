import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('renders the application shell', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Planman' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('shows Today as the default section', () => {
    render(<App />)
    expect(screen.getByRole('main')).toHaveTextContent('Today')
  })

  it('switches sections when a nav item is activated', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: 'Projects' })[0]!)
    expect(screen.getByRole('main')).toHaveTextContent('Projects')
  })
})
