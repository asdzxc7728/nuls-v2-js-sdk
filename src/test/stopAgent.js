const nuls = require('../index');
const utils = require('../utils/utils');
const sdk = require("../api/sdk");
const txs = require("../model/txs");

let pri = '94d344417d6faa55e3017709dd6b837bac2bc1769e3a4b516ac9a981465ac03c';
let pub = '02403cb49ac24ff9555b073ce981e28bed5e81438b2c715a14d06bd248ea1d0091';
let fromAddress = "tNULSeBaMfwpGBmn8xuKABPWUbdtsM2cMoinnn";

let amount = 2000100000000;
let remark = 'niels test alias....';

//转账功能 trustUrl
async function doit(pri, pub, fromAddress, assetsChainId, assetsId, amount, agentHash) {

    const balanceInfo = await nuls.getNulsBalance(fromAddress);
    let fee = 100000;

    if (balanceInfo.balance < amount + fee) {
        return {success: false, data: "Your balance is not enough."}
    }
    const depositList = await nuls.getAgentDeposistList(agentHash);
    let inputs = [];
    let outputs = [];
    inputs.push({
        address: fromAddress,
        assetsChainId: assetsChainId,
        assetsId: assetsId,
        amount: amount,
        locked: -1,
        nonce: agentHash.substring(agentHash.length - 16)//这里是hash的最后16个字符
    });

    outputs.push({
        address: fromAddress, assetsChainId: assetsChainId,
        assetsId: assetsId, amount: amount - fee, lockTime: 0
    });


    for (let i = 0; i < depositList.length; i++) {
        let dpt = depositList[i];
        inputs.push({
            address: dpt.address,
            assetsChainId: assetsChainId,
            assetsId: assetsId,
            amount: dpt.amount,
            locked: -1,
            nonce: dpt.txHash.substring(agentHash.length - 16)//这里是hash的最后16个字符
        });

        outputs.push({
            address: dpt.address, assetsChainId: assetsChainId,
            assetsId: assetsId, amount: dpt.amount, lockTime: 0
        });

    }

    let tt = new txs.StopAgentTransaction(agentHash);
    tt.time = 123456789;
    tt.setCoinData(inputs, outputs);
    tt.remark = remark;
    sdk.signatureTx(tt, pri, pub);
    let txhex = tt.txSerialize().toString('hex');
    let result = await nuls.validateTx(txhex);
    if (result&&result.value) {
        console.log(result.value)
        nuls.broadcastTx(txhex);
    }else{
        console.log("opration failed!")
    }
    console.log(txhex);
    return 'done!';
}

//测试开始
doit(pri, pub, fromAddress, 2, 1, amount, 'f9e0dd20b97b7cf03967a86417dcdf4d8f3893076dba9b29cb9be076a0c24308').then((response) => {
    console.log(response)
}).catch((error) => {
    console.log(error)
});