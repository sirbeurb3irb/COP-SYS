import { useState } from 'react';
import { api } from '../lib/api';

export async function getServerSideProps() { return { props: {} }; }

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		try {
			const res = await api.post('/auth/login', { email, password });
			localStorage.setItem('token', res.data.token);
			window.location.href = '/';
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Login failed');
		}
	}

	return (
		<div className="container">
			<h1>Login</h1>
			<form onSubmit={onSubmit}>
				<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit">Login</button>
			</form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<p>Or <a href="/register">register</a></p>
		</div>
	);
}