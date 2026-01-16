import { useState } from 'react';
import VisualizerLayout from '../components/VisualizerLayout';
import { styles } from '../styles/styles';

/**
 * Sorting Visualizer Component
 * Demonstrates Bubble Sort algorithm with step-by-step visualization
 */
function SortingVisualizer() {
  // State: array to sort, sorting status, current comparison indices
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);
  const [currentIndices, setCurrentIndices] = useState([]);

  /**
   * Generate random array for sorting
   */
  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 10 }, 
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setCurrentIndices([]);
  };

  /**
   * Bubble Sort Algorithm with Visualization
   * Compares adjacent elements and swaps if needed
   */
  const bubbleSort = async () => {
    setSorting(true);
    const arr = [...array];
    const n = arr.length;

    // Outer loop: n-1 passes
    for (let i = 0; i < n - 1; i++) {
      // Inner loop: compare adjacent elements
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight elements being compared
        setCurrentIndices([j, j + 1]);
        await sleep(300); // Pause for visualization

        // Swap if left > right
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]); // Update display
          await sleep(300);
        }
      }
    }

    // Clear highlights when done
    setCurrentIndices([]);
    setSorting(false);
  };

  /**
   * Helper function to create delays for visualization
   */
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Controls: generate array and start sort buttons
  const controls = (
    <div style={styles.controlsGrid}>
      <button 
        onClick={generateRandomArray} 
        style={styles.button} 
        disabled={sorting}
      >
        Generate Random Array
      </button>
      <button 
        onClick={bubbleSort} 
        style={styles.button} 
        disabled={sorting}
      >
        {sorting ? 'Sorting...' : 'Start Bubble Sort'}
      </button>
    </div>
  );

  // Visualization: bars representing array values
  const visualization = (
    <div style={styles.sortingContainer}>
      {array.map((value, index) => (
        <div key={index} style={styles.barContainer}>
          {/* Bar height based on value, color changes during comparison */}
          <div
            style={{
              ...styles.bar,
              height: `${value * 3}px`,
              backgroundColor: currentIndices.includes(index) 
                ? '#e74c3c'  // Red when being compared
                : '#3498db'  // Blue otherwise
            }}
          />
          <div style={styles.barValue}>{value}</div>
        </div>
      ))}
    </div>
  );

  return (
    <VisualizerLayout 
      title="Bubble Sort Visualizer" 
      controls={controls} 
      visualization={visualization} 
    />
  );
}

export default SortingVisualizer;