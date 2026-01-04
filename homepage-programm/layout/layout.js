async function loadHTML(id, file) {
  const response = await fetch(file);
  const text = await response.text();
  document.getElementById(id).innerHTML = text;
}

loadHTML("header", "header.html");
loadHTML("footer", "footer.html");
loadHTML("sidebar", "sidebar.html");