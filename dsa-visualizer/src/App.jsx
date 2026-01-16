import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArrayVisualizer from './pages/ArrayVisualizer';
import StackVisualizer from './pages/StackVisualizer';
import QueueVisualizer from './pages/QueueVisualizer';
import SortingVisualizer from './pages/SortingVisualizer';
import { styles } from './styles/styles';

/**
 * Main App Component
 * Handles routing between different pages using state
 */
function App() {
  // State: tracks which page is currently active
  const [currentPage, setCurrentPage] = useState('Home');

  /**
   * Render the appropriate page component based on currentPage
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home onNavigate={setCurrentPage} />;
      case 'Array':
        return <ArrayVisualizer />;
      case 'Stack':
        return <StackVisualizer />;
      case 'Queue':
        return <QueueVisualizer />;
      case 'Sorting':
        return <SortingVisualizer />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div style={styles.app}>
      {/* Navigation bar - always visible */}
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {/* Main content area - changes based on current page */}
      <div style={styles.content}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;