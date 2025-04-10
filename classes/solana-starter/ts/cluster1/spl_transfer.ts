import {
    Commitment,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction
} from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import {createTransferInstruction, getOrCreateAssociatedTokenAccount, transfer} from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey('FhnLH6rNA3wuMztW1fUxeWvumvkXL4fssxGkRYaftm2X');


// Recipient address
const to = new PublicKey('HfNNFfKyrrv61ymaumuBDrE113rqKRHtVYZHHLqSgx3Q');

(async () => {
    try {
        console.log('>>> 1');
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromWallet = await getOrCreateAssociatedTokenAccount(
          connection,
          keypair,
          mint,
          keypair.publicKey,
          true,
          commitment,
        );

        console.log('>>> 2');

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toWallet = await getOrCreateAssociatedTokenAccount(
          connection,
          keypair,
          mint,
          keypair.publicKey,
          true,
          commitment,
        );

        console.log('>>> 3');

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = new Transaction();
        tx.add(createTransferInstruction(
          fromWallet.address,
          toWallet.address,
          to,
          1,
          [to]
        ));

        console.log('>>> 4');


        const latestBlockHash = await connection.getLatestBlockhash('confirmed');
        console.log('>>> 5');
        tx.recentBlockhash = await latestBlockHash.blockhash;
        const signature = await sendAndConfirmTransaction(connection,tx,[keypair]);
        console.log(
          '\x1b[32m', //Green Text
          `   Transaction Success!🎉`,
          `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
        );


    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();