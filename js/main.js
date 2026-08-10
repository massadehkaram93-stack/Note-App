import { logic } from "./logic.js" ;
import { render } from "./render.js" ;

let allNotes = JSON.parse(localStorage.getItem("allNotes") || `[]`);

let mainSection = document.querySelector(".main-section");
let titleInput = document.querySelector(".title-input");
let navBarLis = document.querySelectorAll("nav ul li");

let filterMenuLis = document.querySelectorAll(".filter-menu ul li");
let searchInput = document.querySelector(".search-input");

function manageAddAction () {
    if (mainSection.classList.contains("add-note") && !mainSection.classList.contains("added-note")) {
        if (titleInput.value != "") {
            allNotes.push(logic.saveNote());
            localStorage.setItem("allNotes" , JSON.stringify(allNotes));
        }
        render.manageActiveAddNote();
        render.manageCreatNotes(allNotes , "all" , "all");
    }   else if (mainSection.classList.contains("added-note") && mainSection.classList.contains("add-note")) {
        let AllNotesNodeList = document.querySelectorAll(".notes-space .note");
        let activeNote ;

        AllNotesNodeList.forEach((note) => {
            if (note.classList.contains("opened")) {
                activeNote = note ;
                return note ;
            }
        });

        logic.updateNote(activeNote , allNotes);
        render.manageActiveAddNote();
        localStorage.setItem("allNotes" , JSON.stringify(allNotes));
        manageCreatNotes();
        activeNote.classList.remove("opened");
        mainSection.classList.remove("added-note");
    }   else if (!mainSection.classList.contains("add-note")) {
        render.manageActiveAddNote();
    }
}

function managaMoveNote (note , type) {
    note = note.closest(".note");
    logic.moveNote(note , allNotes , type);
    localStorage.setItem("allNotes" , JSON.stringify(allNotes));
    manageCreatNotes();
}

function manageNavBar (li) {
    render.manageNavBar(li);
    manageCreatNotes();
}

function managefiltermenuLis (li) {
    render.manageFilterMenu(li);
    manageCreatNotes();
}

function manageCreatNotes () {
    let activeNavLi ;
    let activeFilterLi ;

    navBarLis.forEach((li) => {
        if (li.classList.contains("active")) {
            activeNavLi = li ;
        }
    });

    filterMenuLis.forEach((li) => {
        if (li.classList.contains("active")) {
            activeFilterLi = li ;
        }
    });

    if (activeNavLi.classList.contains("all-notes")) {
        if (activeFilterLi.classList.contains("all-notes")) {
            render.manageCreatNotes(allNotes , "all" , "all");
        }   else if (activeFilterLi.classList.contains("pinning-notes")) {
            render.manageCreatNotes(allNotes , "pinned" , "else");
        }   else {
            // the Tag in progrres 
        }
    }   else if (activeNavLi.classList.contains("archive-notes")) {
        render.manageCreatNotes(allNotes , "archived" , "else");
    }   else {
        render.manageCreatNotes(allNotes , "deleted" , "deleted");
    }
}

const clicks = {
    "nav-li" : (li) => manageNavBar(li.closest("li") || li) ,

    "mode" : render.manageMode ,
    "moon" : render.manageMode ,
    "sun" : render.manageMode ,
    "slider" : render.manageMode ,

    "filter-action" :  render.activeFilterMenu ,

    "filter-li" : (li) => managefiltermenuLis(li.closest("li") || li) ,

    "add-action" : () => manageAddAction(),

    "trash-btn" : (note) => managaMoveNote(note , "deleted"),

    "archive-btn" : (note) => managaMoveNote(note , "archived"),

    "pinning-btn" : (note) => managaMoveNote(note , "pinned") ,
    
    "restore-btn" : (note) => managaMoveNote(note , "restore") ,

    "finaly-trash-btn" : (note) => { 
        allNotes = logic.finalyDeleted(note.closest(".note") , allNotes) ;
        console.log(allNotes);
        localStorage.setItem("allNotes" , JSON.stringify(allNotes));
        manageCreatNotes(note);
    } ,

    "note": (note) => render.openNote(note.closest(".note") || note , allNotes) ,

    "humbarger-menu-btn" : render.manageActiveHumbargerMenu ,
    "first" : render.manageActiveHumbargerMenu ,
    "middle" : render.manageActiveHumbargerMenu ,
    "last" : render.manageActiveHumbargerMenu ,
}

window.addEventListener("click" , (e) => {
    for (let className of e.target.classList) {
        if (clicks[className]) {
            clicks[className] (e.target);
            break;
        }
    }
});

searchInput.addEventListener("input" , (e) => {
    if (render.creatSearchNotes(logic.search(searchInput.value , allNotes))) { 
        manageCreatNotes();
    }
});

window.addEventListener("load" , (e) => {
    logic.calcFilterBtnPositon();
    logic.calcHumbaergerMenuBtnPosition();
    render.manageCreatNotes(allNotes , "all" , "all");
});

window.addEventListener("resize" , (e) => {
    logic.calcFilterBtnPositon();
    logic.calcHumbaergerMenuBtnPosition();
});