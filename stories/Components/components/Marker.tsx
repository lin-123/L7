// @ts-ignore
import { Marker, PointLayer, PolygonLayer, Popup, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class MarkerComponent extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const data = await response.json();
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120.184824, 30.248341],
        pitch: 0,
        zoom: 18,
      }),
    });
    this.scene = scene;

    const popup = new Popup({
      offsets: [0, 20],
    }).setText('hello');

    const marker = new Marker({
      offsets: [0, -20],
    })
      .setLnglat({
        lng: 120.184824,
        lat: 30.248341,
      })
      .setPopup(popup);

    scene.addMarker(marker);

    const el = document.createElement('h1');
    el.innerHTML = 'Marker';
    marker.setElement(el);

    const arr = [
      {
        lng: 120.184824,
        lat: 30.248341,
        count: 40,
      },
    ];
    const pointLayer = new PointLayer({})
      .source(arr, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('dot')
      .active(true)
      .animate(false)
      .size(5)
      .color('#ffa842')
      .style({
        opacity: 1,
      });

    scene.addLayer(pointLayer);
    scene.addMarker(marker);

    scene.on('loaded', () => {
      // @ts-ignore
      marker.on('click', (e) => {
        console.log(this.scene.getZoom());
      });
      // const marker1 = new AMap.Marker({
      //   map: scene.map,
      //   position: [120.184824, 30.248341],
      //   shadow: '#000',
      //   label: {
      //     content: '站点',
      //     direction: 'top',
      //   },
      // });
      // marker1.on('click', () => {
      //  console.log(this.scene.getZoom());
      //   console.log('选中的点', 1111);
      // });
    });
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
