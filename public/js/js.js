$( document ).ready(function() {


	$("a.show_comments").click(function(){
		if($(this).children()[0].textContent=="+"){
			$(this).children()[0].textContent="-"
			$(this).parent().parent().next().slideDown("fast");
		} else {
			$(this).children()[0].textContent="+"
			$(this).parent().parent().next().slideUp("fast");
		}
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