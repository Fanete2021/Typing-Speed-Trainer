import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import {StoreProvider} from "./app/providers/StoreProvider";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  // </StrictMode>,
)
