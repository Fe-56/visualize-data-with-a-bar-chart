import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = (props) => {
    const d3BarChart = React.useRef();
    const dates = [];
    const gdp = [];
    const height = 800;
    const width = 1000;

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
        .then(res => res.json())
        .then((result) => {
            var parseTime = d3.timeParse("%Y-%m-%d");
            for (let i = 0; i < result.data.length; i++){
                dates.push(parseTime(result.data[i][0]));
                gdp.push(result.data[i][1]);
            }

            var xScale = d3.scaleTime()
                        .domain(d3.extent(dates))
                        .range([0, width]);
            const xAxis = d3.axisBottom().scale(xScale);
            const yScale = d3.scaleLinear()
                            .domain([0, d3.max(gdp)])
                            .range([0, height]);
            const yAxis = d3.axisLeft().scale(yScale);

            var svg = d3.select(d3BarChart.current)
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr('id', 'x-axis')
                        .attr("transform", "translate(60, 500)")
                        .call(xAxis.ticks(d3.timeYear.every(5)))
                        .append("g")
                        .attr('id', 'y-axis')
                        .attr("transform", "translate(0, -50)")
                        .call(yAxis);
        })
    }, []);

    return (
        <div>
            <svg ref={d3BarChart} />
        </div>
    )
}

export default BarChart;