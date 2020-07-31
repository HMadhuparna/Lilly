function stockTicker() {

    let ticker = document.getElementById('ticker').value;
    ticker = ticker.toUpperCase();
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=2X8AHKH6M7SLGS8H`;
    let urlName = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=2X8AHKH6M7SLGS8H`;

    fetch(url).then(function(stockData) {
        stockData.json().then(function(data) {
    
            if( data['Meta Data'] ) {
                document.querySelector('.tickerDoesNotExist').innerHTML = "";

                let lastRefresh = data['Meta Data']['3. Last Refreshed'];
                let tickerName = data['Meta Data']['2. Symbol'];
                let openPrice = data['Time Series (1min)'][lastRefresh]['1. open'];
                let highPrice = data['Time Series (1min)'][lastRefresh]['2. high'];
                let lowPrice = data['Time Series (1min)'][lastRefresh]['3. low'];
                let closePrice = data['Time Series (1min)'][lastRefresh]['4. close'];
               
    
                openPrice = Number( openPrice ).toFixed(2);
                lowPrice = Number( lowPrice ).toFixed(2);
                highPrice = Number( highPrice ).toFixed(2);
                closePrice = Number( closePrice ).toFixed(2);

                //Convert date from UTC to a nice looking date
                let dateConversionObject = new Date(lastRefresh);
                let month = dateConversionObject.toLocaleString('default', { month: 'long' });
                let day = dateConversionObject.getUTCDate();
                let year = dateConversionObject.getUTCFullYear();
                let UTCHour = dateConversionObject.getHours();
                let suffix = (UTCHour >= 12) ? " PM" : " AM";
                let hour = (( dateConversionObject.getHours() + 11) % 12 + 1);
                let minute = dateConversionObject.getMinutes();
                //Add zero to minutes if minutes equals 0
                let addZero = (minute === 0) ? "0" : "";
                let fullDate = month + ", " + day + ", " + year + " " + hour + ":" + minute + addZero + suffix;
    
                document.querySelector('.tickerText').innerHTML = "Ticker: " + `<span class="green bold">${tickerName}</span>`;

                fetch(urlName).then(function(name) {
                    name.json().then(function(nameData) {
                        let stockName = nameData.bestMatches[0]['2. name'];
                        document.querySelector('.stockName').innerHTML = "Name: " + `<span class="green bold">${stockName}</span>`;
                    });
                });

                document.querySelector('.priceContainer').classList.add('addPadding');
    
                document.querySelector('.lastAvailPrice').innerHTML = "Last available price: " + 
                `<td class="green">${fullDate}</td>`;
    
                document.querySelector('.openPrice').innerHTML = "Open price: " + 
                `<td class='green'> $${openPrice} </td>`;

                document.querySelector('.lowPrice').innerHTML = "Low price: " + 
                `<td class='green'> $${lowPrice} </td>`;

                document.querySelector('.highPrice').innerHTML = "High price: " + 
                `<td class='green'> $${highPrice} </td>`;

                document.querySelector('.closePrice').innerHTML = "Last price: " + 
                `<td class='green'> $${closePrice} </td>`;
    
                   

            } else {
                document.querySelector('.priceContainer').classList.remove('addPadding');

                let clearClasses = document.querySelectorAll('.clear');
                for (let i = 0; i < clearClasses.length; i++) {
                    let element = clearClasses[i];
                    element.innerHTML = "";
                }

                document.querySelector('.tickerDoesNotExist').innerHTML = "Ticker does not exist or failed to fetch data.";
            }
        });
    });
    
    //adds commas every 3 digits
    function numberWithCommas( x ) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

}



//Runs stockTicker function when a user presses the enter key
document.addEventListener("keydown", function(e) {
    if (e.key === 'Enter'){
        stockTicker();
    }

    Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv", function (err, rows) {

    function unpack(rows, key) {
        return rows.map(function (row) { return row[key]; });
    }


    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: 'AAPL High',
        x: unpack(rows, 'Date'),
        y: unpack(rows, 'AAPL.High'),
        line: { color: 'green' }
    }

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: 'AAPL Low',
        x: unpack(rows, 'Date'),
        y: unpack(rows, 'AAPL.Low'),
        line: { color: 'orange' }
    }

    var data = [trace1, trace2];

    var layout = {
        title: 'Apple Stock',
        xaxis: {
            autorange: true,
            range: ['2015-02-17', '2017-02-16'],
            rangeselector: {
                buttons: [
                    {
                        count: 1,
                        label: '2y',
                        step: 'month',
                        stepmode: 'backward'
                    }
                    
                    
                ]
            },
            //rangeslider: { range: ['2015-02-17', '2017-02-16'] },
            //type: 'date'
        },
        yaxis: {
            //autorange: true,
            //range: [86.8700008333, 138.870004167],
            //type: 'linear'
        }
    };

    Plotly.newPlot('myDiv', data, layout, { showSendToCloud: true });
})
});

