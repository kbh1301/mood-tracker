import { datetimeState, moodState, anxietyState, notesState, updateDatetimeState, updateNotes, getEntryData } from '../../js/state.js'
import { route } from '../../js/router.js';
import { fetchAuth } from '../../js/auth.js';
import { fetchPath } from '../../config.js';
import { datetimeInputFormat, dateDisplayFormat, standardizedParse, standardizedFormat, isoParse } from '../../js/dates.js';

export const notes = () => {
    // display current state value to be submitted
    const dateInput = document.getElementById("datetime-selection");
    const date = standardizedParse(datetimeState).toFormat(datetimeInputFormat);

    // initialize dateInput
    dateInput.value = date;

    // update datetime state when dateInput is changed
    dateInput.onchange = (event) => updateDatetimeState(isoParse(event.target.value).toFormat(standardizedFormat));

    const notesInput = document.getElementById("notes-input");
    const { dateDisplay, timeDisplay } = dateDisplayFormat(isoParse(date));

    // initialize input fields with state data
    document.getElementById("mood-display").innerHTML = moodState;
    document.getElementById("anxiety-display").innerHTML = anxietyState;
    notesInput.value = notesState;
    notesInput.placeholder = (
       `${dateDisplay} ${timeDisplay}\nMood: ${moodState}\nAnxiety: ${anxietyState}`
    );

    const submitBtn = document.getElementById("submit-button");
    const submitData = async (event) => {
        // disable submit button
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';

        // function to overwrite existing data
        const submitOverwrite = () => {
            fetchAuth(`${fetchPath}/data/overwrite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: getEntryData()
            });
        };

        try {
            const res = await fetchAuth(`${fetchPath}/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: getEntryData()
            });

            if(res.status != 200) {
                if(confirm(`${res.statusText} Overwrite?`)) {
                    submitOverwrite();
                    route(event, 'dashboard');
                } else {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Submit';
                    return;
                };
            };

            route(event, 'dashboard');
        } catch(err) {
            console.trace(err);
            alert('Error communicating with server');
        };
    };

    document.getElementById('ratings-overview').onclick = (event) => route(event, 'ratings');
    notesInput.onchange = (event) => updateNotes(event.target.value);
    submitBtn.onclick = (event) => submitData(event);
};