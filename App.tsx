import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { ProjectDataProvider } from './contexts/ProjectDataContext';
import { ProjectMembersProvider } from './contexts/ProjectMembersContext';
import { AuthGuard } from './components/AuthGuard';
import { ProjectSelector } from './components/ProjectSelector';
import { MainApp } from './components/MainApp';
import { InvitationAcceptPage } from './components/InvitationAcceptPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <ProjectDataProvider>
            <ProjectMembersProvider>
              <Routes>
                <Route path="/invite" element={
                  <AuthGuard>
                    <InvitationAcceptPage />
                  </AuthGuard>
                } />
                <Route path="/*" element={
                  <div className="min-h-screen bg-gray-50">
                    <AuthGuard>
                      <ProjectSelector>
                        <MainApp />
                      </ProjectSelector>
                    </AuthGuard>
                  </div>
                } />
              </Routes>
            </ProjectMembersProvider>
          </ProjectDataProvider>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;