const readline = require('readline');
const {
  InworldClient,
  InworldPacket,
} = require ('@inworld/nodejs-sdk');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
arinSesi = {}
userId = "hshsh"







  // const client = new InworldClient()
  //   // Get key and secret from the integrations page.
  //   .setApiKey({
  //     key: 'zNDzCzmDL8IwtblzBHTn8HIEgNlRAMZA',
  //     secret: 'zzX10GsbzyWclYnUO1uoCOjqiBX3nmONC5O9yoGkdz1KAzLKkDmgFzfPmZhWRy0S',
  //   })
  //   // Setup a user name.
  //   // It allows character to call you by name.
  //   .setUser({ fullName: 'eki' })
  //   // Setup required capabilities.
  //   // In this case you can receive character emotions.
  //   .setConfiguration({
  //     capabilities: { audio: true, emotions: true },
  //   })
  //   // Use a full character name.
  //   // It should be like workspaces/{WORKSPACE_NAME}/characters/{CHARACTER_NAME}.
  //   // Or like workspaces/{WORKSPACE_NAME}/scenes/{SCENE_NAME}.
  //   .setScene('workspaces/default-lxmaplyhs-0wyveqmxeqqw/characters/arin_haniz')
  //   // Attach handlers
  //   .setOnError((err) => console.error(err))
  // .setOnMessage((namex) => {
  //   let txnya = namex.text?.text;
  //   console.log(txnya);
  //   });
  //   const connection = client.build();
   
 arinSesi[userId] ={ arin: new InworldClient()

    // Get key and secret from the integrations page.

    .setApiKey({
      key: 'zNDzCzmDL8IwtblzBHTn8HIEgNlRAMZA',
      secret: 'zzX10GsbzyWclYnUO1uoCOjqiBX3nmONC5O9yoGkdz1KAzLKkDmgFzfPmZhWRy0S',
    })
    // Setup a user name.
    // It allows character to call you by name.
    .setUser({ fullName: 'eki' })
    // Setup required capabilities.
    // In this case you can receive character emotions.
    .setConfiguration({
      capabilities: { audio: true, emotions: true },
    })
    // Use a full character name.
    // It should be like workspaces/{WORKSPACE_NAME}/characters/{CHARACTER_NAME}.
    // Or like workspaces/{WORKSPACE_NAME}/scenes/{SCENE_NAME}.
    .setScene('workspaces/default-lxmaplyhs-0wyveqmxeqqw/characters/arin_haniz')
    // Attach handlers
    .setOnError((err) => console.error(err))
  .setOnMessage((namex) => {
    let txnya = namex.text?.text;
    console.log(txnya);
    }),
    connection: "mamam"
}
 
 arinSesi[userId].connection = arinSesi[userId].arin.build()
 
  // Send your message to a character.
  
  function promptMessage() {
  rl.question('Masukkan pesan (ketik "exit" untuk keluar): ', (answer) => {
    if (answer.toLowerCase() === 'exit') {
      rl.close();
    } else {
      console.log('Anda memasukkan:', answer);
      arinSesi[userId].connection.sendText(answer);
      promptMessage(); // Menjalankan prompt lagi secara rekursif
    }
  });
}

promptMessage(); // Memanggil fungsi untuk pertama kali
