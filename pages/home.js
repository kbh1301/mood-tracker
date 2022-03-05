Object.assign(pageFunctions, {[pages[getScriptName()]]: () => {
    const getDaysFromMonth = (month, year) => {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date).toLocaleDateString("en-US", {day:'numeric',month:'numeric'}));
            date.setDate(date.getDate() + 1)
        }
        return days;
    }

    const currentDate = new Date();
    let daysInMonthLabels = getDaysFromMonth(currentDate.getMonth(), currentDate.getFullYear())
    document.getElementById("month-selection").value = currentDate.getMonth();

    const data = [
        {x: '3/1', mood: 2, anxiety: 3, notes: 'testtesttest'},
        {x: '3/2', mood: 3, anxiety: 2, notes: ''},
        {x: '3/3', mood: 2, anxiety: 1, notes: ''},
        {x: '3/4', mood: 6, anxiety: 5, notes: ''},
        {x: '3/5', mood: 1, anxiety: 1, notes: ''},
        {x: '3/6', mood: 1, anxiety: 1, notes: ''},
    ];

    let configOptions = (mode) => { 
        return {
            options: {
                indexAxis: mode,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: () => {
                                return ''
                            },
                            afterBody: (context) => {
                                let tooltip = '';
                                tooltip += "Mood: " + context[0].raw.mood;
                                tooltip += "\nAnxiety: " + context[0].raw.anxiety;
                                tooltip += "\nNotes: " + context[0].raw.notes;
                                return tooltip;
                            }
                        }
                    }
                },
                scales: {
                    [mode == 'y' ? 'x' : 'y']: {
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

    let config = {
        type: 'bar',
        data: {
            labels: daysInMonthLabels,
            datasets: [{
                label: 'Mood',
                backgroundColor: '#9AE6F4',
                borderColor: '#9AE6F4',
                data: data,
                parsing: {
                    yAxisKey: 'mood'
                }
            },{
                label: 'Anxiety',
                backgroundColor: '#48C2D9',
                borderColor: '#48C2D9',
                data: data,
                parsing: {
                    yAxisKey: 'anxiety'
                }
            }]
        },
    };
    Object.assign(config, configOptions());

    const moodChart = new Chart(document.getElementById('mood-chart'), config);

    const setChartAxis = () => {
        let mode = window.innerWidth < window.innerHeight ? 'y' : 'x';
        if(moodChart.options.indexAxis !== mode) {
            Object.assign(config, configOptions(mode));
            moodChart.update();
        }
    }
    window.addEventListener('resize', setChartAxis)

    const updateChart = () => {
        const parseSelection = (selection) => parseInt(document.getElementById(selection).value);
        daysInMonthLabels = getDaysFromMonth(parseSelection("month-selection"), parseSelection("year-selection"));
        Object.assign(config.data, {labels: daysInMonthLabels})
        moodChart.update();
    }
    document.getElementById("chart-selection-form").onchange = updateChart;
}});