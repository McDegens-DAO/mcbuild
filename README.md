# mcbuild
A js class that builds, optimizes, and optionally serializes & base64 encodes a Solana transaction.

# Usage
```javascript
// ************************************************************************************
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
    if(typeof req.query.priority != "undefined"){
      priority = req.query.priority;
    }
    let account = req.body.account;
    let signers = false;
    let serialize = true;
    let encode = true;
    let table = false;
    let lamports = req.query.amount * 1000000000;
    let from = new PublicKey(account);
    let to = new PublicKey("GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu"); // recipient
    let donateIx = SystemProgram.transfer({fromPubkey:from, lamports:lamports, toPubkey:to})
    let instructions = [ donateIx ];
    tolerance = 2;
    let result = await mcbuild.tx(rpc,account,instructions,signers,priority,tolerance,serialize,encode,table);
    res.send(JSON.stringify(result));
});
// ************************************************************************************
```
