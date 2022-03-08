Object.assign(pageFunctions, {[pages[getScriptName()]]: () => {
    let monthSelection = document.getElementById("month-selection");
    let yearSelection = document.getElementById("year-selection");

    // generate array of days to serve as index axis labels
    const getDaysFromMonth = (month, year) => {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date).toLocaleDateString("en-US", {day:'numeric',month:'numeric'}));
            date.setDate(date.getDate() + 1);
        };
        return days;
    };

    const currentDate = new Date();
    // initialize index axis labels with current month's days
    let daysInMonthLabels = getDaysFromMonth(currentDate.getMonth(), currentDate.getFullYear());
    // initialize month and date dropdowns with current month and date
    monthSelection.value = currentDate.getMonth();
    yearSelection.value = currentDate.getFullYear();

    const data = [
        {dateTime: '2022-03-01 08:00:00', mood: 2, anxiety: 3, notes: 'testtesttest'},
        {dateTime: '2022-03-02 08:00:00', mood: 3, anxiety: 2, notes: ''},
        {dateTime: '2022-03-03 08:00:00', mood: 2, anxiety: 1, notes: ''},
        {dateTime: '2022-03-04 08:00:00', mood: 6, anxiety: 5, notes: ''},
        {dateTime: '2022-03-05 08:00:00', mood: 1, anxiety: 1, notes: ''},
        {dateTime: '2022-03-06 08:00:00', mood: 1, anxiety: 1, notes: ''},
    ];

    // moodChart configuration
    const moodChartConfig = () => {
        // adds date property to data for labeling;
        // filters data based on date property and selection values
        const filteredData = data.filter(obj => {
            const date = new Date(obj.dateTime);
            obj.date = date.toLocaleDateString("en-US", {day:'numeric',month:'numeric'});

            return date.getMonth().toString() == monthSelection.value && date.getFullYear().toString() == yearSelection.value;
        });

        let dateAxis = window.innerWidth < window.innerHeight ? 'y' : 'x';
        let scaleAxis = window.innerWidth < window.innerHeight ? 'x' : 'y';

        return {
            type: 'bar',
            data: {
                labels: daysInMonthLabels,
                datasets: [{
                    label: 'Mood',
                    backgroundColor: '#9AE6F4',
                    borderColor: '#9AE6F4',
                    data: data,
                    parsing: {
                        [scaleAxis + 'AxisKey']: 'mood',
                        [dateAxis + 'AxisKey']: 'date'
                    }
                },{
                    label: 'Anxiety',
                    backgroundColor: '#48C2D9',
                    borderColor: '#48C2D9',
                    data: data,
                    parsing: {
                        [scaleAxis + 'AxisKey']: 'anxiety',
                        [dateAxis + 'AxisKey']: 'date'
                    }
                }]
            },
            options: {
                indexAxis: dateAxis,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: () => {
                                return ''
                            },
                            afterBody: (context) => {
                                let tooltip = '';
                                tooltip += context[0].raw.dateTime;
                                tooltip += "\nMood: " + context[0].raw.mood;
                                tooltip += "\nAnxiety: " + context[0].raw.anxiety;
                                tooltip += "\nNotes: " + context[0].raw.notes;
                                return tooltip;
                            }
                        }
                    }
                },
                scales: {
                    [scaleAxis]: {
                        max: 7,
                        min: 0,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        }
    };

    // initialize moodChart
    let moodChart = new Chart(document.getElementById('mood-chart'), moodChartConfig());

    // rebuild moodChart with update configuration
    const rebuildMoodChart = () => {
        moodChart.destroy();
        moodChart = new Chart(document.getElementById('mood-chart'), moodChartConfig());
    };

    // rebuilds moodChart with horizontal bars when window is in portrait mode and vertical bars in landscape
    const setChartAxis = () => {
        let dateAxis = window.innerWidth < window.innerHeight ? 'y' : 'x';
        if(moodChart.options.indexAxis != dateAxis) rebuildMoodChart();
    };
    window.addEventListener('resize', setChartAxis);

    // rebuilds moodChart with new labels when selection dropdowns are changed
    const updateChart = () => {
        const parseSelection = (selection) => parseInt(selection.value);
        daysInMonthLabels = getDaysFromMonth(parseSelection(monthSelection), parseSelection(yearSelection));
        rebuildMoodChart();
    };
    document.getElementById("chart-selection-form").onchange = updateChart;
}});