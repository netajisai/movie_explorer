# 🎬 Movie Explorer - Frontend

A modern, responsive React + TypeScript application for exploring movies, actors, and directors.

## ✨ Features

- **🎥 Browse Movies** - Explore a comprehensive catalog with beautiful poster displays
- **🔍 Advanced Filtering** - Filter by genre, year, rating, director, and actor
- **⭐ Movie Details** - View complete information including cast, reviews, and related movies
- **📝 Add Reviews** - Rate and review your favorite movies
- **👥 Actor & Director Profiles** - Explore filmographies and biographies
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile
- **🚀 Fast Performance** - Built with Vite and React Query for optimal speed
- **♿ Accessible** - WCAG compliant with semantic HTML

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Data fetching & caching
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see [backend README](../backend/README.md))

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/
│   └── movie-icon.svg          # Favicon
├── src/
│   ├── components/             # Reusable components
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Footer.tsx         # Footer component
│   │   ├── MovieCard.tsx      # Movie card display
│   │   ├── PersonCard.tsx     # Actor/Director card
│   │   ├── Pagination.tsx     # Pagination controls
│   │   ├── LoadingSkeleton.tsx # Loading states
│   │   └── ErrorMessage.tsx   # Error displays
│   ├── pages/                  # Page components
│   │   ├── Home.tsx           # Movies list & filters
│   │   ├── MovieDetail.tsx    # Movie detail page
│   │   ├── ActorDetail.tsx    # Actor profile page
│   │   ├── DirectorDetail.tsx # Director profile page
│   │   ├── ActorsList.tsx     # All actors list
│   │   ├── DirectorsList.tsx  # All directors list
│   │   └── NotFound.tsx       # 404 page
│   ├── services/               # API services
│   │   └── api.ts             # API client & endpoints
│   ├── types/                  # TypeScript types
│   │   └── index.ts           # Type definitions
│   ├── utils/                  # Utility functions
│   │   └── helpers.ts         # Helper functions
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── tailwind.config.js         # Tailwind config
├── postcss.config.js          # PostCSS config
└── README.md
```

## 🎨 Key Features Breakdown

### Home Page
- Movie grid with posters and key info
- Advanced filtering sidebar
  - Genre filter (dropdown)
  - Release year filter
  - Rating filter (4.5+, 4.0+, etc.)
  - Sort options
- Search functionality
- Pagination
- Responsive grid layout

### Movie Detail Page
- Backdrop hero section
- Movie information
  - Title, year, duration, rating
  - Description
  - Director info
  - Cast list
  - Genres
- Review system
  - View existing reviews
  - Add new review with rating
- Related movies suggestions
- Responsive design

### Actor/Director Pages
- Profile information
  - Name, nationality, birth date
  - Biography
  - Profile image
  - Awards (directors)
- Complete filmography
  - All movies worked on
  - Clickable movie posters
- Responsive layout

## 🎯 API Integration

The frontend connects to the backend API at `http://localhost:8000/api/v1`

### Main API Endpoints Used:

```typescript
// Movies
GET    /movies                 # List with filters
GET    /movies/:id             # Single movie
GET    /movies/:id/related     # Related movies
POST   /movies/:id/reviews     # Add review

// Actors
GET    /actors                 # List all
GET    /actors/:id             # Single actor
GET    /actors/:id/movies      # Actor's movies

// Directors
GET    /directors              # List all
GET    /directors/:id          # Single director
GET    /directors/:id/movies   # Director's movies

// Genres
GET    /genres                 # List all
```

## 🎨 Styling Approach

### Tailwind CSS Utility Classes

We use Tailwind's utility-first approach:

```tsx
<div className="card p-6 hover:shadow-lg transition-shadow">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">
    Title
  </h2>
</div>
```

### Custom Components

Reusable button and card classes in `index.css`:

```css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all;
}

.card {
  @apply bg-white rounded-xl shadow-sm border;
}
```

## 📱 Responsive Design

Mobile-first approach with breakpoints:

- **sm**: 640px (tablet)
- **md**: 768px (small desktop)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

Example:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Responsive grid */}
</div>
```

## 🔄 State Management

Using React Query for server state:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['movies', filters],
  queryFn: () => moviesApi.getAll(filters),
});
```

Benefits:
- Automatic caching
- Background refetching
- Loading states
- Error handling
- Optimistic updates

## 🚦 Routing

Client-side routing with React Router:

```typescript
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="movies/:id" element={<MovieDetail />} />
    <Route path="actors" element={<ActorsList />} />
    // ... more routes
  </Route>
</Routes>
```

## 🎭 Component Patterns

### Loading States

```tsx
{isLoading && <MovieCardSkeleton />}
{data && <MovieCard movie={data} />}
```

### Error Handling

```tsx
{error && (
  <ErrorMessage 
    message="Failed to load" 
    onRetry={refetch} 
  />
)}
```

### Conditional Rendering

```tsx
{data.length > 0 ? (
  <MovieGrid movies={data} />
) : (
  <EmptyState />
)}
```

## 🔍 Search & Filters

Filters are managed in URL params:

```typescript
const [searchParams, setSearchParams] = useSearchParams();

// Update URL
setSearchParams({ 
  genre_id: '123', 
  release_year: '2010' 
});
```

Benefits:
- Shareable URLs
- Browser history
- Direct links to filtered results

## 🎨 Icons

Using Lucide React for consistent icons:

```tsx
import { Star, Calendar, User } from 'lucide-react';

<Star className="w-5 h-5 text-yellow-500" />
```

## 🐛 Debugging

### Enable React DevTools

Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)

### Enable React Query DevTools

Add to `App.tsx`:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### View Network Requests

Open browser DevTools → Network tab

## 🚀 Performance Optimization

### Implemented Optimizations:

1. **Code Splitting** - Lazy load routes
2. **Image Optimization** - Lazy loading images
3. **React Query Caching** - 5min stale time
4. **Debounced Search** - Reduce API calls
5. **Pagination** - Load data in chunks
6. **Skeleton Loaders** - Better perceived performance

## 📦 Build & Deploy

### Build

```bash
npm run build
```

Output in `dist/` folder

### Preview Build

```bash
npm run preview
```

### Deploy Options

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-p", "3000"]
```

## 🧪 Testing (Future Enhancement)

Recommended testing setup:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

## 🛠️ Development Tips

### Hot Module Replacement

Vite provides instant HMR - changes reflect immediately

### TypeScript Strict Mode

All type errors must be fixed before build

### Linting

```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint -- --fix
```

## 📄 Environment Variables

Available variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🤝 Contributing

1. Follow existing code style
2. Use TypeScript types
3. Add proper error handling
4. Test responsiveness
5. Update documentation

## 📝 License

MIT License - see LICENSE file

## 👤 Author

**Netaji Sai**
- GitHub: [@netajisai](https://github.com/netajisai)

## 🙏 Acknowledgments

- React team for the amazing library
- Tailwind CSS for the utility framework
- Lucide for beautiful icons
- FastAPI for the backend framework

---

**Need Help?** Open an issue on GitHub!

**⭐ Star this repo if you find it useful!**