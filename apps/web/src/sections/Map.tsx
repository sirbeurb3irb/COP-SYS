import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ events }: { events: any[] }) {
	const center: [number, number] = [9.145, 40.4897];
	return (
		<MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
			{events.map((e) => {
				const [lat, lng] = e.location?.coordinates || [center[0], center[1]];
				return (
					<Marker key={e.id} position={[lat, lng]}>
						<Popup>
							<strong>{e.title}</strong>
							<div>Severity: {e.severity}</div>
						</Popup>
					</Marker>
				);
			})}
		</MapContainer>
	);
}