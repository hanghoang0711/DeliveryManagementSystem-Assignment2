import { useState } from "react";
import axios from 'axios';
import { Button } from "./ui/button";

const DUMMY_USERNAME: string = "admin"
const DUMMY_PASSWORD: string = "admin123"
const API: string = "http://localhost:3000"

export let authorized: boolean = false

async function Login(username: string, password: string): Promise<string> {
	if (username == "" || password == "") {
		return ""
	}
	
	let return_msg = ""

	await axios.post('/api/auth/login', { "username": username, "password": password })
	.then((msg: any) => {
		localStorage.setItem('authToken', `Bearer ${msg.data.token}`);
		window.location.reload()
	})
	.catch((error: any)  => {
		return_msg = "Đăng nhập thất bại";
		console.log(error)
	});

	return return_msg
}

export function Logout() {
	localStorage.removeItem('authToken');
	window.location.reload()
}

export function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorstr, setErrorstr] = useState("");
	
	axios.defaults.baseURL = API;
	axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
	axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

	document.addEventListener('keydown', async event => {
		if (event.key !== 'Enter') {
			return
		}

		setErrorstr(await Login(username, password))
	})

	return (
		<div className="x-50 h-screen bg-gray-100 flex items-center justify-center p-4 rounded-2xl">
			<div className="bg-white rounded-xl shadow-lg w-50 p-8 space-y-6">
				<h1 className="text-2xl font-semibold text-gray-800 text-center">
					Admin Login
				</h1>

				<div className="space-y-4">
					<div>
						<label className="block text-sm text-gray-600 mb-1">Email</label>
						<input
							type="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2"
							placeholder="admin"
						/>
					</div>

					<div>
						<label className="block text-sm text-gray-600 mb-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2"
							placeholder="••••••••"
						/>
					</div>
				</div>

				<div className="bold font-semibold text-red-600 text-sm">
					<p>{errorstr}</p>
				</div>

				<button
					className="w-full mt-4 py-2 bg-blue-500 hover:bg-gray-800 text-white rounded-xl text-center cursor-pointer"
					onClick={async () => setErrorstr(await Login(username, password))}
				>
					Sign in
				</button>
			</div>
		</div>
	);
}
