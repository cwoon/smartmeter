const
  io = require("socket.io"),
  server = io.listen(3000);

mysql = require('mysql');

connection = mysql.createConnection({
  host: '192.168.0.147',
  user: 'root',
  password: '1234',
  database: 'db',
  port: '3306'
  /*host: 'testSQL.my.to',
  user: 'user',
  password: 'user',
  database: 'db',
  port: '3306'*/
});

var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
var now = new Date();
var thisMonth = months[now.getMonth()];

function sum( obj ) {
  var sum = obj.reduce((a, {usage}) => a + parseFloat(usage), 0);
  console.log(sum);
  return sum;
}

function calcBill( unitUsed ) {

  const rateCat1 = 0.2180; //For the first 200 kWh (1 - 200 kWh) per month	sen/kWh	21.80
  const rateCat2 = 0.3340; //For the next 100 kWh (201 - 300 kWh) per month	sen/kWh	33.40
  const rateCat3 = 0.5160; //For the next 300 kWh (301 - 600 kWh) per month	sen/kWh	51.60
  const rateCat4 = 0.5460; //For the next 300 kWh (601 - 900 kWh) per month	sen/kWh	54.60
  const rateCat5 = 0.5710; //For the next kWh (901 kWh onwards) per month	sen/kWh	57.10

  if (unitUsed <= 0) {
      console.log('The number entered was invalid, or was less than 0.');
      return 0;
  }

  // calculates the total
  return (
      unitUsed > 900
      ? rateCat1 * 200 + rateCat2 * 100 + rateCat3 * 300 + rateCat4 * 300 + rateCat5 * (unitUsed - 900)
      : unitUsed > 600
          ? rateCat1 * 200 + rateCat2 * 100 + rateCat3 * 300 + rateCat4 * (unitUsed - 600)
          : unitUsed > 300
              ? rateCat1 * 200 + rateCat2 * 100 + rateCat3 * (unitUsed - 300)
              : unitUsed > 200
                  ? rateCat1 * 200 + rateCat2 * (unitUsed - 100)
                  : rateCat1 * unitUsed
  );
}

let
  sequenceNumberByClient = new Map();

// event fired every time a new client connects:
server.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);

  socket.on('getRows', () => {
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query('SELECT `*` FROM ' + thisMonth + ' ORDER BY `time` DESC LIMIT 10', function (error, rows, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      socket.emit('resultRows', rows);
    });
  });

  socket.on('getDate', (data) => {
    // Executing the MySQL query (select all data from the 'users' table).
    var start = new Date(data[0]);
    var until = new Date(data[1]);
    var month1 = months[start.getMonth()];
    var month2 = months[until.getMonth()];
    var dateRange = JSON.parse(JSON.stringify(data));
    connection.query('SELECT `*` FROM ' + month1 + ' WHERE `time` >= "' + dateRange[0] + '" and time <= "' + dateRange[1] + '" UNION SELECT `*` FROM ' + month2 + ' WHERE time >= "' + dateRange[0] + '" and time <= "' + dateRange[1] + '" order by `time` DESC', function (error, rows, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;
      var sumUsage = 0;
      sumUsage = sum(rows);
      var totalBill = 0;
      totalBill = calcBill(sumUsage);
      socket.emit('resultDate', {rows, sumUsage, totalBill});
      console.info(dateRange[0]);
      console.info(dateRange[1]);
      console.info(month1);
      console.info(month2);
    });
  });

  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });
});

// sends each client its current sequence number
setInterval(() => {
  for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
    client.emit("seq-num", sequenceNumber);
    sequenceNumberByClient.set(client, sequenceNumber + 1);
  }
}, 1000);

console.log("Server on");