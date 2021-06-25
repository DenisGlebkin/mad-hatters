// class BurgerMenu {
// 	constructor(burgerBtn, menu) {
// 		//? burgerBtn - класс бургер-кнопки
// 		//? menu - клас меню, которое отрывается/закрывается
// 		this.btnSelector = burgerBtn;
// 		this.menuBtn = document.querySelector(this.btnSelector);
// 		this.menuBody = document.querySelector(menu);

// 		this.load();
// 		this.createEvents();
// 	}

// 	load() {
// 		if (window.outerWidth <= 768) this.menuBody.style.height = "0px"
// 	}

// 	toggleMenu() {
// 		let menuBtnActiveClass = `${this.btnSelector.replace(".", "")}--active`
// 		this.menuBtn.classList.toggle(menuBtnActiveClass);
// 		// this.menuBody.classList.toggle("_active");
// 		if (this.menuBtn.classList.contains(menuBtnActiveClass)) {
// 			this.menuBody.style.height = `${this.menuBody.scrollHeight}px`;
// 		} else {
// 			this.menuBody.style.height = "0px"
// 		}
// 	}


// 	createEvents() {
// 		this.menuBtn.addEventListener("click", this.toggleMenu.bind(this))
// 	}
// }

// const burgerMenu = new BurgerMenu(".burger-menu", ".header__menu")

class BurgerMenu {
	constructor(params) {
		// ? burgerBtn - класс бургер-кнопки
		//? menu - клас обёртки меню, которое отрывается/закрывается
		//? resolution - разрешение на котором срабатывает бургер
		// ? effect - "sideSlide" двигается сбоку, иначе регулируется высота

		this.menuBtn            = document.querySelector(params.burgerBtn);
		this.menuBody           = document.querySelector(params.menu);
		this.menuBtnActiveClass = `${params.burgerBtn.replace(".", "")}--active`;
		this.isSideSlideEffect  = params.effect === "sideSlide" ? true : false;
		this.screenWidth        = params.resolution ? params.resolution : 768;

		this.load(this.screenWidth);
		this.createEvents();
	}

	toggleMenu() {
		let body    = document.body;
		body.classList.toggle("menu-actived");

		this.menuBtn.classList.toggle(this.menuBtnActiveClass);
		if (this.menuBtn.classList.contains(this.menuBtnActiveClass)) {
			this.isSideSlideEffect ? this.menuBody.style.transform = "translateX(0%)" : this.menuBody.style.height = `${this.menuBody.scrollHeight}px`;
		} else {
			this.isSideSlideEffect ? this.menuBody.style.transform = "translateX(-100%)" : this.menuBody.style.height = "0px";
		}
	}

	load() {
		let body = document.body;
		if (body.offsetWidth >= this.screenWidth) {
			this.isSideSlideEffect ? this.menuBody.style.transform = "translateX(0%)" : this.menuBody.style.height = "auto";
		} else {
			this.isSideSlideEffect ? this.menuBody.style.transform = "translateX(-100%)" : this.menuBody.style.height = "0px";

			if (this.menuBtn.classList.contains(this.menuBtnActiveClass)) this.toggleMenu();
		}
	}


	createEvents() {
		this.menuBtn.addEventListener("click", this.toggleMenu.bind(this));
		window.addEventListener("resize", this.load.bind(this));
	}
}

const burgerMenu = new BurgerMenu({
	burgerBtn: ".burger-menu",
	menu: ".header__menu"
})