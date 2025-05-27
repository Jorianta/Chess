import CONFIG from './config.js';
import { Guild, quote, User } from 'discord.js';
import { Connection, createConnection } from 'mysql';

//this is probably bad practice but idk what good practice is so lol
var SQL_CONNECTION: Connection = null

export function ConnectDatabase(client)
{
	client.once('ready', async c => {

		console.log("Creating database connection...")
        init_db()
  })
}

function init_db()
{

  let con = createConnection({
    host: CONFIG.dbHost,
    port: 3306,
    user: "root",
    password: "",
  });

  con.connect(function(err) {
    if(err && err.code == "ECONNREFUSED")
    {
      console.warn(`No database found at the specified host, ${CONFIG.dbHost}. Did you mean to configure one?`)
      return;
    }
    if (err) throw err;
    console.log(`Connected to ${CONFIG.dbHost}!`);
    con.query(`CREATE DATABASE IF NOT EXISTS chess_db`, function (err, result) {
      if (err) throw err;
      console.log("chess database created");

      let tables = connect()

      //Make sure our tables exist
      tables.query(`CREATE TABLE IF NOT EXISTS quotes (id INT AUTO_INCREMENT PRIMARY KEY, guild VARCHAR(255), quoted_user VARCHAR(255), clipping_user VARCHAR(255), date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
        (err,result)=>{
          if(err) throw err;
          console.log("Quote Table created")
        }
      )
      tables.query(`CREATE TABLE IF NOT EXISTS citations (id INT AUTO_INCREMENT PRIMARY KEY, guild VARCHAR(255), culprit_user VARCHAR(255), reason VARCHAR(255), date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`, 
        (err,result)=>{
          if(err) throw err;
          console.log("Citation Table created")
        })
    });
  });
}

function connect(): Connection
{
  let con = createConnection({
    host: CONFIG.dbHost,
    port: 3306,
    user: "root",
    password: "",
    database: `chess_db`,
    multipleStatements: true
  });

  con.connect()
  SQL_CONNECTION = con;

  handleDisconnect(con)  

  //reconnect if something bad happend
  function handleDisconnect(connection: Connection)
  {
    connection.on('error', function(err) {
      if (!err.fatal) {
          return;
      }
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
          throw err;
      }
      console.log('Re-connecting lost connection: ' + err.stack);
      let sql = createConnection(connection.config);
      handleDisconnect(sql);
      sql.connect();
      SQL_CONNECTION = sql;
  });
  }

  return con
}

export function submitQuote(guildId: string, quoted: string, clipper: string)
{
  if(SQL_CONNECTION == null) return;

  //Mariadb should automagically assign a timestamp
  SQL_CONNECTION.query(`INSERT INTO quotes (guild, quoted_user, clipping_user) VALUES ('${guildId}', '${quoted}', '${clipper}');`, (err, result) =>
  {
    if(err) throw err
    console.log("Quote saved")
  })
}

export function submitCitation(guildId: string, culprit: string, reason: string = "vore")
{
  if(SQL_CONNECTION == null) return;
  SQL_CONNECTION.query(`INSERT INTO citations (guild, culprit_user, reason) VALUES ('${guildId}', '${culprit}', '${reason}');`, (err, result) =>
    {
      if(err) throw err
      console.log("Citation saved")
    })
}