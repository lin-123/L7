import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 60,
    style: 'dark',
    center: [ 104.34278, 41.12554 ],
    zoom: 2.94888,
    rotation: 42.3999
  })
});

fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
  .then(res => res.text())
  .then(data => {
    const layer = new LineLayer({})
      .source(data, {
        parser: {
          type: 'csv',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2'
        }
      })
      .size(1)
      .shape('arc3d')
      .color('#FF7C6A')
      .style({
        opacity: 0.8
      });
    scene.addLayer(layer);
  });
