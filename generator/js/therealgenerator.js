/**
*	@author Giosuè Sulipano
*/
$(document).ready(function () {
	$('#pswCopy').tooltip({
		trigger: 'manual',
		delay: {show: 0, hide: 500}
	});
	
	/**
	*	@description This function create a new random string, choosing random chars from the var 'chars'.
	*/
	$("#generatePsw").on("click", function(event) {
		event.preventDefault();
		var chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz!,.-?@1234567890";
		var password = "";
		var length = $('#pswLength').val();
		
		for (var i = 0; i < length; i++) {
			var random = Math.floor(Math.random() * chars.length);
			console.log(random);
			console.log(chars[random]);
			password += chars[random];
			console.log(i);
		}
		
		console.log(password);
		
		$("#pswGenerated").val(password);
	});

	/**
	*	@description This function copy the password generated inside the user clipboard.
	*/
	$("#pswCopy").on("click", function() {
		event.preventDefault();
		$("#pswGenerated").select();
		document.execCommand("copy");
		$('#pswCopy').tooltip('show').delay(5000).tooltip('hide');
	});
});