import { useState } from 'react';
import VisualizerLayout from '../components/VisualizerLayout';
import { styles } from '../styles/styles';

/**
 * Array Visualizer Component
 * Demonstrates array operations: insert and delete at any index
 */
function ArrayVisualizer() {
  // State: array data, input values
  const [array, setArray] = useState([10, 20, 30, 40, 50]);
  const [inputValue, setInputValue] = useState('');
  const [indexInput, setIndexInput] = useState('');

  /**
   * Insert element at specified index (or at end if no index given)
   */
  const handleInsert = () => {
    const value = parseInt(inputValue);
    const index = parseInt(indexInput);
    
    // Validate input
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    // If no index specified, add to end
    if (isNaN(index)) {
      setArray([...array, value]);
    } else {
      // Insert at specific index using splice
      const newArray = [...array];
      newArray.splice(index, 0, value);
      setArray(newArray);
    }
    
    // Clear inputs
    setInputValue('');
    setIndexInput('');
  };

  /**
   * Delete element at specified index
   */
  const handleDelete = () => {
    const index = parseInt(indexInput);
    
    // Validate index
    if (isNaN(index) || index < 0 || index >= array.length) {
      alert('Please enter a valid index');
      return;
    }
    
    // Remove element at index
    const newArray = [...array];
    newArray.splice(index, 1);
    setArray(newArray);
    setIndexInput('');
  };

  // Controls: input fields and buttons
  const controls = (
    <div style={styles.controlsGrid}>
      <input
        type="number"
        placeholder="Value"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Index (optional)"
        value={indexInput}
        onChange={(e) => setIndexInput(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleInsert} style={styles.button}>Insert</button>
      <button onClick={handleDelete} style={styles.buttonSecondary}>Delete</button>
    </div>
  );

  // Visualization: display array elements with indices
  const visualization = (
    <div style={styles.arrayContainer}>
      {array.map((value, index) => (
        <div key={index} style={styles.arrayElement}>
          <div style={styles.arrayValue}>{value}</div>
          <div style={styles.arrayIndex}>{index}</div>
        </div>
      ))}
    </div>
  );

  return (
    <VisualizerLayout 
      title="Array Visualizer" 
      controls={controls} 
      visualization={visualization} 
    />
  );
}

export default ArrayVisualizer;