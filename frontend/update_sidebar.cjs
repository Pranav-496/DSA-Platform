const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Import Menu
if (!content.includes('Menu,')) {
    content = content.replace('X,', 'Menu,\n  X,');
}

// 2. Add sidebarOpen state to MainLayout
content = content.replace(
    'const [searchQuery, setSearchQuery] = React.useState("");',
    'const [searchQuery, setSearchQuery] = React.useState("");\n  const [sidebarOpen, setSidebarOpen] = React.useState(false);'
);

// 3. Update Sidebar rendering & Add Floating Menu Button
content = content.replace(
    '{shouldShowSidebar && <Sidebar setSearchOpen={setSearchOpen} />}',
    `{/* Floating Hamburger Menu */}
      {shouldShowSidebar && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-primary border-4 border-text rounded shadow-brutal-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_#111] transition-all"
        >
          <Menu size={24} className="text-text" />
        </button>
      )}
      
      {shouldShowSidebar && <Sidebar setSearchOpen={setSearchOpen} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}`
);

// 4. Update Main Content Pane padding to avoid overlap with floating button
content = content.replace(
    '<main className="flex-1 p-4 md:p-8 relative overflow-y-auto h-screen w-full">',
    '<main className="flex-1 py-4 pr-4 pl-20 md:py-8 md:pr-8 md:pl-24 relative overflow-y-auto h-screen w-full transition-all">'
);

// 5. Update Sidebar component definition
content = content.replace(
    'function Sidebar({ setSearchOpen }) {',
    'function Sidebar({ setSearchOpen, sidebarOpen, setSidebarOpen }) {'
);

// 6. Update Sidebar aside class and add Backdrop + Close button
const asideOriginal = `<aside className="w-64 bg-surface border-r-8 border-text flex flex-col items-center py-6 z-10 flex-shrink-0 shadow-[4px_0_0_#111]">`;
const asideReplacement = `<>
      {/* Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-text/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside className={\`fixed inset-y-0 left-0 transform \${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-200 ease-in-out w-64 bg-surface border-r-8 border-text flex flex-col items-center py-6 z-50 shadow-[4px_0_0_#111] h-screen\`}>
        
        {/* Close Button */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 hover:bg-danger hover:text-surface border-2 border-transparent hover:border-text transition-all rounded"
        >
          <X size={24} />
        </button>`;

content = content.replace(asideOriginal, asideReplacement);

// 7. Add closing fragment tag to Sidebar return
content = content.replace(
    '    </aside>\n  );\n}',
    '    </aside>\n    </>\n  );\n}'
);

// 8. Make sure links close the sidebar
content = content.replace(
    /onClick=\{\(\) => \{ setSearchOpen\(false\); setSearchQuery\(""\); \}\}/g,
    'onClick={() => { setSearchOpen(false); setSearchQuery(""); setSidebarOpen(false); }}'
);
// For navItems links in Sidebar which don't currently have an onClick
content = content.replace(
    /<Link\n              key=\{item\.to\}\n              to=\{item\.to\}/g,
    '<Link\n              key={item.to}\n              to={item.to}\n              onClick={() => setSidebarOpen(false)}'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("App.jsx updated successfully");
