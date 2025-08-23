import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export async function getServerSideProps() { return { props: {} }; }

export default function EventsPage() {
	const [events, setEvents] = useState<any[]>([]);
	const [title, setTitle] = useState('');
	const [lat, setLat] = useState(9.145);
	const [lng, setLng] = useState(40.4897);
	const [severity, setSeverity] = useState('LOW');

	useEffect(() => { api.get('/events').then(r => setEvents(r.data)); }, []);

	async function createEvent(e: React.FormEvent) {
		e.preventDefault();
		const res = await api.post('/events', { title, severity, location: { coordinates: [lat, lng] } });
		setEvents(prev => [res.data, ...prev]);
		setTitle('');
	}

	return (
		<div className="container">
			<h1>Events</h1>
			<form onSubmit={createEvent}>
				<input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
				<select value={severity} onChange={(e) => setSeverity(e.target.value)}>
					<option>LOW</option>
					<option>MEDIUM</option>
					<option>HIGH</option>
					<option>CRITICAL</option>
				</select>
				<input type="number" step="0.0001" value={lat} onChange={(e) => setLat(Number(e.target.value))} />
				<input type="number" step="0.0001" value={lng} onChange={(e) => setLng(Number(e.target.value))} />
				<button type="submit">Create</button>
			</form>
			<ul>
				{events.map(e => (<li key={e.id}><strong>{e.severity}</strong> {e.title}</li>))}
			</ul>
		</div>
	);
}