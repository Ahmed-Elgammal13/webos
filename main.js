(async () => {
  const container = document.getElementById("app") || document.body;

  function renderList(path, items) {
    container.innerHTML = `
      <h2>${path}</h2>
      <ul>
        ${items.map(i => `<li data-path="${path}/${i.name}">${i.name}</li>`).join("")}
      </ul>
    `;
  }

  async function loadDirectory(path) {
    try {
      const res = await window.fs.readdir(path);
      renderList(path, res);
    } catch (e) {
      container.innerHTML = `<p>Error: ${e.message}</p>`;
    }
  }

  container.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;
    const newPath = li.dataset.path;
    loadDirectory(newPath);
  });

  loadDirectory("/home/default");
})();
