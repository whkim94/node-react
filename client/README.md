# Invoice Management Client

## Description
React-based client application for the Invoice Management system, built with TypeScript and Vite.

## Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

## Features
- User authentication (login and registration)
- Invoice listing with pagination and sorting
- Invoice details view
- Standardized layout structure with shared components

## Application Structure
- **Pages**: Container components that use layouts and other components
  - `InvoiceListPage`: Uses MainLayout and InvoiceList components
- **Layouts**: Reusable layout components
  - `MainLayout`: Provides the application shell with sidebar, header, and content area
- **Components**: Reusable UI components
  - `InvoiceList`: Handles invoice data display and interaction
  - `InvoiceModal`: Shows detailed invoice information
  - `Pagination`: Handles page navigation for lists

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Connection
This client connects to the Invoice API running on the server. Make sure the server is running before using this client.

## Technologies
- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query (React Query)
- Zod for validation
- Tailwind CSS
