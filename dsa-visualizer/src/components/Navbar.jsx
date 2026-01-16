import { styles } from '../styles/styles';

/**
 * Navbar Component
 * Displays the application header with navigation buttons
 * @param {string} currentPage - Currently active page
 * @param {function} onNavigate - Callback to handle page navigation
 */
function Navbar({ currentPage, onNavigate }) {
  const pages = ['Home', 'Array', 'Stack', 'Queue', 'Sorting'];
  
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>DSA Visualizer</h2>
      <div style={styles.navLinks}>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            style={{
              ...styles.navButton,
              ...(currentPage === page ? styles.navButtonActive : {})
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;