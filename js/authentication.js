// SELECT ELEMENT
function getElement(selection) {
    const element = document.querySelector(selection);
    if (element) {
      return element;
    }
    throw new Error(
      `Please check "${selection}" selector, no such element exists`
    );
  }

// TABS 

const registerTab = getElement(".js-registerTab");
const loginTab = getElement(".js-loginTab");
const registerTabContent = getElement(".js-registerTabContent");
const loginTabContent = getElement(".js-loginTabContent");
const tabs = document.querySelectorAll(".js-tabs");

const changeActiveTab = (e) => {
    tabs.forEach(tab => {
        tab.classList.remove("active");
    })

    if(e.target.classList.contains("js-registerTab")) {
        registerTabContent.classList.add("active");
        loginTabContent.classList.remove("active");
    } else if(e.target.classList.contains("js-loginTab")) {
        loginTabContent.classList.add("active");
        registerTabContent.classList.remove("active");
    }
    e.target.classList.add("active");
}

// REGISTER

const registerName = getElement(".js-registerName");
const registerEmail = getElement(".js-registerEmail");
const registerPassword = getElement(".js-registerPassword");
const registerBtn = getElement(".js-registerBtn");

const registerAuth = () => {
    const name = registerName.value;
    const email = registerEmail.value;
    const password = registerPassword.value;
    
    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        // console.log(cred);
        return db.collection('users').doc(cred.user.uid).set({
            Name: name,
            Email: email,
            Password: password
        }).then(() => {
            location = "dashboard.html";
        }).catch(err => {
            alert(err.message);
        })
    }).catch(err => {
        alert(err.message);
    })
}

// LOGIN
const loginEmail = getElement(".js-loginEmail");
const loginPassword = getElement(".js-loginPassword");
const loginBtn = getElement(".js-loginBtn");

const loginAuth = () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    auth.signInWithEmailAndPassword(email, password).then(() => {
        console.log('login');
        location = "dashboard.html";
    }).catch(err => {
        alert(err.message);
    })

}

// EVENT LISTENERS

registerBtn.addEventListener("click", registerAuth);
loginBtn.addEventListener("click", loginAuth);
registerTab.addEventListener("click", changeActiveTab);
loginTab.addEventListener("click", changeActiveTab);

