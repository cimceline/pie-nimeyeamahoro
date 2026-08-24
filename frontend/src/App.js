import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminLayout from './components/layout/AdminLayout';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import CookieConsent from './components/common/CookieConsent';
import MobileActionBar from './components/common/MobileActionBar';

const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Education = lazy(() => import('./pages/public/Education'));
const Skills = lazy(() => import('./pages/public/Skills'));
const Experience = lazy(() => import('./pages/public/Experience'));
const Expertise = lazy(() => import('./pages/public/Expertise'));
const Research = lazy(() => import('./pages/public/Research'));
const ResearchDetail = lazy(() => import('./pages/public/ResearchDetail'));
const Publications = lazy(() => import('./pages/public/Publications'));
const PublicationDetail = lazy(() => import('./pages/public/PublicationDetail'));
const Projects = lazy(() => import('./pages/public/Projects'));
const ProjectDetail = lazy(() => import('./pages/public/ProjectDetail'));
const Resources = lazy(() => import('./pages/public/Resources'));
const ResourceDetail = lazy(() => import('./pages/public/ResourceDetail'));
const Services = lazy(() => import('./pages/public/Services'));
const ServiceDetail = lazy(() => import('./pages/public/ServiceDetail'));
const Books = lazy(() => import('./pages/public/Books'));
const BookDetail = lazy(() => import('./pages/public/BookDetail'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Appointments = lazy(() => import('./pages/public/Appointments'));
const Search = lazy(() => import('./pages/public/SearchPage'));

const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Unauthorized = lazy(() => import('./pages/public/Unauthorized'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProfile = lazy(() => import('./pages/admin/Profile'));
const AdminEducation = lazy(() => import('./pages/admin/EducationList'));
const AdminSkills = lazy(() => import('./pages/admin/SkillsList'));
const AdminExperience = lazy(() => import('./pages/admin/ExperienceList'));
const AdminPublications = lazy(() => import('./pages/admin/PublicationsList'));
const AdminResearchProjects = lazy(() => import('./pages/admin/ResearchProjectsList'));
const AdminProjects = lazy(() => import('./pages/admin/ProjectsList'));
const AdminExpertise = lazy(() => import('./pages/admin/ExpertiseList'));
const AdminResources = lazy(() => import('./pages/admin/ResourcesList'));
const AdminServices = lazy(() => import('./pages/admin/ServicesList'));
const AdminServiceRequests = lazy(() => import('./pages/admin/ServiceRequestsList'));
const AdminComments = lazy(() => import('./pages/admin/CommentsList'));
const AdminNewsletter = lazy(() => import('./pages/admin/NewsletterList'));
const AdminContact = lazy(() => import('./pages/admin/ContactList'));
const AdminMedia = lazy(() => import('./pages/admin/MediaList'));
const AdminUsers = lazy(() => import('./pages/admin/UsersList'));
const AdminSettings = lazy(() => import('./pages/admin/SettingsPage'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AuditLogsList'));
const AdminTranslations = lazy(() => import('./pages/admin/TranslationsList'));
const AdminFaqs = lazy(() => import('./pages/admin/FaqsList'));
const AdminTestimonials = lazy(() => import('./pages/admin/TestimonialsList'));
const AdminAcademicTitles = lazy(() => import('./pages/admin/AcademicTitlesList'));
const AdminAnnouncements = lazy(() => import('./pages/admin/AnnouncementsList'));
const AdminBooks = lazy(() => import('./pages/admin/BooksList'));
const AdminAppointments = lazy(() => import('./pages/admin/AppointmentsList'));
const AdminContentVersions = lazy(() => import('./pages/admin/ContentVersions'));
const AdminUsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const AdminSystemHealth = lazy(() => import('./pages/admin/SystemHealth'));

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner className="py-32" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

function AdminRoute({ roles }) {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <AdminLayout>
      <Suspense fallback={<LoadingSpinner className="py-32" />}>
        <Outlet />
      </Suspense>
    </AdminLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
          <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/education" element={<Education />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/expertise" element={<Expertise />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:slug" element={<ResearchDetail />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/publications/:slug" element={<PublicationDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ResourceDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:slug" element={<BookDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/search" element={<Search />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/education" element={<AdminEducation />} />
            <Route path="/admin/skills" element={<AdminSkills />} />
            <Route path="/admin/experience" element={<AdminExperience />} />
            <Route path="/admin/publications" element={<AdminPublications />} />
            <Route path="/admin/research-projects" element={<AdminResearchProjects />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/expertise" element={<AdminExpertise />} />
            <Route path="/admin/resources" element={<AdminResources />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/service-requests" element={<AdminServiceRequests />} />
            <Route path="/admin/comments" element={<AdminComments />} />
            <Route path="/admin/newsletter" element={<AdminNewsletter />} />
            <Route path="/admin/contact" element={<AdminContact />} />
            <Route path="/admin/media" element={<AdminMedia />} />
            <Route path="/admin/faqs" element={<AdminFaqs />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/academic-titles" element={<AdminAcademicTitles />} />
            <Route path="/admin/translations" element={<AdminTranslations />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/content-versions" element={<AdminContentVersions />} />
          </Route>
          <Route element={<AdminRoute roles={['admin']} />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users-management" element={<AdminUsersManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route path="/admin/system-health" element={<AdminSystemHealth />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        </Suspense>
        <CookieConsent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
