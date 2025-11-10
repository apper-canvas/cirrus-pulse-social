import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

const Home = lazy(() => import("@/components/pages/Home"))
const Profile = lazy(() => import("@/components/pages/Profile"))
const Messages = lazy(() => import("@/components/pages/Messages"))
const Notifications = lazy(() => import("@/components/pages/Notifications"))
const Friends = lazy(() => import("@/components/pages/Friends"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
)

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "profile/:userId",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "messages",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Messages />
      </Suspense>
    ),
  },
  {
    path: "messages/:conversationId",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Messages />
      </Suspense>
    ),
  },
  {
    path: "notifications",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Notifications />
      </Suspense>
    ),
  },
  {
    path: "friends",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Friends />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    ),
  },
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  },
]

export const router = createBrowserRouter(routes)