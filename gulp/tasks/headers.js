import fs from "fs";
import path from "path";

export const generateHeaders = (done) => {
  // Путь к файлу _headers для Netlify
  const buildPath = app.paths.base.build;
  const headersPath = path.join(buildPath, "_headers");

  // Определяем заголовки для разных типов файлов
  const headers = `# Заголовки кэширования для Netlify
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

# Кэширование HTML - короткое время (1 час)
/*.html
  Cache-Control: public, max-age=3600

# Кэширование CSS - среднее время (1 неделя)
/css/*
  Cache-Control: public, max-age=604800, immutable

# Кэширование JS - среднее время (1 неделя)
/js/*
  Cache-Control: public, max-age=604800, immutable

# Кэширование изображений - длительное время (1 месяц)
/img/*.jpg
  Cache-Control: public, max-age=2592000, immutable
/img/*.jpeg
  Cache-Control: public, max-age=2592000, immutable
/img/*.png
  Cache-Control: public, max-age=2592000, immutable
/img/*.webp
  Cache-Control: public, max-age=2592000, immutable
/img/*.avif
  Cache-Control: public, max-age=2592000, immutable
/img/*.svg
  Cache-Control: public, max-age=2592000, immutable

# Кэширование шрифтов - максимально длительное время (1 год)
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
`;

  // Записываем файл заголовков
  fs.writeFileSync(headersPath, headers);
  console.log("Файл _headers сгенерирован для Netlify");

  // Генерируем .htaccess для Apache (если используется)
  const htaccessPath = path.join(buildPath, ".htaccess");
  const htaccess = `# Включаем GZIP сжатие
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# Включаем кэширование
<IfModule mod_expires.c>
  ExpiresActive On

  # HTML документы
  ExpiresByType text/html "access plus 1 hour"

  # CSS
  ExpiresByType text/css "access plus 1 week"

  # JavaScript
  ExpiresByType application/javascript "access plus 1 week"

  # Изображения
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/gif "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/avif "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"

  # Шрифты
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Запрет выдачи информации о сервере
ServerSignature Off

# Защита от XSS атак
<IfModule mod_headers.c>
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;

  fs.writeFileSync(htaccessPath, htaccess);
  console.log("Файл .htaccess сгенерирован для Apache");

  done();
};
