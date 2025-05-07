import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51RJDRSQ7CkXEwtPDJjcQSQsuaNGm3V7bAnUsi0lZiaGEHO6UHIFAuSEoDC3lVQ3KYVbiLxzpzVBuUeBirYk8wZf600anh4fBQj");


createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
)
