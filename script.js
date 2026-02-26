let currentUser = null;
let editIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    let savedUser = localStorage.getItem("loggedInUser");
    if(savedUser){
        currentUser = savedUser;
        showBlog();
    }
});

/* AUTH */

function signup(){
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if(!user || !pass){
        alert("Fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if(users[user]){
        alert("User already exists");
        return;
    }

    users[user] = pass;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful!");
}

function login(){
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(users[user] === pass){
        currentUser = user;
        localStorage.setItem("loggedInUser", user);
        showBlog();
    } else {
        alert("Invalid credentials");
    }
}

function logout(){
    localStorage.removeItem("loggedInUser");
    location.reload();
}

function showBlog(){
    document.getElementById("authSection").style.display="none";
    document.getElementById("blogSection").style.display="block";
    document.getElementById("currentUser").innerText="👤 "+currentUser;
    loadPosts();
}

/* ================= POSTS ================= */

function addPost(){
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;

    let post = {
        user: currentUser,
        title,
        content,
        likes:0,
        date: new Date().toLocaleString()
    };

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));

    loadPosts();
}

function loadPosts(){
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let div = document.getElementById("posts");
    div.innerHTML="";

    posts.filter(p=>p.user===currentUser)
    .forEach((post,index)=>{
        div.innerHTML+=`
        <div class="post">
            <h3>${post.title}</h3>
            <small>${post.date}</small>
            <p>${post.content}</p>
            <button onclick="likePost(${index})">❤️ ${post.likes}</button>
        </div>
        `;
    });
}

function likePost(index){
    let posts = JSON.parse(localStorage.getItem("posts"));
    posts[index].likes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
}

/* ================= AI FEATURES (SIMULATED) ================= */

function generateTitle(){
    let content = document.getElementById("content").value;
    if(content.length<10){
        alert("Write more content first");
        return;
    }
    document.getElementById("title").value="✨ "+content.substring(0,20)+"...";
}

function generateSummary(){
    let content = document.getElementById("content").value;
    alert("AI Summary:\n"+content.substring(0,100)+"...");
}

function improveWriting(){
    let content = document.getElementById("content").value;
    document.getElementById("content").value = content + "\n\n✨ Enhanced by AI.";
}

/* ================= SEARCH ================= */

function searchPosts(){
    let search = document.getElementById("search").value.toLowerCase();
    let posts = document.querySelectorAll(".post");
    posts.forEach(post=>{
        post.style.display = post.innerText.toLowerCase().includes(search) ? "block":"none";
    });
}

/* ================= CHARACTER COUNT ================= */

document.getElementById("content")?.addEventListener("input", function(){
    document.getElementById("charCount").innerText=this.value.length+" characters";
});