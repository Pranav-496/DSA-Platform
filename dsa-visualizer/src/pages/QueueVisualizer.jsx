import { useState } from 'react';
import VisualizerLayout from '../components/VisualizerLayout';
import { styles } from '../styles/styles';

/**
 * Queue Visualizer Component
 * Demonstrates FIFO (First In First Out) queue operations
 */
function QueueVisualizer() {
  // State: queue array (front is at index 0, rear is at the end)
  const [queue, setQueue] = useState([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');

  /**
   * Enqueue - Add element to rear of queue
   */
  const handleEnqueue = () => {
    const value = parseInt(inputValue);
    
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    // Add to end (rear)
    setQueue([...queue, value]);
    setInputValue('');
  };

  /**
   * Dequeue - Remove element from front of queue
   */
  const handleDequeue = () => {
    if (queue.length === 0) {
      alert('Queue is empty!');
      return;
    }
    
    // Remove first element (front)
    const newQueue = [...queue];
    newQueue.shift();
    setQueue(newQueue);
  };

  // Controls: input and enqueue/dequeue buttons
  const controls = (
    <div style={styles.controlsGrid}>
      <input
        type="number"
        placeholder="Value to enqueue"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleEnqueue} style={styles.button}>Enqueue</button>
      <button onClick={handleDequeue} style={styles.buttonSecondary}>Dequeue</button>
    </div>
  );

  // Visualization: horizontal queue with front/rear labels
  const visualization = (
    <div style={styles.queueContainer}>
      {queue.length === 0 ? (
        <div style={styles.emptyMessage}>Queue is empty</div>
      ) : (
        <>
          <div style={styles.queueLabel}>Front →</div>
          {queue.map((value, index) => (
            <div key={index} style={styles.queueElement}>
              {value}
            </div>
          ))}
          <div style={styles.queueLabel}>← Rear</div>
        </>
      )}
    </div>
  );

  return (
    <VisualizerLayout 
      title="Queue Visualizer (FIFO)" 
      controls={controls} 
      visualization={visualization} 
    />
  );
}

export default QueueVisualizer;