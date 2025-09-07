import { useState } from "react";
import StarField from "./components/StarField";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import History from "./components/History";
import Uploads from "./components/Uploads";
import RightPanel from "./components/RightPanel";

export default function App() {
  const [activeSection, setActiveSection] = useState("chat");
  const [isRightPanelExpanded, setIsRightPanelExpanded] =
    useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const renderMainContent = () => {
    switch (activeSection) {
      case "chat":
        return <Chat />;
      case "history":
        return <History onSectionChange={setActiveSection} />;
      case "uploads":
        return <Uploads />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white dark relative overflow-hidden">
      {/* Animated Star Background */}
      <StarField />

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="relative z-1">
        <div
          className={`
          transition-all duration-300
          ${isSidebarCollapsed ? "ml-16" : "ml-64"}
          ${activeSection === "chat" && isRightPanelExpanded ? "mr-96" : "mr-0"}
          ${activeSection === "chat" ? "mr-12" : "mr-0"}
        `}
        >
          <div
            className={`
            min-h-screen p-6
            ${activeSection === "chat" ? "flex flex-col" : ""}
          `}
          >
            {activeSection === "chat" ? (
              <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-lg border border-purple-900/30 overflow-hidden">
                <Chat />
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                {renderMainContent()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Only show for chat */}
      {activeSection === "chat" && (
        <RightPanel
          isExpanded={isRightPanelExpanded}
          onToggle={() =>
            setIsRightPanelExpanded(!isRightPanelExpanded)
          }
        />
      )}
    </div>
  );
}