// exports code to pageFunctions as a function with the name based on filename
Object.assign(pageFunctions, {[pages[getScriptName()]]: () => {
    // display current state value to be submitted
    document.getElementById("date-selection").value = date;

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
        renderRadioOption(curRating, 'mood', mood);
        renderRadioOption(curRating, 'anxiety', anxiety);
    }
}});