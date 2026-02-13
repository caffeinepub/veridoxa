import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import SectionListPage from './pages/SectionListPage';
import EntryDetailPage from './pages/EntryDetailPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import IntroductionPage from './pages/IntroductionPage';
import WorksListPage from './pages/WorksListPage';
import WorkDetailPage from './pages/WorkDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminEditorPage from './pages/admin/AdminEditorPage';
import AdminWorksPage from './pages/admin/AdminWorksPage';
import AdminWorkUploadPage from './pages/admin/AdminWorkUploadPage';
import AdminGuard from './components/auth/AdminGuard';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
      <Toaster />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const introductionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/introduction',
  component: IntroductionPage,
});

const researchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/research',
  component: () => <SectionListPage section="research" />,
});

const storytellingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/storytelling',
  component: () => <SectionListPage section="storytelling" />,
});

const poetryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/poetry',
  component: () => <SectionListPage section="poetry" />,
});

const entryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$section/$id',
  component: EntryDetailPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const worksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/works',
  component: WorksListPage,
});

const workDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/works/$id',
  component: WorkDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminDashboardPage />
    </AdminGuard>
  ),
});

const adminNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/new',
  component: () => (
    <AdminGuard>
      <AdminEditorPage />
    </AdminGuard>
  ),
});

const adminEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/edit/$id',
  component: () => (
    <AdminGuard>
      <AdminEditorPage />
    </AdminGuard>
  ),
});

const adminWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/works',
  component: () => (
    <AdminGuard>
      <AdminWorksPage />
    </AdminGuard>
  ),
});

const adminWorkUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/works/upload',
  component: () => (
    <AdminGuard>
      <AdminWorkUploadPage />
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  introductionRoute,
  researchRoute,
  storytellingRoute,
  poetryRoute,
  entryDetailRoute,
  searchRoute,
  aboutRoute,
  worksRoute,
  workDetailRoute,
  adminRoute,
  adminNewRoute,
  adminEditRoute,
  adminWorksRoute,
  adminWorkUploadRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
