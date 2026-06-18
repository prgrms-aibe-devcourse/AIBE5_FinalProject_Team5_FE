import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { BookmarkProvider } from './contexts/BookmarkContext.tsx'
import { CompareCoursesProvider } from './contexts/CompareCoursesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BookmarkProvider>
        <CompareCoursesProvider>
          <App />
        </CompareCoursesProvider>
      </BookmarkProvider>
    </BrowserRouter>
  </StrictMode>,
)
