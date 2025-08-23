import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const Map = dynamic(() => import('../sections/Map'), { ssr: false });

export default function HomePage() {
	const [events, setEvents] = useState<any[]>([]);

	useEffect(() => {
		axios.get('/api/events').then(r => setEvents(r.data));
		const socket = io('', { path: '/ws' });
		socket.on('event:new', (evt: any) => setEvents(prev => [evt, ...prev]));
		return () => { socket.disconnect(); };
	}, []);

	return (
		<div className="container">
			<h1>ENDFCOP - Common Operational Picture</h1>
			<div className="layout">
				<div className="map">
					<Map events={events} />
				</div>
				<div className="feed">
					<h2>Latest Events</h2>
					<ul>
						{events.map((e) => (
							<li key={e.id}>
								<strong>{e.severity}</strong> {e.title}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}