import { now, standardizedFormat, standardizedParse } from "./dates.js";

export let usernameState = localStorage.getItem('username') || '';
export const updateUser = (input) => {
    if(input) usernameState = input;
}

export let moodState;
export const updateMood = (input) => {
    if(input) moodState = input;
};

export let anxietyState;
export const updateAnxiety = (input) => {
    if(input) anxietyState = input;
};

// export const getDateInit = () => new Date();
export let datetimeState;
let _meridiemState;

export const updateDatetimeState = (input) => {
    if(input) {
        datetimeState = standardizedParse(input).toFormat(standardizedFormat);
        _meridiemState = '_' + standardizedParse(input).toFormat('a').toLowerCase();
    };
};

export let notesState;
export const updateNotes = (input) => {
    if(input) notesState = input;
};

export const initialState = () => {
    moodState = anxietyState = 1;
    updateDatetimeState(now().toFormat(standardizedFormat));
    notesState = "";
};
initialState();

export const getEntryData = () => {
    return JSON.stringify({
        _meridiem : _meridiemState,
        time: datetimeState,
        mood: moodState,
        anxiety: anxietyState,
        notes: notesState
    });
};