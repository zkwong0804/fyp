$(document).ready(function() {
    const form = $("#search-route-form");

    form.submit(function(event) {
        event.preventDefault();
        const origin = $("#origin").val();
        const destination = $("#destination").val();
        const features = $("#features").val();
        const toll = $("#toll-val").val();
        const historical_start = $("#historical-start").val();
        const historical_end = $("#historical-end").val();
        console.log(`histocial_start:${historical_start}`)
        console.log(`histocial_end:${historical_end}`)
        const google = $("#google").val();
        const bing = $("bing").val();
        $.ajax({
            async: false,
            method: "POST",
            url: "/api/",
            data: {
                origin, destination, features, toll, historical_start, historical_end, google, bing
            }
        }).done(function(res) {
            let datasets = [];
            let labels = []
            let resultList = res["google"]["2"];
            let historyColor = [];
            for(let i=0; i<24; i++) labels.push(`${i}:00`);
            for(let i=0; i<resultList.length/24; i++) {
                let data = [];
                let p = i*24;
                let label = `${resultList[p].day}/${resultList[p].month}/${resultList[p].year}`;
                // let label = i;
                let randColor = "";
                  do {
                      randColor = getRandomColor();
                  } while (historyColor.indexOf(randColor) !== -1)
                  historyColor.push(randColor);

                  let hoverBorderColor = randColor;
                  let borderColor = randColor;
                  for (let j=0; j<24; j++) {
                      data.push(resultList[i*24+j].duration);
                  }
  
                  datasets.push({
                      label, data, borderColor, hoverBorderColor,
                      fill: false
                  });
            }

            let chart = $("#display-chart");
            let myChart = new Chart(chart, {
                type: 'line',
                data: {labels, datasets},
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Duration (Minute)"
                            }
                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Time (Day)"
                            }
                        }]
                    }
                }
            });

            let src = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyA8v-SEuu8nnoPaU9dkT8VjySVPPIu6m6w&origin=${res["origin"]["address"]}&destination=${res["destination"]["address"]}`
            $('#direction-map').attr("src", src);
        });
    });
    
});

function getRandomColor() {
    const colorPlate = ["#f9ff21", "#ff1f5a", "#0b8457", "#dee1ec", "#fef4a9", "#00e0ff", "#3d5af1", "#ba53de", "#b31e6f", "#ff69af"];
    return colorPlate[Math.floor(Math.random()*colorPlate.length)];
}