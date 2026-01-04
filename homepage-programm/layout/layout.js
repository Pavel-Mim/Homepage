async function loadHTML(id, file) {
  const response = await fetch(file);
  const text = await response.text();
  document.getElementById(id).innerHTML = text;
}

loadHTML("header", "homepage-programm/layout/header.html");
loadHTML("footer", "homepage-programm/layout/footer.html");
loadHTML("sidebar", "homepage-programm/layout/sidebar.html");