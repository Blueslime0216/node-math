const fs = require('fs');
const path = require('path');

// 복사할 디렉토리 경로
const srcDir = path.resolve(__dirname, 'public/js');
const destDir = path.resolve(__dirname, '!node-math/_nodemath/js');

// 재귀적으로 파일 복사 함수
function copyFiles(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyFiles(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// 컴파일된 파일 복사
copyFiles(srcDir, destDir);
console.log('Files copied to', destDir);