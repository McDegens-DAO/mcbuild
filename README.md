# mcbuild
builds, optimizes, serializes, and encodes a solana transaction for both apps and actions

# usage
```javascript
import mcbuild from './mcbuild.js';
let result = await mcbuild.tx(params);
```

# example
```javascript
// build transaction
let _tx_ = {};
_tx_.rpc = rpc;                     // string : required
_tx_.account = req.body.account;    // string : required
_tx_.instructions = [ donateIx ];   // array  : required
_tx_.signers = false;               // array  : default false
_tx_.serialize = true;              // bool   : default false
_tx_.encode = true;                 // bool   : default false
_tx_.table = false;                 // array  : default false
_tx_.tolerance = 2;                 // int    : default 1.1    
_tx_.compute = false;               // bool   : default true
_tx_.fees = true;                   // bool   : default true
_tx_.priority = req.query.priority; // string : VeryHigh,High,Medium,Low,Min : default Medium
let tx = await mcbuild.tx(_tx_);    // package the tx
res.json(tx);                       // output
```
