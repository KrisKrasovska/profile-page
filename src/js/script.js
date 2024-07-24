document.addEventListener("DOMContentLoaded", () => {
  // Открытие/закрытие меню
  const menuBtnRef = document.getElementById("open-menu");
  const closeBtnRef = document.getElementById("close-menu");
  const menu = document.querySelector(".backdrop-menu");
  const openMenu = () => {
    menu.classList.remove("is-hidden");
  };
  const closeMenu = () => {
    menu.classList.add("is-hidden");
  };
  menuBtnRef.addEventListener("click", openMenu);
  closeBtnRef.addEventListener("click", closeMenu);
});

//   Работа с формой
const form = document.querySelector(".form-profile");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  console.log("Form Data:", data);

  // Очистка значений
  form.reset();
});
