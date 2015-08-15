$( document ).ready(function() {

	

	$("a.show_comments").click(function(){
		$(this).parent().parent().next().toggle( "slow" );
	});

	//search
	if ($('#search_input').val()=='') {
		$("#div_search_quiz").hide();
	}

	$("a#search_quiz").click(function(){
		if ($('#search_input').val()) {
			$('#form_search_quiz').submit();
		} else {
			$('#div_search_quiz').toggle('slow');
		}
	});

});