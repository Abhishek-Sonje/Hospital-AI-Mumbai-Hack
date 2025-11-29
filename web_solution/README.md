# Hospital AI Operations Dashboard

A production-grade web dashboard for AI-powered hospital operations management, designed specifically for Indian hospitals to handle patient surges, staffing, inventory, beds, and advisories.

## 🎯 Project Overview

This dashboard helps hospitals predict and manage:
- **Patient Surges** during festivals (Diwali, Holi), pollution spikes, and epidemics
- **Staff Scheduling** with AI-optimized rosters and overtime management
- **Inventory Management** with forecasting and automated reorder suggestions
- **Bed & Ward Management** with occupancy tracking and ICU reservations
- **Alert System** for public advisories and staff notifications
- **Appointment Management** with surge-aware rescheduling
- **Autonomous Planning** with AI-generated action plans

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **UI Library**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **State Management**: React Query (TanStack Query) ready
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes (Light/Dark mode)
- **Icons**: lucide-react
- **Date Utilities**: date-fns

## 📁 Project Structure

```
Hospital_AI_gemini/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx               # Root layout with theme provider
│   │   ├── page.tsx                 # Dashboard (Patient Surge Prediction)
│   │   ├── staff-scheduling/        # Staff scheduling page
│   │   ├── inventory/               # Inventory management page
│   │   ├── beds/                    # Bed & ward management page
│   │   ├── alerts/                  # Alert system page
│   │   ├── appointments/            # Appointment management page
│   │   ├── planner/                 # Autonomous planner page
│   │   └── admin/                   # Admin pages
│   │       ├── roles/               # User roles management
│   │       └── audit-logs/          # System audit logs
│   │
│   ├── components/                   # React components
│   │   ├── layout/                  # Layout components
│   │   │   ├── sidebar.tsx          # Navigation sidebar
│   │   │   └── topbar.tsx           # Top bar with weather/AQI
│   │   ├── dashboard/               # Dashboard components
│   │   │   ├── metrics-cards.tsx
│   │   │   ├── surge-chart.tsx
│   │   │   ├── context-panel.tsx
│   │   │   └── impact-summary.tsx
│   │   ├── staffing/                # Staff scheduling components
│   │   ├── inventory/               # Inventory components
│   │   ├── beds/                    # Bed management components
│   │   ├── alerts/                  # Alert system components
│   │   ├── appointments/            # Appointment components
│   │   ├── planner/                 # Planner components
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── theme-provider.tsx       # Theme context provider
│   │   └── mode-toggle.tsx          # Dark/light mode toggle
│   │
│   └── lib/                          # Utilities and API
│       ├── api/                     # Mock API layer
│       │   └── index.ts             # Mock data functions
│       ├── types.ts                 # TypeScript interfaces
│       └── utils.ts                 # Utility functions
│
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config
├── next.config.ts                   # Next.js config
└── components.json                  # shadcn/ui config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📊 Current Status

### ✅ Completed Features

- [x] Project initialization with Next.js 14 + TypeScript
- [x] shadcn/ui component library setup
- [x] Theme provider (Light/Dark mode)
- [x] App shell (Sidebar, Topbar, Layout)
- [x] Mock API layer with TypeScript types
- [x] **Dashboard Page**: Surge forecasting, metrics, context panel
- [x] **Staff Scheduling Page**: Roster table, constraints, risk summary
- [x] **Inventory Page**: Item table, usage forecasts, reorder suggestions
- [x] **Beds Page**: Occupancy charts, ward status, AI suggestions
- [x] **Alerts Page**: Public advisories, staff notifications, auto-draft
- [x] **Appointments Page**: Surge-aware appointment management
- [x] **Planner Page**: Unified AI plan management
- [x] **Admin Pages**: Roles management, audit logs

### 🔄 Next Steps to Complete the Project

#### 1. Backend Integration (HIGH PRIORITY)

**Current State**: All API calls use mock data from `src/lib/api/index.ts`

**What to do**:
- Replace mock functions with real FastAPI endpoints
- Set up environment variables for API base URL:
  ```bash
  # .env.local
  NEXT_PUBLIC_API_URL=http://your-backend-url
  ```
- Update `src/lib/api/index.ts` to make real HTTP requests:
  ```typescript
  export const getSurgeForecast = async (): Promise<ForecastData[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forecast`);
    return response.json();
  };
  ```
- Add error handling and loading states
- Implement React Query for caching and state management

#### 2. Authentication & Authorization

**What to do**:
- Implement login/logout pages (`/auth/login`)
- Add JWT token management
- Protect routes based on user roles (Admin, Doctor, Nurse, Planner)
- Add role-based UI rendering
- Store user session in cookies/localStorage

**Files to create**:
- `src/app/auth/login/page.tsx`
- `src/lib/auth.ts` - Auth utilities
- `src/middleware.ts` - Route protection

#### 3. Real-time Updates

**What to do**:
- Implement WebSocket connection for live updates
- Add real-time notifications for critical alerts
- Update dashboard metrics automatically
- Show live bed occupancy changes

**Libraries to add**:
```bash
npm install socket.io-client
```

#### 4. Data Persistence & Forms

**What to do**:
- Implement form submissions for:
  - Staff scheduling constraints
  - Inventory reorder approvals
  - Alert drafting and sending
  - Appointment rescheduling
- Add form validation with Zod schemas
- Show success/error toasts after actions

**Files to update**:
- Add `react-hook-form` to all interactive forms
- Create Zod schemas in `src/lib/validations.ts`

#### 5. Enhanced Visualizations

**What to do**:
- Add more interactive charts (click to drill down)
- Implement date range pickers for historical data
- Add export functionality (PDF/CSV) for reports
- Create printable views for schedules

#### 6. Mobile Responsiveness

**What to do**:
- Test on mobile devices (currently optimized for tablets/desktop)
- Add mobile navigation (hamburger menu)
- Optimize charts for small screens
- Test touch interactions

#### 7. Performance Optimization

**What to do**:
- Add React Query for data caching
- Implement pagination for large tables
- Add virtual scrolling for long lists
- Optimize bundle size with code splitting
- Add loading skeletons for better UX

#### 8. Testing

**What to do**:
- Add unit tests with Jest + React Testing Library
- Add E2E tests with Playwright
- Test accessibility (WCAG compliance)
- Test across browsers

**Setup**:
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
npm install -D @playwright/test
```

#### 9. Deployment

**What to do**:
- Set up CI/CD pipeline (GitHub Actions)
- Deploy to Vercel/Netlify (frontend)
- Configure environment variables
- Set up monitoring (Sentry, LogRocket)
- Add analytics (Google Analytics, Mixpanel)

#### 10. Documentation

**What to do**:
- Add JSDoc comments to complex functions
- Create user guide for hospital staff
- Document API integration points
- Add deployment guide

## 🎨 Design System

### Color Palette

The app uses semantic colors:
- **Green**: Safe status, success states
- **Yellow/Orange**: Warning, at-risk states
- **Red**: Critical alerts, danger states
- **Blue**: AI suggestions, informational
- **Purple**: AI-powered features

### Typography

- **Headings**: Geist Sans
- **Body**: Geist Sans
- **Code**: Geist Mono

## 🔧 Development Guidelines

### Adding a New Page

1. Create page file: `src/app/your-page/page.tsx`
2. Add route to sidebar: `src/components/layout/sidebar.tsx`
3. Create components in: `src/components/your-page/`
4. Add mock API function: `src/lib/api/index.ts`
5. Add TypeScript types: `src/lib/types.ts`

### Adding a New shadcn/ui Component

```bash
npx shadcn@latest add component-name
```

### Code Style

- Use TypeScript for all files
- Use "use client" directive for client components
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use semantic HTML elements

## 🐛 Known Issues

- Mock data is static (needs backend integration)
- No authentication implemented yet
- No real-time updates
- Limited mobile optimization
- No data persistence

## 📝 Environment Variables

Create a `.env.local` file:

```env
# API Configuration (when backend is ready)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication (when implemented)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is proprietary software for hospital operations management.

## 👥 Team

- **Frontend**: Next.js Dashboard (Current Implementation)
- **Backend**: FastAPI + ML Models + LangGraph (To be integrated)
- **Database**: PostgreSQL + Redis (To be integrated)

## 📞 Support

For questions or issues, contact the development team.

---

**Last Updated**: November 2025  
**Version**: 1.0.0 (MVP - Mock Data)  
**Next Milestone**: Backend Integration
#   H o s p i t a l - A I - M u m b a i - H a c k s  
 