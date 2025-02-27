import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import studio from '@theatre/studio'
import MMDState from './MMD.theatre-project-state.json'

localStorage.setItem('theatre-0.4.persistent', JSON.stringify(MMDState))
// localStorage.removeItem("theatre-0.4.persistent")
studio.initialize()

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
