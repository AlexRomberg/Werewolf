const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'wolf', 'browser', 'index.html');
const content = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Wolf</title>

    <link rel="icon" type="image/png" href="en/favicon/favicon-48x48.png" sizes="48x48">
    <link rel="icon" type="image/svg+xml" href="en/favicon/favicon.svg">
    <link rel="shortcut icon" href="en/favicon/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="en/favicon/apple-touch-icon.png">
    <meta name="apple-mobile-web-app-title" content="Werewolf">
    <link rel="manifest" href="en/favicon/site.webmanifest">
    <meta name="theme-color" content="#18181b">

    <script>
      const locale = navigator.language.startsWith('de') ? 'de' : 'en';
      window.location.replace(\`/\${locale}/\`);
    </script>
  </head>
  <body></body>
</html>
`;

fs.writeFileSync(indexPath, content);
console.log('Created /index.html with locale redirect.');