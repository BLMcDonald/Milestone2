queue()
    .defer(d3.csv, "data/cereal.csv")
    .await(createGraphs);
    

function createGraphs(error, cerealData) {
    var ndx = crossfilter(cerealData);
    
    show_cereal_calories(ndx);
    
    dc.renderAll();
}

function show_cereal_calories(ndx) {
    var dim = ndx.dimension(dc.pluck('calories'));
    var group = dim.group();
    
    dc.barChart("#cereal-calories")
        .width(1300)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Calories")
        .yAxis().ticks(20);
}