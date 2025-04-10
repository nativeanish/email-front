import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { EmailList } from "./components/EmailList";
import { EmailContent } from "./components/EmailContent";
import { Email } from "./types/email";

function App() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEmailListVisible, setIsEmailListVisible] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  const [emails] = useState<Email[]>([
    {
      id: 1,
      from: "Jane Doe",
      subject: "Proposal for Partnership 🎉",
      preview:
        "Hi John, I hope this message finds you well! I'm reaching out to explore...",
      date: "10 Dec 2024 9:00",
      read: false,
    },
    {
      id: 2,
      from: "Michael Lee",
      subject: "Follow-Up: Product Demo Feedback",
      preview:
        "Hi John, Thank you for attending the product demonstration yesterday...",
      date: "9:00",
      read: true,
    },
    // Adding more test emails to demonstrate scrolling
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 3,
      from: `Test User ${i + 1}`,
      subject: `Test Email ${i + 1}`,
      preview: "This is a test email to demonstrate the scrolling behavior...",
      date: "9:00",
      read: true,
    })),
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    setIsNewMessageOpen(false);
    if (window.innerWidth < 768) {
      setIsEmailListVisible(false);
    }
  };

  const handleBackToList = () => {
    setIsEmailListVisible(true);
    setSelectedEmail(null);
  };

  const handleNewMessage = () => {
    setIsNewMessageOpen(true);
    setSelectedEmail(null);
    if (window.innerWidth < 768) {
      setIsEmailListVisible(false);
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <Sidebar
        isDarkMode={isDarkMode}
        isSidebarOpen={isSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarOpen={setIsSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col h-full">
        <Header
          isDarkMode={isDarkMode}
          setIsSidebarOpen={setIsSidebarOpen}
          toggleTheme={toggleTheme}
          onNewMessage={handleNewMessage}
        />

        <div
          className={`flex-1 flex md:flex-row flex-col overflow-hidden ${
            isDarkMode ? "bg-black" : "bg-gray-50"
          }`}
        >
          <EmailList
            isDarkMode={isDarkMode}
            isEmailListVisible={isEmailListVisible}
            emails={emails}
            selectedEmail={selectedEmail}
            handleEmailSelect={handleEmailSelect}
          />

          <EmailContent
            isDarkMode={isDarkMode}
            isEmailListVisible={isEmailListVisible}
            selectedEmail={selectedEmail}
            handleBackToList={handleBackToList}
            isNewMessageOpen={isNewMessageOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
