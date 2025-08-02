# TRS Frontend

A modern Next.js frontend application for the Transport Reporting System, built with TypeScript, Tailwind CSS, and Shadcn UI components.

## 🚀 Features

- **Modern Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** with custom design system
- **Shadcn UI** components with Radix UI primitives
- **Responsive Layout System** with mobile-first design
- **Theme Support** with dark/light mode
- **Professional UI Components** (cards, buttons, forms, modals, etc.)
- **Mock Data** for demonstration purposes

## 🏗️ Architecture

### Layout System

The application uses a comprehensive layout system:

- **Container**: Responsive container with consistent max-width and padding
- **DefaultLayout**: Main layout wrapper with navbar and optional sidebar
- **Navbar**: Top navigation with user menu and responsive design
- **Sidebar**: Collapsible sidebar with navigation items

### Component Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── layout/            # Layout components
│   │   ├── Container.tsx
│   │   ├── DefaultLayout.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── ui/               # Shadcn UI components
├── lib/
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
```

## 🎨 Design System

### Colors
- **Primary**: Professional dark gray
- **Secondary**: Light gray for subtle elements
- **Accent**: Blue for interactive elements
- **Destructive**: Red for error states
- **Muted**: Gray for secondary text

### Typography
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first approach
- **Hierarchy**: Clear heading structure

### Components
- **Cards**: Information containers
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Input fields, labels, validation
- **Modals**: Dialog and sheet components
- **Navigation**: Dropdown menus, sidebar navigation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trs-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Full-width layout with collapsible sidebar
- **Tablet**: Responsive grid layouts
- **Desktop**: Full sidebar with collapsible functionality

### Breakpoints
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

## 🎯 Key Features

### Layout Components

#### Container
```tsx
import { Container } from '@/components/layout'

<Container>
  {/* Your content here */}
</Container>
```

#### DefaultLayout
```tsx
import { DefaultLayout } from '@/components/layout'

<DefaultLayout
  eventId="123"
  title="Event Name"
  subtitle="Event Description"
  showSidebar={true}
>
  {/* Your page content */}
</DefaultLayout>
```

### Theme Support

The application supports both light and dark themes:

- **System**: Automatically follows system preference
- **Light**: Clean, professional light theme
- **Dark**: Easy on the eyes dark theme

### Mock Data

The application includes mock data for demonstration:

- **Events**: Sample events with details
- **Users**: Demo user information
- **Statistics**: Dashboard metrics
- **Navigation**: Sidebar menu items

## 🔧 Customization

### Adding New Components

1. Use Shadcn UI CLI:
```bash
npx shadcn@latest add <component-name>
```

2. Create custom components in `src/components/`

### Styling

- Use Tailwind CSS classes for styling
- Follow the design system color palette
- Maintain responsive design principles

### Layout Customization

- Modify `DefaultLayout.tsx` for layout changes
- Update `Sidebar.tsx` for navigation changes
- Customize `Navbar.tsx` for header modifications

## 📦 Dependencies

### Core
- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety

### Styling
- **Tailwind CSS v4**: Utility-first CSS
- **class-variance-authority**: Component variants
- **clsx**: Conditional classes
- **tailwind-merge**: Class merging

### UI Components
- **Radix UI**: Accessible primitives
- **Shadcn UI**: Component library
- **Lucide React**: Icons

### Utilities
- **next-themes**: Theme management
- **sonner**: Toast notifications
- **date-fns**: Date utilities
- **react-hook-form**: Form handling
- **zod**: Schema validation

## 🎨 Design Principles

1. **Mobile-First**: Design for mobile, enhance for desktop
2. **Accessibility**: WCAG compliant components
3. **Performance**: Optimized for speed
4. **Maintainability**: Clean, documented code
5. **Consistency**: Unified design system

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository.
