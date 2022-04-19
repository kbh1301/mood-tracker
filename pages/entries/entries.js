import { fetchEntriesData } from '../../js/fetchEntriesData.js';

export const entries = () => {
    const buildTable = (data) => {
        // filter data elements not wanted for display in table
        const filteredData = data.map(({id, user_id, dateDisplay, dateShortDisplay, timeDisplay, timeDisplay_pm, ...rest}) => {
            console.log(rest)
            rest.date = dateDisplay;
            rest.time_am = rest.time_am ? timeDisplay : null;
            rest.time_pm = rest.time_pm ? timeDisplay_pm : null;
            return rest;
        });
    
        // destroy existing container
        const curContainer = document.getElementById('entry-btn-container');
        curContainer.remove();
    
        // rebuild container
        const container = curContainer.cloneNode();
        document.getElementById('main-content').append(container);
    
        // for each row of data, generate accordion
        filteredData.forEach(row => {
            // generate accordion button
            const accordionBtn = document.createElement('button');
                accordionBtn.className = 'accordion-button';
                accordionBtn.innerText = `${row.date} - ${row.dayNameDisplay}`;
            container.append(accordionBtn);
    
            // generate accordion table
            const accordionTable = document.createElement('table');
                accordionTable.className = 'accordion-table';
            accordionBtn.after(accordionTable);
    
            // for each data element in row, generate table row
            for (const [key, value] of Object.entries(row)) {
                if(value) {
                    // generate table row and add class based on time suffix
                    const tableRow = document.createElement('tr');
                        tableRow.className = key.endsWith('_am') ? 'am-row' : 'pm-row';
        
                    // skip row if key is date, else add time label
                    switch(key) {
                        case 'date': continue;
                        case 'dayNameDisplay': continue;
                        case 'time_am': {
                            const timeLabel = document.createElement('th');
                                timeLabel.colSpan = 2;
                                timeLabel.innerText = 'DAY \u263C';
                            accordionTable.append(timeLabel);
                            break;
                        }
                        case 'time_pm': {
                            const timeLabel = document.createElement('th');
                                timeLabel.colSpan = 2;
                                timeLabel.innerText = 'NIGHT \u263D';
                            accordionTable.append(timeLabel);
                            break;
                        }
                    };
        
                    // generate key cell
                    const keyCell = document.createElement('td');
                        keyCell.className = 'key-cell';
                        // display key without time suffix
                        keyCell.innerText = key.slice(0, -3);
                    tableRow.append(keyCell);
        
                    // generate value cell
                    const valueCell = document.createElement('td');
                        valueCell.className = 'value-cell';
                        // format value if key is time
                        valueCell.innerText = value;
                    tableRow.append(valueCell);
        
                    accordionTable.append(tableRow)
                };
            };
    
            // add table toggle to accordion button
            accordionBtn.addEventListener('click', () => {
                const active = document.querySelectorAll('.accordion-button.active')[0];
                // remove 'active' from accordion button if it exists
                active?.classList.remove('active');
                // add 'hidden' from accordion's table if active accordion exists
                if(active) active.nextElementSibling.style.maxHeight = null;
    
                // if active accordion button does not match THIS accordion button, activate it and display its table
                if(active != accordionBtn) {
                    accordionBtn.classList.add('active');
                    accordionTable.style.maxHeight = accordionTable.scrollHeight + 'px';
    
                    // if active accordion button exists, scroll into view after transition animation
                    accordionTable.addEventListener('transitionend', () => {
                        document.querySelectorAll('.accordion-button.active')[0]?.scrollIntoView({behavior: 'smooth'});
                    });
                };
            });
        });
    };
    
    // build table
    fetchEntriesData(buildTable);
}