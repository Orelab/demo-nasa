import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NeoObject } from '../types/neo';

interface NeoMapProps {
  neos: NeoObject[];
}

const NeoMap = ({ neos }: NeoMapProps) => {
  return (
    <MapContainer
      center={[0, 0] as LatLngExpression}
      zoom={3}
      style={{ height: '100%', width: '100%', minHeight: '400px' }}
      className="rounded"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {neos.map((neo) => {
        const distance = parseFloat(neo.close_approach_data[0].miss_distance.kilometers);
        const size = neo.estimated_diameter.kilometers.estimated_diameter_max;
        
        return (
          <Circle
            key={neo.id}
            center={[Math.random() * 80 - 40, Math.random() * 360 - 180]}
            radius={size * 10000}
            pathOptions={{ 
              color: neo.is_potentially_hazardous_asteroid ? 'red' : 'blue' 
            }}
          >
            <Popup>
              <h6>{neo.name}</h6>
              <p>Distance: {(distance / 1000000).toFixed(2)} million km</p>
              <p>Diamètre: {size.toFixed(2)} km</p>
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
  );
};

export default NeoMap;
