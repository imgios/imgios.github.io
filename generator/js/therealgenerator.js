/**
*	@author Giosuè Sulipano
*/
$(document).ready(function () {	
	/**
	*	@description This function creates a new random string, choosing random chars from the var 'chars'.
	*/
	$("#generatePsw").on("click", function(event) {
		event.preventDefault();
		var chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz!,.-?@1234567890";
		var password = "";
		var length = $('#pswLength').val();
		
		if (length < 8 || length > 128) {
			$('#snackbar').html("You selected an invalid length!<br/>Min: 8<br/>Max: 128").addClass("show");
			setTimeout(function() {$('#snackbar').removeClass("show");}, 3000);
		} else {		
			for (var i = 0; i < length; i++) {
				var random = Math.floor(Math.random() * chars.length);
				// debugging purposes
				// console.log(random);
				// console.log(chars[random]);
				password += chars[random];
			}
			
			$("#pswGenerated").val(password);
		}
	});

	/**
	*	@description This function copies the password generated inside the user clipboard.
	*/
	$("#pswCopy").on("click", function() {
		event.preventDefault();
		if ($("#pswGenerated").val() === "") {
			$('#snackbar').text("You must generate a new string first!");
		} else {
			$("#pswGenerated").select();
			document.execCommand("copy");
			$('#snackbar').text("String copied inside the clipboard!");
		}
		$('#snackbar').addClass("show");
		setTimeout(function() {$('#snackbar').removeClass("show");}, 3000);
	});
});
