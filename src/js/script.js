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

  //   Добавление в избранное
  const galleryList = document.querySelector(".gallery__list");
  const heartCountElement = document.querySelector(".heart-count");
  let heartCount = 0;

  function updateHeartCount() {
    heartCountElement.textContent = heartCount;
    if (heartCount > 0) {
      heartCountElement.classList.remove("is-hidden");
    } else {
      heartCountElement.classList.add("is-hidden");
    }
  }

  galleryList.addEventListener("click", function (event) {
    if (event.target.closest(".card__btn")) {
      const button = event.target.closest(".card__btn");
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        heartCount--;
      } else {
        button.classList.add("active");
        heartCount++;
      }
      updateHeartCount();
    }
  });
});

window.onload = function () {
  $(".slider").slick({
    autoplay: true,
    autoplaySpeed: 1500,
    variableWidth: true,
    centerMode: true,
  });
};
