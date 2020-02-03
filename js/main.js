// Tooltips
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
})

// Age
$(function () {
	var age = new Date(new Date() - new Date(1996, 9, 19)).getFullYear() - 1970;
	$(".age").html(age);
})