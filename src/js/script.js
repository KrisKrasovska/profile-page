(() => {
  const menuBtnRef = document.getElementById("open-menu");
  const closeBtnRef = document.getElementById("close-menu");
  const menu = document.querySelector(".backdrop-menu");

  menuBtnRef.addEventListener("click", () => {
    menu.classList.remove("is-hidden");
  });
  closeBtnRef.addEventListener("click", () => {
    menu.classList.add("is-hidden");
  });
  console.log("yes");
})();
