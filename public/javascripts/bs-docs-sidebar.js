$(document).ready(function(){
	$('body').scrollspy({
		target: '#scrollable',
		offset: 40
	});
});

function f1(id)
  {
  	//console.log(document.getElementById(id));
  	//alert(document.getElementById(id).getAttribute('mytag'));
    document.getElementById(id).href = document.getElementById(id).getAttribute('mytag'); 
    //alert(document.getElementById(id).href);
    return false;
  };
