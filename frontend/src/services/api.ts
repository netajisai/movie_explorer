import axios, { AxiosError } from 'axios';
import type {
  Movie,
  MovieListItem,
  Actor,
  Director,
  Genre,
  ApiResponse,
  ListResponse,
  MovieFilters,
  MovieMinimal,
  Review,
} from '@/types';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = 'http://localhost:8000';


const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Movies API - Updated to match your backend
export const moviesApi = {
  // GET /api/v1/movies - List all with optional filters
  getAll: async (filters?: MovieFilters): Promise<ListResponse<MovieListItem>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.genre_id) params.append('genre_id', filters.genre_id);
    if (filters?.director_id) params.append('director_id', filters.director_id);
    if (filters?.actor_id) params.append('actor_id', filters.actor_id);
    if (filters?.release_year) params.append('release_year', filters.release_year.toString());
    if (filters?.min_rating !== undefined) params.append('min_rating', filters.min_rating.toString());
    if (filters?.max_rating !== undefined) params.append('max_rating', filters.max_rating.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.order) params.append('order', filters.order);

    const { data } = await api.get<ListResponse<MovieListItem>>(`/movies?${params.toString()}`);
    return data;
  },

  // GET /api/v1/movies/filter - Filtered movies
  filter: async (filters: MovieFilters): Promise<ListResponse<MovieListItem>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const { data } = await api.get<ListResponse<MovieListItem>>(`/movies/filter?${params.toString()}`);
    return data;
  },

  // GET /api/v1/movies/{movie_id}
  getById: async (id: string): Promise<Movie> => {
    const { data } = await api.get<ApiResponse<Movie>>(`/movies/${id}`);
    return data.data;
  },

  // POST /api/v1/movies
  create: async (movieData: any): Promise<Movie> => {
    const { data } = await api.post<ApiResponse<Movie>>('/movies', movieData);
    return data.data;
  },

  // PUT /api/v1/movies/{movie_id}
  update: async (id: string, movieData: any): Promise<Movie> => {
    const { data } = await api.put<ApiResponse<Movie>>(`/movies/${id}`, movieData);
    return data.data;
  },

  // DELETE /api/v1/movies/{movie_id}
  delete: async (id: string): Promise<void> => {
    await api.delete(`/movies/${id}`);
  },

  // POST /api/v1/movies/{movie_id}/reviews
  addReview: async (id: string, rating: number, comment: string): Promise<Movie> => {
    const { data } = await api.post<ApiResponse<Movie>>(`/movies/${id}/reviews`, {
      rating,
      comment,
    });
    return data.data;
  },

  // GET /api/v1/movies/{movie_id}/reviews
  getReviews: async (id: string): Promise<Review[]> => {
    const { data } = await api.get<ApiResponse<Review[]>>(`/movies/${id}/reviews`);
    return data.data;
  },
};

// Actors API - Updated to match your backend
export const actorsApi = {
  // GET /api/v1/actors
  getAll: async (page = 1, limit = 20, search?: string): Promise<ListResponse<Actor>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const { data } = await api.get<ListResponse<Actor>>(`/actors?${params.toString()}`);
    return data;
  },

  // GET /api/v1/actors/{actor_id}
  getById: async (id: string): Promise<Actor> => {
    const { data } = await api.get<ApiResponse<Actor>>(`/actors/${id}`);
    return data.data;
  },

  // POST /api/v1/actors
  create: async (actorData: any): Promise<Actor> => {
    const { data } = await api.post<ApiResponse<Actor>>('/actors', actorData);
    return data.data;
  },

  // PUT /api/v1/actors/{actor_id}
  update: async (id: string, actorData: any): Promise<Actor> => {
    const { data } = await api.put<ApiResponse<Actor>>(`/actors/${id}`, actorData);
    return data.data;
  },

  // DELETE /api/v1/actors/{actor_id}
  delete: async (id: string): Promise<void> => {
    await api.delete(`/actors/${id}`);
  },

  // Get actor's movies (if your backend has this endpoint)
  getMovies: async (id: string): Promise<MovieMinimal[]> => {
    if (!id) return [];

    try {
      const { data } = await api.get<ApiResponse<MovieMinimal[]>>(`/actors/${id}/movies`);
      return data.data.map((m: any) => ({
        id: m.id ?? m._id,
        title: m.title,
        release_year: m.release_year,
        poster_url: m.poster_url,
      }));
    } catch (error) {
      // If endpoint doesn't exist, fetch movies filtered by actor using the filter endpoint
      const moviesData = await moviesApi.filter({ actor_id: id, limit: 100, page: 1 });
      return moviesData.data.map((movie: any) => ({
        id: movie.id ?? movie._id,
        title: movie.title,
        release_year: movie.release_year,
        poster_url: movie.poster_url,
      }));
    }
  },

  search: async (query: string): Promise<Actor[]> => {
    const { data } = await api.get<ListResponse<Actor>>(`/actors?search=${query}&limit=50`);
    return data.data;
  },
};

// Directors API - Updated to match your backend
export const directorsApi = {
  // GET /api/v1/directors
  getAll: async (page = 1, limit = 20, search?: string): Promise<ListResponse<Director>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const { data } = await api.get<ListResponse<Director>>(`/directors?${params.toString()}`);
    return data;
  },

  // GET /api/v1/directors/{director_id}
  getById: async (id: string): Promise<Director> => {
    const { data } = await api.get<ApiResponse<Director>>(`/directors/${id}`);
    return data.data;
  },

  // POST /api/v1/directors
  create: async (directorData: any): Promise<Director> => {
    const { data } = await api.post<ApiResponse<Director>>('/directors', directorData);
    return data.data;
  },

  // PUT /api/v1/directors/{director_id}
  update: async (id: string, directorData: any): Promise<Director> => {
    const { data } = await api.put<ApiResponse<Director>>(`/directors/${id}`, directorData);
    return data.data;
  },

  // DELETE /api/v1/directors/{director_id}
  delete: async (id: string): Promise<void> => {
    await api.delete(`/directors/${id}`);
  },

  // Get director's movies
  getMovies: async (id: string): Promise<MovieMinimal[]> => {
    if (!id) return [];

    try {
      const { data } = await api.get<ApiResponse<MovieMinimal[]>>(`/directors/${id}/movies`);
      return data.data.map((m: any) => ({
        id: m.id ?? m._id,
        title: m.title,
        release_year: m.release_year,
        poster_url: m.poster_url,
      }));
    } catch (error) {
      // If endpoint doesn't exist, fetch movies filtered by director using the filter endpoint
      const moviesData = await moviesApi.filter({ director_id: id, limit: 100, page: 1 });
      return moviesData.data.map((movie: any) => ({
        id: movie.id ?? movie._id,
        title: movie.title,
        release_year: movie.release_year,
        poster_url: movie.poster_url,
      }));
    }
  },

  search: async (query: string): Promise<Director[]> => {
    const { data } = await api.get<ListResponse<Director>>(`/directors?search=${query}&limit=50`);
    return data.data;
  },
};

// Genres API - Updated to match your backend
export const genresApi = {
  // GET /api/v1/genres
  getAll: async (page = 1, limit = 100): Promise<Genre[]> => {
    const { data } = await api.get<ListResponse<Genre>>(`/genres?page=${page}&limit=${limit}`);
    return data.data;
  },

  // GET /api/v1/genres/{genre_id}
  getById: async (id: string): Promise<Genre> => {
    const { data } = await api.get<ApiResponse<Genre>>(`/genres/${id}`);
    return data.data;
  },

  // POST /api/v1/genres
  create: async (genreData: any): Promise<Genre> => {
    const { data } = await api.post<ApiResponse<Genre>>('/genres', genreData);
    return data.data;
  },

  // PUT /api/v1/genres/{genre_id}
  update: async (id: string, genreData: any): Promise<Genre> => {
    const { data } = await api.put<ApiResponse<Genre>>(`/genres/${id}`, genreData);
    return data.data;
  },

  // DELETE /api/v1/genres/{genre_id}
  delete: async (id: string): Promise<void> => {
    await api.delete(`/genres/${id}`);
  },
};

// Health API
export const healthApi = {
  check: async () => {
    const { data } = await api.get('/health');
    return data;
  },

  stats: async () => {
    const { data } = await api.get('/health/stats');
    return data;
  },
};

export default api;