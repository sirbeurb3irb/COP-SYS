import { useState } from 'react';
import { api } from '../lib/api';

export async function getServerSideProps() { return { props: {} }; }

export default function RegisterPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [error, setError] = useState('');

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		try {
			await api.post('/auth/register', { email, password, firstName, lastName });
			const login = await api.post('/auth/login', { email, password });
			localStorage.setItem('token', login.data.token);
			window.location.href = '/';
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Registration failed');
		}
	}

	return (
		<div className="container">
			<h1>Register</h1>
			<form onSubmit={onSubmit}>
				<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
				<input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit">Create account</button>
			</form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
}