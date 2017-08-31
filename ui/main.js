console.log("Loaded!!");

var button1 = document.getElementById('submit_btn');

if(button1 !== null){
    button1.onclick = function(){
    	
    	//http request
    	
    	var httpRequest = new XMLHttpRequest();
    	
    	httpRequest.onreadystatechange = function(){
    		if(httpRequest.readyState === XMLHttpRequest.DONE){
    			//response received
    			if(httpRequest.status === 200){
    			    alert('Logged in successfully!!');
    			    document.getElementById('loginSection').innerHTML = '<div><p>Logged in </p></div>';
    			} else if(httpRequest.status === 403){
    			    alert('username/password is invalid');
    			}else if(httpRequest.status === 500){
    			    alert('Server problem');
    			}
    		}
    	};
    	var username = document.getElementById('username').value;
    	var password = document.getElementById('password').value;
    	console.log("username --" + username);
    	console.log("password --" + password);
    	//Make request
    	httpRequest.open('POST','http://gopalequal.imad.hasura-app.io/login',true);
    	httpRequest.setRequestHeader('Content-Type', 'application/json');
    	httpRequest.send(JSON.stringify({username:username , password:password}));
    	
    }	
};

var button = document.getElementById('commentButton');

if(button !== null){
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
    				// var comments = httpRequest.responseText;
    				// comments = JSON.parse(comments);
    				// var list='';
    				
    				// for(var i=0;i<comments.length;i++){
    				// 	list += '<li>' + comments[i] + '</li><br><hr>';
    				// }
    				var text='<li>'+comment+'</li>'
    				 document.getElementById('commentList').appendChild();
    				//ul.innerHTML = list;
    				
    			}
    		}
    	}
    	
    	//Make request
    	httpRequest.open('GET','http://gopalequal.imad.hasura-app.io/submit-comment?comment='+comment,true);
    	httpRequest.send(null);
    	
    }
}

checkloginfunction();

	function checkloginfunction(){
	//http request
    	
    	var httpRequest = new XMLHttpRequest();
    	
    	httpRequest.onreadystatechange = function(){
    		if(httpRequest.readyState == XMLHttpRequest.DONE){
    			//response received
    			if(httpRequest.status == 200){
    			 if(document.getElementById('loginSection') !== null){
                    document.getElementById('loginSection').innerHTML = '<div><p>Logged in </p></div>';
                    if(button !== null){
                     document.getElementById('commentButton').disabled = false;
                    }
    			 }
    			} else if(httpRequest.status == 404){
    			    if(button !== null){
    			        document.getElementById('commentButton').disabled = true;
    			    }
    		}
    	}
    	}
    	//Make request
    	httpRequest.open('POST','http://gopalequal.imad.hasura-app.io/checklogin',true);
    	httpRequest.send(null);


}