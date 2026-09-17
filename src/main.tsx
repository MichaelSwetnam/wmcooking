import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx';
import NotFound from './routes/NotFound.tsx';
import Health from './routes/Health.tsx';
import Home from './routes/Home.tsx';
import EventPage from './routes/EventPage.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import QueryClient from './lib/database/QueryClient.ts';
import { UserProvider } from './components/Auth/UserProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={QueryClient}>
    <BrowserRouter> 
          <div className='flex flex-col min-h-screen'>
            <UserProvider>
              <Header />
              <main className='flex-1 flex p-5'>
                <div className='w-full bg-linear-to-b from-orange-50 via-white to-orange-100 rounded-xl p-3'>
                  <Routes>
		    <Route path="/events/:id" element={<EventPage />} />
                    <Route path="/health" element={<Health />} />
                    <Route path="/" element={<Home />} />
                    {/* 
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventPage />} />
                    <Route path="/events/:id/edit" element={<EditEvent />} />
                    <Route path="/profile" element={<Profile />} />
                    */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
              <Footer />
           </UserProvider>
          </div>
        </BrowserRouter>
  </QueryClientProvider>
);
