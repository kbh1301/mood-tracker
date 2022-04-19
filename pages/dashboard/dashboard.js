import { monthYearParse } from '../../js/dates.js';
import { fetchEntriesData } from '../../js/fetchEntriesData.js';

export const dashboard = () => {
    // initialize moood chart
    let moodChart = new Chart(document.getElementById('mood-chart'));

    // build mood chart with config and data
    const buildChart = async (data, month, year) => {

        // generate array of days to serve as index axis labels
        const getDaysFromMonth = (month, year) => {
            let date = monthYearParse(`${year}-${month}`);
            var days = [];

            while (parseInt(date.toFormat('L')) === month) {
                days.push(date.toFormat('M/d'));
                date = date.plus({ days:1 });
            };
            return days;
        };

        // get current month/year selection and create array of days
        const daysInMonthLabels = getDaysFromMonth(month, year);

        // moodChart configuration
        const moodChartConfig = (data, daysInMonthLabels) => {

            // formats and trims notes data to fit tooltip
            const ttNotesFormat = (note) => {
                // max number of notes paragraph lines
                let lineLimit = 3;
                // max character length of each line
                let charLimit = 26;
                // initialize note to be returned
                let formattedNote = '';

                for (let curLine = 1; curLine <= lineLimit; curLine++) {
                    // find first whitespace from the end of charLimit
                    const whiteSpaceIndex = note.lastIndexOf(" ", charLimit);
                    // if remaining note is within charLimit or there is no whitespace (value is -1), store entire note; else store substring before the nearest whitespace based on charLimit
                    let lineString = note.length < charLimit || whiteSpaceIndex < 0 ? note : note.substring(0, whiteSpaceIndex);

                    // if lineString is longer than charLimit, trim to charLimit
                    if(lineString.length > charLimit) lineString = lineString.slice(0, charLimit);

                    // set note to be remainder of note after removing lineString
                    note = note.slice(lineString.length).trim();

                    // if first line and no string exists, set note to 'none' and break loop; else add lineString to return note
                    if(curLine == 1 && !lineString.trim()) {
                        formattedNote += '(none)';
                        break;
                    } else if(lineString) {
                        formattedNote += `\n\t${lineString}`;
                    }
                    
                    // if final paragraph line and there is note remaining, append notice of continuation
                    if(curLine == lineLimit && note.length) {
                        formattedNote += ' (...)';
                    };
                };

                return formattedNote;
            };

            // set axis based on window mode of landscape or portrait
            let dateAxis = window.innerWidth < window.innerHeight ? 'y' : 'x';
            let scaleAxis = window.innerWidth < window.innerHeight ? 'x' : 'y';

            return {
                type: 'bar',
                data: {
                    labels: daysInMonthLabels,
                    datasets: [{
                        id: 'AM',
                        label: 'Mood \u263C',
                        backgroundColor: '#99ccff',
                        borderColor: '#99ccff',
                        data: data,
                        parsing: {
                            [scaleAxis + 'AxisKey']: 'mood_am',
                            [dateAxis + 'AxisKey']: 'dateShortDisplay'
                        }
                    },{
                        id: 'PM',
                        label: 'Mood \u263D',
                        backgroundColor: '#77aaff',
                        borderColor: '#77aaff',
                        data: data,
                        parsing: {
                            [scaleAxis + 'AxisKey']: 'mood_pm',
                            [dateAxis + 'AxisKey']: 'dateShortDisplay'
                        }
                    },{
                        id: 'AM',
                        label: 'Anxiety \u263C',
                        backgroundColor: '#5588ff',
                        borderColor: '#5588ff',
                        data: data,
                        parsing: {
                            [scaleAxis + 'AxisKey']: 'anxiety_am',
                            [dateAxis + 'AxisKey']: 'dateShortDisplay'
                        }
                    },{
                        id: 'PM',
                        label: 'Anxiety \u263D',
                        backgroundColor: '#3366ff',
                        borderColor: '#3366ff',
                        data: data,
                        parsing: {
                            [scaleAxis + 'AxisKey']: 'anxiety_pm',
                            [dateAxis + 'AxisKey']: 'dateShortDisplay'
                        }
                    }]
                },
                options: {
                    indexAxis: dateAxis,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            backgroundColor: (context) => {
                                return context.tooltipItems[0]?.dataset.borderColor;
                            },
                            borderColor: 'black',
                            borderWidth: '1',
                            callbacks: {
                                title: (context) => {
                                    // tooltip title
                                    const isMorning = context[0].dataset.id=='AM' ? true : false;
                                    const ttTime = isMorning ? context[0].raw.timeDisplay : context[0].raw.timeDisplay_pm;
                                    const ttDay = context[0].raw.dayNameDisplay;
                                    const labelTime = isMorning ? 'Day \u263C' : 'Night \u263D';

                                    return `${context[0].label} - ${labelTime}\n${ttDay} ${ttTime}`;
                                },
                                label: () => {
                                    return '';
                                },
                                afterBody: (context) => {
                                    // tooltip body
                                    const isMorning = context[0].dataset.id=='AM' ? true : false;
                                    const ttMood = isMorning ? context[0].raw.mood_am : context[0].raw.mood_pm;
                                    const ttAnxiety = isMorning ? context[0].raw.anxiety_am : context[0].raw.anxiety_pm;
                                    let ttNotes = isMorning ? context[0].raw.notes_am : context[0].raw.notes_pm;
                                    ttNotes = ttNotesFormat(ttNotes);
                                    const ttNotesNotNull = ttNotes ? `\nNotes: ${ttNotes}` : '';
        
                                    return `\nMood: ${ttMood}\nAnxiety: ${ttAnxiety}${ttNotesNotNull}`;
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
                        },
                    }
                }
            }
        };

        // reinitialize chart
        const reinitializeChart = async () => {
            await moodChart.destroy();
            moodChart = new Chart(document.getElementById('mood-chart'), moodChartConfig(data, daysInMonthLabels));
        };
        reinitializeChart([]);
    };

    // build moodChart
    fetchEntriesData(buildChart);

    // rebuilds moodChart with horizontal bars when window is in portrait mode and vertical bars in landscape
    const setChartAxis = () => {
        let dateAxis = window.innerWidth < window.innerHeight ? 'y' : 'x';
        if(moodChart.options.indexAxis != dateAxis) fetchEntriesData(buildChart);
    };
    window.addEventListener('resize', setChartAxis);
};