import { styles } from '../styles/styles';

/**
 * Home Page Component
 * Landing page with overview cards for each visualizer
 * @param {function} onNavigate - Callback to navigate to other pages
 */
function Home({ onNavigate }) {
  // List of available visualizers with descriptions
  const visualizers = [
    { 
      name: 'Array', 
      description: 'Insert and delete elements from an array', 
      page: 'Array' 
    },
    { 
      name: 'Stack', 
      description: 'Push and pop elements (LIFO)', 
      page: 'Stack' 
    },
    { 
      name: 'Queue', 
      description: 'Enqueue and dequeue elements (FIFO)', 
      page: 'Queue' 
    },
    { 
      name: 'Sorting', 
      description: 'Visualize Bubble Sort algorithm', 
      page: 'Sorting' 
    }
  ];

  return (
    <div style={styles.home}>
      <h1 style={styles.homeTitle}>Welcome to DSA Visualizer</h1>
      <p style={styles.homeSubtitle}>
        Learn data structures and algorithms through interactive visualizations
      </p>
      
      {/* Grid of visualizer cards */}
      <div style={styles.cardGrid}>
        {visualizers.map(vis => (
          <div key={vis.name} style={styles.card}>
            <h3 style={styles.cardTitle}>{vis.name}</h3>
            <p style={styles.cardDescription}>{vis.description}</p>
            <button 
              onClick={() => onNavigate(vis.page)}
              style={styles.cardButton}
            >
              Try it →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;