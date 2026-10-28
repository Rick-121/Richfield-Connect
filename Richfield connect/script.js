// Feed page functionality

$(document).ready(function(){

    // live preview
    $("#name").on("input", function(){
        $("#previewName").text($(this).val());
    });
    $("#bio").on("input", function(){
        $("#previewBio").text($(this).val());
    });
    $("#interests").on("input", function(){
        var interests = $(this).val().split(",");
        $("#previewInterests").empty();
        for(var i=0;i<interests.length;i++){
            $("#previewInterests").append("<span class='tag'>" + interests[i] + "</span>");
        }
    });

    // signup form

    $("#signupForm").submit(function(e){
        e.preventDefault();
        var valid = true;

        // validation
        if($("#name").val() === ""){
            $("#name").next(".error").text("Name required");
            valid = false;
        } else { $("#name").next(".error").text(""); }

        if(isNaN($("#studentNumber").val())){
            $("#studentNumber").next(".error").text("Number must be numeric");
            valid = false;
        } else { $("#studentNumber").next(".error").text(""); }

        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();
        if(password.length < 8){
            $("#password").next(".error").text("Too short");
            valid = false;
        }
        if(password !== confirmPassword){
            $("#confirmPassword").next(".error").text("Passwords must match");
            valid = false;
        }

        // checks i added for the rest of the fields
        if($("#studentNumber").val() === ""){
            $("#studentNumber").next(".error").text("Student number required");
            valid = false;
        }

        if($("#campus").val() === ""){
            $("#campus").next(".error").text("Please select a campus");
            valid = false;
        }

        if(!checkEmail($("#email").val())){
            $("#email").next(".error").text("Please enter a valid email");
            valid = false;
        }

        if($("#interests").val() === ""){
            $("#interests").next(".error").text("Please add at least one interest");
            valid = false;
        }

        if($("#bio").val() === ""){
            $("#bio").next(".error").text("Please write a short bio");
            valid = false;
        }

        updateBorders();

        if(valid){
            var user = {
                name: $("#name").val(),
                studentNumber: $("#studentNumber").val(),
                campus: $("#campus").val(),
                email: $("#email").val(),
                interests: $("#interests").val(),
                bio: $("#bio").val()
            };
            localStorage.setItem("userProfile", JSON.stringify(user));
            window.location.href = "profile.html";
        }

    });


    // checks if the email looks like name@something.com
    function checkEmail(email){
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    // makes the border red if there is an error message next to the field
    function updateBorders(){
        $(".error").each(function(){
            if($(this).text() !== ""){
                $(this).prev().addClass("invalid");
            } else {
                $(this).prev().removeClass("invalid");
            }
        });
    }

    // real time validation while the user types
    $("#name").on("input", function(){
        if($(this).val() === ""){
            $(this).next(".error").text("Name required");
        } else { $(this).next(".error").text(""); }
        updateBorders();
    });

    $("#studentNumber").on("input", function(){
        if($(this).val() === ""){
            $(this).next(".error").text("Student number required");
        } else if(isNaN($(this).val())){
            $(this).next(".error").text("Number must be numeric");
        } else { $(this).next(".error").text(""); }
        updateBorders();
    });

    $("#campus").on("change", function(){
        if($(this).val() === ""){
            $(this).next(".error").text("Please select a campus");
        } else { $(this).next(".error").text(""); }
        updateBorders();
    });

    $("#email").on("input", function(){
        if(!checkEmail($(this).val())){
            $(this).next(".error").text("Please enter a valid email");
        } else { $(this).next(".error").text(""); }
        updateBorders();
    });

    $("#password, #confirmPassword").on("input", function(){
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();
        if(password.length < 8){
            $("#password").next(".error").text("Too short");
        } else { $("#password").next(".error").text(""); }

        // only check the match once they started typing the confirm one
        if(confirmPassword !== "" && password !== confirmPassword){
            $("#confirmPassword").next(".error").text("Passwords must match");
        } else { $("#confirmPassword").next(".error").text(""); }
        updateBorders();
    });

    $("#interests").on("input", function(){
        if($(this).val() === ""){
            $(this).next(".error").text("Please add at least one interest");
        } else { $(this).next(".error").text(""); }
        updateBorders();
    });

    $("#bio").on("input", function(){
        if($(this).val() === ""){
            $(this).next(".error").text("Please write a short bio");
        } else { $(this).next(".error").text(""); }
        updateBorders();
    });


    // profile page (moved here from profile.html because inline scripts are not allowed)
    if(document.getElementById("profileContainer")){
        // it works
        var user = JSON.parse(localStorage.getItem("userProfile"));
        if(user){
            document.getElementById("profileContainer").innerHTML =
                "<p>Name: " + user.name + "</p>" +
                "<p>Student Number: " + user.studentNumber + "</p>" +
                "<p>Campus: " + user.campus + "</p>" +
                "<p>Email: " + user.email + "</p>" +
                "<p>Bio: " + user.bio + "</p>" +
                "<p>Interests: " + user.interests + "</p>";
        } else {
            document.getElementById("profileContainer").innerHTML = "<p>No profile found. Please sign up.</p>";
        }
    }

    // slide toggle for the profile details
    $("#toggleDetails").click(function(){
        $("#profileContainer").slideToggle();
    });


    // nav hover animation
    $("nav a").hover(function(){
        $(this).stop().animate({ opacity: 0.5 }, 200);
    }, function(){
        $(this).stop().animate({ opacity: 1 }, 200);
    });


    // feed page
    var currentUser = JSON.parse(localStorage.getItem("userProfile"));

    // gets the posts from local storage
    function getPosts(){
        var posts = JSON.parse(localStorage.getItem("posts"));
        if(posts == null){
            posts = [];
        }
        return posts;
    }

    function savePosts(posts){
        localStorage.setItem("posts", JSON.stringify(posts));
    }

    // adds one post to the page
    function showPost(post){
        var likedClass = "";
        if(post.liked){ likedClass = " liked"; }

        var html = "<div class='post' data-id='" + post.id + "'>" +
            "<p><b>" + post.username + "</b> <small>" + post.date + "</small></p>" +
            "<p class='postText'></p>" +
            "<button class='likeBtn" + likedClass + "'>Like</button> <span class='likeCount'>" + post.likes + "</span>" +
            " <button class='deleteBtn'>Delete</button>" +
            "</div>";

        var newPost = $(html);
        newPost.find(".postText").text(post.content); // .text so the post cant break the html
        $("#feedContainer").prepend(newPost);
        return newPost;
    }

    // load the posts when the feed page opens
    if($("#feedContainer").length){
        if(currentUser){
            var posts = getPosts();
            for(var i=0;i<posts.length;i++){
                // only show posts from the logged in user
                if(posts[i].owner === currentUser.studentNumber){
                    showPost(posts[i]);
                }
            }
        } else {
            $("#feedContainer").html("<p>Please sign up first to post.</p>");
            $("#postBtn").prop("disabled", true);
        }
    }

    // create post
    $("#postBtn").click(function(){
        var content = $("#postContent").val();
        if(content.trim() === ""){
            $("#postError").text("Post cannot be empty");
            return;
        }
        $("#postError").text("");

        var post = {
            id: Date.now(),
            owner: currentUser.studentNumber,
            username: currentUser.name,
            date: new Date().toLocaleString(),
            content: content,
            likes: 0,
            liked: false
        };

        var posts = getPosts();
        posts.push(post);
        savePosts(posts);

        // fade in the new post
        showPost(post).hide().fadeIn(600);
        $("#postContent").val("");
    });

    // like button (using .on because the posts are added after the page loads)
    $("#feedContainer").on("click", ".likeBtn", function(){
        var postDiv = $(this).closest(".post");
        var id = postDiv.data("id");
        var posts = getPosts();

        for(var i=0;i<posts.length;i++){
            if(posts[i].id == id){
                if(posts[i].liked){
                    posts[i].likes--;
                    posts[i].liked = false;
                } else {
                    posts[i].likes++;
                    posts[i].liked = true;
                }
                postDiv.find(".likeCount").text(posts[i].likes);
            }
        }
        savePosts(posts);
        $(this).toggleClass("liked");
    });

    // delete button
    $("#feedContainer").on("click", ".deleteBtn", function(){
        if(confirm("Are you sure you want to delete this post?")){
            var postDiv = $(this).closest(".post");
            var id = postDiv.data("id");

            var posts = getPosts();
            for(var i=0;i<posts.length;i++){
                if(posts[i].id == id){
                    posts.splice(i, 1);
                }
            }
            savePosts(posts);

            postDiv.fadeOut(400, function(){
                $(this).remove();
            });
        }
    });

});
