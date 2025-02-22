import { IParserCfg, IParserData, ISourceCFG, ITransform } from '@antv/l7-core';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import Supercluster from 'supercluster/dist/supercluster';
export function cluster(data: IParserData, option: ITransform): IParserData {
  const { radius = 80, maxZoom = 18, minZoom = 0, field, zoom = 2 } = option;
  if (data.pointIndex) {
    const clusterData = data.pointIndex.getClusters(
      data.extent,
      Math.floor(zoom),
    );
    data.dataArray = formatData(clusterData);
    return data;
  }
  const pointIndex = new Supercluster({
    radius,
    minZoom,
    maxZoom,
    map: (props: any) => ({ sum: props[field] }), // 根据指定字段求和
    reduce: (accumulated: any, props: any) => {
      accumulated.sum += props.sum;
    },
  });
  const geojson: {
    type: string;
    features: any[];
  } = {
    type: 'FeatureCollection',
    features: [],
  };
  geojson.features = data.dataArray.map((item) => {
    return {
      type: 'Feature',
      properties: {
        [field]: item[field],
      },
      geometry: {
        type: 'Point',
        coordinates: item.coordinates,
      },
    };
  });
  pointIndex.load(geojson.features);
  const clusterPoint = pointIndex.getClusters(data.extent, zoom);
  const resultData = clusterPoint.map((point: any, index: number) => {
    return {
      coordinates: point.geometry.coordinates,
      _id: index + 1,
      ...point.properties,
    };
  });
  data.dataArray = resultData;
  data.pointIndex = pointIndex;
  return data;
}
export function formatData(clusterPoint: any[]) {
  return clusterPoint.map((point, index) => {
    return {
      coordinates: point.geometry.coordinates,
      _id: index + 1,
      ...point.properties,
    };
  });
}
