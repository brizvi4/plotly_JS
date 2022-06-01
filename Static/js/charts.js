function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {

    var sampleNames = data.names;

    sampleNames.forEach((sample) => {

      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {

    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number

    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`

    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  
  d3.json("samples.json").then((data) => {
    
    var samples = data.samples;
    
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
      
    var metaArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    
    var firstSample = samplesArray[0];
     
    var firstMeta = metaArray[0];
    
    var sample_values = firstSample.sample_values;
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    
    
    var wfreq = firstMeta.wfreq;
    

    var yticks = otu_ids.slice(0,10).map(otu_ids => `OTU ${otu_ids}`).reverse();

    //  Create the trace for the bar chart. 

    var barData = [{
      
      y: yticks,
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        
        r: 100,
        t: 100,
        b:100,
        l: 100
      }
     };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

  //Bubble Chart:
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
        size : sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    var bubbleLayout = {
      title: "Bacteria Species per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      showlegend: false
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    //Gauge Chart:
    var gaugeData = [{
      domain: {x: [0,1], y: [0,1]},
      title: {text: "Belly Button Washing Frequency <br> Scrubs per Week"},
      value: wfreq,
      mode: "gauge+number",
      type: "indicator",
      gauge: {
        axis: {range: [null,10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}]
        }
    }];

    var gaugeLeyout = {
      width: 500,
      height: 460,
      margin: {t: 0, b: 0}
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLeyout);
  });
}