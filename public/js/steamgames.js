$(document).ready(function() {
	$.ajax({
		url: '/steamgamesdata',
		complete: function(data) {
			var steamdata = data.responseJSON.data.response;
			$("#gamesgohere").html(JSON.stringify(steamdata));
		}
	});	
});
