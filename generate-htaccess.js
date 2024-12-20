import fs from "fs";
import path from "path";

const htaccessContent = `
RewriteEngine On

RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
RewriteRule ^ - [L]

RewriteRule ^ index.html [L]
`;

const outputPath = path.join(process.cwd(), "dist", ".htaccess");

fs.writeFileSync(outputPath, htaccessContent, "utf8");
console.log(`.htaccess файл создан по пути: ${outputPath}`);
