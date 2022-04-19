import { datetimeState, moodState, anxietyState, updateDatetimeState, updateMood, updateAnxiety } from '../../js/state.js';
import { route } from '../../js/router.js';
import { datetimeInputFormat, standardizedParse, standardizedFormat, isoParse } from '../../js/dates.js';

export const ratings = () => {
    // display current state value to be submitted
    const dateInput = document.getElementById("datetime-selection");
    const date = standardizedParse(datetimeState).toFormat(datetimeInputFormat);

    // initialize dateInput
    dateInput.value = date;

    // update datetime state when dateInput is changed
    dateInput.onchange = (event) => updateDatetimeState(isoParse(event.target.value).toFormat(standardizedFormat));

    // number of rating options to be generated
    const maxRatings = 7;

    const renderRadioOption = (curRating, type, typeState) => {
        const selection = document.getElementById(type + '-selection');
        const scrollBox = document.querySelector('#' + type + '-selection' + ' .scrollbox');
        let isScrolling = false;

        // create input
        const radioOption = document.createElement('input');
            radioOption.type = "radio";
            radioOption.name = type;
            radioOption.id = type + curRating;
            radioOption.value = curRating;
            if(curRating == typeState) radioOption.checked = true;
        // create label for input
        const radioOptionLabel = document.createElement('label');
            radioOptionLabel.htmlFor = radioOption.id;
            radioOptionLabel.innerText = curRating;

        // render input within scrollbox container 
        scrollBox.appendChild(radioOption)
        // render label after input
        radioOption.after(radioOptionLabel);

        const initShadow = () => {
            if(scrollBox.scrollWidth > scrollBox.clientWidth)
                selection.classList.add('right-arrow-active');
            else
                selection.classList.remove('right-arrow-active');
        }
        initShadow();
        window.addEventListener('resize', initShadow);

        const setShadows = (event) => {
            if(!isScrolling) {
                window.requestAnimationFrame(() => {
                    if(Math.round(event.target.scrollWidth - event.target.scrollLeft) -1 !== event.target.clientWidth &&
                    Math.round(event.target.scrollWidth - event.target.scrollLeft) !== event.target.clientWidth) {
                        selection.classList.add('right-arrow-active')
                    } else {
                        selection.classList.remove('right-arrow-active')
                    }
                    if(event.target.scrollLeft !== 0) {
                        selection.classList.add('left-arrow-active')
                    } else {
                        selection.classList.remove('left-arrow-active')
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }
        scrollBox.addEventListener('scroll', setShadows);
    }

    // render specific number of rating options based on maxRatings
    for(let curRating = 1; curRating <= maxRatings; curRating++) {
        renderRadioOption(curRating, 'mood', moodState);
        renderRadioOption(curRating, 'anxiety', anxietyState);
    }

    // add onclick event to submit btn
    document.getElementById("ratings-submit-btn").onclick = (event) => {
        updateMood(document.getElementById("mood-selection").mood.value);
        updateAnxiety(document.getElementById("anxiety-selection").anxiety.value);
        route(event, 'notes');
    };
}