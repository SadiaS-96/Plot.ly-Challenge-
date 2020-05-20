// Use D3 library to read in samples.json
// build a horsontal bar chart 

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

  // Build a Bubble Chart
    var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" },
          margin: { t: 30}
        };
        var bubbleData = [
          {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
            }
          }
        ];
  // Display the sample metadata, i.e., an individual's demographic information.

    function buildMetadata(sample) {
        d3.json("samples.json").then((data) => {
          var metadata = data.metadata;
          var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
          var result = resultArray[0];
          // d3 will select the panel with id of `#sample-metadata`
          var PANEL = d3.select("#sample-metadata");
      
          // Use `.html("") to clear any existing metadata
          PANEL.html("");
          // Display each key-value pair from the metadata JSON object somewhere on the page.
          
          Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
          });
      
        
          buildGauge(result.wfreq);
        });
      }

      

      
    
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
          {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
          }
        ];
    
        var barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: { t: 30, l: 150 }
        };
    
        Plotly.newPlot("bar", barData, barLayout);
      });
    }

// Update all of the plots any time that a new sample is selected.
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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
