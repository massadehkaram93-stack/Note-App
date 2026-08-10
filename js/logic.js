let filterBtn = document.querySelector(".filter-action");
let filterMenu = document.querySelector(".filter-menu");

let titleInput = document.querySelector(".title-input");
let typeArea = document.querySelector(".type-area");
let topCard = document.querySelector(".top-card");

let humbargerMenuBtn = document.querySelector(".humbarger-menu-btn");

export const logic = {
    calcFilterBtnPositon : () => {
        let rect = filterBtn.getBoundingClientRect();

        let Bottom = rect.bottom + 15;
        let Right = rect.left - ( filterMenu.offsetWidth * 0.75);
        
        filterMenu.style.top = `${Bottom}px`;
        filterMenu.style.left = `${Right}px`;
    } ,

    calcHumbaergerMenuBtnPosition : () => {
        let rect = topCard.getBoundingClientRect();

        let CenterY = rect.top + (rect.height / 2 ) - (humbargerMenuBtn.offsetHeight / 2);

        humbargerMenuBtn.style.top = `${CenterY}px`
    },

    saveNote: (allNotes) => {
        let newNote = {
            title:"",
            textHtml:"",
            pinned : false ,
            archived : false ,
            deleted : false 
        };

        newNote.title = titleInput.value ;
        newNote.textHtml = typeArea.innerHTML ;

        return newNote ;
    },

    updateNote: (note , allNotes) => {
        let mainTitle = note.firstElementChild.innerText ;
        let noteObject ;
        allNotes.filter((theNote) => {
            if (theNote.title === mainTitle) {
                noteObject = theNote ;
                return theNote ;
            }
        });

        noteObject.title = titleInput.value ;
        noteObject.textHtml = typeArea.innerHTML ;
        
    },
    
    moveToDeletedNotes: (theNote) => {
        theNote.pinned = false ;
        theNote.archived = false ;
        theNote.deleted = true ;
    },

    moveToArchivedNotes: (theNote) => {
        theNote.pinned = false ;
        theNote.archived = true ;
        theNote.deleted = false ;
    },

    moveToPinnedNotes: (theNote) => {
        theNote.pinned = true ;
        theNote.archived = false ;
        theNote.deleted = false ;
    },
    
    moveNote: (mainNote , allNotes , type) => {
        const Move = {
            "deleted": (theNote) => logic.moveToDeletedNotes(theNote) ,
            "archived": (theNote) => logic.moveToArchivedNotes(theNote) ,
            "pinned": (theNote) => logic.moveToPinnedNotes(theNote) ,
            "restore": (theNote) => logic.restoreNote(theNote) ,
        }

        let mainTitle = mainNote.firstElementChild.innerText ;
        let theNote ;
        
        allNotes.filter((note) => {
            if (note.title === mainTitle) {
                theNote = note ;
            }
        });
        
        for(let i=0; i<4; i++) {
            if (Move[type]) {
                Move[type] (theNote);
                break;
            }
        }
    },

    restoreNote : (theNote) => {
        theNote.pinned = false ;
        theNote.archived = false ;
        theNote.deleted = false ;
    } ,

    finalyDeleted : (mainNote , allNotes) => {
        let mainTitle = mainNote.firstElementChild.innerHTML ;
        
        allNotes = [...allNotes.filter((note) => {
            return note.title !== mainTitle ;
        })];
        
        return allNotes ;
    } ,

    search: (value , allNotes) => {
        if (value !== "") {
            let searchNotes = [] ;

            allNotes.forEach((note) => {
                if (note.title.toLowerCase().includes(value.toLowerCase())) {
                    searchNotes.push(note);
                }
            });

            return searchNotes ;
        }   else {
            return [] ;
        }
    },
}