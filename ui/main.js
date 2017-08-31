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
    			    document.getElementById('loginSection').innerHTML = "<div><p>Logged in </p><button id='logoutbtn'>Logout</button></div>";
    			    logoutfunction();
    			    
    			    
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



var signup_btn = document.getElementById('signup_submit_btn');

if(signup_btn !== null){
    signup_btn.onclick = function(){
    	
    	//http request
    	
    	var httpRequest = new XMLHttpRequest();
    	
    	httpRequest.onreadystatechange = function(){
    		if(httpRequest.readyState === XMLHttpRequest.DONE){
    			//response received
    			if(httpRequest.status === 200){
    			    alert('User create and Logged in successfully!!');
    			    document.getElementById('loginSection').innerHTML = "<div><p>Logged in </p><button id='logoutbtn'>Logout</button></div>";
    			    logoutfunction();
    			    
    			    
    			} else if(httpRequest.status === 403){
    			    alert('could not create user');
    			}else if(httpRequest.status === 500){
    			    alert('Server problem');
    			}
    		}
    	};
    	var username = document.getElementById('signup_username').value;
    	var password = document.getElementById('signup_password').value;
    	console.log("username --" + username);
    	console.log("password --" + password);
    	//Make request
    	httpRequest.open('POST','http://gopalequal.imad.hasura-app.io/createuser',true);
    	httpRequest.setRequestHeader('Content-Type', 'application/json');
    	httpRequest.send(JSON.stringify({username:username , password:password}));
    	
    }	
};

function logoutfunction(){
    var loggout_button = document.getElementById('logoutbtn');
    
    if(loggout_button !== null){
         loggout_button.onclick = function(){
             //http request
        	
        	var httpRequest = new XMLHttpRequest();
        		//Make request
        	httpRequest.open('GET','http://gopalequal.imad.hasura-app.io/logout',true);
        	httpRequest.send(null);
        	
        	httpRequest.onreadystatechange = function(){
        		if(httpRequest.readyState == XMLHttpRequest.DONE){
        			//response received
        			if(httpRequest.status == 200){
        			    location.reload();
        			    alert('logged out !!!');
        			    
        			} else {
        			     alert('unable to logout');
        			    }
        		}
        	};
        	};
        
             
         }
    
}

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
    				
    				var list = document.getElementById('commentList');
    				var entry = document.createElement('li');
                    entry.appendChild(document.createTextNode(comment));
                    list.appendChild(entry);
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
                    document.getElementById('loginSection').innerHTML = "<div><p>Logged in </p><button id='logoutbtn'>Logout</button></div>";
                     logoutfunction();
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
    	httpRequest.open('GET','http://gopalequal.imad.hasura-app.io/checklogin',true);
    	httpRequest.send(null);


}