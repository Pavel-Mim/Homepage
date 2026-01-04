// generate_dwz_static.js
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    const url = 'https://www.schachbund.de/verein/70353.html';
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const table = $('#dewisTable');

    const removeCols = [1, 2, 4]; // remove unwanted columns
    table.find('tr').each((i, row) => {
      removeCols.slice().sort((a,b) => b-a).forEach(idx => {
        $(row).find('th, td').eq(idx).remove();
      });
    });

    const headerRow = table.find('tr').first();
    headerRow.find('th').last().remove();

    table.find('tr').each((i, row) => {
      $(row).find('td').each((j, cell) => {
        const text = $(cell).text();
        if (text.includes(',')) {
          const parts = text.split(',').map(p => p.trim());
          $(cell).text(parts.reverse().join(' '));
        }
      });
    });

    table.find('tr').each((i, row) => {
      if (i > 0) {
        const cells = $(row).find('td');
        if (cells.length >= 3) {
          const secondCell = cells.eq(1);
          const lastCell = cells.eq(cells.length - 1);
          const combinedText = (lastCell.text() + ' ' + secondCell.text()).trim();
          secondCell.text(combinedText);
          lastCell.remove();

          const thirdCell = cells.eq(2);
          const fourthCell = cells.eq(3);
          let dwz = thirdCell.text().trim();
          let elo = fourthCell.text().trim();

          thirdCell.text(dwz === "Restp." || dwz === "" ? "—" : dwz.split('-')[0]);
          fourthCell.text(elo === "-----" ? "—" : elo);
        }
      }
    });

    const outputHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>DWZ Tabelle</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
<style>
  table.dwz { width: 100%; font-family: 'Montserrat', sans-serif; border-collapse: collapse; }
  table.dwz th, table.dwz td { padding: 0.4em 0.6em; border: 1px solid #ddd; }
  table.dwz th { background-color: #f8f8f8; color: #b40808; font-weight: 600; }
  table.dwz tr:nth-child(even) td { background-color: #f2f2f2; }
  table.dwz tr:hover td { background-color: #ffe0e0; }
</style>
</head>
<body>
  <table class="dwz" id="dewisTable">
    ${table.html()}
  </table>
</body>
</html>
`;

    fs.writeFileSync('dwz-liste-table.html', outputHTML);
    console.log('DWZ static page generated: dwz-liste-table.html');

  } catch (err) {
    console.error('Error generating DWZ page:', err);
  }
})();
