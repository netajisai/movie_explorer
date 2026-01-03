import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import ActorDetail from './pages/ActorDetail';
import DirectorDetail from './pages/DirectorDetail';
import ActorsList from './pages/ActorsList';
import DirectorsList from './pages/DirectorsList';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movies/:id" element={<MovieDetail />} />
            <Route path="actors" element={<ActorsList />} />
            <Route path="actors/:id" element={<ActorDetail />} />
            <Route path="directors" element={<DirectorsList />} />
            <Route path="directors/:id" element={<DirectorDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;