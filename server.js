const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON payloads

app.post('/webhook', (req, res) => {
  const commitMessage = req.body.head_commit.message;
  console.log('Received commit:', commitMessage);

  // Pull latest changes from the GitHub repository
  exec('git pull origin main', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Error pulling latest changes');
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    // Restart server using pm2 (or you can directly restart with your logic)
    exec('pm2 restart server.js', (err) => {
      if (err) {
        console.error('Failed to restart server:', err);
        res.status(500).send('Failed to restart server');
        return;
      }
      console.log('Server restarted');
      res.status(200).send('Server updated and restarted');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
