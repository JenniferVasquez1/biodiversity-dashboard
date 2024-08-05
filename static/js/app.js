const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

const optionChanged = option => {

  // Populating options in select element if option variable is undefined
  if (option == undefined) {

    d3.json(url).then(({ names }) => {
      option = names[0];

      names.forEach(name => {
        d3.select('#selDataset').append('option').text(name);
      });
    });
  };

  d3.json(url).then(({ metadata, samples }) => {

    const renderCharts = (option) => {

      // Data filtering based on selection
      let meta = metadata.find(obj => obj.id == option);
      let { otu_ids, sample_values, otu_labels } = samples.find(obj => obj.id == option);

      // Demographic Info
      d3.select('#sample-metadata').html('');
      Object.entries(meta).forEach(([k, v]) => {
        d3.select('#sample-metadata').append('h6').text(`${k.toUpperCase()}: ${v}`)
      });

      // Bar Chart Info
      var graph_data = [
        {
          x: sample_values.slice(0, 10).reverse(),
          y: otu_ids.map(x => `OTU ${x}`).slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: 'bar',
          orientation: 'h'
        }
      ];

      layout = {
        'title': 'Top 10 Bacteria Cultures Found',
        xaxis: { title: 'Number of Bacteria' }
      }

      Plotly.newPlot('bar', graph_data, layout);

      // Bubble Chart Info
      var trace1 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      };

      layout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Number of Bacteria' }
      }

      var bubble_data = [trace1];

      Plotly.newPlot('bubble', bubble_data, layout);
    };

    renderCharts(option);
  });
};

optionChanged();