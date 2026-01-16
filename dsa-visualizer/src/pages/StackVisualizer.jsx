import { useState } from 'react';
import VisualizerLayout from '../components/VisualizerLayout';
import { styles } from '../styles/styles';

/**
 * Stack Visualizer Component
 * Demonstrates LIFO (Last In First Out) stack operations
 */
function StackVisualizer() {
  // State: stack array (top is at the end)
  const [stack, setStack] = useState([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');

  /**
   * Push - Add element to top of stack
   */
  const handlePush = () => {
    const value = parseInt(inputValue);
    
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    // Add to end (top of stack)
    setStack([...stack, value]);
    setInputValue('');
  };

  /**
   * Pop - Remove element from top of stack
   */
  const handlePop = () => {
    if (stack.length === 0) {
      alert('Stack is empty!');
      return;
    }
    
    // Remove last element
    const newStack = [...stack];
    newStack.pop();
    setStack(newStack);
  };

  // Controls: input and push/pop buttons
  const controls = (
    <div style={styles.controlsGrid}>
      <input
        type="number"
        placeholder="Value to push"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={styles.input}
      />
      <button onClick={handlePush} style={styles.button}>Push</button>
      <button onClick={handlePop} style={styles.buttonSecondary}>Pop</button>
    </div>
  );

  // Visualization: stack with top element highlighted
  const visualization = (
    <div style={styles.stackContainer}>
      {stack.length === 0 ? (
        <div style={styles.emptyMessage}>Stack is empty</div>
      ) : (
        // Reverse array to show top element at top visually
        [...stack].reverse().map((value, index) => (
          <div 
            key={stack.length - index - 1} 
            style={{
              ...styles.stackElement,
              ...(index === 0 ? styles.stackTop : {}) // Highlight top element
            }}
          >
            {value}
            {index === 0 && <span style={styles.topLabel}> ← Top</span>}
          </div>
        ))
      )}
    </div>
  );

  return (
    <VisualizerLayout 
      title="Stack Visualizer (LIFO)" 
      controls={controls} 
      visualization={visualization} 
    />
  );
}

export default StackVisualizer;