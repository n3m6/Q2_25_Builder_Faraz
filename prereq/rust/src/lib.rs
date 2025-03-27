mod programs;

#[cfg(test)]
mod tests {
    use bs58;
    use solana_sdk;
    use std::io::{self, BufRead};

    #[test]
    #[ignore]
    fn base58_to_wallet() {
        println!("Input your private key as base58:");
        let stdin = io::stdin();
        let base58 = stdin.lock().lines().next().unwrap().unwrap();
        println!("Your wallet file is:");
        let wallet = bs58::decode(base58).into_vec().unwrap();
        println!("{:?}", wallet)
    }

    #[test]
    #[ignore]
    fn wallet_to_base58() {
        println!("Input your private key as a wallet file byte array:");
        let stdin = io::stdin();
        let wallet = stdin
            .lock()
            .lines()
            .next()
            .unwrap()
            .unwrap()
            .trim_start_matches('[')
            .trim_end_matches(']')
            .split(',')
            .map(|s| s.trim().parse::<u8>().unwrap())
            .collect::<Vec<u8>>();
        println!("Your private key is:");
        let base58 = bs58::encode(wallet).into_string();
        println!("{:?}", base58);
    }

    #[test]
    #[ignore]
    fn keygen() {
        use solana_sdk::{
            pubkey::Pubkey,
            signature::{Keypair, Signer},
        };

        let kp = Keypair::new();
        println!(
            "You've generated a new Solana wallet: {}",
            kp.pubkey().to_string()
        );
        println!("");
        println!("To save your wallet, copy and paste the following into a JSON file:");
        println!("{:?}", kp.to_bytes());
        // Generated wallet public address Hkxs8KWUHBzXmzhP4LL6qJ8qWJtALET9qtquGDxzGfy6
    }

    #[test]
    #[ignore]
    fn airdop() {
        use solana_client::rpc_client::RpcClient;
        use solana_sdk::signature::{Keypair, Signer, read_keypair_file};

        const RPC_URL: &str = "https://api.devnet.solana.com";

        // Import our keypair
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        // Connected to Solana Devnet RPC Client
        let client = RpcClient::new(RPC_URL);

        // We're going to claim 2 devnet SOL tokens (2 billion lamports)
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(s) => {
                println!("Success! Check out your TX here:");
                println!(
                    "https://explorer.solana.com/tx/{}?cluster=devnet",
                    s.to_string()
                );
            }
            Err(e) => println!("Oops, something went wrong: {}", e.to_string()),
        }
        // https://explorer.solana.com/tx/5HL8v86cG2ibJowUSRy6iYLQ1xCLHcBb72X49C4D7McdWakXzthmZ3ryPgD7tKr2VWXetk597Lo7YmbCKVKVKRba?cluster=devnet
    }

    #[test]
    #[ignore]
    fn transfer_sol() {
        use solana_client::rpc_client::RpcClient;
        use solana_program::{pubkey::Pubkey, system_instruction::transfer};
        use solana_sdk::hash::hash;
        use solana_sdk::{
            message::Message,
            signature::{Keypair, Signature, Signer, read_keypair_file},
            transaction::Transaction,
        };
        use std::str::FromStr;

        const RPC_URL: &str = "https://api.devnet.solana.com";

        // Import our keypair
        let keypair: Keypair =
            read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        // With the imported Keypair, we can sign a new message.
        let pubkey: Pubkey = keypair.pubkey();
        let message_bytes = b"I verify my solana Keypair!";

        let sig: Signature = keypair.sign_message(message_bytes);
        let sig_hashed = hash(sig.as_ref());

        // After that we can verify the singature, using the default implementation
        match sig.verify(&pubkey.to_bytes(), &sig_hashed.to_bytes()) {
            true => println!("Signature verified"),
            false => println!("Verification failed"),
        };

        // Define our Turbin3 public key
        let to_pubkey = Pubkey::from_str("HfNNFfKyrrv61ymaumuBDrE113rqKRHtVYZHHLqSgx3Q").unwrap();

        // Create a Solana devnet connection
        let rpc_client = RpcClient::new(RPC_URL);

        // Get recent blockhash
        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        // Get balance of dev wallet
        let balance = rpc_client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");

        // Create a test transaction to calculate fees
        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );

        let fee = rpc_client
            .get_fee_for_message(&message)
            .expect("Failed to get fee calculator");

        // Sign
        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        // Send the transaction
        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );

        //ADcaide4vBtKuyZQqdU689YqEGZMCmS4tL35bdTv9wJa

        // Success !
        // https://explorer.solana.com/tx/5y71hoy1RAPmwkZZytRComvYsrqPPTjSYRzQ6tEHexirUSH6iXG9FNm4EYWaeVnP9p8qRhoBZgzFvrwxG2zawLC4?cluster=devnet
    }

    #[test]
    #[ignore]
    fn enroll() {
        use crate::programs::Turbin3_prereq::{CompleteArgs, Turbin3PrereqProgram, UpdateArgs};
        use solana_client::rpc_client::RpcClient;
        use solana_program::system_program;
        use solana_sdk::{
            message::Message,
            signature::{Keypair, Signature, Signer, read_keypair_file},
            transaction::Transaction,
        };

        const RPC_URL: &str = "https://api.devnet.solana.com";

        let rpc_client = RpcClient::new(RPC_URL);

        let signer = read_keypair_file("Turbin3-wallet.json").expect("Couldn't find wallet file");

        let prereq = Turbin3PrereqProgram::derive_program_address(&[
            b"prereq",
            signer.pubkey().to_bytes().as_ref(),
        ]);

        let args = CompleteArgs {
            github: b"n3m6".to_vec(),
        };

        let blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let transaction = Turbin3PrereqProgram::complete(
            &[&signer.pubkey(), &prereq, &system_program::id()],
            &args,
            Some(&signer.pubkey()),
            &[&signer],
            blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
        // Success ! https://explorer.solana.com/tx/2v3Hdm3kWe7Sfo6qDfmEC88GZ7FpNLE7yyt4VaFcAcMbdW5vdYZktLyLJnehrU5pWgacniL2xCe1BiF416uxtpFV?cluster=devnet
    }
}
