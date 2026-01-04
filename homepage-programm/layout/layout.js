async function loadHTML(id, file) {
  const response = await fetch(file);
  const text = await response.text();
  document.getElementById(id).innerHTML = text;
}

loadHTML("header", "/layout/header.html");
loadHTML("footer", "/layout/footer.html");
loadHTML("sidebar", "/layout/sidebar.html");