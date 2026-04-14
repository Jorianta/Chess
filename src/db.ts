import { error } from 'console';
import CONFIG from './config.js';
import { Guild, quote, User } from 'discord.js';
import { Connection, createConnection } from 'mysql';

export function initDB()
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

export function connect(): Connection
{
  let con = createConnection({
    host: CONFIG.dbHost,
    port: 3306,
    user: "root",
    password: "",
    database: `chess_db`,
    multipleStatements: true
  });

  return con
}

export function submitCitation(guildId: string, culprit: string, reason: string = "vore")
{
  const SQL = connect()
  if(SQL == null) return;
  SQL.query(`INSERT INTO citations (guild, culprit_user, reason) VALUES ('${guildId}', '${culprit}', '${reason}');`, (err, result) =>
    {
      if(err) console.error(err)
      else console.log("Citation saved")
    })
}