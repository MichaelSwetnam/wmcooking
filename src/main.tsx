import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './routes/Home.tsx'
import NotFound from './routes/NotFound.tsx';
import Footer from './components/Footer.tsx';
import WIP from './components/Utility/WIP.tsx';
import Events from './routes/Events/Events.tsx';
import EventPage from './routes/EventPage.tsx';
import EditEvent from './routes/EditEvent.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter> 
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 flex p-5'>
        <div className='w-full bg-linear-to-b from-orange-50 via-white to-orange-100 rounded-xl p-3'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wip" element={<WIP />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/events/:id/edit" element={<EditEvent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);