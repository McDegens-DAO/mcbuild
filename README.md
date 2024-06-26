# mcbuild
A js class that builds, optimizes, and optionally serializes & base64 encodes a Solana transaction.

# usage
```javascript
let result = await mcbuild.tx(params);
```

Click the link below to see a full example in a Solana Actions server.

https://github.com/McDegens-DAO/solana-action-express/tree/main

```javascript
// ************************************************************************************
// include the mcbuild class here above your routes
// ************************************************************************************
// the server route below returns a valid solana action
// ************************************************************************************
let rpc = "your-rpc-url";

app.route('/donate-build').post(async function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Content-Encoding', 'compress');
    res.setHeader('Content-Type', 'application/json');
    let err = {}
    if(typeof req.body.account == "undefined"){
      err.transaction = "error";
      err.message = "action did not receive an account";
      res.send(JSON.stringify(err));
    }
    else if(typeof req.query.amount == "undefined"){
      err.transaction = "error";
      err.message = "action did not receive an amount to send";
      res.send(JSON.stringify(err));
    }

    // create instructions
    let lamports = req.query.amount * 1000000000;
    let from = new PublicKey(req.body.account);
    let to = new PublicKey("GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu");
    let donateIx = SystemProgram.transfer({fromPubkey:from, lamports:lamports, toPubkey:to});
    // create instructions
    
    // build transaction
    let _tx_ = {};
    _tx_.rpc = rpc;                     // string : required
    _tx_.account = req.body.account;    // string : required
    _tx_.instructions = [ donateIx ];   // array : required
    _tx_.signers = false;               // array : default false
    _tx_.serialize = true;              // bool : default false
    _tx_.encode = true;                 // bool : default false
    _tx_.table = false;                 // bool : default false
    _tx_.tolerance = 2;                 // int : default 1.1    
    _tx_.compute = false;               // bool : default true
    _tx_.fees = true;                   // bool : default true
    _tx_.priority = req.query.priority; // string : VeryHigh,High,Medium,Low,Min : default Medium
    let tx = await mcbuild.tx(_tx_);
    // build transaction
    
    res.send(JSON.stringify(result));
});
// ************************************************************************************
```
