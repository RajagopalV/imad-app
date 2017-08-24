console.log("Loaded!!");
var button = document.getElementById('commentButton');

button.onclick = function(){
	
	//Get comment
	var commentText = document.getElementById('commentText');
	var comment = commentText.value;
	
	
	//http request
	
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = function(){
		if(httpRequest.readyState == XMLHttpRequest.DONE){
			//response received
			if(httpRequest.status == 200){
				var comments = httpRequest.responseText;
				comments = JSON.parse(comments);
				var list='';
				
				for(var i=0;i<comments.length;i++){
					list += '<li>' + comments[i] + '</li><br><hr>';
				}
				var ul = document.getElementById('commentList');
				ul.innerHTML = list;
				
			}
		}
	}
	
	//Make request
	httpRequest.open('GET','http://localhost/submit-comment?comment='+comment,true);
	httpRequest.send(null);
	
	
}