const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000; // Change to the port you want to use

app.use(express.json());

app.post('/webhook', (req, res) => {
	const payload = req.body;
	if (payload.ref === 'refs/heads/main') {
		// Pull the latest code from main and restart the app
		exec(
			'cd /musify_backend && git pull origin main && pm2 restart all',
			(err, stdout, stderr) => {
				if (err) {
					console.error(`Error: ${stderr}`);
					return res.status(500).send('Pull failed');
				}
				console.log(stdout);
				return res.status(200).send('Pull successful');
			}
		);
	} else {
		res.status(400).send('Not main branch');
	}
});

app.listen(PORT, () => console.log(`Webhook listener running on port ${PORT}`));
