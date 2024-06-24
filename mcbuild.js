// *****************************************************************************************
// name: mcbuild
// author: Dapper (@SolDapper)
// repo: https://github.com/McDegens-DAO/mcbuild
// license: https://github.com/McDegens-DAO/mcbuild?tab=MIT-1-ov-file
// *****************************************************************************************
// transaction packager
class mcbuild {
    static async ComputeLimit(cluster,opti_payer,opti_ix,opti_tolerance,opti_tables=false){
        let connection = new Connection(cluster, 'confirmed');
        let opti_sim_limit = ComputeBudgetProgram.setComputeUnitLimit({units:1400000});
        let re_ix = [];
        for (let o in opti_ix) {re_ix.push(opti_ix[o]);}
        opti_ix = re_ix;
        opti_ix.unshift(opti_sim_limit);
        let opti_msg = null;
        if(opti_tables == false){
          opti_msg = new TransactionMessage({
            payerKey: opti_payer.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
            instructions: opti_ix,
          }).compileToV0Message([]);
        }
        else{
          opti_msg = new TransactionMessage({
            payerKey: opti_payer.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
            instructions: opti_ix,
          }).compileToV0Message([opti_tables]);
        }
        let opti_tx = new VersionedTransaction(opti_msg);    
        let opti_cu_res = await connection.simulateTransaction(opti_tx,{replaceRecentBlockhash:true,sigVerify:false,});
        console.log("Simulation Results: ", opti_cu_res.value);
        if(opti_cu_res.value.err != null){
          return {"transaction":"error","message":"error during simulation","logs":opti_cu_res.value.logs}
        }
        let opti_consumed = opti_cu_res.value.unitsConsumed;
        let opti_cu_limit = Math.ceil(opti_consumed * opti_tolerance);
        return opti_cu_limit;
    }
    static async FeeEstimate(cluster,payer,priorityLevel,instructions,tables=false){
        let connection = new Connection(cluster,'confirmed',);
        let re_ix = [];
        for (let o in instructions) {re_ix.push(instructions[o]);}
        instructions = re_ix;
        let _msg = null;
        if(tables==false){
          _msg = new TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
            instructions: instructions,
          }).compileToV0Message([]);
        }
        else{
          _msg = new TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
            instructions: instructions,
          }).compileToV0Message([tables]);
        }
        let tx = new VersionedTransaction(_msg);
        let response = await fetch(cluster, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getPriorityFeeEstimate",
            params: [
              {
                transaction: bs58.encode(tx.serialize()), // Pass the serialized transaction in Base58
                options: { priorityLevel: priorityLevel },
              },
            ],
          }),
        });
        let data = await response.json();
        console.log("estimate reponse:", data);
        data = parseInt(data.result.priorityFeeEstimate);
        if(data < 10000){data = 10000;}
        return data;
    }
    static async tx(_rpc_,_account_,_instructions_,_signers_,_priority_=false,_tolerance_,_encode_=false,_table_=false){
        let _obj_={}
        if(_priority_==false){_priority_=priority;}
        let _wallet_= new PublicKey(_account_);
        let connection= new Connection(_rpc_,"confirmed");
        if(_priority_=="Extreme"){_priority_="VeryHigh";}
        let _payer_={publicKey:_wallet_}
        let _cu_= null;
        _cu_= await this.ComputeLimit(_rpc_,_payer_,_instructions_,_tolerance_,_table_);
        if(typeof _cu_.logs != "undefined"){
            _cu_.transaction="error";
            _cu_.message="there was an error when simulating the transaction";
            return _cu_;
        }
        else if(_cu_==null){
            _obj_.transaction="error";
            _obj_.message="there was an error when optimizing compute limit";
            return _obj_;
        }
        else{
            _instructions_.unshift(ComputeBudgetProgram.setComputeUnitLimit({units:_cu_}));
            let get_priority = await this.FeeEstimate(_rpc_,_payer_,_priority_,_instructions_,_table_);
            _instructions_.unshift(ComputeBudgetProgram.setComputeUnitPrice({microLamports:get_priority}));
            let _message_=null;
            let _blockhash_ = (await connection.getRecentBlockhash('confirmed')).blockhash;
            if(_table_!=false){
                _message_= new TransactionMessage({payerKey:_wallet_,recentBlockhash:_blockhash_,instructions:_instructions_,}).compileToV0Message(_table_);
            }
            else{
                _message_= new TransactionMessage({payerKey:_wallet_,recentBlockhash:_blockhash_,instructions:_instructions_,}).compileToV0Message([]);
            }
            let _tx_= new VersionedTransaction(_message_);
            if(_signers_!=false){_tx_.sign(_signers_);}
            if(_encode_ === true){
                _tx_=_tx_.serialize();
                _tx_= Buffer.from(_tx_).toString("base64");
            }
            _obj_.message="success";
            _obj_.transaction=_tx_;
            return _obj_;
        }
    }
}