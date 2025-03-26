import { Keypair } from "@solana/web3.js";
import bs58 from 'bs58'
import * as fs from 'fs';

function saveSecretKeyInSolanaWalletFromat(secretKey: Uint8Array) {
  fs.writeFileSync('dev-wallet.json', `[${secretKey.toString()}]`);
}

function wallet_to_base58(secretKey: Uint8Array): string {
  return bs58.encode(secretKey).toString();
}

function base58_to_wallet(secretKey: string): Uint8Array {
  return bs58.decode(secretKey);
}

//Generate a new keypair
let kp = Keypair.generate()
console.log(`You've generated a new Solana wallet: ${kp.publicKey.toBase58()}`);

saveSecretKeyInSolanaWalletFromat(kp.secretKey);

//console.log(`Secret key in phantom format: ${wallet_to_base58(kp.secretKey)}`);