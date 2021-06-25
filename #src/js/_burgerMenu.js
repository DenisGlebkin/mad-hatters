class BurgerMenu {
	constructor(burgerBtn, menu) {
		//? burgerBtn - класс бургер-кнопки
		//? menu - клас меню, которое отрывается/закрывается
		this.btnSelector = burgerBtn;
		this.menuBtn = document.querySelector(this.btnSelector);
		this.menuBody = document.querySelector(menu);

		this.load();
		this.createEvents();
	}

	load() {
		if (window.outerWidth <= 768) this.menuBody.style.height = "0px"
	}

	toggleMenu() {
		let menuBtnActiveClass = `${this.btnSelector.replace(".", "")}--active`
		this.menuBtn.classList.toggle(menuBtnActiveClass);
		// this.menuBody.classList.toggle("_active");
		if (this.menuBtn.classList.contains(menuBtnActiveClass)) {
			this.menuBody.style.height = `${this.menuBody.scrollHeight}px`;
		} else {
			this.menuBody.style.height = "0px"
		}
	}


	createEvents() {
		this.menuBtn.addEventListener("click", this.toggleMenu.bind(this))
	}
}

const burgerMenu = new BurgerMenu(".burger-menu", ".header__menu")