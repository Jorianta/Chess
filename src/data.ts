import CONFIG from './config.js';
import { Guild, quote, User } from 'discord.js';
import { Connection, createConnection } from 'mysql';

//this is probably bad practice but idk what good practice is so lol
const CONNECTIONS: {[id: string]: Connection} = {}

export function ConnectDatabase(client)
{
	client.once('ready', async c => {

		console.log("Creating database connection...")

    client.guilds.cache.forEach(guild => {
      //I could def do one function for this
      init_db(guild)
      CONNECTIONS[guild.id] = connect(guild)
    })
  })
}

function init_db(guild: Guild)
{

  let con = createConnection({
    host: CONFIG.dbHost,
    port: 3306,
    user: "root",
    password: "",
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`CREATE DATABASE IF NOT EXISTS guild_${guild.id};`, function (err, result) {
      if (err) throw err;
      console.log(guild.name + " database created");

      let tables = connect(guild)

      //Make sure our tables exist
      tables.query(`CREATE TABLE IF NOT EXISTS quotes (id INT AUTO_INCREMENT PRIMARY KEY, quoted_user VARCHAR(255), clipping_user VARCHAR(255), date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
        (err,result)=>{
          if(err) throw err;
          console.log("Quote Table created")
        }
      )
      tables.query(`CREATE TABLE IF NOT EXISTS citations (id INT AUTO_INCREMENT PRIMARY KEY, culprit_user VARCHAR(255), reason VARCHAR(255), date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`, 
        (err,result)=>{
          if(err) throw err;
          console.log("Citation Table created")
          tables.end()
        })
    });
  });
}

function connect(guild: Guild): Connection
{
  let con = createConnection({
    host: CONFIG.dbHost,
    port: 3306,
    user: "root",
    password: "",
    database: `guild_${guild.id}`,
    multipleStatements: true
  });

  con.connect()

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
  });
  }

  return con
}

export function submitQuote(guildId: string, quoted: string, clipper: string)
{
  if(!Object.keys(CONNECTIONS).includes(guildId)) return;
  //Mariadb should automagically assign a timestamp
  CONNECTIONS[guildId].query(`INSERT INTO quotes (quoted_user, clipping_user) VALUES ('${quoted}', '${clipper}');`, (err, result) =>
  {
    if(err) throw err
    console.log("Quote saved")
  })
}

export function submitCitation(guildId: string, culprit: string, reason: string = "vore")
{
  if(!Object.keys(CONNECTIONS).includes(guildId)){ 
    console.warn(`Connection to guild ${guildId} database was lost.`)
    return;
  }
  CONNECTIONS[guildId].query(`INSERT INTO citations (culprit_user, reason) VALUES ('${culprit}', '${reason}');`, (err, result) =>
    {
      if(err) throw err
      console.log("Citation saved")
    })
}