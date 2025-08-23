import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export async function getServerSideProps() { return { props: {} }; }

export default function UnitsPage() {
	const [units, setUnits] = useState<any[]>([]);
	const [name, setName] = useState('');
	const [type, setType] = useState('INFANTRY');

	useEffect(() => { api.get('/units').then(r => setUnits(r.data)); }, []);

	async function createUnit(e: React.FormEvent) {
		e.preventDefault();
		const res = await api.post('/units', { name, type });
		setUnits(prev => [...prev, res.data]);
		setName('');
	}

	async function removeUnit(id: string) {
		await api.delete(`/units/${id}`);
		setUnits(prev => prev.filter(u => u.id !== id));
	}

	return (
		<div className="container">
			<h1>Units</h1>
			<form onSubmit={createUnit}>
				<input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
				<select value={type} onChange={(e) => setType(e.target.value)}>
					<option>INFANTRY</option>
					<option>ARMOR</option>
					<option>ARTILLERY</option>
					<option>AIRFORCE</option>
					<option>NAVY</option>
					<option>SUPPORT</option>
				</select>
				<button type="submit">Create</button>
			</form>
			<ul>
				{units.map(u => (<li key={u.id}>{u.name} <button onClick={() => removeUnit(u.id)}>Delete</button></li>))}
			</ul>
		</div>
	);
}