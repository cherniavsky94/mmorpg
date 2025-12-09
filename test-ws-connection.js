// Simple WebSocket connection test
const Colyseus = require("colyseus.js");

async function testConnection() {
  console.log("Testing Colyseus connection to ws://localhost:2567");
  
  try {
    const client = new Colyseus.Client("ws://localhost:2567");
    console.log("✅ Client created");
    
    const room = await client.joinOrCreate("city");
    console.log("✅ Connected to room:", room.name);
    console.log("   Room ID:", room.id);
    console.log("   Session ID:", room.sessionId);
    
    // Wait a bit to see state updates
    setTimeout(() => {
      console.log("   Players in room:", room.state.players.size);
      room.leave();
      console.log("✅ Test completed successfully!");
      process.exit(0);
    }, 2000);
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

testConnection();
