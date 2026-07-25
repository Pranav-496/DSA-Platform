const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

async function executeLocal(code, lang) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'algonova-'));
  const id = uuidv4().replace(/-/g, '');
  
  try {
    if (lang === 'python') {
      const filePath = path.join(tmpDir, `script_${id}.py`);
      await fs.writeFile(filePath, code);
      return await runCommand(`python "${filePath}"`);
    } 
    else if (lang === 'c++' || lang === 'cpp') {
      const srcPath = path.join(tmpDir, `main_${id}.cpp`);
      const exePath = path.join(tmpDir, `main_${id}.exe`);
      await fs.writeFile(srcPath, code);
      // compile
      const compileRes = await runCommand(`g++ "${srcPath}" -o "${exePath}"`);
      if (compileRes.code !== 0) {
        return compileRes; // compilation error
      }
      // run
      return await runCommand(`"${exePath}"`);
    }
    else if (lang === 'java') {
      // Find class name in the code
      const classMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = classMatch ? classMatch[1] : `Main_${id}`;
      const safeCode = classMatch ? code : code.replace(/class\s+Main\b/, `public class ${className}`);
      
      const filePath = path.join(tmpDir, `${className}.java`);
      await fs.writeFile(filePath, safeCode);
      
      const compileRes = await runCommand(`javac "${filePath}"`);
      if (compileRes.code !== 0) {
        return compileRes; // compilation error
      }
      return await runCommand(`java -cp "${tmpDir}" ${className}`);
    }
    else {
      throw new Error(`Unsupported language for local execution: ${lang}`);
    }
  } finally {
    // Cleanup
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }
}

function runCommand(command) {
  return new Promise((resolve) => {
    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) {
        resolve({
          code: error.code || 1,
          stdout: stdout || '',
          stderr: stderr || error.message
        });
      } else {
        resolve({
          code: 0,
          stdout: stdout || '',
          stderr: stderr || ''
        });
      }
    });
  });
}

module.exports = { executeLocal };
