import { styles } from '../styles/styles';

/**
 * VisualizerLayout Component
 * Reusable layout wrapper for all visualizer pages
 * @param {string} title - Page title
 * @param {JSX.Element} controls - Control buttons/inputs section
 * @param {JSX.Element} visualization - Visualization display section
 */
function VisualizerLayout({ title, controls, visualization }) {
  return (
    <div style={styles.visualizerPage}>
      <h1 style={styles.visualizerTitle}>{title}</h1>
      
      {/* Controls Section - Buttons and inputs */}
      <div style={styles.controlsSection}>
        {controls}
      </div>
      
      {/* Visualization Section - Data structure display */}
      <div style={styles.visualizationSection}>
        {visualization}
      </div>
    </div>
  );
}

export default VisualizerLayout;