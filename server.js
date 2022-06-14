const express = require('express'); 
const port = 3001
const bodyParser = require('body-parser'); 

const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('./.env')

const app = express(); 
const cors = require('cors');

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

app.use(cors());
app.use(express.static('../frontend'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
//middleware
app.use(express.json());

app.post('/contato', (req, res) => {

	const { nome, fone, email, texto } = req.body
 
	async function sendEmail() {
		var transport = nodemailer.createTransport({
			host: SMTP_CONFIG.host,
			port: SMTP_CONFIG.port,
			auth: {
			  user: SMTP_CONFIG.auth.user,
			  pass: SMTP_CONFIG.auth.pass,
			}
		  });

		let sendMessage = await transport.sendMail({
			text: texto, 
			subject: `${nome} - Curriculo`, 
			from: `${nome} - ${fone} <${email}>`,
			to: SMTP_CONFIG.to, 
		})


		console.log("Message sent: ", sendMessage.messageId, sendMessage)
	}

	sendEmail()
})

app.put('/editLang', (req, res) => {
	const { language } = req.body
	let langLevel = language.split(' ')

	async function insertDB() {
		const db = await sqlite.open({ filename: './curriculoDatabase.db', driver: sqlite3.Database})

		await db.run(`INSERT INTO idiomas (idioma, nivel) VALUES (?, ?)`, [langLevel[0], langLevel[1]])
		const idiomas = await db.all('SELECT * FROM idiomas');
		res.status(200).send(idiomas)

		db.close()
	}

	insertDB();
})

app.get('/dados', (req, res) => {
	async function insertDB() {
		let db = await sqlite.open({ filename: './curriculoDatabase.db', driver: sqlite3.Database});

		const dados = await db.get('SELECT * FROM dados');
		
		res.json(dados)
		db.close();
	}
	
	insertDB();
}); 

app.delete('/deleteLang', (req, res) => {
	const { id } = req.body

	async function deleteDB() {
		const db = await sqlite.open({ filename: './curriculoDatabase.db', driver: sqlite3.Database})
		await db.run(`DELETE FROM idiomas WHERE id = ${id}`)
		const idiomas = await db.all('SELECT * FROM idiomas');
		res.status(200).send(idiomas)

		db.close()
	}

	deleteDB()
}) 

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
}); 