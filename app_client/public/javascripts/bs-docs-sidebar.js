//to highlight sidebar's menu items
$(document).ready(function(){
	$('body').scrollspy({
		target: '#scrollable',
		offset: 50
	});
});

//to call an angualr function from jquery.
//I'm doing this because I want to call the scroolTo function exposed using $scope
function f1(id) {
  angular.element(document.getElementById(id)).scope().scrollTo(id);
    //console.log($( "#"+id ).attr( 'mytag' ));
  	//console.log(document.getElementById(id));
  	//alert(document.getElementById(id).getAttribute('mytag'));
    //document.getElementById(id).href = document.getElementById(id).getAttribute('mytag'); 
    //alert(document.getElementById(id).href);
    return false;
}
