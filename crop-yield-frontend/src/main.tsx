import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "aos/dist/aos.css";
import './index.css'
import App from './App.tsx'

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant" as ScrollBehavior,
  });
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
