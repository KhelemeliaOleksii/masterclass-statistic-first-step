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

function fetchData() {
    const string = fetch("./data/ZonAnn.Ts+dSST.csv")
        .then((response) => response.text())
    return string;
}

function parseData(string) {
    return Papa.parse(string, { header: true }).data
}

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
function drawData(dataToPlot) {
    const ctx = document.querySelector('.canvasGisMeteo').getContext('2d');
    const mixedChart = new Chart(ctx, {
        data: {
            datasets: [{
                type: 'line',
                label: 'Global',
                data: dataToPlot.temperatureGlob,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                type: 'line',
                label: 'North',
                data: dataToPlot.temperatureNorth,
                fill: false,
                borderColor: 'green',
                tension: 0.1
            }, {
                type: 'line',
                label: 'South',
                data: dataToPlot.temperatureSouth,
                fill: false,
                borderColor: 'purple',
                tension: 0.1
            },
            ],
            labels: dataToPlot.years
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
