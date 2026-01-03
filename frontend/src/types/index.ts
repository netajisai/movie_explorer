// Base types
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Genre types
export interface Genre extends BaseEntity {
  name: string;
  description?: string;
}

export interface GenreMinimal {
  id: string;
  name: string;
}

// Actor types
export interface Actor extends BaseEntity {
  name: string;
  bio?: string;
  birth_date?: string;
  nationality?: string;
  profile_image?: string;
}

export interface ActorMinimal {
  id: string;
  name: string;
}

// Director types
export interface Director extends BaseEntity {
  name: string;
  bio?: string;
  birth_date?: string;
  nationality?: string;
  profile_image?: string;
  awards?: string[];
}

export interface DirectorMinimal {
  id: string;
  name: string;
}

// Movie types
export interface Review {
  rating: number;
  comment: string;
  created_at: string;
}

export interface Ratings {
  average: number;
  count: number;
  reviews: Review[];
}

export interface Movie extends BaseEntity {
  title: string;
  description?: string;
  release_year: number;
  duration_minutes?: number;
  poster_url?: string;
  backdrop_url?: string;
  director?: DirectorMinimal;
  actors: ActorMinimal[];
  genres: GenreMinimal[];
  ratings: Ratings;
}

export interface MovieListItem {
  id: string;
  title: string;
  release_year: number;
  poster_url?: string;
  director_name?: string;
  genres: string[];
  average_rating: number;
  rating_count: number;
}

export interface MovieMinimal {
  id: string;
  title: string;
  release_year: number;
  poster_url?: string;
}

// API Response types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  message: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
  timestamp: string;
}

// Filter types
export interface MovieFilters {
  search?: string;
  genre_id?: string;
  director_id?: string;
  actor_id?: string;
  release_year?: number;
  min_rating?: number;
  max_rating?: number;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

// Extended types for detail pages
export interface ActorWithMovies extends Actor {
  movies: MovieMinimal[];
}

export interface DirectorWithMovies extends Director {
  movies: MovieMinimal[];
}