/* 
// this method is blocked by CORS policy
import { URL } from "./api/api.js";

function fetchViaPapaParse () {
    Papa.parse(URL, {
        download: true,
    });
} */

const AVERAGE_GLOBAL_TEMPERATURE = 14;

const draw = fetchData()
    .then(parseData)
    .then(getDataToPlot)
    .then(drawData);

/* 
fetchData
do: - get data from local file
    - convert it to text
out:- data as string
 */ 
function fetchData() {
    const string = fetch("./data/ZonAnn.Ts+dSST.csv")
        .then((response) => response.text())
    return string;
}

/* 
parseData
do: - parse data with Papa.parse
out:- parsed data
 */
function parseData(string) {
    return Papa.parse(string, { header: true }).data
}

/* 
getDataToPlot
do: - prepare data to plot
out:-object with properties:
        <>years[]
        <>temperatureGlob[]
        <>temperatureNorth[]
        <>temperatureSouth[]
 */
function getDataToPlot(data) {
    const dataToPlot = data.reduce((acc, item) => {
        acc.years.push(item.Year);
        acc.temperatureGlob.push(Number(item.Glob) + AVERAGE_GLOBAL_TEMPERATURE);
        acc.temperatureNorth.push(Number(item.NHem) + AVERAGE_GLOBAL_TEMPERATURE);
        acc.temperatureSouth.push(Number(item.SHem) + AVERAGE_GLOBAL_TEMPERATURE)
        return acc;
    }, { years: [], temperatureGlob: [], temperatureNorth: [], temperatureSouth: [] })
    return dataToPlot;
}

/* 
drawData
do: - plot chart with three datasets form object dataToPlot
*/
function drawData(dataToPlot) {
    const {years, temperatureGlob, temperatureNorth, temperatureSouth } = dataToPlot;
    const ctx = document.querySelector('.canvasGisMeteo').getContext('2d');
    const mixedChart = new Chart(ctx, {
        data: {
            datasets: [{
                type: 'line',
                label: 'Global',
                data: temperatureGlob,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                type: 'line',
                label: 'North',
                data: temperatureNorth,
                fill: false,
                borderColor: 'green',
                tension: 0.1
            }, {
                type: 'line',
                label: 'South',
                data: temperatureSouth,
                fill: false,
                borderColor: 'purple',
                tension: 0.1
            },
            ],
            labels: years
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        callback(value) { return value + "\xB0C" }
                    }
                }
            }
        }
    });
};
fetchData();
