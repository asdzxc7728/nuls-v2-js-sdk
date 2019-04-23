const nuls = require('../index');
const {getNulsBalance, countFee, inputsOrOutputs, validateTx, broadcastTx} = require('./api/util');
let pri = '94d344417d6faa55e3017709dd6b837bac2bc1769e3a4b516ac9a981465ac03c';
let pub = '02403cb49ac24ff9555b073ce981e28bed5e81438b2c715a14d06bd248ea1d0091';
let fromAddress = "tNULSeBaMfwpGBmn8xuKABPWUbdtsM2cMoinnn";
let amount = 210000000000;
let remark = 'niels test alias....';
/**
 * 退出共识
 * @param pri
 * @param pub
 * @param fromAddress
 * @param assetsChainId
 * @param assetsId
 * @param amount
 * @param depositHash
 * @returns {Promise<void>}
 */
async function take(pri, pub, fromAddress, assetsChainId, assetsId, amount, depositHash) {
  const balanceInfo = await getNulsBalance(fromAddress);
  let transferInfo = {
    fromAddress: fromAddress,
    assetsChainId: assetsChainId,
    assetsId: assetsId,
    amount: amount,
    fee: countFee(),
    depositHash: depositHash
  };
  let inOrOutputs = await inputsOrOutputs(transferInfo, balanceInfo, 6);
  let txhex = await nuls.transactionSerialize(pri, pub, inOrOutputs.inputs, inOrOutputs.outputs, remark, 6, depositHash);
  //console.log(txhex);
  let result = await validateTx(txhex);
  if (result) {
    console.log(result.value);
    let results = await broadcastTx(txhex);
    if (results && result.value) {
      console.log("交易完成")
    } else {
      console.log("广播交易失败")
    }
  } else {
    console.log("验证交易失败")
  }
}

//测试开始
take(pri, pub, fromAddress, 2, 1, amount, 'f556c7d05dd30c1080759e88e5934ff8981df2bf0dabd287dfee63b490bece50');
