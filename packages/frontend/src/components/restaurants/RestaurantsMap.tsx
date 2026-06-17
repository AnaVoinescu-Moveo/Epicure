'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import type { Restaurant } from '@/lib/strapi';
import styles from './RestaurantsMap.module.css';

const TEL_AVIV_CENTER: [number, number] = [32.0853, 34.7818];

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function createLabelIcon(name: string) {
  const tail = `<span style="position:absolute;bottom:-14px;left:20px;width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-top:14px solid #DE9200;display:block"></span>`;
  return L.divIcon({
    html: `<div style="position:relative;display:inline-block;background:#DE9200;border-radius:8px;padding:5px 20px;box-shadow:0px 4px 4px 0px rgba(0,0,0,0.25);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:400;font-size:40px;line-height:47px;letter-spacing:2.67px;white-space:nowrap;color:#000">${escapeHtml(name)}${tail}</div>`,
    className: '',
    iconAnchor: [34, 71],
  });
}

interface RestaurantsMapProps {
  restaurants: Restaurant[];
}

export function RestaurantsMap({ restaurants }: RestaurantsMapProps) {
  const withCoords = restaurants.filter(
    (r) => r.latitude != null && r.longitude != null,
  );

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={TEL_AVIV_CENTER}
        zoom={13}
        className={styles.map}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((r) => (
          <Marker
            key={r.id}
            position={[r.latitude!, r.longitude!]}
            icon={createLabelIcon(r.name)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
