import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = (props) => {
    const d3BarChart = React.useRef();
    const dates = [];
    const rawDates = [];
    const gdps = [];
    const fullData = [];
    const height = 800;
    const width = 1000;

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
        .then(res => res.json())
        .then((result) => {
            var parseTime = d3.timeParse("%Y-%m-%d");

            for (let i = 0; i < result.data.length; i++){
                const date = parseTime(result.data[i][0]);
                const gdp = result.data[i][1];
                dates.push(date);
                rawDates.push(result.data[i][0]);
                gdps.push(gdp);
                fullData.push({
                    date: date,
                    gdp: gdp
                });
            }

            const xScale = d3.scaleTime()
                        .domain(d3.extent(dates))
                        .range([0, width/1.1]);
            const xAxis = d3.axisBottom().scale(xScale);
            const yScale = d3.scaleLinear()
                            .domain([0, d3.max(gdps)])
                            .range([0, -height/1.5]);
            const yAxis = d3.axisLeft().scale(yScale);

            var svg = d3.select(d3BarChart.current)
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr('id', 'x-axis')
                        .attr("transform", `translate(60, ${height/1.3})`)
                        .attr("color", "white")
                        .call(xAxis.ticks(d3.timeYear.every(5)))
                        .append("g")
                        .attr('id', 'y-axis')
                        .attr("transform", "translate(0, 0)")
                        .call(yAxis);

            svg.selectAll("rect")
                .data(fullData)
                .enter()
                .append("rect")
                .attr("data-date", (item, index) => {
                    return rawDates[index];
                })
                .attr("data-gdp", (item) => {
                    return item.gdp;
                })
                .attr("class", "bar")
                .attr("x", (item, index) => {
                    return xScale(item.date);
                })
                .attr("y", (item) => {
                    return yScale(item.gdp);
                })
                .attr("width", width/dates.length - 1)
                .attr("height", (item) => {
                    return -yScale(item.gdp)
                })
                .style("fill", "#CCFF00");
        })
    }, []);

    return (
        <div>
            <svg ref={d3BarChart} />
        </div>
    )
}

export default BarChart;