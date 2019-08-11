queue()
    .defer(d3.csv, "data/cereal.csv")
    .await(createGraphs);
    

function createGraphs(error, cerealData) {
    var ndx = crossfilter(cerealData);
    
    cerealData.forEach(function(d) {
        d.sugars = parseInt(d.sugars);
        d.calories = parseInt(d.calories);
        d.rating = parseFloat(d.rating);
    });
    
    show_mfr_selector(ndx);
    show_cereal_calories(ndx);
    show_sugar_calories_plot(ndx);
    show_calories_rating_plot(ndx);
    
    dc.renderAll();
}

function show_mfr_selector(ndx) {
    dim = ndx.dimension(dc.pluck('mfr'));
    group = dim.group();
    
    dc.selectMenu("#mfr-selector")
        .dimension(dim)
        .group(group);
}

function show_cereal_calories(ndx) {
    var dim = ndx.dimension(dc.pluck('calories'));
    var group = dim.group();
    
    dc.barChart("#cereal-calories")
        .width(1000)
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

function show_sugar_calories_plot(ndx) {
    var sDim = ndx.dimension(dc.pluck('sugars'));
    var sugarsDim = ndx.dimension(function(d) {
        return [d.sugars, d.calories]
    });
    var sugarsCaloriesGroup = sugarsDim.group();
    
    var minSugars = sDim.bottom(1)[0].sugars;
    var maxSugars = sDim.top(1)[0].sugars;
    
    dc.scatterPlot("#sugar-calories-plot")
        .width(1000)
        .height(400)
        .x(d3.scale.linear().domain([minSugars,maxSugars]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Sugars")
        .yAxisLabel("Calories")
        .title(function(d) {
            return "Calories: " + d.key[1]
        })
        .dimension(sugarsDim)
        .group(sugarsCaloriesGroup)
        .margins({top: 75, right: 75, bottom: 75, left: 75});
}

function show_calories_rating_plot(ndx) {
    var cDim = ndx.dimension(dc.pluck('calories'));
    var caloriesDim = ndx.dimension(function(d) {
        return [d.calories, d.rating]
    });
    var caloriesRatingGroup = caloriesDim.group();
    
    var minCalories = cDim.bottom(1)[0].calories;
    var maxCalories = cDim.top(1)[0].calories;
    
    dc.scatterPlot("#calories-rating-plot")
        .width(1000)
        .height(400)
        .x(d3.scale.linear().domain([minCalories,maxCalories]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Calories")
        .yAxisLabel("Rating")
        .title(function(d) {
            return "Rating: " + d.key[1]
        })
        .dimension(caloriesDim)
        .group(caloriesRatingGroup)
        .margins({top: 75, right: 75, bottom: 75, left: 75});
}