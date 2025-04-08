import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { WebStorageStateStore } from "oidc-client-ts"
import { AuthProvider } from "react-oidc-context"

const oidcConfig = {
  authority: "https://instance1-el5q1i.zitadel.cloud/",
  client_id: "312751992336403117",
  redirect_uri: "https://cesieat.nathan-lorit.com/commercial/",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  scope: "openid profile email", // Ensure needed scopes are requested
  response_type: "code",
  loadUserInfo: true, // Important to fetch additional claims
  // ...
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
