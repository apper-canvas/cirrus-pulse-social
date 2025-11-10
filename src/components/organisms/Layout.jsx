import { Outlet, useLocation } from "react-router-dom"
import { useState } from "react"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"
import MobileSidebar from "@/components/organisms/MobileSidebar"
import NotificationPanel from "@/components/organisms/NotificationPanel"
import ChatWindow from "@/components/organisms/ChatWindow"

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [activeChatId, setActiveChatId] = useState(null)
  const location = useLocation()

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)
  const toggleNotificationPanel = () => setIsNotificationPanelOpen(!isNotificationPanelOpen)
  const closeNotificationPanel = () => setIsNotificationPanelOpen(false)

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <Header 
        onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
        onNotificationClick={toggleNotificationPanel}
        onChatOpen={setActiveChatId}
      />

      {/* Main Layout Container */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={closeMobileSidebar}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={isNotificationPanelOpen}
          onClose={closeNotificationPanel}
        />

        {/* Chat Window */}
        {activeChatId && (
          <ChatWindow
            conversationId={activeChatId}
            onClose={() => setActiveChatId(null)}
          />
        )}
      </div>
    </div>
  )
}

export default Layout