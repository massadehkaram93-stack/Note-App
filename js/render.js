import { logic } from "./logic.js" ;

let darkMode = JSON.parse(localStorage.getItem("darkMode") || false);

let checkBox = document.querySelector(".mode input");
let filterMenu = document.querySelector(".filter-menu");
let mainSection = document.querySelector(".main-section");

let typeArea = document.querySelector(".type-area");
let titleInput = document.querySelector(".title-input");
let notesSpace = document.querySelector(".notes-space");

let humbargerMenu = document.querySelector(".humbarger-menu");
let humbargerMenuBtn = document.querySelector(".humbarger-menu-btn");
let humbargerMenuBtnDivs = document.querySelectorAll(".humbarger-menu-btn div");
let uiOverlay = document.querySelector(".ui-overlay");

if (darkMode) {
    document.body.classList.add("dark");
    checkBox.checked = true ;
}

function setActiveLi (mainLi) {
    let navlis = Array.from(mainLi.parentElement.children);

    navlis.forEach(li => {
        li.classList.remove("active");
    });
    mainLi.classList.add("active");
}

function manageDarkMode (li) {
    if (checkBox.checked) {
        document.body.classList.remove("dark")
        darkMode = false ;
    }  else {
        document.body.classList.add("dark")
        darkMode =  true ;
    }
    localStorage.setItem("darkMode" , JSON.stringify(darkMode));
}

const buttons = {
            "all" : () => {
                return `<div class="btns-box">
                            <button class="pinning-btn">
                                <svg width="24" height="24" class="pinning-btn">
                                    <use href="#pin-svg" class="pinning-btn"></use>
                                </svg>
                            </button>
                            <button class="archive-btn">
                                <svg width="24" height="24" class="archive-btn">
                                    <use href="#archive-svg" class="archive-btn"></use>
                                </svg>
                            </button>
                            <button class="trash-btn">
                                <svg width="24" height="24" class="trash-btn">
                                    <use href="#trash-svg" class="trash-btn"></use>
                                </svg>
                            </button>
                        </div>` ;
            },

            "deleted": () => {
                return `<div class="box">
                                <button class="restore-btn">
                                    <svg width="24" height="24" class="restore-btn">
                                        <use href="#restore-svg" class="restore-btn"></use>
                                    </svg>
                                </button>
                                <button class="finaly-trash-btn">
                                    <svg width="24" height="24" class="finaly-trash-btn">
                                        <use href="#trash-svg" class="finaly-trash-btn"></use>
                                    </svg>
                                </button>
                            </div>`;
            },

            "else" : () => {
                return `<div class="box">
                            <button class="restore-btn">
                                <svg width="24" height="24" class="restore-btn">
                                    <use href="#restore-svg" class="restore-btn"></use>
                                </svg>
                            </button>
                            <button class="trash-btn">
                                <svg width="24" height="24" class="trash-btn">
                                    <use href="#trash-svg" class="trash-btn"></use>
                                </svg>
                            </button>
                        </div>`;
            }
        };

export const render = {
    manageNavBar: (li) => {
        setActiveLi(li.closest("li"));
    },

    manageMode: () => manageDarkMode() ,

    manageFilterMenu: (li) => {
        setActiveLi(li);
    } ,

    activeFilterMenu : () => {
        filterMenu.classList.toggle("active");
    },

    manageActiveAddNote : () => {
        if (mainSection.classList.contains("add-note")) {
            mainSection.classList.remove("add-note")
            titleInput.innerText = "";
            typeArea.innerHTML = "";
        }   else {
            mainSection.classList.add("add-note")
            titleInput.innerText = "";
            typeArea.innerHTML = "";
            typeArea.focus();
        }
    },

    manageActiveHumbargerMenu: () => {
        if (humbargerMenu.classList.contains("open")) {
            uiOverlay.classList.remove("active");
            humbargerMenu.classList.remove("open")
            humbargerMenuBtnDivs.forEach((div) => {
                div.classList.remove("open");
            });
            humbargerMenuBtn.classList.remove("open");
        }   else {
            uiOverlay.classList.add("active");
            humbargerMenu.classList.add("open")
            humbargerMenuBtnDivs.forEach((div) => {
                div.classList.add("open");
            });
            humbargerMenuBtn.classList.add("open");
        }
    },

    manageCreatNotes: (allNotes , TheType , btns) => {
        if (TheType != "all") {
            allNotes = allNotes.filter((note) => {
                if (note[TheType]) {
                    return note ;
                }
            });
        }   else {
            allNotes = allNotes.filter((note) => {
                if (!note.pinned && !note.deleted && !note.archived) {
                    return note ;
                }
            });
        }

        if (allNotes.length != 0) {
            notesSpace.innerHTML = allNotes.map((note) => {
                return `<div class="note">
                        <div class="name">${note.title}</div>
                        ${buttons[btns] ()}
                    </div>`
            }).join("");
        }   else {
            notesSpace.innerHTML = `<div class="special">No Notes Yet</div>`
        }
    },

    creatSearchNotes: (allNotes , value , btns) => {
        if (allNotes.length != 0) {
            notesSpace.innerHTML = allNotes.map((note) => {
                if (note.deleted) {
                    btns = "deleted";
                }   else if (note.archive || note.pinned) {
                    btns = "else";
                }   else {
                    btns = "all" ;
                }

                return `<div class="note">
                        <div class="name">${note.title}</div>
                        ${buttons[btns] ()}
                    </div>`
            }).join("");
        }   else {
            notesSpace.innerHTML = `<div class="special">Not Found</div>`
        }
    },

    openNote : (note , allNotes) => {
        note.classList.add("opened");
        let mainTitle = note.firstElementChild.innerText ;
        let noteObject ;
        allNotes.filter((theNote) => {
            if (theNote.title === mainTitle) {
                noteObject = theNote ;
                return theNote ;
            }
        });


        titleInput.value = noteObject.title ;
        typeArea.innerHTML = noteObject.textHtml || "";

        mainSection.classList.add("add-note");
        mainSection.classList.add("added-note");
    },

};