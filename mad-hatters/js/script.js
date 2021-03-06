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
class FormChecker {
	constructor(id) {
		// this.form = $(id);
		this.form = document.querySelector(id);
		// this.formTextfields = this.form.find(".form__input");
		this.formTextfields = this.form.querySelectorAll(".newsletter-form__input");
		this.isFormError = false;

		this.createEvents();
	}

	checkTextfield(event, textfield) {
		let currentTextfield = textfield ? textfield : event.currentTarget;
		// $(currentTextfield).removeClass("error");
		if (currentTextfield.classList.contains("error")) currentTextfield.classList.remove("error");
		const textfiledType = {
			name: "^[A-Za-zА-Яа-я\\s]{3,20}$",
			email: '^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$',
			message: "^[\\w\\s\.А-Яа-я]{1,255}$"
		}
		let currentTextfieldValue = currentTextfield.value;
		if (currentTextfieldValue.length != 0) {
			let regExp = new RegExp(textfiledType[currentTextfield.name]),
				isCurrentTextfieldCorect = regExp.test(currentTextfieldValue);
			if (!isCurrentTextfieldCorect) {
				this.isFormError = true;
				// $(currentTextfield).addClass("error");
				currentTextfield.classList.add("error");
			}
		}
		else {
			this.isFormError = true;
			// $(currentTextfield).addClass("error");
			currentTextfield.classList.add("error");
		}
	}

	formCheck(event) {
		event.preventDefault();
		this.isFormError = false;
		// this.formTextfields.each((i, currentTextfield) => {
		// 	this.checkTextfield(event, currentTextfield);
		// });

		this.formTextfields.forEach(currentTextfield => {
			this.checkTextfield(event, currentTextfield);
		})

		if (!this.isFormError) this.sendForm();
	}

	// sendForm() {
	// 	let formData = new FormData(document.querySelector("#form"));
	// 	$.ajax({
	// 		"url": "order.php",
	// 		"method": "post",
	// 		"dataType": "json",
	// 		"timeout": 5000,
	// 		"data": formData,
	// 		"processData": false,
	// 		"contentType": false,
	// 		"success": (serverResponse) => {
	// 			console.log("serverResponse", serverResponse);
	// 			// popup.putPopupInfo("loading");
	// 		},
	// 		"error": (ajaxObject) => {
	// 			console.log("ajaxObject", ajaxObject);
	// 			// popup.putPopupInfo("error");
	// 		},
	// 		"complete": (ajaxObject) => {
	// 			console.log("Complete");
	// 			// setTimeout(() => {
	// 			//     popup.putPopupInfo("complete");
	// 			// }, 5000);
	// 		}
	// 	})
	// }

	async sendForm() {
		let formData = new FormData(this.form);
		let responce = await fetch("./order.php", {
			method: 'POST'
			,body: formData
		})
		
		if (responce.ok) this.form.reset()
	}

	createEvents() {
		// this.formTextfields.blur(this.checkTextfield.bind(this));
		this.formTextfields.forEach(currentTextfild =>{
			currentTextfild.addEventListener("blur", this.checkTextfield.bind(this))
		});
		// this.form.submit(this.formCheck.bind(this));
		this.form.addEventListener("submit", this.formCheck.bind(this));
	}
}

let formchecker = new FormChecker("#newsletter-form");