import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import * as score from "./scoreSettings.json";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

const db = new JsonDB(new Config("citizen", true, false, "/"));

dotenv.config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.on("ready", () => {
  console.log(`Logged in`);
  client.user.setActivity("China", {
  type: "STREAMING",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  });
});

client.on("messageCreate", (message) => {
  if (message.channel.id == "901214528522575875") {
    if (message.author.id === client.user.id) return;
    const messagecnt = message.content.toLocaleLowerCase();
    let points = score["v+1"];

    if (message.content.startsWith("!score")) {
      try {
        points += score["v-2"];
        message.reply(
          `Du hast ${parseInt(
            db.getData(`/users/${message.author.id}/points`)
          )} Punkte`
        );
      } catch {
        message.reply("retry..");
      }
    }

    for (const i of score.negative1) {
      if (messagecnt.includes(i.toLocaleLowerCase())) {
        message.react("🚫");
        points += score["v-1"];
      }
    }
    for (const i of score.negative2) {
      if (messagecnt.includes(i.toLocaleLowerCase())) {
        message.react("🚫");
        points += score["v-2"];
      }
    }
    for (const i of score.negative3) {
      if (messagecnt.includes(i.toLocaleLowerCase())) {
        message.react("🚫");
        points += score["v-3"];
      }
    }

    for (const i of score.postive) {
      if (messagecnt.includes(i.toLocaleLowerCase())) {
        message.react("✅");
        points += score["v+2"];
      }
    }

    for (const i of score.xi_name) {
      if (messagecnt.includes(i.toLocaleLowerCase())) {
        for (const ib of score.xi_positive) {
          if (messagecnt.includes(ib.toLocaleLowerCase())) {
            points += score["v+3"];
            message.react("✅");
          }
        }
        for (const ic of score.xi_negative) {
          if (messagecnt.includes(ic.toLocaleLowerCase())) {
            points += score["v-3"];
            message.react("🚫");
          }
        }
      }
    }

    for (const i of score.negation) {
      if (messagecnt.includes(i.toLocaleLowerCase())) {
        points = score["v-2"];
        message.react("❓");
      }
    }
    console.log(`Points: ${points}`);

    let dbpoints = 0;
    try {
      dbpoints = parseInt(db.getData(`/users/${message.author.id}/points`));
    } catch {
      dbpoints = 997;
    }

    db.push(
      `/users/${message.author.id}/`,
      { points: dbpoints + points },
      false
    );

    const setMute = async (status : boolean) => {
      try {
    await  message.member.voice.setMute(status);
      } catch {
        console.log("Not in voice")
  }
}


    if (dbpoints + points <= 0) {
      setMute(true);
    } else {
      setMute(false);
    }
  }
});



client.login(process.env.TOKEN);
