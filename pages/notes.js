Object.assign(pageFunctions, {[pages[getScriptName()]]: () => {
    // display current state values to be submitted
    document.getElementById("date-selection").value = date;
    document.getElementById("mood-display").innerHTML = mood;
    document.getElementById("anxiety-display").innerHTML = anxiety;
    document.getElementById("notes-input").value = notes;
    document.getElementById("notes-input").placeholder = (
        date + "\n"+
        "Mood: " + mood + "\n" +
        "Anxiety: " + anxiety);

    const submitData = () => {
        console.log(date.replace('T', ' ') + ':00');
        console.log(mood);
        console.log(anxiety);
        console.log(notes);
        initialState();
        route(event, './')
    }
    document.getElementById("submit-button").onclick = () => submitData();
}});