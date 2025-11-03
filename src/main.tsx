import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './routes/Home.tsx'
import NotFound from './routes/NotFound.tsx';
import Footer from './components/Footer.tsx';
import WIP from './routes/WIP.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/wmcooking'> 
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-1 flex p-5'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wip" element={<WIP />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  </StrictMode>,
);