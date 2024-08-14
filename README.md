# mcbuild
builds, optimizes, serializes, and encodes a solana transaction for both apps and actions

# usage
```javascript
import mcbuild from './mcbuild.js';
```

# example
```javascript

// create your instructions and then:

// optimize transaction
const _tx_ = {};
_tx_.rpc = rpc;                       // string : required
_tx_.account = "PAYER-WALLET-HERE";   // string : required
_tx_.instructions = [instructions];   // array  : required
_tx_.signers = false;                 // array  : default false
_tx_.serialize = false;               // bool   : default false
_tx_.encode = false;                  // bool   : default false
_tx_.table = false;                   // array  : default false
_tx_.tolerance = 1.1;                 // float  : default 1.1    
_tx_.compute = true;                  // bool   : default true
_tx_.fees = true;                     // bool   : default true
_tx_.priority = "Medium";             // string : VeryHigh,High,Medium,Low,Min
const tx = await mcbuild.tx(_tx_);    // package the tx

// sign and send transaction
const signed = await provider.signTransaction(tx);
const signature = await connection.sendRawTransaction(signed.serialize(),{skipPreflight:true,maxRetries:0});     

// track the status
const status = await mcbuild.status(signature,10,4);
if(status != "finalized"){console.log("status", status);}
console.log("status", "complete");

```
