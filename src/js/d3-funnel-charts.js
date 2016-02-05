(function(){
  var DEFAULT_HEIGHT = 600,
      DEFAULT_WIDTH = 400,
      DEFAULT_BOTTOM_PERCENT = 1/3;

  window.FunnelChart = function(options) {
    /* Parameters:
      data:
        Array containing arrays of categories and engagement in order from greatest expected funnel engagement to lowest.
        I.e. Button loads -> Short link hits
        Ex: [['Button Loads', 1500], ['Button Clicks', 300], ['Subscribers', 150], ['Shortlink Hits', 100]]
      width & height:
        Optional parameters for width & height of chart in pixels, otherwise default width/height are used
      bottomPct:
        Optional parameter that specifies the percent of the total width the bottom of the trapezoid is
        This is used to calculate the slope, so the chart's view can be changed by changing this value
    */

    this.data = options.data;
    this.totalEngagement = 0;
    for(var i = 0; i < this.data.length; i++){
      this.totalEngagement += this.data[i][1];
    }
    this.width = typeof options.width !== 'undefined' ? options.width : DEFAULT_WIDTH;
    this.height = typeof options.height !== 'undefined' ? options.height : DEFAULT_HEIGHT;
    var bottomPct = typeof options.bottomPct !== 'undefined' ? options.bottomPct : DEFAULT_BOTTOM_PERCENT;
    this._slope = 2*this.width/(this.height - bottomPct*this.height);
    this._totalArea = (this.height+bottomPct*this.height)*this.width/2;
    this.label = options.label;
    this.tooltip = options.tooltip;
    this.icon = options.icon;
    this.click = options.click;
    this.colors = options.colors;
    this.fillcolor = options.fill;
    this.redirect = options.redirect;
  };

  window.FunnelChart.prototype._getLabel = function(ind){
    /* Get label of a category at index 'ind' in this.data */
    return this.data[ind][0];
  };
  window.FunnelChart.prototype._getEngagementCount = function(ind){
    /* Get engagement value of a category at index 'ind' in this.data */
    return this.data[ind][1];
  };
  window.FunnelChart.prototype._getRedirectLink = function(ind){
    /* Get redirect link of a category at index 'ind' in this data */
    return this.data[ind][2];
  };
  window.FunnelChart.prototype._getImageResource = function(ind){
    /* Get Image resource of a category at index 'ind' in this data */
    return this.data[ind][3];
  };
  window.FunnelChart.prototype._gettooltipMsg = function(ind){
    /* Get Image resource of a category at index 'ind' in this data */
    return this.data[ind][4];
  };
  window.FunnelChart.prototype._getFillColor = function(){
    return this.fillcolor;
  };
  window.FunnelChart.prototype._getClick = function(){
    return this.click;
  };
  window.FunnelChart.prototype._gettooltip = function(){
    return this.tooltip;
  };
  window.FunnelChart.prototype._getlabelposition = function(){
    return this.label;
  };
  window.FunnelChart.prototype._geticon = function(){
    return this.icon;
  };
  window.FunnelChart.prototype._getRedirect = function(){
    return this.redirect;
  };
  window.FunnelChart.prototype._createPaths = function(){
    /* Returns an array of points that can be passed into d3.svg.line to create a path for the funnel */
    trapezoids = [];

    function findNextPoints(chart, prevLeftX, prevRightX, prevHeight, dataInd){
      // reached end of funnel
      if(dataInd >= chart.data.length) return;

      // math to calculate coordinates of the next base
      area = chart.data[dataInd][1]*chart._totalArea/chart.totalEngagement;
      prevBaseLength = prevRightX - prevLeftX;
      nextBaseLength = Math.sqrt((chart._slope * prevBaseLength * prevBaseLength - 4 * area)/chart._slope);
      nextLeftX = (prevBaseLength - nextBaseLength)/2 + prevLeftX;
      nextRightX = prevRightX - (prevBaseLength-nextBaseLength)/2;
      nextHeight = chart._slope * (prevBaseLength-nextBaseLength)/2 + prevHeight;

      points = [[nextRightX, nextHeight]];
      points.push([prevRightX, prevHeight]);
      points.push([prevLeftX, prevHeight]);
      points.push([nextLeftX, nextHeight]);
      points.push([nextRightX, nextHeight]);
      trapezoids.push(points);

      findNextPoints(chart, nextLeftX, nextRightX, nextHeight, dataInd+1);
    }
    findNextPoints(this, 0, this.height, 0, 0);
    return trapezoids;
  };

  window.FunnelChart.prototype.draw = function(elem, speed){
    var DEFAULT_SPEED = 2;
    speed = typeof speed !== 'undefined' ? speed : DEFAULT_SPEED;

    var funnelSvg = d3.select(elem).append('svg:svg')
              .attr('width', this.width)
              .attr('height', this.height)
              .append('svg:g');

    // Creates the correct d3 line for the funnel
    var funnelPath = d3.svg.line()
                    .x(function(d) { return d[1]; })
                    .y(function(d) { return d[0]; });

    // Color settings.
    var colorScale = d3.scale.ordinal()
                    .range(this.colors);
    // Draw lines.
    var paths = this._createPaths();
    function drawTrapezoids(funnel, i, onestep){
      var trapezoid = funnelSvg
                      .append('svg:path')
                      .attr('id', 'trapezoid_'+i)
                      .attr('d', function(d){
                        return funnelPath(
                            [paths[i][0], paths[i][1], paths[i][2],
                            paths[i][2], paths[i][1], paths[i][2]]);
                      })
                      .attr('fill', '#FFFFFF');
      nextHeight = paths[i][[paths[i].length]-1];

      var totalLength = trapezoid.node().getTotalLength();
      var time;
      // Animation Settings.
      if (speed === 0)
        time = 0.000001;
      else {
        time = totalLength / speed;
      }
      // Fill color in shape.
      if (funnel.fillcolor === true) {
        var transition = trapezoid
            .transition()
            .duration(time)
            .ease("linear")
            .attr("d", function (d) {
              return funnelPath(paths[i]);
            })
            .attr("fill", function(d){return colorScale(i);});
      }else{
          var transition = trapezoid
            .transition()
            .duration(time)
            .ease("linear")
            .attr("d", function (d) {
                return funnelPath(paths[i]);
            })
            .attr('stroke-width', function (d) { return "3";})
            .attr('stroke', function(d){return colorScale(i);});
      }
      // Place x axis label.
      var label_position;
      if (funnel._getlabelposition() === 'bottom'){
        label_position = funnel.height + 20;
      }else{
        label_position = funnel.height/2;
      }
      funnelSvg
      .append('svg:text')
      .text(function(d) { return funnel._getLabel(i) + '(' + funnel._getEngagementCount(i) + ')'; })
      .attr('id', 'text_'+i)
      .attr("y", function(d){return label_position ;})
      .attr("x", function(d){return (paths[i][0][1] + paths[i][1][1])/2;})
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "20px")
      .attr("font-family", "sans-serif")
      .attr("fill", function(d){
        if (funnel._getlabelposition() === 'bottom' || funnel._getFillColor() !== true){
          return colorScale(i);
        }else {
          return '#F4F4F4';
        }
      })
      .on({
        "mouseover": function() {
          if (funnel._gettooltip() === true) {
            tooltip.style("visibility", "visible");
            tooltip.text(funnel._gettooltipMsg(i));
          }
        },
        "mousemove": function(){
          if (funnel._gettooltip() === true) {
            return tooltip
                .style("top", (event.pageY - 200) + "px")
                .style("left", ((paths[i][0][1] + paths[i][1][1]) / 2 + 30 + "px"));
          }
        },
        "mouseout":  function() {
          if (funnel._gettooltip() === true) {
            return tooltip.style("visibility", "hidden");
          }
        },
        "click":  function() {

          if (funnel._getRedirect() === true) {
            window.open(funnel._getRedirectLink(i));

          }
          else if (funnel._getClick() === true){
            hidetrapezoid(i);
          }
        }
      });
      if (funnel._geticon() === true) {
        funnelSvg
            .append('svg:image')
            .attr("xlink:href", function () {
              return funnel._getImageResource(i);
            })
            .attr('width', 100)
            .attr('height', 100)
            .attr('x', function (d) {
              return (paths[i][0][1] + paths[i][1][1]) / 2 - 50;
            })
            .attr('y', function (d) {
              return funnel.height / 2 - 40;
            })
            .on({
              'click': function () {
                showtrapezoid(i);
              }
            });
      }
      var tooltip;
      if (funnel._gettooltip() === true) {
        tooltip = d3.select("div.tooltip-area")
            .append("div")
            .attr("class", "tooltip")
            .style("z-index", "10")
            .style("visibility", "hidden");
      }
      if (onestep != true) {
        if (i < paths.length - 1) {
          transition.each('end', function () {
            drawTrapezoids(funnel, i + 1);
          });
        }
      }
    }
    drawTrapezoids(this, 0);

  };
  function hidetrapezoid(ind){
    $('#trapezoid_'+ind).css('display', 'none');
    $('#text_'+ind).css('display', 'none');
  }
  function showtrapezoid(ind){
    $('#trapezoid_' + ind).css('display', '');
    $('#text_' + ind).css('display', '');
  }
})();
