    //This is to prevent searching without anything in the search bar
    document.getElementById('databaseSearch').disabled="true";
    
    //Get current URL
    var current= window.location;

    //Once logout is clicked the user is logged out and will be able to log in again
    $("logout").click(function(){
			document.getElementById("registration").style.visibility="visible";  
            document.getElementById("login").style.visibility="visible";   
            document.getElementById("logout").style.visibility="hidden";		
    });

    //Go to the basket page
    $("#checkout").on('click',function() {
        var ar= current.href;
        var count=0;
        var pos=0;
        for(var i=0;i<ar.length;i++){
            if(count==3){
                pos=i;break;
            }
            if(ar.charAt(i)=="/"){
                count++;
            }
        }
        var attempt=ar.substring(pos,ar.length-1);
        var manip=attempt.substring(0,attempt.indexOf("/"));
        var search = $("#Search").val().replace(/[|&;$%@"<>()+,^  ]/g, "");
        if(ar.includes('true')){
            $(location).attr('href', '/'+ manip+'/login=true/basket');
        }else{
            $(location).attr('href', '/basket');
        }
    });
    
    //This is for the search bar functionality
    $("#databaseSearch").on('click',function() {
        var ar= current.href;
        var count=0;
        var pos=0;
        for(var i=0;i<ar.length;i++){
            if(count==3){
                pos=i;break;
            }
            if(ar.charAt(i)=="/"){
                count++;
            }
        }
        var attempt=ar.substring(pos,ar.length-1);
        var manip=attempt.substring(0,attempt.indexOf("/"));
        var search = $("#Search").val().replace(/[|&;$%@"<>()+,^  ]/g, "");
        if (ar.includes('true')) {
            $(location).attr('href', '/' +manip+'/login=true/Products/ProductName/'+search);
        } 
        else{
            $(location).attr('href', '/Products/ProductName/'+search);
        }
    });
    
    //Only let the user search when their search isn't empty
    $("#Search").on('keyup',function() {
        var search = $("#Search").val().replace(/[|&;$%@"<>()+,^  ]/g, "");
        if (search.length >0) {
            document.getElementById('databaseSearch').disabled=false;
            document.getElementById('databaseSearch').style.cursor="pointer";
        } else {
            document.getElementById('databaseSearch').disabled=true;
            document.getElementById('databaseSearch').style.cursor="default";
        }
    });
    
    //Search using the Enter button
	  document.getElementById('Search').addEventListener("keyup", function(event) {
        if (event.keyCode === 13){
            event.preventDefault();
            document.getElementById("databaseSearch").click();
        }
    });
    
    //return to the homepage
    $("#header1").on('click',function() {
        var ar= current.href;
        var count=0;
        var pos=0;
        for(var i=0;i<ar.length;i++){
            if(count==3){
                pos=i;break;
            }
            if(ar.charAt(i)=="/"){
                count++;
            }
        }
        var attempt=ar.substring(pos,ar.length-1);
        var manip=attempt.substring(0,attempt.indexOf("/"));
        var search = $("#Search").val().replace(/[|&;$%@"<>()+,^  ]/g, "");
        if(ar.includes('true')){
            $(location).attr('href', '/'+ manip+'/login=true');
        }else{
            $(location).attr('href', '/');
        }
    });

    //Go to the login page
    $("#login").on('click',function() {
        $(location).attr('href', '/Login');
    });

    //Once logout is clicked the user is logged out and will be able to log in again
    $("#logout").click(function(){
        $(location).attr('href', '/');        
    });

    //While input is empty the user can't move on
    $(document).ready(function(){
        var ar= current.href;
        if(ar.includes('true')){
            document.getElementById('logout').style.visibility="visible";
            document.getElementById('checkout').style.visibility="visible";
            document.getElementById('login').style.visibility="hidden"
        }
    })

    function addProduct(value){
        var n=value.innerHTML;
        var ar=n.split('>');
        var newar=ar[1].split('<');
        var name= newar[0];
        $(location).attr('href', '/basket/'+name);
    };
    
    $(document).ready(function(){
        if(current.href.includes("login")){
            const Http= new XMLHttpRequest();
            const url= current.href+"/s";
            Http.open("GET",url);
            Http.send();
            Http.onreadystatechange=function(){
                var s=Http.responseText;
                 $(document).ready(function(){
                    if(s.toString()=="false"){
                        $('#errorAlert').modal('show');
                        var timer = setTimeout(function(){document.getElementById("logout").click()},3000);  
                    }
                });
            }  
        }
    });

    $(document).ready(function(){
        var s1="data:image/png;base64,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"
        var s2="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CiAgICAgPEF0dHJpYjpUb3VjaFR5cGU+MjwvQXR0cmliOlRvdWNoVHlwZT4KICAgIDwvcmRmOmxpPgogICA8L3JkZjpTZXE+CiAgPC9BdHRyaWI6QWRzPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpkYz0naHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8nPgogIDxkYzp0aXRsZT4KICAgPHJkZjpBbHQ+CiAgICA8cmRmOmxpIHhtbDpsYW5nPSd4LWRlZmF1bHQnPkxvZ288L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+YnJvbmFnaGdhbGxhZ2hlcjIxQGhvdG1haWwuY29tPC9wZGY6QXV0aG9yPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp4bXA9J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8nPgogIDx4bXA6Q3JlYXRvclRvb2w+Q2FudmE8L3htcDpDcmVhdG9yVG9vbD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSdyJz8+PXSoogAAAABJRU5ErkJggg==";
        document.getElementById("header1").src=s1+s2;
    });

    $(document).ready(function(){
        var oldUrl = $("#theH").attr("href");
        var newUrl;
        var ar= current.href;
        var count=0;
        var pos=0;
        for(var i=0;i<ar.length;i++){
            if(count==3){
                pos=i;break;
            }
            if(ar.charAt(i)=="/"){
                count++;
            }
        }
        var attempt=ar.substring(pos,ar.length-1);
        var manip=attempt.substring(0,attempt.indexOf("/"));
        if(ar.includes("true")){
            newUrl = '/'+ manip+'/login=true/basket/'+ oldUrl;
        }else{
            newUrl="/basket/"+ oldUrl;
        }
        $("#theH").attr("href", newUrl); 
    });