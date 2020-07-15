/*
 * @Author: One_Random
 * @Date: 2020-07-14 08:22:41
 * @LastEditors: One_Random
 * @LastEditTime: 2020-07-16 00:25:16
 * @FilePath: /OS/js/d3.js
 * @Description: Copyright © 2020 One_Random. All rights reserved.
 */ 
var slot = 1000;
var default_height = 40;
var default_color = "#2ea44e";
var background_color = "whitesmoke";
var rect_x_padding = 0;
var rect_y_padding = 3;
var text_x_padding = 5;
var text_y_padding = 25;
var trans_padding = 10;

var dataset = [];
var parts_info = [[0, -1, default_color]];

function svg_x_scale(length, times = 3) {
    return length * times;
}

function svg_y_scale(length, times = 1) {
    return length * times;
}

function set_svg(width, height, max_size) {
    // 定义画布
    const svg = d3.select("body").select("#visiable_svg")
                .attr("width", width)
                .attr("height", height)
                .attr("font-family", "Consolas");
                //.attr("font-family", "Helvetica");

    dataset.push(max_size);
    
    var rects = svg.selectAll(".mem_rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class", "mem_rect")
                .attr("id", (d, i)  => {
                    return "part_" + parts_info[i][0];
                })
                .attr("y", (d, i)  => {
                    return svg_y_scale(i * default_height) + rect_y_padding;
                })
                .attr("x", rect_x_padding)
                .attr("height", svg_y_scale(default_height))
                .attr("width", (d)  => {
                    return svg_x_scale(d);
                })
                .attr("fill", (d, i) => {
                    return parts_info[i][2];
                })
    
    var size_texts = svg.selectAll(".mem_text")
                    .data(dataset)
                    .enter()
                    .append("text")
                    .text((d, i) => {
                        return d;
                    })
                    .attr("class", "mem_size_text")
                    .attr("id", (d, i) => {
                        return "size_" + parts_info[i][0];
                    })
                    .attr("x", (d, i) => {
                        let r = d3.select("#part_" + parts_info[i][0]);
                        return svg_x_scale(parseInt(d)) + rect_x_padding + text_x_padding;
                    })
                    .attr("y", (d, i) => {
                        return svg_y_scale(i * default_height) + rect_y_padding + text_y_padding;
                    })
}

function add(index, part_number, job_info){
    let size = dataset[index] - job_info[1];
    if (size == 0) {
        parts_info[index][1] = job_info[0];
        d3.select("#part_" + parts_info[index][0])
        .transition()
        .duration(slot)
        .attr("fill", job_info[2]);
        return;
    }
        
    d3.selectAll(".mem_rect")
    .transition()
    .delay(slot)
    .duration(slot)
    .attr("y", (d, i) => {
        let y = d3.select("#part_" + parts_info[i][0]).attr("y");
        if (i > index)
            return parseInt(y) + svg_y_scale(default_height) + rect_y_padding;
        else
            return parseInt(y);
    });

    d3.selectAll(".mem_size_text")
    .transition()
    .delay(slot)
    .duration(slot)
    .attr("y", (d, i) => {
        let y = d3.select("#part_" + parts_info[i][0]).attr("y");
        if (i > index)
            return parseInt(y) + svg_y_scale(default_height) + rect_y_padding + text_y_padding;
        else
            return parseInt(y) + text_y_padding;
    });

    let orignal = d3.select("#part_" + parts_info[index][0]);

    let orignal_width = parseInt(orignal.attr("width"));
    let orignal_height = parseInt(orignal.attr("height"));
    let orignal_x = parseInt(orignal.attr("x"));
    let orignal_y = parseInt(orignal.attr("y"));
    
    dataset[index] -= size;
    dataset.splice(index + 1, 0, size);
    parts_info[index][1] = job_info[0];
    parts_info[index][2] = job_info[2];
    parts_info.splice(index + 1, 0, [part_number, -1, default_color]);

    orignal.attr("width", orignal_width - svg_x_scale(size))
    .transition()
    .duration(slot)
    .attr("fill", parts_info[index][2]);

    d3.select("#size_" + parts_info[index][0])
    .transition()
    .duration(slot)
    .attr("x", orignal_width + orignal_x + text_x_padding + trans_padding)
    .transition()
    .duration(slot)
    .attr("fill", background_color)
    .transition()
    .duration(slot)
    .attr("x", orignal_width + orignal_x - svg_x_scale(size) + text_x_padding)
    .attr("fill", "black")
    .text(dataset[index]);
        
    d3.select("body").select("#visiable_svg")
    .selectAll(".mem_rect")
    .data(dataset)
    .enter()
    //.append("rect")
    //.insert("rect", "#part_" + parts_info[index+2][0])
    .insert("rect", "#size_" + parts_info[index][0])
    .attr("fill", default_color)
    .attr("class", "mem_rect")
    .attr("id", "part_" + parts_info[index+1][0])
    .attr("y", orignal_y)
    .attr("x", orignal_width + orignal_x - svg_x_scale(size))
    .attr("height", orignal_height)
    .attr("width", svg_x_scale(size))
    .transition()
    .duration(slot)
    .attr("x", orignal_width + orignal_x - svg_x_scale(size) + trans_padding)
    .transition()
    .duration(slot)
    .attr("y", orignal_y + svg_y_scale(default_height) + rect_y_padding)
    .transition()
    .duration(slot)
    .attr("x", rect_x_padding);

    d3.select("body").select("#visiable_svg")
    .selectAll(".mem_size_text")
    .data(dataset)
    .enter()
    //.insert("text", "#size_" + parts_info[index+2][0])
    .append("text")
    .text(size)
    .attr("class", "mem_size_text")
    .attr("id", "size_" + parts_info[index+1][0])
    .attr("x", orignal_width + orignal_x + trans_padding + text_y_padding)
    .attr("y", orignal_y + svg_y_scale(default_height) + rect_y_padding + text_y_padding)
    .attr("fill", background_color)
    .transition()
    .delay(slot * 2)
    .duration(slot)
    .attr("x", orignal_x + svg_x_scale(size) + text_x_padding)
    .attr("fill", "black");

    return slot * 3;
}

function finish(index) {
    parts_info[index][1] = -1;
    d3.select("#part_" + parts_info[index][0])
    .transition()
    .duration(slot)
    .attr("fill", default_color);

    return slot * 1;
}

function merge(index){
    let orignal = d3.select("#part_" + parts_info[index][0]);

    let orignal_width = parseInt(orignal.attr("width"));
    let orignal_height = parseInt(orignal.attr("height"));
    let orignal_x = parseInt(orignal.attr("x"));
    let orignal_y = parseInt(orignal.attr("y"));
    
    d3.selectAll(".mem_rect")
    .transition()
    .delay(slot)
    .duration(slot)
    .attr("y", (d, i) => {
        let y = d3.select("#part_" + parts_info[i][0]).attr("y");
        if (i > index)
            return parseInt(y) - svg_y_scale(default_height) - rect_y_padding;
        else
            return parseInt(y);
    });

    d3.selectAll(".mem_size_text")
    .transition()
    .delay(slot)
    .duration(slot)
    .attr("y", (d, i) => {  
        let y = d3.select("#part_" + parts_info[i][0]).attr("y");
        if (i > index)
            return parseInt(y) - svg_y_scale(default_height) - rect_y_padding + text_y_padding;
        else
            return parseInt(y) + text_y_padding;
    });

    orignal.transition()
    .delay(slot * 2)
    .duration(slot)
    .attr("fill", default_color)
    .transition()
    .duration(0)
    .attr("width", orignal_width + svg_x_scale(dataset[index+1]))

    d3.select("#part_" + parts_info[index+1][0])
    .transition()
    .duration(slot)
    .attr("x", orignal_width + orignal_x + trans_padding)
    .transition()
    .duration(slot)
    .attr("y", orignal_y)
    .transition()
    .duration(slot)
    .attr("x", orignal_width + orignal_x)
    .remove();

    d3.select("#size_" + parts_info[index][0])
    .transition()
    .duration(slot)
    .attr("x", orignal_width + orignal_x + svg_x_scale(dataset[index + 1]) + text_x_padding + trans_padding)
    .transition()
    .duration(slot)
    .attr("fill", background_color)
    .transition()
    .duration(slot)
    .text(dataset[index] + dataset[index+1])
    .attr("x", orignal_width + orignal_x + svg_x_scale(dataset[index + 1]) + text_x_padding)
    .attr("fill", "black");

    d3.select("#size_" + parts_info[index+1][0])
    .transition()
    .duration(slot)
    .attr("fill", background_color)
    .attr("x", orignal_width + orignal_x + svg_x_scale(dataset[index + 1]) + text_x_padding + trans_padding)
    .remove();

    dataset[index] += dataset[index+1];
    dataset.splice(index + 1, 1);
    parts_info[index][1] = -1;
    parts_info.splice(index + 1, 1);

    d3.selectAll(".mem_rect").data(dataset);

    return slot * 3;
}
