import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/authContext';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ContentBlueprintPage from './pages/ContentBlueprintPage';
import ContentReviewPage from './pages/ContentReviewPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/content-blueprint"
            element={
              <ProtectedRoute>
                <ContentBlueprintPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content-review"
            element={
              <ProtectedRoute>
                <ContentReviewPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
