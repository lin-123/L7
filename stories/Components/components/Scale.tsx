// @ts-ignore
import { Layers, PointLayer, PolygonLayer, Scale, Scene, Zoom } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const response2 = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    );
    const pointsData = await response2.json();
    const data = await response.json();
    const scene = new Scene({
      id: 'map',
      logoVisible: false,
      map: new Mapbox({
        style: 'dark',
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    this.scene = scene;
    const layer = new PolygonLayer({
      name: '01',
    });

    layer
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      // .select(true)
      .style({
        opacity: 1.0,
      });
    scene.addLayer(layer);
    const pointLayer = new PointLayer({
      name: '02',
    })
      .source(pointsData, {
        cluster: true,
      })
      .shape('circle')
      .scale('point_count', {
        type: 'quantile',
      })
      .size('point_count', [5, 10, 15, 20, 25])
      .animate(false)
      .active(true)
      .color('yellow')
      .style({
        opacity: 0.5,
        strokeWidth: 1,
      });
    scene.addLayer(pointLayer);
    layer.on('click', (e) => {
      layer.setSelect(e.featureId);
    });
    const scaleControl = new Scale();
    const layers = {
      点图层: pointLayer,
      面图层: layer,
    };
    const layerControl = new Layers({
      overlayers: layers,
      position: 'bottomright',
    });

    scene.addControl(scaleControl);
    scene.addControl(layerControl);
    const zoomControl = new Zoom({
      position: 'bottomright',
    });
    scene.addControl(zoomControl);
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
