import * as Mongo from 'mongodb';
import * as assert from 'assert';
import * as Config from './config.json';

const url = Config.mongo;
const dbName = 'tfnotify';
const collectionName = 'bound';

export function BindToChannel(channel: string) {
    const client = new Mongo.MongoClient(url);
    client.connect(function(err) {
        assert.strictEqual(null, err);
        console.log(`Binding to channel ${channel}.`)

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        collection.findOne({channelID: channel}).then(function(value){
            if(value) {
                collection.replaceOne({channelID: channel}, {
                    channelID: channel,
                });
            } else {
                collection.insertOne({
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

export function GetChannels() {
  let toSend: any[] = [];
  const client = new Mongo.MongoClient(url);
  client.connect(function(err) {
    assert.strictEqual(null, err);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    let cursor = collection.find();
    cursor.forEach((doc) => {
      toSend.push(doc.channelID);
    });
  });
  return toSend;
}
