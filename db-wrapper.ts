import * as Mongo from 'mongodb';
import * as assert from 'assert';
import * as Config from './config.json';

const url = Config.mongo;
const dbName = 'tfnotify';
const collectionName = 'bound';

export function BindToChannel(channel: string, guild: string) {
    const client = new Mongo.MongoClient(url);
    client.connect(function(err) {
        assert.strictEqual(null, err);
        console.log(`Binding to channel ${channel} for guild ${guild}.`)
    
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        collection.findOne({guildID: guild}).then(function(value){
            if(value) {
                collection.replaceOne({guildID: guild}, {
                    guildID: guild,
                    channelID: channel,
                });
            } else {
                collection.insertOne({
                    guildID: guild,
                    channelID: channel,
                });
            }
            client.close();
        }, function(err) {
            console.error(err);
            client.close();
            return;
        })
    });
}