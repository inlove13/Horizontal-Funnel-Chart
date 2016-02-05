# Horizontal-Funnel-Chart

Horizontal Funnel Chart generation library using the D3.js framework

Modify Vertical Horizontal Funnel chart library from http://jakezatecky.github.io/d3-funnel/

##Play with this chart using customized properties.
![alt text](https://github.com/inlove13/Horizontal-Funnel-Chart/blob/master/screenshot/horizontal_default.png "Horizontal Funnel Chart example")
This will support 
![alt text](https://github.com/inlove13/Horizontal-Funnel-Chart/blob/master/screenshot/horizontal_option.png "Customization Properties ")
1. Color Settings
  ![alt text](https://github.com/inlove13/Horizontal-Funnel-Chart/blob/master/screenshot/horizontal_borderonly.png "Border only")
2. Animation Settings
3. Images Settings
  ![alt text](https://github.com/inlove13/Horizontal-Funnel-Chart/blob/master/screenshot/horizontal_image.png "Insert Images(even gif)")
4. Label positioin Settings
  ![alt text](https://github.com/inlove13/Horizontal-Funnel-Chart/blob/master/screenshot/horizontal_label_bottom.png "Label bottom")
5. Section hide/show Settings
   Hide/Show Step area by clicking a label.
6. Link Settings:
   Click label will redirect certain place.
7. Tooltip Settings
  ![alt text](https://github.com/inlove13/Horizontal-Funnel-Chart/blob/master/screenshot/horizontal_tooltip.png "Tooltip")
8. Window size response behavior
  Will redraw Char when chaning browser window size.

###How to use
###Define actual data for funnel chart.
1st: Label name
2nd: counts
3rd: redirect link
4th: tooltip message
(example)
var funnel_data = [
      ['Website visits', 800, 'http://i.imgur.com/Ej8Oyf8.gif', 'http://i.imgur.com/Ej8Oyf8.gif', '10 per day'],
      ['Downloads', 700, 'http://38.media.tumblr.com/68a980299b26202540db083a6b69077b/tumblr_nxcbqqYXs61tfb9v2o1_500.gif', 'http://38.media.tumblr.com/68a980299b26202540db083a6b69077b/tumblr_nxcbqqYXs61tfb9v2o1_500.gif', '4 per day'],
      ['Request demo', 300, 'http://24.media.tumblr.com/130f821e0c1c0ba7490622aa870ffe96/tumblr_n4iuliOlHb1tziei6o1_500.gif', 'http://24.media.tumblr.com/130f821e0c1c0ba7490622aa870ffe96/tumblr_n4iuliOlHb1tziei6o1_500.gif', '2 per day'],
      ['Purchased', 150, 'http://25.media.tumblr.com/d4dd104b64e7b9f3b34abc5428d63bac/tumblr_mpn7u7ek351rmw6moo1_500.gif', 'http://25.media.tumblr.com/d4dd104b64e7b9f3b34abc5428d63bac/tumblr_mpn7u7ek351rmw6moo1_500.gif', '.5 per day']];
### Define properties
var width = $('#funnelContainer').width();
var DEFAULT_HEIGHT = 490;
var DEFAULT_LABEL = 'middle';
var DEFAULT_TRUE = true;
var DEFAULT_FASLE = false;
var DEFAULT_COLORS = ['#00BCD4', '#2196F3', '#3F51B5', '#673AB7', '#9C27B0', '#E91E63', '#FF5722', '#FF9800', '#FFC107', '#CDDC39',
        '#607D8B', '#4CAF50', '#AD1457', '#D500F9', '#7C4DFF', '#4FC3F7', '#69F0AE', '#1A237E', '#DD2C00', '#FFEB38'];
### Create funnelchart instance.
var chart = new FunnelChart({
      data: funnel_data,
      width: width,
      height: height,
      bottomPct: 1/4,
      fill: fill,
      hoverEffects: DEFAULT_TRUE,
      colors: DEFAULT_COLORS,
      label: true,
      icon: true,
      tooltip: true,
      click: true,
      redirect: true
    });
### Draw chart
chart.draw('#funnelContainer', animation);
