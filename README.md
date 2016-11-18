Websocket Messages cause Slowdown
=================================

(1) Setup:
```
npm install
```

(2) Run server:
```
node server.js
```

(3) View demo (direct, no web workers): http://localhost:3000/
https://boiling-meadow-36770.herokuapp.com
![Sample output](/withoutWebWorker.png?raw=true "Witout WebWorkers")

(4) View demo (indirect, use web workers): http://localhost:3000?useWebWorker=true
https://boiling-meadow-36770.herokuapp.com/?useWebWorker=true
![Sample output](/withWebWorker.png?raw=true "With WebWorkers")


