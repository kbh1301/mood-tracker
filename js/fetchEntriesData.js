import { fetchPath } from '../config.js';
import { fetchAuth } from './auth.js';
import { dateDisplayFormat, now, standardizedParse } from './dates.js';

const dataFormatted = (data) => {
    return data.map(obj => {
        const time = standardizedParse(obj.time_am || obj.time_pm);
        const time_pm = obj.time_pm ? standardizedParse(obj?.time_pm) : null;
        return ({
            ...obj,
            ...dateDisplayFormat(time, time_pm)
        });
    });
};

export const fetchEntriesData = async (buildFunc) => {
    const monthSelection = document.getElementById('month-selection');
    const yearSelection = document.getElementById('year-selection');
    const errorDisplay = document.getElementById('chart-and-table-error');

    // initialize month and datetime dropdowns with current month and year
    const curDate = now();
    const month = curDate.toFormat('LL');
    monthSelection.value = parseInt(month) - 1;
    yearSelection.value = curDate.toFormat('yyyy');

    // fetch data from database with month/year params and stored token
    // then run build function or display error
    const attemptFetch = async () => {
        const year = parseInt(yearSelection.value);
        const monthInt = parseInt(monthSelection.value) + 1;

        try {
            document.getElementById('chart-and-table-error').innerText = 'Loading...';
            const res = await fetchAuth(`${fetchPath}/data/${monthInt}/${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await res.json();
            data = dataFormatted(data);
    
            if(res.status != 200) {
                errorDisplay.innerText = `\u26A0 ${data}`;
                // TODO: possibly display blank table
            } else {
                data = data ? data : [];
                buildFunc(data, monthInt, year);
                errorDisplay.innerText = '';
            }
        } catch (err) {
            console.trace(err + `\nError connecting to server`);
            // display error to user
            errorDisplay.innerText = `\u26A0 Error connecting to server... please try again later`;
        };
    }
    await attemptFetch();

    // rebuilds chart when month or year is changed
    document.getElementById("chart-selection-form").onchange = attemptFetch;
};