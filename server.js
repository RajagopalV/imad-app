var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var app = express();
app.use(morgan('combined'));

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
	    
	    </div>
	    <script type ="text/javaScript" src="ui/main.js">
	    </script>
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
    pool.query('SELECT * FROM article',function(err,result){
        if(err){
            res.status(500).send(err.toString);
        }else{
            res.send(JSON.Stringify(result));
        }
        
    });
    
});
    


app.get('/:articleName', function (req, res) {
	var articleName = req.params.articleName;
	console.log('url requested : '+articleName );
	console.log('comments  : '+comments );
	res.send(createTemplate(articles[articleName],comments));
	});
	


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
