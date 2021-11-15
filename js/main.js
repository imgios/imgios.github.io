// Age
$(function () {
	var age = new Date(new Date() - new Date(1996, 9, 19)).getFullYear() - 1970;
	$("#age").html(age);
});

// Dark Theme
$(function () {
	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

	if (prefersDarkScheme.matches) {
	  document.body.classList.add("bg-dark");
		document.body.classList.add("text-light")
		document.body.classList.remove("bg-light");
		document.body.classList.remove("text-dark");
	} else {
		document.body.classList.add("bg-light");
		document.body.classList.add("text-dark")
	  document.body.classList.remove("bg-dark");
		document.body.classList.remove("text-light");
	}
});
