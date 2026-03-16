import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import App from './App.jsx'
import './styles/main.scss'
import './i18n'

// Global Error Catching for Production
window.onerror = function (message, source, lineno, colno, error) {
  console.error("GLOBAL ERROR DETECTED:", { message, source, lineno, colno, error });
};

window.onunhandledrejection = function (event) {
  console.error("UNHANDLED PROMISE REJECTION:", event.reason);
};

console.log("APP BOOTSTRAP: Starting ShieldCheck AI initialization...");

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL APP ERROR (ErrorBoundary):", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 style={{ fontWeight: 900 }}>Algo deu errado na ShieldCheck.</h1>
          <p style={{ maxWidth: '600px', fontSize: '1.2rem' }}>Ocorreu um erro catastrófico que impediu o carregamento do site.</p>
          <pre style={{ background: '#f8f8f8', padding: '15px', borderRadius: '10px', marginTop: '20px', width: '100%', overflowX: 'auto', textAlign: 'left' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Tentar Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("MOUNT ERROR: Element with id 'root' not found!");
  } else {
    console.log("MOUNT SUCCESS: 'root' element found, rendering app...");
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </React.StrictMode>,
    )
  }
} catch (error) {
  console.error("CRITICAL MOUNT ERROR:", error);
}

