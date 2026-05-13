import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client'
import client from './apolloClient.ts'
import './styles/global.css'

if (!localStorage.getItem("app_guest_id")) {
    localStorage.setItem("app_guest_id", crypto.randomUUID());
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>  
    </StrictMode>,
)
