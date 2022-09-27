import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = (props) => {
    const d3BarChart = React.useRef();
    const dates = [];
    const gdp = [];
    const height = "100%";
    const width = "100%";

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
        .then(res => res.json())
        .then((result) => {
            for (let i = 0; i < result.data.length; i++){
                dates.push(result.data[i][0]);
                gdp.push(result.data[i][1]);
            }

            // const xAxis = d3.scaleTime()
            //                 .domain([dates]);

            // const yAxis = d3.scaleLinear()
            //                 .domain([Math.min(gdp), Math.max(gdp)])
            //                 .range

            const svg = d3.select(d3BarChart.current)
                            .attr("width", width)
                            .attr("height", height)
                            .append("rect")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .attr("fill", "red")
        })
    }, []);

    return (
        <div>
            <svg ref={d3BarChart} />
            <p></p>
        </div>
    )
}

export default BarChart;