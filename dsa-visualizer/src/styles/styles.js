// All application styles in one place for easy management
export const styles = {
  // App Container
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    backgroundColor: '#2c3e50',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  logo: {
    color: 'white',
    margin: 0
  },
  navLinks: {
    display: 'flex',
    gap: '1rem'
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#ecf0f1',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  },
  navButtonActive: {
    backgroundColor: '#34495e'
  },
  content: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  home: {
    textAlign: 'center'
  },
  homeTitle: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  homeSubtitle: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    marginBottom: '3rem'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    cursor: 'pointer'
  },
  cardTitle: {
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  cardDescription: {
    color: '#7f8c8d',
    marginBottom: '1.5rem',
    minHeight: '3rem'
  },
  cardButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '100%'
  },
  visualizerPage: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  visualizerTitle: {
    color: '#2c3e50',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  controlsSection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '8px'
  },
  controlsGrid: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #bdc3c7',
    borderRadius: '4px',
    width: '150px'
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  buttonSecondary: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  visualizationSection: {
    minHeight: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  },
  arrayContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  arrayElement: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  arrayValue: {
    width: '60px',
    height: '60px',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  arrayIndex: {
    fontSize: '0.9rem',
    color: '#7f8c8d'
  },
  stackContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'center',
    minWidth: '200px'
  },
  stackElement: {
    width: '150px',
    padding: '1rem',
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'center',
    borderRadius: '4px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  stackTop: {
    backgroundColor: '#e74c3c'
  },
  topLabel: {
    fontSize: '0.9rem',
    fontWeight: 'normal'
  },
  queueContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  queueElement: {
    width: '60px',
    height: '60px',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  queueLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  emptyMessage: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    fontStyle: 'italic'
  },
  sortingContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '350px'
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  bar: {
    width: '40px',
    backgroundColor: '#3498db',
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.3s ease'
  },
  barValue: {
    fontSize: '0.85rem',
    color: '#2c3e50',
    fontWeight: 'bold'
  }
};