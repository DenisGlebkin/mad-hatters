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