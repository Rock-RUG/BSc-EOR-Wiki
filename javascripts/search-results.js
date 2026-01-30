(function () {
  function isOnFindPage() {
    return /\/find\.html$/.test(location.pathname);
  }

  function unlockSearchAndScroll() {
    try {
      // 关闭 Material search toggle
      const toggle =
        document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
        document.querySelector("#__search");
      if (toggle) toggle.checked = false;

      // 移除所有 scrollfix 标记
      document.querySelectorAll("[data-md-scrollfix]").forEach(el => {
        el.removeAttribute("data-md-scrollfix");
      });
      document.documentElement.removeAttribute("data-md-scrollfix");
      document.body.removeAttribute("data-md-scrollfix");

      // 清 html 锁
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.height = "";

      // 清 body 锁
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.height = "";

      document.documentElement.classList.remove("md-search--active");
      document.body.classList.remove("md-search--active");

      // 失焦
      if (document.activeElement && document.activeElement.blur) {
        try { document.activeElement.blur(); } catch (_) {}
      }
    } catch (_) {}
  }

  function main() {
    if (!isOnFindPage()) return;

    // ⭐ 只在这里、只执行一次
    unlockSearchAndScroll();

    // ===== 下面开始是你原本的搜索逻辑 =====
    // （我不动你的业务代码）

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      const input = document.getElementById("search-input");
      if (input) input.value = token;
    }
  }

  document.addEventListener("DOMContentLoaded", main);
})();
