import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = (props) => {
    const height = 650;
    const width = 1200;

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
        .then(res => res.json())
        .then((result) => {
            const parseTime = d3.utcParse("%Y-%m-%d");
            const dates = [];
            const gdps = [];
            const fullData = [];

            for (let i = 0; i < result.data.length; i++){
                // const parseTime = d3.timeParse("%Y-%m-%d %Z");
                // const date = parseTime(result.data[i][0] + " -0000");
                const date = parseTime(result.data[i][0]);
                const gdp = result.data[i][1];
                dates.push(date);
                gdps.push(gdp);
                fullData.push({
                    date: date,
                    gdp: gdp
                });
            }

            // console.log(fullData)
            // console.log(dates)
            // console.log(parseTime("2015-07-01"))

            let dateMin = d3.min(fullData, (item) => item.date);
            let dateMax = d3.max(fullData, (item) => item.date);
            dateMax.setMonth(dateMax.getMonth() + 3);

            // console.log(dateMax)
            fullData[274].date = parseTime("2015-07-01");
            // console.log(fullData)
            
            const xScale = d3.scaleTime()
                            .domain([dateMin, dateMax])
                            .range([0, width]);
            const xAxis = d3.axisBottom().scale(xScale);
            const yScale = d3.scaleLinear()
                            .domain([0, d3.max(gdps) + 2000])
                            .range([height, 0]);
            const yAxis = d3.axisLeft(yScale);

            var svg = d3.select("#holder")
                        .append("svg")
                        .attr("width", width + 100)
                        .attr("height", height)
                        .append("g")
                        .call(xAxis)
                        .attr('id', 'x-axis')
                        .attr("transform", `translate(70, ${height - 40})`)
                        .attr("color", "white")
                        .append("g")
                        .call(yAxis)
                        .attr('id', 'y-axis')
                        .attr("transform", `translate(0, ${-height})`);

            const barWidth = width/(fullData.length);

            svg.selectAll("rect")
                .data(fullData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("data-date", (item) => {
                    return item.date.toISOString().split('T')[0];
                })
                .attr("data-gdp", (item) => {
                    return item.gdp;
                })
                .attr("x", (item) => {
                    return xScale(item.date);
                })
                .attr("y", (item) => {
                    return yScale(item.gdp);
                })
                .attr("width", barWidth)
                .attr("height", (item) => {
                    return height - yScale(item.gdp);
                })
                .style("fill", "#CCFF00")
                .on("mouseover", (event, item) => {
                    const date = new Date(item.date);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    let quarter;
                    let gdp = 0;

                    switch (month){
                        case 1:
                            quarter = "Q1";
                            break;

                        case 4:
                            quarter = "Q2";
                            break;

                        case 7:
                            quarter = "Q3";
                            break;

                        case 10:
                            quarter = "Q4";
                            break;

                        default:
                            quarter = "Q1";
                    }

                    if (item.gdp >= 10000){
                        gdp = item.gdp.toString().slice(0, 2) + "," + item.gdp.toString().slice(2);
                    }

                    else if (item.gdp >= 1000){
                        gdp = item.gdp.toString().slice(0, 1) + "," + item.gdp.toString().slice(1);
                    }

                    else{
                        gdp = item.gdp.toString();
                    }

                    let tooltip = document.getElementById("tooltip");
                    tooltip.style.visibility = "visible";
                    d3.select(event.currentTarget).style("fill", "black");
                    const tooltipText = `${year} ${quarter}<br />$${gdp} Billion`;
                    tooltip.innerHTML = tooltipText;
                    tooltip.setAttribute("data-date", d3.select(event.currentTarget).attr("data-date"));
                })
                .on("mouseout", (event) => {
                    d3.select(event.currentTarget).style("fill", "#CCFF00");
                    document.getElementById("tooltip").style.visibility = "hidden";
                });
        })
    }, []);

    return (
        <div id="holder"></div>
    )
}

export default BarChart;