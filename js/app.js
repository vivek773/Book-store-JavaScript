// storing Signup data in local storage
function validateForm() {
    let data = localStorage.getItem("SignUp-data")
        ? JSON.parse(localStorage.getItem("SignUp-data"))
        : [];
    let formData = {
        name: document.getElementById("uName").value,
        email: document.getElementById("uEmail").value,
        role: document.getElementById("uRole").value,
        phoneNo: document.getElementById("uPhone").value,
        password: document.getElementById("uPassword").value,
        confirmpassword: document.getElementById("confirmPassword").value,
    };
    let existemail = JSON.parse(localStorage.getItem("SignUp-data"));
    let getexistemail = existemail?.find((emailData) => emailData.email === formData.email)
    // password matching
    if (formData.password !== formData.confirmpassword) {
        alert('Password Must be Matching');
    }
    // Email matching 
    else if (getexistemail?.email === formData.email) {
        alert('email address already exist');
    }
    else {
        data.push(formData);
        if (localStorage) {
            localStorage.setItem("SignUp-data", JSON.stringify(data));
            document.getElementById("uName").value = "",
                document.getElementById("uEmail").value = "",
                document.getElementById("uRole").value = "",
                document.getElementById("uPhone").value = "",
                document.getElementById("uPassword").value = "",
                document.getElementById("confirmPassword").value = ""
        }
        alert("you have successfully registered");
        window.location.href = "/login.html";
    }
}

// login 

function login() {
    let usersData = JSON.parse(localStorage.getItem("SignUp-data"));
    let loginData = {
        email: document.getElementById("uEmail").value,
        role: document.getElementById("uRole").value,
        password: document.getElementById("uPassword").value,
    };
    const userMatch = usersData.find((user) => user.email === loginData.email && user.password === loginData.password && user.role === loginData.role)


    if (userMatch) {


        if (loginData.role === "Admin") {
            window.location.href = "/admin-dashboard.html";
            alert("you have successfully logged in as Admin");
            localStorage.setItem("admin-login-data", JSON.stringify(loginData));
            document.getElementById("uEmail").value = "",
                document.getElementById("uRole").value = "",
                document.getElementById("uPassword").value = ""
        } else {
            alert("you have successfully logged in as User");
            localStorage.setItem("user-login-data", JSON.stringify(userMatch));
            window.location.href = "/user-dashboard.html";

        }
    } else {
        alert("Invalid login details")
    }
}

// storing create book  data in local storage

const container = document.getElementById("myModal");
const modal = new bootstrap.Modal(container);
function createbookform() {
    let bookdata = localStorage.getItem("book-data")
        ? JSON.parse(localStorage.getItem("book-data"))
        : [];
    let createbookformData = {
        bookname: document.getElementById("book-name").value,
        bookprice: document.getElementById("book-price").value,
        bookauthor: document.getElementById("author-name").value,
        bookusers: [],
    };
    if (createbookformData.bookname === "" && createbookformData.bookprice === "" && createbookformData.bookauthor === "") {
        alert("Please enter book details");
    } else {
        bookdata.push(createbookformData);
        if (localStorage) {
            localStorage.setItem("book-data", JSON.stringify(bookdata));
            document.getElementById("book-name").value = "",
                document.getElementById("book-price").value = "",
                document.getElementById("author-name").value = ""
            alert("Your create Book Data Successfully Add in localStorage");
        }
        modal.hide();
    }
}

// Admin logout 

function adminlogout() {
    localStorage.removeItem("admin-login-data");
    setIsLoggedin(false);
}

// User  logout

function userlogout() {
    localStorage.removeItem("user-login-data");
    setIsLoggedin(false);
}

// Display data of create book in user dashboard select box
if (window.location.href == '/user-dashboard.html') {       

    function selectBook() {
        let userlogindata = JSON.parse(localStorage.getItem("user-login-data"));
        let bookdata = JSON.parse(localStorage.getItem("book-data"));
        let showData = [];
        
        if (userlogindata && bookdata.length > 0) {
            bookdata.map((bookObject) => {
                if (bookObject.bookusers.length > 0) {
                    bookObject.bookusers.map((bookuser) => {
                        if (bookuser === userlogindata.email) {
                            showData.push(bookObject);
                        }
                    });
                }
        });
        
        console.log("showData in selectBook", showData);

        var tableData = showData.map(book => (
            `
            <tr>
            <td>${book.bookname}</td>
                <td>${book.bookauthor}</td>
                <td>${book.bookprice}</td>         
                </tr>
            `
        )).join('');
        
        var tbody = document.querySelector('#body');
        tbody.innerHTML = tableData;
        
    }
    
    let select = document.getElementById("select-book");
    bookdata.map((a) => {
        return (
            select.options[select.options.length] = new Option(`${a.bookname}`)
            )
        })
        select.onchange = (e) => {
            if (e.target.value) {
                const filteredData = bookdata.find((book) => book.bookname === e.target.value);
                
                if (!showData.find((d) => d.bookname === filteredData.bookname)) {
                    showData.push(filteredData);
                    console.log("showdata", showData);
                    let newBookData = []
                    const updatedData = {
                        ...filteredData,
                        bookusers: [...filteredData.bookusers, userlogindata.email]
                    }
                    const index = bookdata.findIndex((d) => d.bookname === e.target.value);
                    if (bookdata[index].bookusers.includes(userlogindata.email)) {
                        alert('already included')
                    } else {
                        bookdata[index] = updatedData;
                        newBookData = bookdata
                        localStorage.setItem("book-data", JSON.stringify(newBookData))
                    }
            }
        }
        var tableData = showData.map(book => (
            `
            <tr>
            <td>${book.bookname}</td>
            <td>${book.bookauthor}</td>
            <td>${book.bookprice}</td>         
            </tr>
            `
            )).join('');
            
        var tbody = document.querySelector('#body');
        tbody.innerHTML = tableData;
        
    }
}
selectBook();
}


// Display book & user data in admin dashboard
function selectedBook() {
    let bookdata = JSON.parse(localStorage.getItem("book-data"));
    const tableData11 = bookdata.map(book => (
        `
          <tr>
            <td>${book.bookname}</td>
            <td>${book.bookauthor}</td>
            <td>${book.bookprice}</td>
            <td>${book.bookusers}</td>         
          </tr>
        `
    )).join('');

    const tbody = document.querySelector('#admin-body');
    tbody.innerHTML = tableData11;
}
selectedBook();



// [{"bookname":"JavaScript","bookprice":"500","bookauthor":"Vivek Singh","bookusers":[]},{"bookname":"HTML","bookprice":"400","bookauthor":"Rahul","bookusers":[]},{"bookname":"Python","bookprice":"500","bookauthor":"Piyush","bookusers":[]},{"bookname":"CSS","bookprice":"400","bookauthor":"Nitesh","bookusers":[]}]

// [{"name":"vivek","email":"vk@gmail.com","role":"User","phoneNo":"8433085703","password":"123","confirmpassword":"123"},{"name":"nitesh","email":"ns@gmail.com","role":"Admin","phoneNo":"8433085703","password":"123","confirmpassword":"123"},{"name":"piyush","email":"pd@gmail.com","role":"User","phoneNo":"8433085703","password":"123","confirmpassword":"123"}]