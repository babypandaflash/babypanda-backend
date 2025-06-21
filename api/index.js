import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.resolve('./public', 'index.html');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html');
  res.send(fileContent);
}
