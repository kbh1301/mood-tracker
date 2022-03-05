let mood;
const updateMood = (input) => {
    if(input) mood = input;
}

let anxiety;
const updateAnxiety = (input) => {
    if(input) anxiety = input;
}

let dateInit = new Date()
let date;
const updateDate = (input) => {
    if(input) date = input;
}

let notes;
const updateNotes = (input) => {
    if(input) notes = input;
}

const initialState = () => {
    mood = anxiety = 1;
    date = new Date(dateInit.getTime() - (dateInit.getTimezoneOffset() * 60000)).toJSON().slice(0,16);
    notes = "";
}

initialState();