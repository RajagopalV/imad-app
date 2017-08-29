var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyparser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyparser.json());
app.use(session({
    secret :'somesecretvalue',
    cookie : {maxAge : 1000 * 60 * 60  *24 *30 }
}));

var config = {
  user: 'gopalequal',
  host: 'db.imad.hasura-app.io',
  database: 'gopalequal',
  password: 'db-gopalequal-87989',
  port: '5432'
}; 

var pool = new Pool(config);

var article1={
		title : 'Article1',
		heading : 'Article1',
		date : '10 Aug 2017',
		content : `<p> Content of the first article</p>`
};



function createTemplate(data,comments){
	var comment =[];
	comment =comments;
	var title = data.title;
	var heading = data.heading;
	var date = data.date;
	var content = data.content;

	var htmltemplate= 
			`
			<html>
		<head>
	        <title>
	        	${title}
	        </title>
	        <Meta name="viewport" content = "width=display-width, initial-scale=1"/> 
	        <link href="/ui/style.css" rel = "stylesheet"/>
	        
	    </head>
	    <body>
	    	<div class=container>
		    	<a href="/" > Home</a>
		    	<hr>
				<h3> 
					${heading}
				</h3>
		    	<hr>
		    	<h4>
		    		${date}
		    	</h4>
		    	<div>
		    		${content}
		    	</div>	
	    	</div>
	    	
	    	<hr>
	    	<div class=comments>
	    		<h3>comment section</h3>
	    		<textarea id="commentText" rows="1" cols="1" style="margin: 0px; width: 316px; height: 84px;">Enter your comments</textarea>
	    		<br>
	    		<button id="commentButton">post</button>
	    	</div>	
	    	
	    	<hr>
	    	<div class=commentsSection>
	    	
    		<h4>comments</h4>
    		<ul id="commentList"></script></ul>
    		
    		</div>
    		<script type="text/javascript">
	        function myFunction(){
	        	var list='';
				
				for(var i=0;i<arguments.length;i++){
					list += '<li>' + arguments[i] + '</li>';
				}
				console.log("myfunction output "+ list);
				return list;
	        }
	        document.getElementById("commentList").innerHTML = myFunction('${comment}');
	        </script>
	     <script type ="text/javaScript" src="/ui/main.js">
	    </script>
	    </div>
	    </body>
	</html>`;
	
	return htmltemplate;
	
};

var articles={
		'article-one' : {
				title : 'Article1',
				heading : 'Article1',
				date : '10 Aug 2017',
				content : `<p> Content of the first article</p>`
		}
};

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/myPhoto.jpg', function (req, res) {
	  res.sendFile(path.join(__dirname, 'ui', 'myPhoto.jpg'));
	});

app.get('/ui/main.js', function (req, res) {
	  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
	});

var comments = [];
app.get('/submit-comment', function (req, res) { //submit-comment?comment=xxxx
	 console.log('Inside submit-comment');
	var comment = req.query.comment;
	comments.push(comment);
	//JSON changes
	res.send(JSON.stringify(comments));
	  
	});
	
app.get('/testDb', function (req, res) {
    console.log('Inside test db');
    pool.query("SELECT * FROM article WHERE title='Article1'",function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
        
    });
    
});
    
app.get('/hash/:input',function(req,res){
    
    res.send(hash(req.params.input,'random-string'));
    
});

//curl -XPOST -H 'Content-Type: application/json' --data '{"username" : "raja", "password" : "password"}' http://gopalequal.imad.hasura-app.io/createuser 
app.post('/createuser',function(req,res){
    
    var username = req.body.username;
    var password = req.body.password;
    
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
                res.send(JSON.stringify(result.rows));
            }
    });
    
});


app.post('/login',function(req,res){
    
    var username = req.body.username;
    var password = req.body.password;
    console.log("username -->"+username);
    console.log("password ---> "+ password);    
    pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
                if(result.rows.length === 0){
                    res.status(403).send("username/password is invalid");
                }else{
                    //Match dbString
                    var dbString = result.rows[0].password;
                    var salt = dbString.split('$')[2];
                    var hashed = hash(password,salt);
                    
                    if(hashed === dbString){
                        
                        //session id
                        req.session.auth = {userId : result.rows[0].id};
                        
                        res.send("Credential matched !!!!");
                    }else{
                        
                    res.status(403).send("Credential not matched");
                    }
                    
                }
            }
    });
    
});

app.get('/checklogin',function(req,res){
    
    if(req.session & req.session.auth && req.session.auth.userId){
        res.send("You are logged in  : "+ req.session.auth.userId.toString());
    }else{
        res.send("You not logged in");
    }
    
});

app.get('/logout',function(req,res){
    
    delete auth.session.auth;
    res.send('Logged out!!!!');
    
});

app.get('/article/:articleName', function (req, res) {
    
    console.log('url requested : '+req.params.articleName );
    pool.query("SELECT * FROM article WHERE title = '"+ req.params.articleName +"'",function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            
            if(result.rows.length === 0){
                 res.status(404).send("Article not found!!!");
            }else{
                res.send(createTemplate(result.rows[0],comments));
            }
        }
        
    });
	//var articleName = req.params.articleName;
	
	//res.send(createTemplate(articles[articleName],comments));
	});
	

function hash(input,salt){
    
    var hashed = crypto.pbkdf2Sync(input,salt,100,512,'sha512');
    return ["pbkdf2","100",salt,hashed.toString('hex')].join('$');
}


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
