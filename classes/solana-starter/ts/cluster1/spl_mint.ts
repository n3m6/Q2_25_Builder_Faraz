import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("<mint address>");

(async () => {
    try {
        // Create an ATA
        // const ata = ???
        // console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        // const mintTx = ???
        // console.log(`Your mint txid: ${mintTx}`);
            // Create an ATA
        // const ata = ???
        // console.log(`Your ata is: ${ata.address.toBase58()}`);
        const ata = await getOrCreateAssociatedTokenAccount(
          connection,
          keypair,
          mint,
          keypair.publicKey,
          true,
          commitment,
        );
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        // const mintTx = ???
        // console.log(`Your mint txid: ${mintTx}`);
        const mintTx = await mintTo(
          connection,
          keypair,
          mint,
          ata.address,
          keypair.publicKey,
          5000n * token_decimals,
        );
        console.log(`Your mint txid: ${mintTx}`);

        //Your ata is: EkdmU1XaxbZjXzjMnwcjvk9Gn9gZTiAfKyo9UvSeX6GY
        // Your mint txid: 39qYcZoQ3AMfyeCS7CQLtCnpUoDovmhvXs3EHudFrpVcEpcAbuxjWZXn3auTJ9rbUQqKByfg756uuXWxJUcwAnfk
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
